import { prisma } from '../../config/database.js';
import type { CreateOrderInput } from './orders.schema.js';
import { paymentsService } from '../../utils/razorpay.js';

export class OrdersService {
  async create(userId: string, input: CreateOrderInput) {
    const { batchId, items, driverTip, paymentMethod } = input as any;

    // Verify batch exists and is open
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: { _count: { select: { participants: true } } },
    });

    if (!batch) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Batch not found' };
    }

    if (batch.status !== 'OPEN') {
      throw { statusCode: 400, code: 'BATCH_CLOSED', message: 'This batch is no longer accepting orders' };
    }

    if (batch.closesAt < new Date()) {
      throw { statusCode: 400, code: 'BATCH_EXPIRED', message: 'This batch has expired' };
    }

    // Check for existing order
    const existingOrder = await prisma.order.findFirst({
      where: { userId, batchId, status: { not: 'CANCELLED' } },
    });

    if (existingOrder) {
      throw { statusCode: 409, code: 'ORDER_EXISTS', message: 'You already have an active order in this batch' };
    }

    // Fetch and validate menu items
    const menuItemIds = items.map((i: { menuItemId: string; quantity: number }) => i.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        restaurantId: batch.restaurantId,
        isAvailable: true,
      },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw { statusCode: 400, code: 'INVALID_ITEMS', message: 'One or more menu items are invalid or unavailable' };
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = items.map((item: { menuItemId: string; quantity: number }) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId)!;
      const lineTotal = menuItem.batchPrice * item.quantity;
      subtotal += lineTotal;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.batchPrice,
      };
    });

    const participantCount = batch._count.participants;
    const deliveryFeeShare = participantCount > 0
      ? Math.round((batch.soloDeliveryFee / participantCount) * 100) / 100
      : batch.soloDeliveryFee;

    const total = Math.round((subtotal + deliveryFeeShare + driverTip) * 100) / 100;

    // Check user wallet
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw { statusCode: 404, code: 'NOT_FOUND', message: 'User not found' };

    if (paymentMethod === 'WALLET' && user.walletBalance < total) {
      throw { statusCode: 400, code: 'INSUFFICIENT_FUNDS', message: 'Insufficient wallet balance. Please add funds.' };
    }

    // Create order, participant in transaction
    let order: any = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          batchId,
          subtotal,
          deliveryFeeShare,
          driverTip,
          total,
          paymentMethod,
          paymentStatus: paymentMethod === 'WALLET' || paymentMethod === 'COD' ? 'AUTHORIZED' : 'PENDING',
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              menuItem: { select: { name: true, category: true } },
            },
          },
        },
      });

      await tx.batchParticipant.upsert({
        where: { userId_batchId: { userId, batchId } },
        create: { userId, batchId, alias: user.displayName.split(' ')[0] },
        update: {},
      });

      return newOrder;
    });

    let razorpayOrderId;
    if (paymentMethod === 'RAZORPAY') {
      const paymentOrder = await paymentsService.createPaymentOrder(total, order.id, { userId });
      order = await prisma.order.update({
        where: { id: order.id },
        data: { paymentReference: paymentOrder.id } as any,
        include: {
          items: {
            include: { menuItem: { select: { name: true, category: true } } },
          },
        },
      });
      razorpayOrderId = paymentOrder.id;
    }

    return {
      ...order,
      razorpayOrderId,
      savings: Math.round((batch.soloDeliveryFee - deliveryFeeShare) * 100) / 100,
    };
  }

  async getById(userId: string, orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: { select: { name: true, category: true, imageUrl: true } },
          },
        },
        batch: {
          select: {
            id: true,
            status: true,
            soloDeliveryFee: true,
            restaurant: { select: { name: true, imageUrl: true } },
          },
        },
      },
    });

    if (!order) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Order not found' };
    }

    if (order.userId !== userId) {
      throw { statusCode: 403, code: 'FORBIDDEN', message: 'You can only view your own orders' };
    }

    return order;
  }

  async getMyOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        batch: {
          select: {
            id: true,
            status: true,
            restaurant: { select: { name: true, imageUrl: true } },
          },
        },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancel(userId: string, orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { batch: true },
    });

    if (!order) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Order not found' };
    }

    if (order.userId !== userId) {
      throw { statusCode: 403, code: 'FORBIDDEN', message: 'You can only cancel your own orders' };
    }

    if (order.status !== 'PENDING') {
      throw { statusCode: 400, code: 'CANNOT_CANCEL', message: 'Only pending orders can be cancelled' };
    }

    if (order.batch.lockAt < new Date()) {
      throw { statusCode: 400, code: 'BATCH_LOCKED', message: 'Cannot cancel order after batch lock time (<=5 mins remaining)' };
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
  }
}

export const ordersService = new OrdersService();

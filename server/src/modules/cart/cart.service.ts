import { prisma } from '../../config/database.js';
import type { AddToCartInput, UpdateCartItemInput } from './cart.schema.js';

export class CartService {
  async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            batch: { include: { restaurant: true } },
            menuItem: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { batch: { include: { restaurant: true } }, menuItem: true } } },
      });
    }

    return cart;
  }

  async addToCart(userId: string, input: AddToCartInput) {
    // 1. Ensure cart exists
    const cart = await this.getCart(userId);

    // 2. Validate menu item exists
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: input.menuItemId },
    });
    if (!menuItem) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Menu item not found' };
    }

    // 3. Validate batch exists and is open
    const batch = await prisma.batch.findUnique({ where: { id: input.batchId } });
    if (!batch) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Batch not found' };
    }
    if (batch.status !== 'OPEN') {
      throw { statusCode: 400, code: 'BATCH_LOCKED', message: 'This batch is locked and no longer accepting items.' };
    }

    // 4. Add or update quantity
    const existingItem = cart.items.find(item => item.menuItemId === input.menuItemId && item.batchId === input.batchId);

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + input.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          batchId: input.batchId,
          menuItemId: input.menuItemId,
          quantity: input.quantity,
        },
      });
    }

    return this.getCart(userId); // Return updated cart
  }

  async updateItemQuantity(userId: string, itemId: string, input: UpdateCartItemInput) {
    const cart = await this.getCart(userId);
    const item = cart.items.find(i => i.id === itemId);

    if (!item) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Item not found in cart' };
    }

    if (input.quantity === 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: input.quantity },
      });
    }

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    return { message: 'Cart cleared successfully' };
  }
}

export const cartService = new CartService();

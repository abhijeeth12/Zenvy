import { prisma } from '../../config/database.js';
import { scheduleBatchClosure } from '../../jobs/queue.js';
import type { CreateBatchInput, ListBatchesInput } from './batches.schema.js';

export class BatchesService {
  async list(query: ListBatchesInput) {
    const { sort, cuisine, status, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    } else {
      where.status = 'OPEN';
      where.closesAt = { gt: new Date() };
    }

    if (cuisine) {
      where.restaurant = { cuisine: { equals: cuisine, mode: 'insensitive' } };
    }

    const orderBy: any = {};
    switch (sort) {
      case 'closing_soon':
        orderBy.closesAt = 'asc';
        break;
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
      default:
        orderBy.closesAt = 'asc';
    }

    const [batches, total] = await Promise.all([
      prisma.batch.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          restaurant: {
            select: { id: true, name: true, cuisine: true, imageUrl: true, slug: true },
          },
          _count: { select: { participants: true } },
        },
      }),
      prisma.batch.count({ where }),
    ]);

    const now = new Date();
    const data = batches.map((b) => {
      const remainingMs = b.closesAt.getTime() - now.getTime();
      const mins = Math.max(0, Math.floor(remainingMs / 60000));
      const secs = Math.max(0, Math.floor((remainingMs % 60000) / 1000));

      const participantCount = b._count.participants;
      const deliveryShare = participantCount > 0 ? b.soloDeliveryFee / participantCount : b.soloDeliveryFee;
      const savings = b.soloDeliveryFee - deliveryShare;

      return {
        id: b.id,
        restaurant: b.restaurant,
        status: b.status,
        participantCount,
        maxParticipants: b.maxParticipants,
        timeRemaining: `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
        closesAt: b.closesAt,
        estimatedSavings: `₹${Math.round(savings)}`,
        soloDeliveryFee: b.soloDeliveryFee,
        createdAt: b.createdAt,
      };
    });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: string) {
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        restaurant: {
          include: {
            menuItems: { where: { isAvailable: true }, orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] },
          },
        },
        participants: {
          select: { id: true, alias: true, joinedAt: true },
        },
        _count: { select: { participants: true, orders: true } },
      },
    });

    if (!batch) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Batch not found' };
    }

    return batch;
  }

  async create(userId: string, input: CreateBatchInput) {
    const restaurant = await prisma.restaurant.findUnique({ where: { id: input.restaurantId } });
    if (!restaurant) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Restaurant not found' };
    }

    const closesAt = new Date(Date.now() + input.closureMinutes * 60 * 1000);
    // Lock phase: 5 minutes before closing (or at creation if closure window < 5 min)
    const lockAt = new Date(closesAt.getTime() - Math.min(5, input.closureMinutes) * 60 * 1000);
    const alias = `Host_${Math.floor(Math.random() * 100)}`;

    const batch = await prisma.batch.create({
      data: {
        creatorId: userId,
        restaurantId: input.restaurantId,
        maxParticipants: input.maxParticipants,
        closesAt,
        lockAt,
        participants: {
          create: { userId, alias },
        },
      },
      include: {
        restaurant: { select: { id: true, name: true, cuisine: true, imageUrl: true } },
        _count: { select: { participants: true } },
      },
    });

    // Schedule auto-closure job (gracefully fails if Redis is unavailable)
    try {
      await scheduleBatchClosure(batch.id, closesAt);
    } catch {
      // Non-critical: batch can still be manually closed
    }

    return batch;
  }

  async join(userId: string, batchId: string) {
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: { _count: { select: { participants: true } } },
    });

    if (!batch) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Batch not found' };
    }

    if (batch.status !== 'OPEN') {
      throw { statusCode: 400, code: 'BATCH_CLOSED', message: 'This batch is no longer accepting participants' };
    }

    if (batch.closesAt < new Date()) {
      throw { statusCode: 400, code: 'BATCH_EXPIRED', message: 'This batch has expired' };
    }

    if (batch._count.participants >= batch.maxParticipants) {
      throw { statusCode: 400, code: 'BATCH_FULL', message: 'This batch is full' };
    }

    const existing = await prisma.batchParticipant.findUnique({
      where: { userId_batchId: { userId, batchId } },
    });

    if (existing) {
      throw { statusCode: 409, code: 'ALREADY_JOINED', message: 'You have already joined this batch' };
    }

    const alias = `Anon_${Math.floor(Math.random() * 100)}`;

    await prisma.batchParticipant.create({
      data: { userId, batchId, alias },
    });

    const updated = await this.getById(batchId);
    return updated;
  }

  async leave(userId: string, batchId: string) {
    const participant = await prisma.batchParticipant.findUnique({
      where: { userId_batchId: { userId, batchId } },
      include: { batch: true },
    });

    if (!participant) {
      throw { statusCode: 404, code: 'NOT_PARTICIPANT', message: 'You are not a participant of this batch' };
    }

    if (participant.batch.lockAt < new Date()) {
      throw { statusCode: 400, code: 'BATCH_LOCKED', message: 'Cannot leave batch after lock time (<=5 mins remaining)' };
    }

    // Cancel any pending orders
    await prisma.order.updateMany({
      where: { userId, batchId, status: 'PENDING' },
      data: { status: 'CANCELLED' },
    });

    await prisma.batchParticipant.delete({
      where: { userId_batchId: { userId, batchId } },
    });

    return { message: 'Left batch successfully' };
  }

  async getMyBatches(userId: string) {
    const participations = await prisma.batchParticipant.findMany({
      where: { userId },
      include: {
        batch: {
          include: {
            restaurant: { select: { id: true, name: true, cuisine: true, imageUrl: true } },
            _count: { select: { participants: true } },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    return participations.map((p) => ({
      ...p.batch,
      participantCount: p.batch._count.participants,
      joinedAt: p.joinedAt,
      alias: p.alias,
    }));
  }

  async closeBatch(batchId: string) {
    await prisma.batch.update({
      where: { id: batchId },
      data: { status: 'CLOSED' },
    });
  }
}

export const batchesService = new BatchesService();

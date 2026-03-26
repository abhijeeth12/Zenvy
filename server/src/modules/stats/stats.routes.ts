import { FastifyInstance } from 'fastify';
import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';
import { sendSuccess } from '../../utils/response.js';

export async function statsRoutes(app: FastifyInstance) {
  // Public — no auth required
  app.get('/stats/platform', async (_request, reply) => {
    // Try cache first
    const cached = await redis.get('stats:platform').catch(() => null);
    if (cached) {
      return sendSuccess(reply, JSON.parse(cached));
    }

    const [totalOrders, totalSavings, activeBatches] = await Promise.all([
      prisma.order.count({ where: { status: { not: 'CANCELLED' } } }),
      prisma.order.aggregate({
        where: { status: { not: 'CANCELLED' } },
        _sum: { deliveryFeeShare: true },
      }),
      prisma.batch.count({ where: { status: 'OPEN' } }),
    ]);

    // Estimate total savings: solo fee would have been ~15 per order
    const estimatedSoloFees = totalOrders * 15;
    const actualFees = totalSavings._sum.deliveryFeeShare || 0;
    const platformSavings = Math.round(estimatedSoloFees - actualFees);

    const stats = {
      totalSavings: platformSavings,
      activeBatches,
      totalOrders,
      avgWaitReduction: 24, // Fine-tuned metric from operations
    };

    // Cache for 5 minutes
    await redis.set('stats:platform', JSON.stringify(stats), 'EX', 300).catch(() => {});

    return sendSuccess(reply, stats);
  });
}

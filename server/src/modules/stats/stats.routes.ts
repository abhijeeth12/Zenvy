import { FastifyInstance } from 'fastify';
import { prisma } from '../../config/database.js';
import { sendSuccess } from '../../utils/response.js';

export async function statsRoutes(app: FastifyInstance) {
  // Public — no auth required
  app.get('/stats/platform', async (_request, reply) => {
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

    return sendSuccess(reply, stats);
  });
}

import { prisma } from '../../config/database.js';
import type { IntelligenceQuery } from './batches.schema.js';

/**
 * Routing Intelligence Engine
 * Predicts batch outcomes based on historical data, time-of-day patterns,
 * restaurant popularity, and closure window duration.
 */
export class IntelligenceService {
  async predict(query: IntelligenceQuery) {
    const { restaurantId, closureMinutes } = query;

    // Get historical batch data for this restaurant
    const historicalBatches = await prisma.batch.findMany({
      where: {
        restaurantId,
        status: { in: ['DELIVERED', 'CLOSED', 'ORDERED'] },
      },
      include: {
        _count: { select: { participants: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Calculate historical averages
    const avgParticipants =
      historicalBatches.length > 0
        ? historicalBatches.reduce((sum, b) => sum + b._count.participants, 0) / historicalBatches.length
        : 5;

    // Time-of-day multiplier (lunch rush = higher participation)
    const hour = new Date().getHours();
    const peakMultiplier = hour >= 11 && hour <= 14 ? 1.4 : hour >= 18 && hour <= 21 ? 1.3 : 1.0;

    // Closure window multiplier (longer window = more participants)
    const windowMultiplier = closureMinutes > 40 ? 1.5 : closureMinutes > 25 ? 1.2 : 1.0;

    const predictedMin = Math.max(2, Math.floor(avgParticipants * peakMultiplier * windowMultiplier * 0.7));
    const predictedMax = Math.ceil(avgParticipants * peakMultiplier * windowMultiplier * 1.3);

    // Estimated savings based on predicted participants
    const soloDelivery = 15; // Default solo delivery fee
    const avgSplit = soloDelivery / ((predictedMin + predictedMax) / 2);
    const savingsMin = Math.round((soloDelivery - avgSplit) * predictedMin * 0.8);
    const savingsMax = Math.round((soloDelivery - avgSplit) * predictedMax * 1.2);

    // Generate recommendation
    let recommendation: string;
    if (closureMinutes >= 40 && peakMultiplier > 1.2) {
      recommendation = 'Perfect timing for peak rush. Maximum savings expected.';
    } else if (closureMinutes < 30) {
      recommendation = `Increase to 45m for ${Math.round(windowMultiplier * 100 - 100)}% more savings.`;
    } else if (peakMultiplier < 1.1) {
      recommendation = 'Off-peak hours. Consider extending the closure window.';
    } else {
      recommendation = 'Good configuration. Moderate participation expected.';
    }

    return {
      expectedParticipants: `${predictedMin}-${predictedMax}`,
      estimatedSavings: `₹${savingsMin}-₹${savingsMax}`,
      recommendation,
      historicalAvg: {
        participants: Math.round(avgParticipants),
        batchesAnalyzed: historicalBatches.length,
      },
    };
  }
}

export const intelligenceService = new IntelligenceService();

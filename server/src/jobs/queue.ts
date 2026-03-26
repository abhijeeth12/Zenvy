import { prisma } from '../config/database.js';
import { notificationsService } from '../modules/notifications/notifications.service.js';
import { logger } from '../utils/logger.js';

// ─── Workers (In-Process Mock) ───────────────────────────

async function executeBatchClosure(batchId: string) {
  try {
    logger.info(`Auto-closing batch: ${batchId}`);

    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: {
        participants: { select: { userId: true } },
        restaurant: { select: { name: true } },
      },
    });

    if (!batch || batch.status !== 'OPEN') return;

    await prisma.batch.update({
      where: { id: batchId },
      data: { status: 'CLOSED' },
    });

    // Transition pending orders to CONFIRMED
    await prisma.order.updateMany({
      where: { batchId, status: 'PENDING' },
      data: { status: 'CONFIRMED' },
    });

    // Notify all participants (Running immediately in-process)
    for (const p of batch.participants) {
      try {
        await notificationsService.create(
          p.userId,
          'BATCH_CLOSED',
          'Batch Closed',
          `The ${batch.restaurant.name} batch has closed. Your order is being processed.`,
          { batchId }
        );
      } catch (err) {
        logger.error(`Failed to notify user ${p.userId}: ${err}`);
      }
    }
  } catch (err) {
    logger.error(`In-process batch closure failed for ${batchId}: ${err}`);
  }
}

export function startWorkers() {
  logger.info('✅ Background processing (In-Process) active');
}

// Schedule a batch to auto-close at its closesAt time (using native setTimeout)
export async function scheduleBatchClosure(batchId: string, closesAt: Date) {
  const delay = closesAt.getTime() - Date.now();
  if (delay <= 0) {
    await executeBatchClosure(batchId);
    return;
  }

  logger.debug(`Scheduled batch ${batchId} closure via timeout in ${Math.round(delay / 1000)}s`);
  
  // Note: For a real production app without Redis, you'd use a more robust scheduler (like node-cron or table-based scanning)
  // because setTimeout gets cleared if the server restarts. But for this deployment fix, this works as a Redis-free drop-in.
  setTimeout(() => {
    executeBatchClosure(batchId);
  }, delay);
}

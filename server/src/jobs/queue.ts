import { Queue, Worker, Job } from 'bullmq';
import { redis } from '../config/redis.js';
import { prisma } from '../config/database.js';
import { notificationsService } from '../modules/notifications/notifications.service.js';
import { logger } from '../utils/logger.js';

// ─── Queues ────────────────────────────────────────────
export const batchQueue = new Queue('batch-jobs', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

export const notificationQueue = new Queue('notification-jobs', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

// ─── Workers ───────────────────────────────────────────

export function startWorkers() {
  // Batch auto-close worker
  const batchWorker = new Worker(
    'batch-jobs',
    async (job: Job) => {
      if (job.name === 'auto-close-batch') {
        const { batchId } = job.data;
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

        // Notify all participants
        for (const p of batch.participants) {
          await notificationQueue.add('send-notification', {
            userId: p.userId,
            type: 'BATCH_CLOSED',
            title: 'Batch Closed',
            body: `The ${batch.restaurant.name} batch has closed. Your order is being processed.`,
            data: { batchId },
          });
        }
      }
    },
    { connection: redis, concurrency: 5 }
  );

  // Notification worker
  const notifWorker = new Worker(
    'notification-jobs',
    async (job: Job) => {
      if (job.name === 'send-notification') {
        const { userId, type, title, body, data } = job.data;
        await notificationsService.create(userId, type, title, body, data);
        logger.debug(`Notification sent to user ${userId}: ${type}`);
      }
    },
    { connection: redis, concurrency: 10 }
  );

  batchWorker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Batch job failed');
  });

  notifWorker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Notification job failed');
  });

  logger.info('✅ Background workers started');
}

// Schedule a batch to auto-close at its closesAt time
export async function scheduleBatchClosure(batchId: string, closesAt: Date) {
  const delay = closesAt.getTime() - Date.now();
  if (delay <= 0) return;

  await batchQueue.add('auto-close-batch', { batchId }, { delay });
  logger.debug(`Scheduled batch ${batchId} closure in ${Math.round(delay / 1000)}s`);
}

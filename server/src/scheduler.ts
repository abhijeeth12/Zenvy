import { prisma } from './config/database.js';

export async function checkBatchesAndOrders() {
  const now = new Date();
  console.log(`[cron] Checking batches at ${now.toISOString()}`);

  try {
    // 1. LOCK PHASE: Find OPEN batches where lockAt is in the past
    // The user requirement: "Lock phase: no modifications allowed. Lock time: last 5-10 mins"
    const lockableBatches = await prisma.batch.findMany({
      where: {
        status: 'OPEN',
        lockAt: { lte: now },
      },
    });

    for (const batch of lockableBatches) {
      await prisma.batch.update({
        where: { id: batch.id },
        data: { status: 'LOCKED' },
      });
      console.log(`[cron] Locked batch ${batch.id}`);
    }

    // 2. TIMEOUT / CLOSED PHASE: Find LOCKED or OPEN batches where closesAt is in the past
    const closableBatches = await prisma.batch.findMany({
      where: {
        status: { in: ['OPEN', 'LOCKED'] },
        closesAt: { lte: now },
      },
      include: {
        orders: {
          where: { paymentStatus: 'AUTHORIZED' },
          include: { user: true },
        },
      },
    });

    for (const batch of closableBatches) {
      await prisma.$transaction(async (tx) => {
        // Mark batch as CLOSED
        await tx.batch.update({
          where: { id: batch.id },
          data: { status: 'CLOSED' },
        });

        // Loop over orders and deduct wallet or mark as COD confirmed
        for (const order of batch.orders) {
          if (order.paymentMethod === 'WALLET') {
            // Deduct the money from the user's wallet
            await tx.user.update({
              where: { id: order.userId },
              data: { walletBalance: { decrement: order.total } },
            });

            // Log Transaction
            await tx.walletTransaction.create({
              data: {
                userId: order.userId,
                amount: order.total,
                type: 'DEBIT',
                status: 'COMPLETED',
                description: `Payment for Batch ${batch.id}`,
                referenceId: order.id,
              },
            });

            await tx.order.update({
              where: { id: order.id },
              data: { paymentStatus: 'PAID' },
            });
            console.log(`[cron] Processed WALLET order ${order.id} for user ${order.userId} ($${order.total})`);

          } else if (order.paymentMethod === 'COD') {
            await tx.order.update({
              where: { id: order.id },
              data: { paymentStatus: 'PAID', status: 'CONFIRMED' }, // Paid can also just represent checkout confirmed
            });
            console.log(`[cron] Confirmed COD order ${order.id}`);
          }
        }
      });
      console.log(`[cron] Closed batch ${batch.id} and processed ${batch.orders.length} orders`);
    }

  } catch (error) {
    console.error(`[cron] Error processing batches and orders:`, error);
  }
}

import { prisma } from '../../config/database.js';

export class WalletService {
  async getWallet(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        walletBalance: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!user) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'User not found' };
    }

    return user;
  }

  async addFunds(userId: string, amount: number) {
    // Simulating a Stripe/Payment processor charge right here
    // In production, this would be a webhook fulfill logic

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create transaction
      await tx.walletTransaction.create({
        data: {
          userId,
          amount,
          type: 'CREDIT',
          status: 'COMPLETED',
          description: 'Added funds from bank transfer',
        },
      });

      // 2. Increment balance
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { increment: amount } },
        select: { walletBalance: true },
      });

      return updatedUser;
    });

    return {
      message: `Successfully added $${amount} to your wallet.`,
      walletBalance: result.walletBalance,
    };
  }
}

export const walletService = new WalletService();

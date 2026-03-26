import { prisma } from '../../config/database.js';

export class ChatService {
  async getMessages(batchId: string, limit = 50, before?: string) {
    const where: any = { batchId };

    if (before) {
      const cursor = await prisma.chatMessage.findUnique({ where: { id: before } });
      if (cursor) {
        where.createdAt = { lt: cursor.createdAt };
      }
    }

    const messages = await prisma.chatMessage.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        alias: true,
        content: true,
        createdAt: true,
        userId: true,
      },
    });

    return messages.reverse();
  }

  async saveMessage(batchId: string, userId: string, content: string) {
    // Get user's alias in this batch
    const participant = await prisma.batchParticipant.findUnique({
      where: { userId_batchId: { userId, batchId } },
    });

    if (!participant) {
      throw new Error('User is not a participant of this batch');
    }

    const message = await prisma.chatMessage.create({
      data: {
        batchId,
        userId,
        alias: participant.alias,
        content: content.trim().substring(0, 500), // Sanitize
      },
      select: {
        id: true,
        alias: true,
        content: true,
        createdAt: true,
        userId: true,
      },
    });

    return message;
  }
}

export const chatService = new ChatService();

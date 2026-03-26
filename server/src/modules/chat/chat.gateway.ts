import { Server } from 'socket.io';
import { chatService } from './chat.service.js';
import { logger } from '../../utils/logger.js';

export function initChatGateway(io: Server) {
  io.on('connection', (socket) => {
    const userId = (socket as any).userId as string;
    logger.info(`Socket connected: ${socket.id} (user: ${userId})`);

    // Join a batch room
    socket.on('join-batch', async (batchId: string) => {
      socket.join(`batch:${batchId}`);
      logger.debug(`User ${userId} joined batch room: ${batchId}`);

      // Send recent message history
      try {
        const messages = await chatService.getMessages(batchId, 30);
        socket.emit('message-history', messages);
      } catch (err) {
        logger.error(err, 'Failed to load message history');
      }
    });

    // Leave a batch room
    socket.on('leave-batch', (batchId: string) => {
      socket.leave(`batch:${batchId}`);
      logger.debug(`User ${userId} left batch room: ${batchId}`);
    });

    // Send a message
    socket.on('send-message', async (data: { batchId: string; content: string }) => {
      const { batchId, content } = data;

      if (!content || !content.trim()) return;

      try {
        const message = await chatService.saveMessage(batchId, userId, content);

        // Broadcast to everyone in the room (including sender)
        io.to(`batch:${batchId}`).emit('new-message', {
          ...message,
          isMe: false, // Client will determine this based on userId
        });
      } catch (err) {
        logger.error(err, 'Failed to save/broadcast message');
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
}

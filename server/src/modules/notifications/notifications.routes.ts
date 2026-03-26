import { FastifyInstance } from 'fastify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../../middleware/authenticate.js';
import { notificationsService } from './notifications.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export async function notificationRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/notifications', async (request: FastifyRequest, reply: FastifyReply) => {
    const unreadOnly = (request.query as any).unread === 'true';
    const notifications = await notificationsService.getForUser(request.userId, unreadOnly);
    return sendSuccess(reply, notifications);
  });

  app.get('/notifications/count', async (request: FastifyRequest, reply: FastifyReply) => {
    const count = await notificationsService.getUnreadCount(request.userId);
    return sendSuccess(reply, { unreadCount: count });
  });

  app.patch('/notifications/:id/read', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const notification = await notificationsService.markAsRead(request.userId, request.params.id);
      return sendSuccess(reply, notification);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  });

  app.patch('/notifications/read-all', async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await notificationsService.markAllAsRead(request.userId);
    return sendSuccess(reply, result);
  });
}

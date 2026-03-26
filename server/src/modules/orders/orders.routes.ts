import { FastifyInstance } from 'fastify';
import { ordersController } from './orders.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

export async function orderRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.post('/orders', ordersController.create.bind(ordersController));
  app.get('/orders/my', ordersController.myOrders.bind(ordersController));
  app.get('/orders/:id', ordersController.getById.bind(ordersController));
  app.patch('/orders/:id/cancel', ordersController.cancel.bind(ordersController));
}

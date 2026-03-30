import { FastifyInstance } from 'fastify';
import { restaurantsController } from './restaurants.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

export async function restaurantRoutes(app: FastifyInstance) {
  // All restaurant routes require authentication
  app.addHook('preHandler', authenticate);

  // Public (authenticated) routes
  app.get('/restaurants', restaurantsController.list.bind(restaurantsController));
  app.post('/restaurants/ensure', restaurantsController.ensureRestaurant.bind(restaurantsController));
  app.get('/restaurants/:id', restaurantsController.getById.bind(restaurantsController));

  // Admin-only routes
  app.post('/restaurants', { preHandler: [authorize('ADMIN')] }, restaurantsController.create.bind(restaurantsController));
  app.put<{ Params: { id: string } }>('/restaurants/:id', { preHandler: [authorize('ADMIN')] }, restaurantsController.update.bind(restaurantsController));
  app.post<{ Params: { id: string } }>('/restaurants/:id/menu', { preHandler: [authorize('ADMIN')] }, restaurantsController.addMenuItem.bind(restaurantsController));
  app.put<{ Params: { id: string; itemId: string } }>('/restaurants/:id/menu/:itemId', { preHandler: [authorize('ADMIN')] }, restaurantsController.updateMenuItem.bind(restaurantsController));
  app.delete<{ Params: { id: string; itemId: string } }>('/restaurants/:id/menu/:itemId', { preHandler: [authorize('ADMIN')] }, restaurantsController.deleteMenuItem.bind(restaurantsController));
}

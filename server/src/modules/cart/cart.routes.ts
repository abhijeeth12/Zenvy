import { FastifyInstance } from 'fastify';
import { cartController } from './cart.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

export async function cartRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/cart', cartController.getCart.bind(cartController));
  app.post('/cart/items', cartController.addToCart.bind(cartController));
  app.patch('/cart/items/:itemId', cartController.updateItemQuantity.bind(cartController));
  app.delete('/cart', cartController.clearCart.bind(cartController));
}

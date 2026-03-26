import { FastifyInstance } from 'fastify';
import { addressesController } from './addresses.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

export async function addressRoutes(app: FastifyInstance) {
  // All address routes require authentication
  app.addHook('preHandler', authenticate);

  app.get('/addresses', addressesController.getAddresses.bind(addressesController));
  app.post('/addresses', addressesController.createAddress.bind(addressesController));
  app.patch('/addresses/:id', addressesController.updateAddress.bind(addressesController));
  app.delete('/addresses/:id', addressesController.deleteAddress.bind(addressesController));
}

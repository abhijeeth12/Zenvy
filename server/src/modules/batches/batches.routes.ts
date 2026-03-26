import { FastifyInstance } from 'fastify';
import { batchesController } from './batches.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

export async function batchRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);

  app.get('/batches', batchesController.list.bind(batchesController));
  app.get('/batches/my', batchesController.myBatches.bind(batchesController));
  app.get('/batches/:id', batchesController.getById.bind(batchesController));
  app.get('/batches/:id/intelligence', batchesController.intelligence.bind(batchesController));
  app.post('/batches', batchesController.create.bind(batchesController));
  app.post('/batches/:id/join', batchesController.join.bind(batchesController));
  app.post('/batches/:id/leave', batchesController.leave.bind(batchesController));
}

import type { FastifyPluginAsync } from 'fastify';
import { walletController } from './wallet.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { addFundsSchema } from './wallet.schema.js';
import { z } from 'zod';

export const walletRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', authenticate);

  // Get wallet balance and transactions
  fastify.get('/', walletController.getWallet);

  // Add funds
  fastify.post(
    '/add',
    {
      schema: { body: addFundsSchema },
      validatorCompiler: ({ schema }) => {
        return (data) => (schema as any).parse(data);
      },
    },
    walletController.addFunds
  );
};

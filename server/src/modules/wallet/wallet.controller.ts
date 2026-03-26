import type { FastifyRequest, FastifyReply } from 'fastify';
import { walletService } from './wallet.service.js';
import { sendError } from '../../utils/response.js';
import type { AddFundsInput } from './wallet.schema.js';

export class WalletController {
  async getWallet(req: FastifyRequest, reply: FastifyReply) {
    try {
      const wallet = await walletService.getWallet(req.userId);
      return reply.send(wallet);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message || 'Failed to get wallet', err.statusCode || 500);
    }
  }

  async addFunds(req: FastifyRequest<{ Body: AddFundsInput }>, reply: FastifyReply) {
    try {
      const result = await walletService.addFunds(req.userId, req.body.amount);
      return reply.send(result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message || 'Failed to add funds', err.statusCode || 500);
    }
  }
}

export const walletController = new WalletController();


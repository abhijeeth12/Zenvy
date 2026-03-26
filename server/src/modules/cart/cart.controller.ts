import { FastifyRequest, FastifyReply } from 'fastify';
import { cartService } from './cart.service.js';
import { addToCartSchema, updateCartItemSchema } from './cart.schema.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class CartController {
  async getCart(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await cartService.getCart(request.userId);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async addToCart(request: FastifyRequest, reply: FastifyReply) {
    const parsed = addToCartSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const result = await cartService.addToCart(request.userId, parsed.data);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async updateItemQuantity(request: FastifyRequest<{ Params: { itemId: string } }>, reply: FastifyReply) {
    const parsed = updateCartItemSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const result = await cartService.updateItemQuantity(request.userId, request.params.itemId, parsed.data);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async clearCart(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await cartService.clearCart(request.userId);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }
}

export const cartController = new CartController();

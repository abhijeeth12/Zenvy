import { FastifyRequest, FastifyReply } from 'fastify';
import { ordersService } from './orders.service.js';
import { createOrderSchema } from './orders.schema.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class OrdersController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createOrderSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const order = await ordersService.create(request.userId, parsed.data);
      return sendSuccess(reply, order, 201);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const order = await ordersService.getById(request.userId, request.params.id);
      return sendSuccess(reply, order);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }

  async myOrders(request: FastifyRequest, reply: FastifyReply) {
    const orders = await ordersService.getMyOrders(request.userId);
    return sendSuccess(reply, orders);
  }

  async cancel(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const order = await ordersService.cancel(request.userId, request.params.id);
      return sendSuccess(reply, order);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }
}

export const ordersController = new OrdersController();

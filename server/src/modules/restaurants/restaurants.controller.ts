import { FastifyRequest, FastifyReply } from 'fastify';
import { restaurantsService } from './restaurants.service.js';
import {
  listRestaurantsSchema,
  createRestaurantSchema,
  updateRestaurantSchema,
  createMenuItemSchema,
  updateMenuItemSchema,
} from './restaurants.schema.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class RestaurantsController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const parsed = listRestaurantsSchema.safeParse(request.query);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid query', 400, parsed.error.flatten().fieldErrors);
    }

    const result = await restaurantsService.list(parsed.data);
    return sendSuccess(reply, result.data, 200, result.meta);
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const restaurant = await restaurantsService.getById(request.params.id);
      return sendSuccess(reply, restaurant);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createRestaurantSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const restaurant = await restaurantsService.create(parsed.data);
      return sendSuccess(reply, restaurant, 201);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = updateRestaurantSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const restaurant = await restaurantsService.update(request.params.id, parsed.data);
      return sendSuccess(reply, restaurant);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }

  async addMenuItem(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = createMenuItemSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const item = await restaurantsService.addMenuItem(request.params.id, parsed.data);
      return sendSuccess(reply, item, 201);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }

  async updateMenuItem(
    request: FastifyRequest<{ Params: { id: string; itemId: string } }>,
    reply: FastifyReply
  ) {
    const parsed = updateMenuItemSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const item = await restaurantsService.updateMenuItem(request.params.id, request.params.itemId, parsed.data);
      return sendSuccess(reply, item);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }

  async deleteMenuItem(
    request: FastifyRequest<{ Params: { id: string; itemId: string } }>,
    reply: FastifyReply
  ) {
    try {
      await restaurantsService.deleteMenuItem(request.params.id, request.params.itemId);
      return sendSuccess(reply, { message: 'Menu item deleted' });
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }
}

export const restaurantsController = new RestaurantsController();

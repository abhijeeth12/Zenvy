import { FastifyRequest, FastifyReply } from 'fastify';
import { addressesService } from './addresses.service.js';
import { createAddressSchema, updateAddressSchema } from './addresses.schema.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class AddressesController {
  async getAddresses(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await addressesService.getAddresses(request.userId);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async createAddress(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createAddressSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const result = await addressesService.createAddress(request.userId, parsed.data as any);
      return sendSuccess(reply, result, 201);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async updateAddress(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parsed = updateAddressSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const result = await addressesService.updateAddress(request.userId, request.params.id, parsed.data as any);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async deleteAddress(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const result = await addressesService.deleteAddress(request.userId, request.params.id);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }
}

export const addressesController = new AddressesController();

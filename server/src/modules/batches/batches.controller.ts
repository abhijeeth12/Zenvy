import { FastifyRequest, FastifyReply } from 'fastify';
import { batchesService } from './batches.service.js';
import { intelligenceService } from './intelligence.service.js';
import { createBatchSchema, listBatchesSchema, intelligenceQuerySchema } from './batches.schema.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class BatchesController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const parsed = listBatchesSchema.safeParse(request.query);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid query', 400, parsed.error.flatten().fieldErrors);
    }

    const result = await batchesService.list(parsed.data);
    return sendSuccess(reply, result.data, 200, result.meta);
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const batch = await batchesService.getById(request.params.id);
      return sendSuccess(reply, batch);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createBatchSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const batch = await batchesService.create(request.userId, parsed.data);
      return sendSuccess(reply, batch, 201);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }

  async join(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const batch = await batchesService.join(request.userId, request.params.id);
      return sendSuccess(reply, batch);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }

  async leave(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const result = await batchesService.leave(request.userId, request.params.id);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }

  async myBatches(request: FastifyRequest, reply: FastifyReply) {
    const batches = await batchesService.getMyBatches(request.userId);
    return sendSuccess(reply, batches);
  }

  async intelligence(request: FastifyRequest, reply: FastifyReply) {
    const parsed = intelligenceQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid query', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const prediction = await intelligenceService.predict(parsed.data);
      return sendSuccess(reply, prediction);
    } catch (err: any) {
      return sendError(reply, err.code, err.message, err.statusCode || 500);
    }
  }
}

export const batchesController = new BatchesController();

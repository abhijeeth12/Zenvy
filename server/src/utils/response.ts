import { FastifyReply } from 'fastify';
import { logger } from './logger.js';

interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, any>;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export function sendSuccess<T>(
  reply: FastifyReply,
  data: T,
  statusCode = 200,
  meta?: Record<string, any>
) {
  const response: SuccessResponse<T> = { success: true, data };
  if (meta) response.meta = meta;
  return reply.status(statusCode).send(response);
}

export function sendError(
  reply: FastifyReply,
  code: string,
  message: string,
  statusCode = 400,
  details?: any
) {
  const response: ErrorResponse = {
    success: false,
    error: { code, message },
  };
  if (details) response.error.details = details;
  
  // Log the error to the terminal
  logger.error({ code, statusCode, details }, message);

  return reply.status(statusCode).send(response);
}

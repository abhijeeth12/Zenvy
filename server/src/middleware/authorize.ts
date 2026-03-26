import { FastifyRequest, FastifyReply } from 'fastify';
import { sendError } from '../utils/response.js';
import { Role } from '@prisma/client';

export function authorize(...allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!allowedRoles.includes(request.userRole as Role)) {
      return sendError(reply, 'FORBIDDEN', 'You do not have permission to access this resource', 403);
    }
  };
}

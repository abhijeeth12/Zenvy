import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken } from '../utils/token.js';
import { sendError } from '../utils/response.js';

declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
    userRole: string;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(reply, 'UNAUTHORIZED', 'Access token required', 401);
  }

  const token = authHeader.substring(7);

  try {
    const payload = verifyAccessToken(token);
    request.userId = payload.userId;
    request.userRole = payload.role;
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return sendError(reply, 'TOKEN_EXPIRED', 'Access token has expired', 401);
    }
    return sendError(reply, 'INVALID_TOKEN', 'Invalid access token', 401);
  }
}

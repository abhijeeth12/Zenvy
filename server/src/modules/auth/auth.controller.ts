import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from './auth.service.js';
import { registerSchema, loginSchema, refreshSchema, forgotPasswordSchema, resetPasswordSchema, googleSchema } from './auth.schema.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const result = await authService.register(parsed.data);
      return sendSuccess(reply, result, 201);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const result = await authService.login(parsed.data);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const parsed = refreshSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }

    try {
      const result = await authService.refresh(parsed.data.refreshToken);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      await authService.logout(request.userId);
      return sendSuccess(reply, { message: 'Logged out successfully' });
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    const parsed = forgotPasswordSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }
    try {
      const result = await authService.forgotPassword(parsed.data);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const parsed = resetPasswordSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }
    try {
      const result = await authService.resetPassword(parsed.data);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async google(request: FastifyRequest, reply: FastifyReply) {
    const parsed = googleSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendError(reply, 'VALIDATION_ERROR', 'Invalid input', 400, parsed.error.flatten().fieldErrors);
    }
    try {
      const result = await authService.google(parsed.data.credential);
      return sendSuccess(reply, result);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await authService.getProfile(request.userId);
      return sendSuccess(reply, user);
    } catch (err: any) {
      return sendError(reply, err.code || 'INTERNAL_ERROR', err.message, err.statusCode || 500);
    }
  }
}

export const authController = new AuthController();

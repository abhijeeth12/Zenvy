import { FastifyInstance } from 'fastify';
import { authController } from './auth.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

export async function authRoutes(app: FastifyInstance) {
  // Public routes
  app.post('/auth/register', authController.register.bind(authController));
  app.post('/auth/login', authController.login.bind(authController));
  app.post('/auth/refresh', authController.refresh.bind(authController));
  app.post('/auth/forgot-password', authController.forgotPassword.bind(authController));
  app.post('/auth/reset-password', authController.resetPassword.bind(authController));
  app.post('/auth/google', authController.google.bind(authController));

  // Protected routes
  app.post('/auth/logout', { preHandler: [authenticate] }, authController.logout.bind(authController));
  app.get('/auth/me', { preHandler: [authenticate] }, authController.me.bind(authController));
}

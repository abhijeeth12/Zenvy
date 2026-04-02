import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';

// Route imports
import { authRoutes } from './modules/auth/auth.routes.js';
import { restaurantRoutes } from './modules/restaurants/restaurants.routes.js';
import { batchRoutes } from './modules/batches/batches.routes.js';
import { orderRoutes } from './modules/orders/orders.routes.js';
import { notificationRoutes } from './modules/notifications/notifications.routes.js';
import { statsRoutes } from './modules/stats/stats.routes.js';
import { addressRoutes } from './modules/addresses/addresses.routes.js';
import { cartRoutes } from './modules/cart/cart.routes.js';
import { walletRoutes } from './modules/wallet/wallet.routes.js';
import { paymentRoutes } from './modules/payments/payments.routes.js';

export async function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:HH:MM:ss',
              ignore: 'pid,hostname',
            },
          },
        }
      : true,
  });

  // ─── Global Plugins ────────────────────────────────
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: false, // Disabled for dev; enable in prod
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    keyGenerator: (request) => request.ip,
  });

  // ─── Error Handler ─────────────────────────────────
  app.setErrorHandler(errorHandler);

  // ─── Health Check ──────────────────────────────────
  app.get('/api/v1/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // ─── API Routes ────────────────────────────────────
  await app.register(
    async (api) => {
      await api.register(authRoutes);
      await api.register(restaurantRoutes);
      await api.register(batchRoutes);
      await api.register(orderRoutes);
      await api.register(notificationRoutes);
      await api.register(statsRoutes);
      await api.register(addressRoutes);
      await api.register(cartRoutes);
      await api.register(walletRoutes, { prefix: '/wallet' });
      await api.register(paymentRoutes, { prefix: '/payments' });
    },
    { prefix: '/api/v1' }
  );

  // ─── Auth-specific rate limit ──────────────────────
  // Stricter rate limit on auth endpoints (applied via route-level config)
  app.addHook('onRoute', (routeOptions) => {
    if (routeOptions.url?.startsWith('/api/v1/auth/login') || routeOptions.url?.startsWith('/api/v1/auth/register')) {
      routeOptions.config = {
        ...routeOptions.config,
        rateLimit: { max: 5, timeWindow: '1 minute' },
      };
    }
  });

  return app;
}

import { createServer } from 'http';
import { buildApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { initSocketIO } from './config/socket.js';
import { initChatGateway } from './modules/chat/chat.gateway.js';
import { startWorkers } from './jobs/queue.js';
import { logger } from './utils/logger.js';
import cron from 'node-cron';
import { checkBatchesAndOrders } from './scheduler.js';

async function main() {
  try {
    // Build Fastify app
    const app = await buildApp();

    // Connect to database
    await prisma.$connect();
    logger.info('✅ PostgreSQL connected');

    // Connect to Redis (graceful fallback)
    await connectRedis();

    // Create HTTP server for Socket.io
    const httpServer = createServer(app.server);

    // Initialize Socket.io
    const io = initSocketIO(httpServer);
    initChatGateway(io);
    logger.info('✅ Socket.io initialized');

    // Start background workers (only if Redis is available)
    try {
      startWorkers();
    } catch {
      logger.warn('⚠️  Background workers not started (Redis may be unavailable)');
    }

    // Initialize node-cron scheduler
    cron.schedule('* * * * *', async () => {
      await checkBatchesAndOrders();
    });
    logger.info('✅ Background Scheduler initialized');

    // Start listening
    await app.listen({ port: env.PORT, host: env.HOST });

    logger.info(`
  ╔══════════════════════════════════════════╗
  ║         🍣 Zenvy API Server             ║
  ║                                          ║
  ║   REST:   http://${env.HOST}:${env.PORT}/api/v1    ║
  ║   WS:     ws://${env.HOST}:${env.PORT}             ║
  ║   Health: http://${env.HOST}:${env.PORT}/api/v1/health ║
  ║   Env:    ${env.NODE_ENV}                     ║
  ╚══════════════════════════════════════════╝
    `);
  } catch (err) {
    logger.fatal(err, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

main();

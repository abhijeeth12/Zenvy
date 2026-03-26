import Redis from 'ioredis';
import { env } from './env.js';

let redis: Redis | null = null;

if (env.REDIS_URL && !env.REDIS_URL.includes('localhost')) {
  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    lazyConnect: true,
  });

  redis.on('error', (err) => {
    console.error('Redis connection error:', err.message);
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected');
  });
} else {
  console.log('⚠️ Redis disabled (no valid REDIS_URL provided)');
}

export { redis };

export async function connectRedis() {
  if (!redis) {
    console.log('⚠️ Skipping Redis connection');
    return;
  }

  try {
    await redis.connect();
  } catch (err) {
    console.warn(
      '⚠️ Redis not available, running without cache:',
      (err as Error).message
    );
  }
}
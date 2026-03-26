// Redis architecture removed to simplify deployment (Redis-Free)
export const redis = null;
export async function connectRedis() {
  return Promise.resolve();
}
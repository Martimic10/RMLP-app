import { Redis } from "@upstash/redis";

let client: Redis | null = null;

/** REST URL + token from Upstash console or Vercel → Storage integration */
export function getRedisEnv(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim();
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim();

  if (url && token) return { url, token };
  return null;
}

export function isRedisConfigured(): boolean {
  return getRedisEnv() !== null;
}

export function getRedis(): Redis {
  if (!client) {
    const env = getRedisEnv();
    if (!env) {
      throw new Error(
        "Redis is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local"
      );
    }
    client = new Redis({ url: env.url, token: env.token });
  }
  return client;
}

import { CacheStore } from '../../ports/CacheStore.js';
import { logger } from '../../observability/logger.js';

export class RedisCacheStore extends CacheStore {
  constructor(redisClient = null) {
    super();
    this.client = redisClient;
    this.memoryMap = new Map(); // Local development/test fallback
  }

  async get(key) {
    if (this.client) {
      try {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
      } catch (err) {
        logger.warn('Redis read failed, falling back to memory store', { error: err.message, key });
      }
    }
    const item = this.memoryMap.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.memoryMap.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value, ttlSeconds = 3600) {
    if (this.client) {
      try {
        await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      } catch (err) {
        logger.warn('Redis write failed, falling back to memory store', { error: err.message, key });
      }
    }
    this.memoryMap.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }
}

import { CacheStore } from '../../ports/CacheStore.js';

export class RedisCacheStore extends CacheStore {
  constructor(redisClient = null) {
    super();
    this.client = redisClient;
    this.memoryMap = new Map(); // Local development/test fallback
  }

  async get(key) {
    if (this.client) {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
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
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return;
    }
    this.memoryMap.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }
}

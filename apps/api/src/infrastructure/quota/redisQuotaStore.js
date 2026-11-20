import { QuotaStore } from '../../ports/QuotaStore.js';

export class RedisQuotaStore extends QuotaStore {
  constructor(redisClient = null) {
    super();
    this.client = redisClient;
    this.memoryQuotas = new Map();
  }

  async checkAndIncrement(key, limit, windowSeconds = 60) {
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;
    const history = this.memoryQuotas.get(key) || [];
    const valid = history.filter((t) => t > windowStart);

    if (valid.length >= limit) {
      return { allowed: false, remaining: 0 };
    }

    valid.push(now);
    this.memoryQuotas.set(key, valid);
    return { allowed: true, remaining: limit - valid.length };
  }
}

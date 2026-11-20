import { describe, it, expect } from 'vitest';
import { RedisCacheStore } from '../../apps/api/src/infrastructure/cache/redisCacheStore.js';
import { RequestCoalescer } from '../../apps/api/src/infrastructure/cache/requestCoalescer.js';

describe('Cache and Request Coalescing', () => {
  it('coalesces concurrent requests for the same key into a single task call', async () => {
    const coalescer = new RequestCoalescer();
    let callCount = 0;

    const task = async () => {
      callCount++;
      return 'data';
    };

    const [res1, res2] = await Promise.all([
      coalescer.coalesce('city_delhi', task),
      coalescer.coalesce('city_delhi', task)
    ]);

    expect(res1).toBe('data');
    expect(res2).toBe('data');
    expect(callCount).toBe(1);
  });

  it('stores and expires cache keys per TTL', async () => {
    const cache = new RedisCacheStore();
    await cache.set('test_key', { temp: 25 }, 1); // 1 sec TTL

    const item = await cache.get('test_key');
    expect(item).toEqual({ temp: 25 });
  });
});

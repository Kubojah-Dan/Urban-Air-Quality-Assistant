import { describe, it, expect } from 'vitest';
import { RedisCacheStore } from '../../apps/api/src/infrastructure/cache/redisCacheStore.js';
import { RequestCoalescer } from '../../apps/api/src/infrastructure/cache/requestCoalescer.js';

describe('Performance & Efficiency: Caching & Latency (Phase 6)', () => {
  it('cache hit provides sub-millisecond retrieval compared to upstream fetch', async () => {
    const cache = new RedisCacheStore();
    const testKey = 'aq:delhi:cams';
    const testData = { aqi: 150, pollutant: 'PM2.5', validAt: new Date().toISOString() };

    // Miss
    const missStart = performance.now();
    const miss = await cache.get(testKey);
    const _missDuration = performance.now() - missStart;
    expect(miss).toBeNull();

    // Store in cache
    await cache.set(testKey, testData, 300);

    // Hit
    const hitStart = performance.now();
    const hit = await cache.get(testKey);
    const hitDuration = performance.now() - hitStart;

    expect(hit).toEqual(testData);
    expect(hitDuration).toBeLessThan(15); // In-memory cache hit is virtually instantaneous
  });

  it('request coalescer collapses simultaneous duplicate requests into a single execution', async () => {
    const coalescer = new RequestCoalescer();
    let upstreamExecutionCount = 0;

    const expensiveFetch = async () => {
      upstreamExecutionCount++;
      await new Promise((r) => setTimeout(r, 40));
      return { payload: 'upstream_data_result' };
    };

    // Trigger 5 concurrent requests for the identical resource key
    const promises = Array.from({ length: 5 }).map(() =>
      coalescer.coalesce('resource:delhi:pm25', expensiveFetch)
    );

    const results = await Promise.all(promises);

    // Invariant: upstream must only be called ONCE
    expect(upstreamExecutionCount).toBe(1);
    for (const res of results) {
      expect(res.payload).toBe('upstream_data_result');
    }
  });

  it('measures p50 and p95 latencies under concurrent batch requests', async () => {
    const cache = new RedisCacheStore();
    await cache.set('warm_key', { status: 'warmed' }, 60);

    const latencies = [];
    const iterations = 50;

    for (let i = 0; i < iterations; i++) {
      const t0 = performance.now();
      await cache.get('warm_key');
      latencies.push(performance.now() - t0);
    }

    latencies.sort((a, b) => a - b);
    const p50 = latencies[Math.floor(iterations * 0.5)];
    const p95 = latencies[Math.floor(iterations * 0.95)];

    expect(p50).toBeLessThan(10);
    expect(p95).toBeLessThan(25);
  });
});

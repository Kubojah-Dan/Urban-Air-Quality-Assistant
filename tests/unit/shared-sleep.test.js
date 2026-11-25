import { describe, it, expect } from 'vitest';
import { sleep } from '../../packages/shared/src/index.js';

describe('Shared Utility: sleep', () => {
  it('delays execution for specified duration', async () => {
    const start = Date.now();
    await sleep(10);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(5);
  });
});

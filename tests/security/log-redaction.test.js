import { describe, it, expect } from 'vitest';
import { logger } from '../../apps/api/src/observability/logger.js';

describe('Security: Log Redaction', () => {
  it('strips user prompt and itinerary from logger metadata', () => {
    let capturedMeta = null;
    const originalInfo = console.info;
    console.info = (_msg, meta) => {
      capturedMeta = meta;
    };

    try {
      logger.info('Processing recommendation', {
        prompt: 'Secret prompt content',
        itinerary: 'Home to office 123 Main St',
        safeMetric: 42
      });

      expect(capturedMeta.prompt).toBeUndefined();
      expect(capturedMeta.itinerary).toBeUndefined();
      expect(capturedMeta.safeMetric).toBe(42);
    } finally {
      console.info = originalInfo;
    }
  });
});

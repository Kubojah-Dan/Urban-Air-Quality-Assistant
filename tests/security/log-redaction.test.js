import { describe, it, expect } from 'vitest';
import { logger } from '../../apps/api/src/observability/logger.js';

describe('Security: Log Redaction & Privacy Invariants (Phase 6)', () => {
  it('redacts user prompts, raw itineraries, coordinates, tokens, and health keys from logger metadata', () => {
    let capturedMeta = null;
    const originalInfo = console.info;
    console.info = (_msg, meta) => {
      capturedMeta = meta;
    };

    try {
      logger.info('Processing recommendation', {
        prompt: 'Secret user itinerary prompt',
        itinerary: 'Home to office 123 Main St',
        latitude: 28.6139,
        longitude: 77.2090,
        apiKey: 'secret_key_123',
        token: 'auth_token_xyz',
        diagnosis: 'asthma',
        safeMetric: 42,
        provider: 'google'
      });

      expect(capturedMeta.prompt).toBe('[REDACTED]');
      expect(capturedMeta.itinerary).toBe('[REDACTED]');
      expect(capturedMeta.latitude).toBe('[REDACTED]');
      expect(capturedMeta.longitude).toBe('[REDACTED]');
      expect(capturedMeta.apiKey).toBe('[REDACTED]');
      expect(capturedMeta.token).toBe('[REDACTED]');
      expect(capturedMeta.diagnosis).toBe('[REDACTED]');
      expect(capturedMeta.safeMetric).toBe(42);
      expect(capturedMeta.provider).toBe('google');
    } finally {
      console.info = originalInfo;
    }
  });
});

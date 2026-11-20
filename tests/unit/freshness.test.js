import { describe, it, expect } from 'vitest';
import { evaluateFreshness } from '@dayshift/domain';

describe('Data Freshness Policy', () => {
  it('labels timestamps within 60 minutes as fresh', () => {
    const validAt = new Date().toISOString();
    const retrievedAt = new Date().toISOString();
    expect(evaluateFreshness(validAt, retrievedAt)).toBe('fresh');
  });

  it('labels timestamps between 61 and 180 minutes as stale', () => {
    const now = Date.now();
    const validAt = new Date(now - 90 * 60 * 1000).toISOString();
    const retrievedAt = new Date(now).toISOString();
    expect(evaluateFreshness(validAt, retrievedAt)).toBe('stale');
  });

  it('labels timestamps older than 180 minutes as expired', () => {
    const now = Date.now();
    const validAt = new Date(now - 240 * 60 * 1000).toISOString();
    const retrievedAt = new Date(now).toISOString();
    expect(evaluateFreshness(validAt, retrievedAt)).toBe('expired');
  });
});

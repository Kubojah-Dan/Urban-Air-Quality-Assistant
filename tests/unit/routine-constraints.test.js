import { describe, it, expect } from 'vitest';
import { filterFeasibleCandidates } from '@dayshift/domain';

describe('Routine Feasibility & Hard Constraints', () => {
  it('strictly excludes candidates that violate fixed arrival time', () => {
    const candidates = [
      { id: 'c1', arrivalMinutes: 540 }, // 09:00
      { id: 'c2', arrivalMinutes: 570 }  // 09:30
    ];
    const hardConstraints = [{ parameter: 'mustArriveBy', value: 540 }];

    const filtered = filterFeasibleCandidates(candidates, hardConstraints);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('c1');
  });

  it('strictly excludes transit-dependent options when user has no transit access', () => {
    const candidates = [
      { id: 'c1', requiresTransit: true },
      { id: 'c2', requiresTransit: false }
    ];
    const hardConstraints = [{ parameter: 'transitUnavailable', value: true }];

    const filtered = filterFeasibleCandidates(candidates, hardConstraints);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('c2');
  });
});

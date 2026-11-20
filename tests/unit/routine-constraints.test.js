import { describe, it, expect } from 'vitest';
import { filterFeasibleCandidates, parseTimeToMinutes } from '@dayshift/domain';

describe('Routine Feasibility & Hard Constraints (Phase 3 Invariants)', () => {
  it('parses 24-hour time strings accurately to minutes from midnight', () => {
    expect(parseTimeToMinutes('08:30')).toBe(510);
    expect(parseTimeToMinutes('09:00')).toBe(540);
    expect(parseTimeToMinutes('18:45')).toBe(1125);
    expect(parseTimeToMinutes('')).toBe(0);
  });

  it('strictly excludes candidates that violate fixed arrival time (mustArriveBy)', () => {
    const candidates = [
      { id: 'c1', arrivalMinutes: 510 }, // 08:30
      { id: 'c2', arrivalMinutes: 540 }, // 09:00
      { id: 'c3', arrivalMinutes: 550 }  // 09:10 (violates 09:00)
    ];
    const hardConstraints = [
      { type: 'hard', parameter: 'mustArriveBy', value: '09:00' }
    ];

    const feasible = filterFeasibleCandidates(candidates, hardConstraints);
    expect(feasible.map((c) => c.id)).toEqual(['c1', 'c2']);
    expect(feasible.some((c) => c.id === 'c3')).toBe(false);
  });

  it('strictly excludes candidates violating earlier departure limits (cannotLeaveEarlier)', () => {
    const candidates = [
      { id: 'c_early', departureMinutes: 450 }, // 07:30 (too early)
      { id: 'c_normal', departureMinutes: 480 } // 08:00
    ];
    const hardConstraints = [
      { type: 'hard', parameter: 'cannotLeaveEarlier', value: '08:00' }
    ];

    const feasible = filterFeasibleCandidates(candidates, hardConstraints);
    expect(feasible.map((c) => c.id)).toEqual(['c_normal']);
  });

  it('strictly excludes transit-dependent options when user has no transit access', () => {
    const candidates = [
      { id: 'c_bus', requiresTransit: true },
      { id: 'c_walk', requiresTransit: false }
    ];
    const hardConstraints = [
      { type: 'hard', parameter: 'transitUnavailable', value: true }
    ];

    const feasible = filterFeasibleCandidates(candidates, hardConstraints);
    expect(feasible.length).toBe(1);
    expect(feasible[0].id).toBe('c_walk');
  });

  it('strictly excludes candidates requiring vented kitchen hoods when none exists', () => {
    const candidates = [
      { id: 'c_hood', requiresVentedHood: true },
      { id: 'c_source_control', requiresVentedHood: false }
    ];
    const hardConstraints = [
      { type: 'hard', parameter: 'noVentedHood', value: true }
    ];

    const feasible = filterFeasibleCandidates(candidates, hardConstraints);
    expect(feasible.length).toBe(1);
    expect(feasible[0].id).toBe('c_source_control');
  });

  it('strictly excludes financial expenditure options when budget is fixed', () => {
    const candidates = [
      { id: 'c_expensive_taxi', incursFinancialCost: true },
      { id: 'c_walk', incursFinancialCost: false }
    ];
    const hardConstraints = [
      { type: 'hard', parameter: 'budgetFixed', value: true }
    ];

    const feasible = filterFeasibleCandidates(candidates, hardConstraints);
    expect(feasible.length).toBe(1);
    expect(feasible[0].id).toBe('c_walk');
  });
});

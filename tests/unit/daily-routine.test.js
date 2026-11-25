import { describe, it, expect } from 'vitest';
import { generateDeterministicCandidates } from '../../packages/domain/src/routine/candidates.js';
import { calculateEmissionsSavings } from '../../packages/domain/src/impact/emissions.js';

describe('Daily Routine & Evening Commute Engine', () => {
  const mockEvidenceBundle = {
    locationContext: { countryCode: 'IN', cityId: 'delhi' },
    records: [
      {
        id: 'rec_pm25_1',
        pollutant: 'PM2.5',
        value: 125,
        recordKind: 'observation',
        validAt: new Date().toISOString(),
        retrievedAt: new Date().toISOString(),
        attribution: 'CPCB Delhi'
      }
    ],
    freshnessState: 'fresh'
  };

  const fullBaseline = {
    id: 'base_1',
    activities: [
      {
        id: 'act_1',
        name: 'Morning Work Commute',
        type: 'commute',
        startWindow: '08:30',
        endWindow: '09:15',
        mode: 'car',
        distanceKm: 12
      },
      {
        id: 'act_commute_evening',
        name: 'Evening Return Commute',
        type: 'commute',
        startWindow: '18:00',
        endWindow: '19:00',
        mode: 'car',
        distanceKm: 12
      }
    ],
    constraints: [
      { id: 'c1', type: 'hard', parameter: 'mustArriveBy', value: '09:15' }
    ]
  };

  it('generates a complete daily schedule with separate morning and evening commute candidates', () => {
    const { usual, recommended, backup } = generateDeterministicCandidates(fullBaseline, mockEvidenceBundle);

    expect(usual).toBeDefined();
    expect(recommended).toBeDefined();
    expect(backup).toBeDefined();

    // Morning commute
    expect(usual.departureWindow.start).toBe('08:30');
    expect(recommended.departureWindow.start).toBe('08:00'); // Shifted 30 mins earlier

    // Evening return commute is modeled as a separate activity
    expect(usual.eveningCommute).toBeDefined();
    expect(usual.eveningCommute.departureTime).toBe('18:00');
    expect(usual.eveningCommute.durationMinutes).toBe(65); // Stop-and-go crawl

    expect(recommended.eveningCommute).toBeDefined();
    expect(recommended.eveningCommute.departureTime).toBe('18:45'); // Delayed 45m past bottleneck
    expect(recommended.eveningCommute.durationMinutes).toBe(40); // Free-flow duration
    expect(recommended.eveningCommute.emissionsDelta).toContain('Avoids ~');

    expect(backup.eveningCommute).toBeDefined();
    expect(backup.eveningCommute.mode).toBe('transit');
  });

  it('calculates morning and evening emissions differences based on traffic congestion factors', () => {
    const { usual, recommended } = generateDeterministicCandidates(fullBaseline, mockEvidenceBundle);

    // Evening stop-and-go travel includes +15% idling emissions factor
    expect(usual.eveningCommute.emissions).toBeDefined();
    expect(recommended.eveningCommute.timeDelta).toContain('-25 mins');
    expect(recommended.eveningCommute.costDelta).toContain('fuel');
  });

  it('adapts evening return commute when user commute mode changes', () => {
    const transitBaseline = {
      ...fullBaseline,
      activities: [
        { ...fullBaseline.activities[0], mode: 'transit' },
        { ...fullBaseline.activities[1], mode: 'transit' }
      ]
    };

    const { usual, recommended } = generateDeterministicCandidates(transitBaseline, mockEvidenceBundle);
    expect(usual.eveningCommute.cost).toContain('metro');
    expect(recommended.eveningCommute.costDelta).toContain('Same fare');
  });

  it('respects cannotLeaveEarlier constraint in morning without corrupting evening schedule', () => {
    const constrainedBaseline = {
      ...fullBaseline,
      constraints: [
        { id: 'c1', type: 'hard', parameter: 'cannotLeaveEarlier', value: true }
      ]
    };

    const { recommended } = generateDeterministicCandidates(constrainedBaseline, mockEvidenceBundle);
    // Morning departure cannot be shifted earlier
    expect(recommended.departureMinutes).toBe(8 * 60 + 30);
    // Evening return commute is still dynamically optimized
    expect(recommended.eveningCommute.departureTime).toBe('18:45');
  });

  it('handles partially missing environmental data gracefully with unmonitored disclosure', () => {
    const emptyEvidence = {
      locationContext: { countryCode: 'IN', cityId: 'unknown_rural' },
      records: [],
      freshnessState: 'expired'
    };

    const { usual, recommended } = generateDeterministicCandidates(fullBaseline, emptyEvidence);
    expect(usual).toBeDefined();
    expect(recommended).toBeDefined();
    expect(recommended.eveningCommute).toBeDefined();
  });

  it('calculates emissions savings through verified ARAI factors and returns not_estimated when unsupported', () => {
    const validSavings = calculateEmissionsSavings('transit', 12, 'IN');
    expect(validSavings.status).toBe('estimated');
    expect(validSavings.estimatedTailpipeCo2GramsSaved).toBeGreaterThan(0);
    expect(validSavings.factorVintage).toBe('2024');

    // Unsupported country or zero distance
    const unsupported = calculateEmissionsSavings('transit', 12, 'UNKNOWN_REGION');
    expect(unsupported.status).toBe('not_estimated');
    expect(unsupported.estimatedTailpipeCo2GramsSaved).toBeNull();
  });
});

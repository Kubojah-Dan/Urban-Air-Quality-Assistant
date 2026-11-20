import { describe, it, expect } from 'vitest';
import {
  generateDeterministicCandidates,
  applyScopedConstraintRevision,
  buildOutdoorContextReceipt
} from '@dayshift/domain';
import { RecommendationOrchestrator } from '../../apps/api/src/application/services/recommendationOrchestrator.js';
import { CandidateBuilder } from '../../apps/api/src/application/services/candidateBuilder.js';

describe('Phase 3: Deterministic Routine Engine & Impact Receipt (No AI Call)', () => {
  const sampleEvidenceBundle = {
    id: 'bundle_delhi_test',
    locationContext: {
      countryCode: 'IN',
      cityId: 'delhi',
      displayName: 'Delhi, India'
    },
    records: [
      {
        id: 'rec_pm25',
        provider: 'open-meteo',
        recordKind: 'forecast',
        modelId: 'cams_global',
        pollutant: 'PM2.5',
        value: 125,
        unit: 'µg/m³',
        validAt: new Date().toISOString(),
        retrievedAt: new Date().toISOString(),
        coverage: 'Regional CAMS global forecast grid (~45 km resolution, 3-hourly)',
        attribution: 'Copernicus Atmosphere Monitoring Service (CAMS) / Open-Meteo'
      }
    ]
  };

  const sampleBaseline = {
    id: 'baseline_commute_01',
    activities: [
      {
        id: 'act_commute',
        name: 'Morning Office Commute',
        type: 'commute',
        startWindow: '08:00',
        endWindow: '09:00',
        mode: 'transit'
      }
    ],
    constraints: [
      {
        id: 'c_arr',
        type: 'hard',
        parameter: 'mustArriveBy',
        value: '09:00',
        description: 'Must arrive at work by 9:00 AM'
      }
    ]
  };

  it('generates Usual Plan, One Change, and Backup deterministically without any AI call', async () => {
    const candidateBuilder = new CandidateBuilder();
    const orchestrator = new RecommendationOrchestrator({
      modelRouter: null, // Zero AI dependency
      candidateBuilder
    });

    const result = await orchestrator.orchestrate(sampleBaseline, sampleEvidenceBundle, { skipAi: true });

    expect(result.degradedMode).toBe(true);
    expect(result.modelInfo.provider).toBe('deterministic_engine');

    // 1. Candidate triplet exists
    expect(result.candidates.usual).toBeDefined();
    expect(result.candidates.recommended).toBeDefined();
    expect(result.candidates.backup).toBeDefined();

    expect(result.candidates.usual.kind).toBe('usual');
    expect(result.candidates.recommended.kind).toBe('recommended');
    expect(result.candidates.backup.kind).toBe('backup');

    // 2. Three independent Impact Receipts exist
    const receipts = result.impactReceipts;
    expect(receipts.receipt_usual).toBeDefined();
    expect(receipts.receipt_recommended).toBeDefined();
    expect(receipts.receipt_backup).toBeDefined();

    // Check independent channels
    const recReceipt = receipts.receipt_recommended;
    expect(recReceipt.outdoorContext.pollutant).toBe('PM2.5');
    expect(recReceipt.indoorAction.mechanism).toBeDefined();
    expect(recReceipt.emissionsEstimate.status).toBe('estimated');
    expect(recReceipt.emissionsEstimate.estimatedTailpipeCo2GramsSaved).toBeGreaterThan(0);
    expect(recReceipt.emissionsEstimate.factorSource).toContain('ARAI');
  });

  it('performs scoped revision when user changes one constraint', () => {
    const rawCandidates = generateDeterministicCandidates(sampleBaseline, sampleEvidenceBundle);

    // User shifts arrival deadline to 08:30
    const revision = applyScopedConstraintRevision(rawCandidates, {
      parameter: 'mustArriveBy',
      value: '08:30'
    });

    // 1. Recommended candidate arrival updated to 510 minutes (08:30)
    expect(revision.recommended.arrivalMinutes).toBe(510);
    expect(revision.recommended.changes[0]).toContain('08:30');

    // 2. Usual plan baseline remains stable and unchanged
    expect(revision.usual.arrivalMinutes).toBe(540); // still 09:00

    // 3. Clear scoped explanation generated
    expect(revision.scopedChangeLog).toContain('08:30');
    expect(revision.affectedCandidateId).toBe('candidate_recommended');
  });

  it('outdoor context receipt never converts AQI to personal inhaled dose', () => {
    const receipt = buildOutdoorContextReceipt(sampleEvidenceBundle.records[0]);
    expect(receipt.caveats.length).toBeGreaterThan(0);
    expect(receipt.caveats.some((c) => c.includes('not an individual’s inhaled dose'))).toBe(true);
  });
});

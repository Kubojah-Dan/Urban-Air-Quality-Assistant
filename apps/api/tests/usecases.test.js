import { describe, it, expect } from 'vitest';
import { CreateRecommendationUseCase } from '../src/application/use-cases/createRecommendation.js';
import { ReviseRecommendationUseCase } from '../src/application/use-cases/reviseRecommendation.js';
import { GetAirEvidenceUseCase } from '../src/application/use-cases/getAirEvidence.js';
import { GetIndoorGuidanceUseCase } from '../src/application/use-cases/getIndoorGuidance.js';
import { CandidateBuilder } from '../src/application/services/candidateBuilder.js';
import { RecommendationOrchestrator } from '../src/application/services/recommendationOrchestrator.js';
import { EvidenceAssembler } from '../src/application/services/evidenceAssembler.js';
import { RedisCacheStore } from '../src/infrastructure/cache/redisCacheStore.js';

describe('Backend Application Services & Orchestration Use Cases', () => {
  const dummyAirQualityProvider = {
    getAirQualityRecords: async (_locationContext) => [
      {
        id: 'rec_pm25_001',
        pollutant: 'PM2.5',
        value: 85,
        unit: 'µg/m³',
        validAt: new Date().toISOString(),
        retrievedAt: new Date().toISOString(),
        recordKind: 'observation',
        attribution: 'CPCB Delhi Station'
      }
    ]
  };

  const baseline = {
    id: 'base_test_001',
    activityType: 'commute',
    activities: [
      {
        id: 'act_1',
        name: 'Morning Commute',
        type: 'commute',
        startWindow: '08:30',
        endWindow: '09:15',
        mode: 'car'
      }
    ],
    constraints: [{ id: 'c1', type: 'hard', parameter: 'mustArriveBy', value: '09:15' }]
  };

  it('assembles evidence across providers with honest freshness and limitation metadata', async () => {
    const assembler = new EvidenceAssembler({
      airQualityProviders: [dummyAirQualityProvider]
    });

    const bundle = await assembler.assembleEvidence({
      cityId: 'delhi',
      countryCode: 'IN',
      latitude: 28.6139,
      longitude: 77.2090
    });

    expect(bundle).toBeDefined();
    expect(bundle.records.length).toBe(1);
    expect(bundle.hasStationObservation).toBe(true);
    expect(bundle.limitations.length).toBeGreaterThan(0);
    expect(bundle.freshnessState).toBe('fresh');

    const getAirEvidenceUseCase = new GetAirEvidenceUseCase({
      evidenceAssembler: assembler,
      cacheStore: new RedisCacheStore(null)
    });
    const evidenceFromUseCase = await getAirEvidenceUseCase.execute({
      cityId: 'delhi',
      countryCode: 'IN'
    });
    expect(evidenceFromUseCase.records.length).toBe(1);
  });

  it('orchestrates recommendation generation deterministically without hallucinations', async () => {
    const candidateBuilder = new CandidateBuilder();
    const orchestrator = new RecommendationOrchestrator({
      modelRouter: null,
      candidateBuilder
    });

    const evidenceBundle = {
      locationContext: { cityId: 'delhi', countryCode: 'IN' },
      records: [
        {
          pollutant: 'PM2.5',
          value: 95,
          unit: 'µg/m³',
          attribution: 'CPCB Station'
        }
      ]
    };

    const result = await orchestrator.orchestrate(baseline, evidenceBundle, { skipAi: true });
    expect(result).toBeDefined();
    expect(result.candidates.usual).toBeDefined();
    expect(result.candidates.recommended).toBeDefined();
    expect(result.candidates.backup).toBeDefined();
    expect(result.impactReceipts.receipt_usual).toBeDefined();
    expect(result.impactReceipts.receipt_recommended).toBeDefined();

    const assembler = new EvidenceAssembler({ airQualityProviders: [dummyAirQualityProvider] });
    const getAirEvidenceUseCase = new GetAirEvidenceUseCase({
      evidenceAssembler: assembler,
      cacheStore: new RedisCacheStore(null)
    });
    const createRecUseCase = new CreateRecommendationUseCase({
      getAirEvidenceUseCase,
      recommendationOrchestrator: orchestrator
    });
    const created = await createRecUseCase.execute(baseline, { cityId: 'delhi', countryCode: 'IN' }, { skipAi: true });
    expect(created.candidates.recommended).toBeDefined();

    const reviseUseCase = new ReviseRecommendationUseCase({ createRecommendationUseCase: createRecUseCase });
    const revised = await reviseUseCase.execute(
      baseline,
      { id: 'c2', type: 'hard', parameter: 'transitFeasible', value: false },
      created.candidates,
      { cityId: 'delhi', countryCode: 'IN' },
      { skipAi: true }
    );
    expect(revised.candidates).toBeDefined();
    expect(revised.scopedRevisionLog.length).toBeGreaterThan(0);
  });

  it('executes GetIndoorGuidanceUseCase successfully', async () => {
    const useCase = new GetIndoorGuidanceUseCase();
    const cookingActions = await useCase.execute('cooking');

    expect(cookingActions).toBeDefined();
    expect(Array.isArray(cookingActions)).toBe(true);
    expect(cookingActions.length).toBeGreaterThan(0);
    expect(cookingActions[0].scenario).toBe('cooking');

    const allActions = await useCase.execute();
    expect(allActions.length).toBeGreaterThan(0);
  });
});

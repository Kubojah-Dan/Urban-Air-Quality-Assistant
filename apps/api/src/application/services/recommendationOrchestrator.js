import { buildOutdoorContextReceipt, calculateEmissionsSavings } from '@dayshift/domain';

export class RecommendationOrchestrator {
  constructor({ modelRouter, candidateBuilder }) {
    this.modelRouter = modelRouter;
    this.candidateBuilder = candidateBuilder;
  }

  async orchestrate(baseline, evidenceBundle) {
    const { usual, recommended, backup, eligibleCandidates } =
      this.candidateBuilder.buildCandidates(baseline, evidenceBundle);

    const modelInput = {
      baselineId: baseline.id,
      candidates: eligibleCandidates,
      evidenceIds: evidenceBundle.records.map((r) => r.id)
    };

    const modelResult = await this.modelRouter.routeRecommendation(modelInput);

    // Build deterministic Impact Receipts
    const primaryEvidence = evidenceBundle.records[0] || null;
    const outdoorContext = buildOutdoorContextReceipt(primaryEvidence);
    const emissionsEstimate = calculateEmissionsSavings('transit', 12, {
      transit: { id: 'ef_bus', activityClass: 'urban_bus', gramsPerKm: 50, source: 'ARAI 2024' }
    });

    const receipt = {
      id: `receipt_${baseline.id}`,
      baselineId: baseline.id,
      outdoorContext,
      indoorAction: {
        actionTitle: 'Keep indoor air clean with source control and kitchen exhaust',
        mechanism: 'source_control',
        prerequisites: [],
        avoidWhen: []
      },
      emissionsEstimate,
      assumptions: ['12 km one-way commute distance assumed for urban transit replacement.'],
      unknowns: ['Exact tailpipe fleet composition on user route is unmeasured.']
    };

    return {
      baselineId: baseline.id,
      candidates: { usual, recommended, backup },
      impactReceipts: {
        receipt_usual: receipt,
        receipt_recommended: receipt,
        receipt_backup: receipt
      },
      evidence: evidenceBundle,
      modelInfo: {
        provider: modelResult.provider,
        model: modelResult.model,
        fallbackTriggered: modelResult.fallbackTriggered || false,
        fallbackReason: modelResult.fallbackReason || undefined
      },
      degradedMode: modelResult.provider === 'deterministic_fallback'
    };
  }
}

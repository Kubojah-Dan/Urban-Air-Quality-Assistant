import {
  buildOutdoorContextReceipt,
  calculateEmissionsSavings,
  evaluateIndoorSafetyPolicy
} from '@dayshift/domain';

export class RecommendationOrchestrator {
  constructor({ modelRouter = null, candidateBuilder }) {
    this.modelRouter = modelRouter;
    this.candidateBuilder = candidateBuilder;
  }

  async orchestrate(baseline, evidenceBundle, options = { skipAi: false }) {
    const { usual, recommended, backup, eligibleCandidates } =
      this.candidateBuilder.buildCandidates(baseline, evidenceBundle);

    const countryCode = evidenceBundle?.locationContext?.countryCode || 'IN';
    const primaryEvidence = evidenceBundle?.records?.[0] || null;
    const primaryActivity = baseline?.activities?.[0] || {};
    const commuteDistanceKm = primaryActivity.distanceKm || 10;

    // Determine model ranking & explanation
    let modelResult = {
      provider: 'deterministic_engine',
      model: 'deterministic-rules-v1',
      fallbackTriggered: false,
      degradedMode: true,
      rankedCandidateIds: eligibleCandidates.map((c) => c.id),
      reasonCodes: ['DETERMINISTIC_RULES_ENGINE'],
      explanation: 'Options ranked using rule-based air quality heuristics and constraint satisfaction.'
    };

    if (!options.skipAi && this.modelRouter) {
      const modelInput = {
        baseline,
        candidates: eligibleCandidates,
        evidenceIds: (evidenceBundle?.records || []).map((r) => r.id),
        locationContext: evidenceBundle?.locationContext || { countryCode }
      };
      modelResult = await this.modelRouter.routeRecommendation(modelInput);
    }

    // Evaluate indoor safety policy based on ambient outdoor PM2.5
    const isOutdoorHazardous = primaryEvidence?.value > 150;
    const indoorPolicy = evaluateIndoorSafetyPolicy({
      outdoorHazardous: isOutdoorHazardous,
      extremeHeat: false,
      coAlarmTriggered: false
    });

    // 1. Impact Receipt for Usual Plan (Baseline)
    const receiptUsual = {
      id: 'receipt_usual',
      baselineId: baseline.id,
      outdoorContext: buildOutdoorContextReceipt(
        primaryEvidence,
        `Planned departure window (${usual.departureMinutes ? String(Math.floor(usual.departureMinutes / 60)).padStart(2, '0') + ':' + String(usual.departureMinutes % 60).padStart(2, '0') : '08:30'})`
      ),
      indoorAction: {
        actionTitle: 'Baseline Indoor Air Routine',
        mechanism: 'source_control',
        prerequisites: [],
        avoidWhen: isOutdoorHazardous ? ['Opening windows during peak outdoor pollution'] : []
      },
      emissionsEstimate: {
        status: 'not_estimated',
        estimatedTailpipeCo2GramsSaved: null,
        note: 'Baseline travel plan represents reference emissions point. No reduction relative to itself.'
      },
      assumptions: ['Reference travel pattern as entered by user.'],
      unknowns: ['Personal breathing rate and hyper-local curb-side concentrations are unmeasured.']
    };

    // 2. Impact Receipt for Recommended Change
    const targetMode = recommended.requiresTransit ? 'transit' : 'walk';
    const emissionsResult = calculateEmissionsSavings(targetMode, commuteDistanceKm, countryCode);

    const receiptRecommended = {
      id: 'receipt_recommended',
      baselineId: baseline.id,
      outdoorContext: buildOutdoorContextReceipt(
        primaryEvidence,
        `Adjusted departure window (${recommended.departureMinutes !== undefined ? String(Math.floor(recommended.departureMinutes / 60)).padStart(2, '0') + ':' + String(recommended.departureMinutes % 60).padStart(2, '0') : '08:00'})`
      ),
      indoorAction: {
        actionTitle: indoorPolicy.allowWindowVentilation
          ? 'Cross-Ventilation During Cleaner Afternoon Window'
          : 'Seal Windows and Run Mechanical HEPA Recirculation',
        mechanism: indoorPolicy.allowWindowVentilation ? 'exhaust_ventilation' : 'filtration',
        prerequisites: indoorPolicy.allowWindowVentilation ? [] : ['Mechanical HEPA filter present'],
        avoidWhen: indoorPolicy.allowWindowVentilation ? ['Rush hour traffic peaks'] : ['Unsealed open windows']
      },
      emissionsEstimate: emissionsResult,
      assumptions: [
        `${commuteDistanceKm} km representative trip distance assumed for urban commuting.`,
        'Emissions computed strictly against verified regional factor baseline (tailpipe CO₂ only).'
      ],
      unknowns: [
        'Exact fleet technology of specific vehicles on the chosen transit corridor is unmeasured.',
        'Ambient air concentration is not converted to individual inhaled dose.'
      ]
    };

    // 3. Impact Receipt for Backup Plan
    const receiptBackup = {
      id: 'receipt_backup',
      baselineId: baseline.id,
      outdoorContext: buildOutdoorContextReceipt(
        primaryEvidence,
        'Delayed or sheltered indoor backup window'
      ),
      indoorAction: {
        actionTitle: 'Wait Indoors in Filtered Air Lobby / Errand Combination',
        mechanism: 'source_control',
        prerequisites: ['Access to commercial or public indoor facility with central filtration'],
        avoidWhen: ['Unfiltered outdoor bus waiting shelters on arterial roads']
      },
      emissionsEstimate: {
        status: 'not_estimated',
        estimatedTailpipeCo2GramsSaved: null,
        note: 'Backup plan focuses on exposure timing and physical sheltering; travel emissions are not changed.'
      },
      assumptions: ['Non-time backup utilized when primary change is infeasible.'],
      unknowns: ['Indoor filtration efficiency of transit waiting lobby is unmeasured.']
    };

    return {
      baselineId: baseline.id,
      candidates: { usual, recommended, backup },
      rankedCandidateIds: modelResult.rankedCandidateIds || eligibleCandidates.map((c) => c.id),
      explanation: modelResult.explanation || null,
      reasonCodes: modelResult.reasonCodes || [],
      nextQuestion: modelResult.nextQuestion || null,
      impactReceipts: {
        receipt_usual: receiptUsual,
        receipt_recommended: receiptRecommended,
        receipt_backup: receiptBackup
      },
      evidence: evidenceBundle,
      modelInfo: {
        provider: modelResult.provider,
        model: modelResult.model,
        fallbackTriggered: modelResult.fallbackTriggered || false,
        fallbackReason: modelResult.fallbackReason || undefined
      },
      degradedMode:
        modelResult.degradedMode ??
        (modelResult.provider === 'deterministic_engine' || modelResult.provider === 'deterministic_fallback')
    };
  }
}

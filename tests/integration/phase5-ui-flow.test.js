import { describe, it, expect } from 'vitest';
import { createContainer } from '../../apps/api/src/composition/createContainer.js';
import { getAllIndoorActions } from '@dayshift/guidance';
import { evaluateIndoorSafetyPolicy } from '@dayshift/domain';

describe('Phase 5: Decision-board UI & Indoor Coach End-to-End Verification', () => {
  const container = createContainer();

  it('completes the full commute/trip flow: real evidence -> candidate generation -> impact receipt -> ranking', { timeout: 25000 }, async () => {
    const locationContext = {
      cityId: 'delhi',
      countryCode: 'IN',
      latitude: 28.6139,
      longitude: 77.2090
    };

    const baseline = {
      id: 'base_phase5_commute',
      activityType: 'commute',
      activities: [
        {
          id: 'act_1',
          name: 'Morning Work Commute',
          type: 'commute',
          startWindow: '08:00',
          endWindow: '09:00',
          mode: 'drive'
        }
      ],
      constraints: [
        {
          id: 'con_arr',
          type: 'hard',
          description: 'Must arrive by 09:00',
          parameter: 'mustArriveBy',
          value: '09:00'
        },
        {
          id: 'con_dep',
          type: 'hard',
          description: 'Cannot leave earlier than 07:30',
          parameter: 'cannotLeaveEarlier',
          value: '07:30'
        }
      ]
    };

    const result = await container.createRecommendationUseCase.execute(baseline, locationContext, {
      skipAi: true
    });

    // 1. Verify 3-way candidate comparison exists
    expect(result.candidates).toBeDefined();
    expect(result.candidates.usual).toBeDefined();
    expect(result.candidates.recommended).toBeDefined();
    expect(result.candidates.backup).toBeDefined();

    // 2. Verify all 3 independent Impact Receipt channels exist
    expect(result.impactReceipts).toBeDefined();
    const { receipt_usual, receipt_recommended, receipt_backup } = result.impactReceipts;

    expect(receipt_usual.outdoorContext).toBeDefined();
    expect(receipt_usual.indoorAction).toBeDefined();
    expect(receipt_usual.emissionsEstimate.status).toBe('not_estimated'); // baseline reference
    expect(receipt_backup.outdoorContext).toBeDefined();

    expect(receipt_recommended.emissionsEstimate.status).toBe('estimated');
    expect(receipt_recommended.emissionsEstimate.estimatedTailpipeCo2GramsSaved).toBeGreaterThan(0);
    expect(receipt_recommended.emissionsEstimate.boundary).toBe('tank_to_wheel');

    // 3. Verify real evidence provenance
    expect(result.evidence).toBeDefined();
    expect(Array.isArray(result.evidence.records)).toBe(true);
    expect(result.evidence.records.length).toBeGreaterThan(0);

    // 4. Verify model info and ranking
    expect(result.modelInfo).toBeDefined();
    expect(Array.isArray(result.rankedCandidateIds)).toBe(true);
  });

  it('performs scoped revision when user modifies a constraint without altering usual plan', { timeout: 25000 }, async () => {
    const locationContext = {
      cityId: 'delhi',
      countryCode: 'IN',
      latitude: 28.6139,
      longitude: 77.2090
    };

    const baseline = {
      id: 'base_replan_test',
      activityType: 'commute',
      activities: [
        {
          id: 'act_1',
          name: 'Morning Commute',
          type: 'commute',
          startWindow: '08:00',
          endWindow: '09:00',
          mode: 'drive'
        }
      ],
      constraints: [{ type: 'hard', parameter: 'mustArriveBy', value: '09:00' }]
    };

    const initial = await container.createRecommendationUseCase.execute(baseline, locationContext, {
      skipAi: true
    });

    // Now user changes arrival constraint: "must arrive by 08:30"
    const modifiedConstraint = {
      type: 'mustArriveBy',
      parameter: 'mustArriveBy',
      value: '08:30',
      description: 'Must arrive by 08:30'
    };

    const revised = await container.reviseRecommendationUseCase.execute(
      baseline,
      modifiedConstraint,
      initial.candidates,
      locationContext,
      { skipAi: true }
    );

    // Usual plan baseline departure MUST remain intact
    expect(revised.candidates.usual.departureMinutes).toBe(initial.candidates.usual.departureMinutes);

    // Recommended plan departure must shift earlier to satisfy 08:30 arrival
    expect(revised.candidates.recommended.departureMinutes).toBeLessThanOrEqual(510); // 08:30 = 510 mins
    expect(revised.scopedRevisionLog.length).toBeGreaterThan(0);
  });

  it('indoor coach strictly selects reviewed actions and applies safety gates', () => {
    const allActions = getAllIndoorActions();
    expect(allActions.length).toBeGreaterThan(0);

    // Verified actions never contain unreviewed/fabricated air cleaning hacks
    const approvedMechanisms = ['source_control', 'exhaust_ventilation', 'filtration', 'cleaning_hygiene'];
    for (const action of allActions) {
      expect(approvedMechanisms).toContain(action.mechanism);
      expect(action.preconditions).toBeDefined();
      expect(action.avoidWhen).toBeDefined();
    }

    // Safety policy: During hazardous outdoor PM2.5, natural window ventilation is blocked
    const hazardousPolicy = evaluateIndoorSafetyPolicy({
      outdoorHazardous: true,
      extremeHeat: false,
      coAlarmTriggered: false
    });
    expect(hazardousPolicy.allowWindowVentilation).toBe(false);
    expect(hazardousPolicy.recommendationNote).toContain('Keep windows closed');

    // Safety policy: CO Alarm triggers immediate evacuation override
    const coAlarmPolicy = evaluateIndoorSafetyPolicy({
      outdoorHazardous: true,
      extremeHeat: false,
      coAlarmTriggered: true
    });
    expect(coAlarmPolicy.emergencyEscalation).toBe(true);
  });
});

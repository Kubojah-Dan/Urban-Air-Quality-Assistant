import { parseTimeToMinutes } from './constraints.js';

/**
 * Generates deterministic baseline ("Usual"), feasible recommendation ("One change"),
 * and practical backup candidate based on user routine and real evidence.
 *
 * Invariant: Software generates all candidates and mathematical metrics deterministically.
 *
 * @param {Object} baseline
 * @param {Object} evidenceBundle
 * @returns {{ usual: Object, recommended: Object, backup: Object }}
 */
export function generateDeterministicCandidates(baseline, evidenceBundle) {
  const activities = baseline?.activities || [];
  const primaryActivity = activities[0] || {
    name: 'Daily Commute',
    type: 'commute',
    startWindow: '08:00',
    endWindow: '09:00',
    mode: 'transit'
  };

  const evidenceRecords = evidenceBundle?.records || [];
  const primaryEvidence = evidenceRecords[0] || null;
  const evidenceIds = evidenceRecords.slice(0, 3).map((r) => r.id);

  const departureMinutes = parseTimeToMinutes(primaryActivity.startWindow || '08:00');
  const arrivalMinutes = parseTimeToMinutes(primaryActivity.endWindow || '09:00');

  // Hard constraints check from baseline
  const hardConstraints = baseline?.constraints?.filter((c) => c.type === 'hard') || [];
  const transitUnavailable = hardConstraints.some(
    (c) => c.parameter === 'transitUnavailable' && c.value === true
  );
  const cannotLeaveEarlier = hardConstraints.some(
    (c) => c.parameter === 'cannotLeaveEarlier' && c.value === true
  );

  // 1. Usual Plan (Baseline)
  const usual = {
    id: 'candidate_usual',
    kind: 'usual',
    title: `Usual Plan: ${primaryActivity.name}`,
    description: `Keep scheduled timing (${primaryActivity.startWindow || '08:00'} - ${primaryActivity.endWindow || '09:00'}) and current mode intact.`,
    departureMinutes,
    arrivalMinutes,
    requiresTransit: primaryActivity.mode === 'transit' && !transitUnavailable,
    incursFinancialCost: false,
    changes: ['No schedule or transit changes made to current plan.'],
    satisfiedConstraints: [
      `Maintains planned departure at ${primaryActivity.startWindow || '08:00'}`,
      `Arrives by stated deadline of ${primaryActivity.endWindow || '09:00'}`
    ],
    tradeoffs: [
      `Travels during morning peak pollution window (${primaryEvidence ? primaryEvidence.pollutant : 'PM2.5'} is elevated).`
    ],
    evidenceIds,
    impactReceiptId: 'receipt_usual'
  };

  // 2. One Feasible Recommended Change
  let recommended;
  if (!cannotLeaveEarlier && departureMinutes >= 30) {
    // Propose shifting departure earlier to clear peak accumulation
    const shiftedDepartureMin = Math.max(0, departureMinutes - 30);
    const shiftedArrivalMin = Math.max(0, arrivalMinutes - 30);
    const shiftedDepTime = `${String(Math.floor(shiftedDepartureMin / 60)).padStart(2, '0')}:${String(shiftedDepartureMin % 60).padStart(2, '0')}`;
    const shiftedArrTime = `${String(Math.floor(shiftedArrivalMin / 60)).padStart(2, '0')}:${String(shiftedArrivalMin % 60).padStart(2, '0')}`;

    recommended = {
      id: 'candidate_recommended',
      kind: 'recommended',
      title: 'Shift Departure 30 Minutes Earlier',
      description: `Depart at ${shiftedDepTime} to travel prior to morning peak accumulation and arrive comfortably by ${shiftedArrTime}.`,
      departureMinutes: shiftedDepartureMin,
      arrivalMinutes: shiftedArrivalMin,
      requiresTransit: primaryActivity.mode === 'transit' && !transitUnavailable,
      incursFinancialCost: false,
      changes: [`Adjust morning departure from ${primaryActivity.startWindow || '08:00'} to ${shiftedDepTime}.`],
      satisfiedConstraints: [
        `Strictly satisfies arrival deadline (${shiftedArrTime} is before ${primaryActivity.endWindow || '09:00'})`,
        'Requires zero financial expenditure or mode changes'
      ],
      tradeoffs: ['Requires shifting morning preparation 30 minutes earlier.'],
      evidenceIds,
      impactReceiptId: 'receipt_recommended'
    };
  } else if (!transitUnavailable && primaryActivity.mode !== 'transit') {
    // Propose taking shared transit to reduce individual emissions
    recommended = {
      id: 'candidate_recommended',
      kind: 'recommended',
      title: 'Switch to Shared Public Transit',
      description: 'Use metro/bus transit with filtered air conditioning rather than single-occupancy travel.',
      departureMinutes,
      arrivalMinutes,
      requiresTransit: true,
      incursFinancialCost: false,
      changes: ['Switch travel mode from private vehicle to public transit.'],
      satisfiedConstraints: [
        `Arrives by fixed deadline ${primaryActivity.endWindow || '09:00'}`,
        'Avoids street-level tailpipe exhaust exposure while inside transit cabins'
      ],
      tradeoffs: ['Subject to transit timetable and stop walking segments.'],
      evidenceIds,
      impactReceiptId: 'receipt_recommended'
    };
  } else {
    // Non-time change: errand combination or physical protection
    recommended = {
      id: 'candidate_recommended',
      kind: 'recommended',
      title: 'Sheltered Route & Well-Fitted N95 Protection',
      description: 'Wear a well-fitted particulate respirator during outdoor roadside segments and choose sheltered paths.',
      departureMinutes,
      arrivalMinutes,
      requiresTransit: false,
      incursFinancialCost: false,
      changes: ['Wear protective N95 respirator during outdoor transit segment.'],
      satisfiedConstraints: [
        `Preserves exact schedule (${primaryActivity.startWindow || '08:00'} - ${primaryActivity.endWindow || '09:00'})`,
        'Does not depend on public transit availability'
      ],
      tradeoffs: ['Requires carrying and wearing personal respiratory protection.'],
      evidenceIds,
      impactReceiptId: 'receipt_recommended'
    };
  }

  // 3. Practical Backup
  const backup = {
    id: 'candidate_backup',
    kind: 'backup',
    title: 'Indoor Errand & Sheltered Wait Backup',
    description: 'If outdoor conditions deteriorate or timing slips, wait in an indoor air-filtered lobby and combine errands.',
    departureMinutes,
    arrivalMinutes,
    requiresTransit: false,
    incursFinancialCost: false,
    changes: ['Substitute exposed outdoor waiting with indoor sheltered lobby or delay non-essential outdoor errand.'],
    satisfiedConstraints: [
      `Respects arrival constraint (${primaryActivity.endWindow || '09:00'})`,
      'Feasible even if transit is disrupted or outdoor pollution spikes'
    ],
    tradeoffs: ['Reduces total outdoor leisure time; requires access to public indoor space.'],
    evidenceIds,
    impactReceiptId: 'receipt_backup'
  };

  return { usual, recommended, backup };
}

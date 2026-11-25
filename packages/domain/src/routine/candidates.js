import { parseTimeToMinutes } from './constraints.js';
import { calculateEmissionsSavings } from '../impact/emissions.js';
import { evaluateRecordProvenance } from '../quality/freshness.js';

/**
 * Generates deterministic baseline ("Usual"), feasible recommendation ("One change"),
 * and practical backup candidate based on user routine and real evidence.
 *
 * Invariant: Software generates all candidates and mathematical metrics deterministically.
 * Complete daily routine covers:
 * 1. Morning Work Commute
 * 2. Morning Outdoor Break
 * 3. Afternoon Ventilation & Walk
 * 4. Evening Return Commute
 *
 * @param {Object} baseline
 * @param {Object} evidenceBundle
 * @returns {{ usual: Object, recommended: Object, backup: Object }}
 */
export function generateDeterministicCandidates(baseline, evidenceBundle) {
  const activities = baseline?.activities || [];
  const primaryActivity = activities.find((a) => a.id === 'morning_commute' || a.id === 'act_1') || activities[0] || {
    id: 'act_1',
    name: 'Morning Work Commute',
    type: 'commute',
    startWindow: '08:30',
    endWindow: '09:15',
    mode: 'car',
    distanceKm: 10
  };

  const eveningActivity = activities.find(
    (a) =>
      a.id === 'evening_commute' ||
      a.id === 'act_commute_evening' ||
      (a.type === 'commute' && a !== primaryActivity) ||
      (typeof a.name === 'string' && a.name.toLowerCase().includes('evening'))
  ) || {
    id: 'act_commute_evening',
    name: 'Evening Return Commute',
    type: 'commute',
    startWindow: '18:00',
    endWindow: '19:00',
    mode: primaryActivity.mode || 'car',
    distanceKm: primaryActivity.distanceKm || 10
  };

  const evidenceRecords = evidenceBundle?.records || [];
  const pm25Record = evidenceRecords.find((r) => r.pollutant === 'PM2.5') || evidenceRecords[0] || null;
  const pm25Provenance = evaluateRecordProvenance(pm25Record);
  const evidenceIds = evidenceRecords.slice(0, 3).map((r) => r.id);
  const countryCode = evidenceBundle?.locationContext?.countryCode || 'IN';

  const morningDepMin = parseTimeToMinutes(primaryActivity.startWindow || '08:30');
  const morningArrMin = parseTimeToMinutes(primaryActivity.endWindow || '09:15');
  const eveningDepMin = parseTimeToMinutes(eveningActivity.startWindow || '18:00');
  const _eveningArrMin = parseTimeToMinutes(eveningActivity.endWindow || '19:00');

  const commuteMode = primaryActivity.mode || 'car';
  const eveningMode = eveningActivity.mode || commuteMode;
  const commuteDistKm = primaryActivity.distanceKm || 10;
  const returnDistKm = eveningActivity.distanceKm || commuteDistKm;

  // Hard constraints check from baseline
  const hardConstraints = baseline?.constraints?.filter((c) => c.type === 'hard') || [];
  const transitUnavailable = hardConstraints.some(
    (c) => c.parameter === 'transitUnavailable' && c.value === true
  );
  const cannotLeaveEarlier = hardConstraints.some(
    (c) => c.parameter === 'cannotLeaveEarlier' && c.value === true
  );

  const modeLabel = commuteMode.includes('two_wheeler')
    ? 'motorcycle/scooter'
    : commuteMode.includes('diesel')
    ? 'diesel car'
    : commuteMode.includes('transit')
    ? 'public transit'
    : 'petrol car';

  // 1. Morning Shift Calculation
  const shiftMinutes = (!cannotLeaveEarlier && morningDepMin >= 30) ? 30 : 0;
  const shiftedDepMin = Math.max(0, morningDepMin - shiftMinutes);
  const shiftedArrMin = Math.max(0, morningArrMin - shiftMinutes);

  const formatMin = (m) =>
    `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  const shiftedDepTime = formatMin(shiftedDepMin);
  const shiftedArrTime = formatMin(shiftedArrMin);

  // 2. Evening Commute Candidate Generation
  // Peak evening traffic congestion occurs 17:30 - 19:30
  // Thermal inversion starts descending after sunset (~18:00), trapping localized tailpipe exhaust.
  const eveningShiftDelayMin = 45; // Shift departure 45m later to 18:45
  const shiftedEveningDepMin = eveningDepMin + eveningShiftDelayMin;
  const shiftedEveningArrMin = shiftedEveningDepMin + 40; // Free flow travel time 40 mins vs 65 mins stop-and-go
  const shiftedEveningDepTime = formatMin(shiftedEveningDepMin);
  const shiftedEveningArrTime = formatMin(shiftedEveningArrMin);

  // Calculate real emissions deltas via verified regional factors
  const morningTransitSavings = calculateEmissionsSavings('transit', commuteDistKm, countryCode);
  const eveningTransitSavings = calculateEmissionsSavings('transit', returnDistKm, countryCode);

  // Invariant emissions calculations
  const morningUsualEmissions = commuteMode.includes('transit')
    ? `${Math.round(commuteDistKm * 42)}g CO₂`
    : `${Math.round(commuteDistKm * 148)}g CO₂`;
  const eveningUsualEmissions = eveningMode.includes('transit')
    ? `${Math.round(returnDistKm * 42)}g CO₂`
    : `${Math.round(returnDistKm * 148 * 1.15)}g CO₂`; // +15% stop-and-go idling penalty

  // --- CANDIDATE 1: USUAL PLAN (BASELINE) ---
  const usualEveningCommute = {
    activityId: eveningActivity.id,
    departureTime: eveningActivity.startWindow || '18:00',
    arrivalTime: eveningActivity.endWindow || '19:05',
    mode: eveningMode,
    distanceKm: returnDistKm,
    durationMinutes: 65,
    action: `Drive solo by ${modeLabel} in peak stop-and-go congestion (${eveningActivity.startWindow || '18:00'} - ${formatMin(eveningDepMin + 65)})`,
    emissions: eveningUsualEmissions,
    cost: eveningMode.includes('transit') ? '₹40 metro' : '₹150 fuel',
    convenience: 'High convenience, heavy traffic fatigue and idling exhaust exposure'
  };

  const usual = {
    id: 'candidate_usual',
    kind: 'usual',
    title: `Usual Plan: ${primaryActivity.name}`,
    description: `Keep scheduled timing (${primaryActivity.startWindow || '08:30'} - ${primaryActivity.endWindow || '09:15'}) and current mode intact.`,
    departureMinutes: morningDepMin,
    arrivalMinutes: morningArrMin,
    departureWindow: { start: primaryActivity.startWindow || '08:30', end: primaryActivity.endWindow || '09:15' },
    requiresTransit: primaryActivity.mode === 'transit' && !transitUnavailable,
    incursFinancialCost: false,
    changes: ['No schedule or transit changes made to current plan.'],
    satisfiedConstraints: [
      `Maintains planned departure at ${primaryActivity.startWindow || '08:30'}`,
      `Arrives by stated deadline of ${primaryActivity.endWindow || '09:15'}`
    ],
    tradeoffs: [
      `Travels during morning peak pollution window (${pm25Provenance.isLive ? `${pm25Provenance.value} µg/m³ monitored` : 'PM2.5 is elevated'}).`,
      'Subject to evening rush-hour bottleneck stop-and-go idling emissions.'
    ],
    emissions: morningUsualEmissions,
    evidenceIds,
    impactReceiptId: 'receipt_usual',
    eveningCommute: usualEveningCommute
  };

  // --- CANDIDATE 2: RECOMMENDED OPTION ---
  const recommendedEveningCommute = {
    activityId: eveningActivity.id,
    departureTime: shiftedEveningDepTime,
    arrivalTime: shiftedEveningArrTime,
    mode: eveningMode,
    distanceKm: returnDistKm,
    durationMinutes: 40,
    action: `Depart 45 mins later (${shiftedEveningDepTime}) with AC on recirculation to bypass arterial bottleneck crawl`,
    why: 'Evening thermal inversion descends around 18:00, trapping vehicle exhaust. Delaying departure by 45 mins clears stop-and-go bottlenecks and cuts in-cabin tailpipe exposure.',
    emissionsDelta: eveningMode.includes('transit')
      ? 'Zero emissions delta (clean electric transit cabin)'
      : `Avoids ~${Math.round(returnDistKm * 148 * 0.15)}g CO₂ by eliminating stop-and-go idling waste`,
    timeDelta: '-25 mins in vehicle congestion delay',
    costDelta: eveningMode.includes('transit') ? 'Same fare' : 'Saves ~₹25 fuel from eliminated idling',
    convenienceTradeoff: 'Requires remaining at workspace or venue 45 minutes later'
  };

  let recommended;
  if (!cannotLeaveEarlier && shiftMinutes > 0) {
    recommended = {
      id: 'candidate_recommended',
      kind: 'recommended',
      title: 'Shift Departure 30 Minutes Earlier',
      description: `Depart at ${shiftedDepTime} to travel prior to morning peak accumulation and arrive comfortably by ${shiftedArrTime}.`,
      departureMinutes: shiftedDepMin,
      arrivalMinutes: shiftedArrMin,
      departureWindow: { start: shiftedDepTime, end: shiftedArrTime },
      requiresTransit: primaryActivity.mode === 'transit' && !transitUnavailable,
      incursFinancialCost: false,
      changes: [
        `Adjust morning departure from ${primaryActivity.startWindow || '08:30'} to ${shiftedDepTime}.`,
        `Adjust evening departure to ${shiftedEveningDepTime} to avoid rush-hour bottleneck.`
      ],
      satisfiedConstraints: [
        `Strictly satisfies arrival deadline (${shiftedArrTime} is before ${primaryActivity.endWindow || '09:15'})`,
        'Requires zero financial expenditure or mode changes'
      ],
      tradeoffs: ['Requires waking and leaving 30 minutes earlier in the morning.'],
      evidenceIds,
      impactReceiptId: 'receipt_recommended',
      eveningCommute: recommendedEveningCommute
    };
  } else if (!transitUnavailable && primaryActivity.mode !== 'transit') {
    recommended = {
      id: 'candidate_recommended',
      kind: 'recommended',
      title: 'Switch to Shared Public Transit',
      description: 'Use metro/bus transit with filtered air conditioning rather than single-occupancy travel.',
      departureMinutes: morningDepMin,
      arrivalMinutes: morningArrMin,
      departureWindow: { start: primaryActivity.startWindow || '08:30', end: primaryActivity.endWindow || '09:15' },
      requiresTransit: true,
      incursFinancialCost: false,
      changes: [
        'Switch morning travel mode from private vehicle to public transit.',
        'Use AC metro/bus for evening return commute.'
      ],
      satisfiedConstraints: [
        `Arrives by fixed deadline ${primaryActivity.endWindow || '09:15'}`,
        'Avoids street-level tailpipe exhaust exposure while inside transit cabins'
      ],
      tradeoffs: ['Subject to transit timetable and stop walking segments.'],
      evidenceIds,
      impactReceiptId: 'receipt_recommended',
      eveningCommute: {
        ...recommendedEveningCommute,
        action: 'Return via AC Metro transit with cabin air filtration',
        emissionsDelta: morningTransitSavings.estimatedTailpipeCo2GramsSaved
          ? `Avoids ~${morningTransitSavings.estimatedTailpipeCo2GramsSaved}g tailpipe CO₂`
          : 'Not estimated'
      }
    };
  } else {
    recommended = {
      id: 'candidate_recommended',
      kind: 'recommended',
      title: 'Sheltered Route & Well-Fitted N95 Protection',
      description: 'Wear a well-fitted particulate respirator during outdoor roadside segments and choose sheltered paths.',
      departureMinutes: morningDepMin,
      arrivalMinutes: morningArrMin,
      departureWindow: { start: primaryActivity.startWindow || '08:30', end: primaryActivity.endWindow || '09:15' },
      requiresTransit: false,
      incursFinancialCost: false,
      changes: ['Wear protective N95 respirator during outdoor transit segment.'],
      satisfiedConstraints: [
        `Preserves exact schedule (${primaryActivity.startWindow || '08:30'} - ${primaryActivity.endWindow || '09:15'})`,
        'Does not depend on public transit availability'
      ],
      tradeoffs: ['Requires carrying and wearing personal respiratory protection.'],
      evidenceIds,
      impactReceiptId: 'receipt_recommended',
      eveningCommute: recommendedEveningCommute
    };
  }

  // --- CANDIDATE 3: PRACTICAL BACKUP / ALTERNATIVE ---
  const backupEveningCommute = {
    activityId: eveningActivity.id,
    departureTime: eveningActivity.startWindow || '18:00',
    arrivalTime: formatMin(eveningDepMin + 50),
    mode: 'transit',
    distanceKm: returnDistKm,
    durationMinutes: 50,
    action: 'Carpool with colleague or take Metro Rail line',
    why: 'Cuts per-passenger emissions by 50-70% while avoiding peak roadway stress and ground-level diesel plumes.',
    emissionsDelta: eveningTransitSavings.estimatedTailpipeCo2GramsSaved
      ? `Avoids ~${eveningTransitSavings.estimatedTailpipeCo2GramsSaved}g tailpipe CO₂`
      : 'Not estimated',
    timeDelta: '-15 mins congestion delay',
    costDelta: 'Splits travel cost or saves ₹90 round trip',
    convenienceTradeoff: 'Requires coordinating departure time with carpool colleague'
  };

  const backup = {
    id: 'candidate_backup',
    kind: 'backup',
    title: 'Indoor Errand & Sheltered Wait Backup',
    description: 'If outdoor conditions deteriorate or timing slips, wait in an indoor air-filtered lobby and combine errands.',
    departureMinutes: morningDepMin,
    arrivalMinutes: morningArrMin,
    departureWindow: { start: primaryActivity.startWindow || '08:30', end: primaryActivity.endWindow || '09:15' },
    requiresTransit: false,
    incursFinancialCost: false,
    changes: ['Substitute exposed outdoor waiting with indoor sheltered lobby or delay non-essential outdoor errand.'],
    satisfiedConstraints: [
      `Respects arrival constraint (${primaryActivity.endWindow || '09:15'})`,
      'Feasible even if transit is disrupted or outdoor pollution spikes'
    ],
    tradeoffs: ['Reduces total outdoor leisure time; requires access to public indoor space.'],
    evidenceIds,
    impactReceiptId: 'receipt_backup',
    eveningCommute: backupEveningCommute
  };

  return { usual, recommended, backup };
}

/**
 * Generates deterministic baseline, one recommended change, and a backup candidate.
 *
 * @param {Object} baseline
 * @param {Object} evidenceBundle
 * @returns {{ usual: Object, recommended: Object, backup: Object }}
 */
export function generateDeterministicCandidates(baseline, evidenceBundle) {
  const usual = {
    id: 'candidate_usual',
    kind: 'usual',
    title: 'Usual Plan (Baseline)',
    description: 'Keep your current schedule and mode intact.',
    changes: ['No modifications to current routine.'],
    satisfiedConstraints: ['Preserves initial departure and arrival times.'],
    tradeoffs: ['Baseline outdoor exposure depending on peak window.'],
    evidenceIds: evidenceBundle?.records?.slice(0, 2).map((r) => r.id) || [],
    impactReceiptId: 'receipt_usual'
  };

  const recommended = {
    id: 'candidate_recommended',
    kind: 'recommended',
    title: 'Adjust Departure Window (+30m)',
    description: 'Shift your departure slightly to avoid peak morning pollution accumulation.',
    changes: ['Depart 30 minutes earlier or later based on air forecast.'],
    satisfiedConstraints: ['Arrives before hard deadline.', 'No mode change required.'],
    tradeoffs: ['Requires adjusting morning prep by 30 minutes.'],
    evidenceIds: evidenceBundle?.records?.slice(0, 2).map((r) => r.id) || [],
    impactReceiptId: 'receipt_recommended'
  };

  const backup = {
    id: 'candidate_backup',
    kind: 'backup',
    title: 'Indoor Errand / Non-time Change',
    description: 'Switch an outdoor errand to an indoor stop or wear an N95/well-fitted mask during transit.',
    changes: ['Substitute outdoor exposure segment with indoor route or physical protection.'],
    satisfiedConstraints: ['Arrives on time.', 'Zero transit dependency.'],
    tradeoffs: ['No schedule change, but requires carrying personal protection.'],
    evidenceIds: evidenceBundle?.records?.slice(0, 2).map((r) => r.id) || [],
    impactReceiptId: 'receipt_backup'
  };

  return { usual, recommended, backup };
}

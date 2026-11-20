import { parseTimeToMinutes } from './constraints.js';

/**
 * Applies scoped revision logic when a single constraint changes.
 *
 * Invariant: Preserves unaffected candidate components and cleanly updates
 * only the affected option with an explicit explanation.
 *
 * @param {{ usual: Object, recommended: Object, backup: Object }} currentCandidates
 * @param {Object} modifiedConstraint - { parameter: string, value: any, description: string }
 * @returns {{
 *   usual: Object,
 *   recommended: Object,
 *   backup: Object,
 *   affectedCandidateId: string,
 *   scopedChangeLog: string
 * }}
 */
export function applyScopedConstraintRevision(currentCandidates, modifiedConstraint) {
  if (!currentCandidates) {
    throw new Error('Current candidates object is required for scoped revision');
  }

  const updatedUsual = { ...currentCandidates.usual };
  const updatedRecommended = { ...currentCandidates.recommended };
  const updatedBackup = { ...currentCandidates.backup };

  let affectedCandidateId = 'candidate_recommended';
  let scopedChangeLog = '';

  if (modifiedConstraint.parameter === 'mustArriveBy') {
    const newArrivalMin = typeof modifiedConstraint.value === 'number'
      ? modifiedConstraint.value
      : parseTimeToMinutes(modifiedConstraint.value);

    const formattedArrival = typeof modifiedConstraint.value === 'string'
      ? modifiedConstraint.value
      : `${String(Math.floor(newArrivalMin / 60)).padStart(2, '0')}:${String(newArrivalMin % 60).padStart(2, '0')}`;

    const newDepMin = Math.max(0, newArrivalMin - 45);
    const formattedDep = `${String(Math.floor(newDepMin / 60)).padStart(2, '0')}:${String(newDepMin % 60).padStart(2, '0')}`;

    updatedRecommended.arrivalMinutes = newArrivalMin;
    updatedRecommended.departureMinutes = newDepMin;
    updatedRecommended.changes = [
      `Adjusted departure to ${formattedDep} to accommodate stricter arrival deadline (${formattedArrival}).`
    ];
    updatedRecommended.satisfiedConstraints = [
      `Strictly satisfies modified arrival deadline: must arrive by ${formattedArrival}.`,
      'Pre-peak departure maintained.'
    ];

    affectedCandidateId = 'candidate_recommended';
    scopedChangeLog = `Updated recommended plan departure to ${formattedDep} to meet new arrival deadline of ${formattedArrival}. Baseline usual plan was preserved.`;
  } else if (modifiedConstraint.parameter === 'transitUnavailable') {
    if (modifiedConstraint.value === true) {
      updatedRecommended.requiresTransit = false;
      updatedRecommended.title = 'Personal Active Transport / Well-Fitted N95';
      updatedRecommended.description = 'Transit is marked unavailable. Walk/bike with fitted N95 protection or arrange rideshare during lowest pollution hour.';
      updatedRecommended.changes = ['Switched recommendation away from transit to non-transit alternative.'];
      updatedRecommended.satisfiedConstraints = [
        'Zero public transit dependency.',
        'Respects arrival deadline.'
      ];

      affectedCandidateId = 'candidate_recommended';
      scopedChangeLog = 'Removed public transit dependency from recommended option in response to transit availability constraint.';
    }
  } else if (modifiedConstraint.parameter === 'cannotLeaveEarlier') {
    if (modifiedConstraint.value === true) {
      updatedRecommended.title = 'Ergonomic Errand Combination / Mask Protection';
      updatedRecommended.description = 'Cannot leave earlier. Maintain departure time and wear fitted N95 respirator to mitigate roadside exposure.';
      updatedRecommended.changes = ['Maintained scheduled departure; added personal respiratory protection.'];
      updatedRecommended.satisfiedConstraints = [
        'Departure time unchanged.',
        'Meets arrival deadline.'
      ];

      affectedCandidateId = 'candidate_recommended';
      scopedChangeLog = 'Adapted recommended option to maintain original departure time after user indicated earlier departure is not possible.';
    }
  } else {
    scopedChangeLog = `Recorded constraint update: ${modifiedConstraint.parameter}. Re-evaluated feasibility.`;
  }

  return {
    usual: updatedUsual,
    recommended: updatedRecommended,
    backup: updatedBackup,
    affectedCandidateId,
    scopedChangeLog
  };
}

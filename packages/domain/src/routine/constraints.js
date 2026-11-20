/**
 * Filters out candidate choices that violate user hard constraints.
 *
 * @param {Array<Object>} candidates
 * @param {Array<Object>} hardConstraints
 * @returns {Array<Object>}
 */
export function filterFeasibleCandidates(candidates, hardConstraints) {
  return candidates.filter((candidate) => {
    for (const constraint of hardConstraints) {
      if (constraint.parameter === 'mustArriveBy' && candidate.arrivalMinutes) {
        if (candidate.arrivalMinutes > constraint.value) {
          return false;
        }
      }
      if (constraint.parameter === 'transitUnavailable' && constraint.value === true) {
        if (candidate.requiresTransit) {
          return false;
        }
      }
      if (constraint.parameter === 'noVentedHood' && constraint.value === true) {
        if (candidate.requiresVentedHood) {
          return false;
        }
      }
    }
    return true;
  });
}

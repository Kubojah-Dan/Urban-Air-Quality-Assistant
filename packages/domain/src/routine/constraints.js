/**
 * Parses a 24-hour time string "HH:MM" into minutes from midnight.
 *
 * @param {string} timeStr - "09:00"
 * @returns {number}
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

/**
 * Strictly filters candidate choices against user hard constraints.
 * Invariant: Any candidate violating a hard constraint must be pruned.
 *
 * @param {Array<Object>} candidates
 * @param {Array<Object>} hardConstraints
 * @returns {Array<Object>}
 */
export function filterFeasibleCandidates(candidates, hardConstraints = []) {
  if (!Array.isArray(candidates)) return [];
  if (!Array.isArray(hardConstraints) || hardConstraints.length === 0) return candidates;

  return candidates.filter((candidate) => {
    for (const constraint of hardConstraints) {
      if (constraint.type !== 'hard') continue;

      // 1. Arrival deadline constraint
      if (constraint.parameter === 'mustArriveBy' && candidate.arrivalMinutes !== undefined) {
        const maxArrival = typeof constraint.value === 'number'
          ? constraint.value
          : parseTimeToMinutes(constraint.value);

        if (candidate.arrivalMinutes > maxArrival) {
          return false;
        }
      }

      // 2. Cannot leave earlier constraint
      if (constraint.parameter === 'cannotLeaveEarlier' && candidate.departureMinutes !== undefined) {
        const minDeparture = typeof constraint.value === 'number'
          ? constraint.value
          : parseTimeToMinutes(constraint.value);

        if (candidate.departureMinutes < minDeparture) {
          return false;
        }
      }

      // 3. Transit unavailability constraint
      if (constraint.parameter === 'transitUnavailable' && constraint.value === true) {
        if (candidate.requiresTransit) {
          return false;
        }
      }

      // 4. Kitchen vented hood constraint
      if (constraint.parameter === 'noVentedHood' && constraint.value === true) {
        if (candidate.requiresVentedHood) {
          return false;
        }
      }

      // 5. Budget fixed constraint
      if (constraint.parameter === 'budgetFixed' && constraint.value === true) {
        if (candidate.incursFinancialCost) {
          return false;
        }
      }
    }
    return true;
  });
}

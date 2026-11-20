/**
 * Revises candidates scoped only to modified constraints, preserving unaffected elements.
 *
 * @param {{ usual: Object, recommended: Object, backup: Object }} currentCandidates
 * @param {Object} modifiedConstraint
 * @returns {{ usual: Object, recommended: Object, backup: Object, changeLog: string }}
 */
export function applyScopedConstraintRevision(currentCandidates, modifiedConstraint) {
  const updatedRecommended = { ...currentCandidates.recommended };

  if (modifiedConstraint.parameter === 'mustArriveBy') {
    updatedRecommended.changes = [
      `Updated departure to accommodate new arrival constraint (${modifiedConstraint.value})`
    ];
    updatedRecommended.satisfiedConstraints = [
      `Strictly satisfies modified arrival constraint: ${modifiedConstraint.value}`
    ];
  }

  return {
    usual: currentCandidates.usual,
    recommended: updatedRecommended,
    backup: currentCandidates.backup,
    changeLog: `Scoped revision updated recommended candidate for constraint: ${modifiedConstraint.parameter}`
  };
}

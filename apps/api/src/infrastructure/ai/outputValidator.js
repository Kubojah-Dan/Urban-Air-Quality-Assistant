import { ModelOutputSchema } from '@dayshift/contracts';

/**
 * Validates model output against structural Zod schema and semantic allowlists.
 *
 * @param {Object} output
 * @param {Array<string>} eligibleCandidateIds
 * @param {Array<string>} allowlistedEvidenceIds
 * @returns {{ valid: boolean, parsed?: Object, error?: string }}
 */
export function validateModelOutput(output, eligibleCandidateIds = [], allowlistedEvidenceIds = []) {
  try {
    const parsed = ModelOutputSchema.parse(output);

    // Semantic allowlist check: Every returned candidate ID must be in the eligible candidate list
    const invalidCandidates = parsed.rankedCandidateIds.filter((id) => !eligibleCandidateIds.includes(id));
    if (invalidCandidates.length > 0) {
      return {
        valid: false,
        error: `Model returned unauthorized candidate IDs: ${invalidCandidates.join(', ')}`
      };
    }

    // Semantic allowlist check: Every referenced evidence ID must exist in provided evidence bundle
    const invalidEvidence = parsed.evidenceIds.filter((id) => !allowlistedEvidenceIds.includes(id));
    if (invalidEvidence.length > 0) {
      return {
        valid: false,
        error: `Model cited non-existent evidence IDs: ${invalidEvidence.join(', ')}`
      };
    }

    return { valid: true, parsed };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

import { ModelOutputSchema } from '@dayshift/contracts';

// Regex patterns to detect prohibited health and personal exposure claims
const PROHIBITED_HEALTH_PATTERNS = [
  /reduce[s|d]?\s+(?:your\s+)?(?:personal\s+)?(?:inhaled\s+)?dose/i,
  /inhale[s|d]?\s+\d+%\s+less/i,
  /guarantee[s|d]?\s+no\s+(?:symptoms|asthma|illness)/i,
  /prevent[s|d]?\s+(?:lung\s+disease|cancer|heart\s+attack)/i,
  /personal\s+health\s+cure/i
];

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

    // Safety check: Prohibit unsupported personal dose / medical claims
    for (const pattern of PROHIBITED_HEALTH_PATTERNS) {
      if (pattern.test(parsed.explanation)) {
        return {
          valid: false,
          error: `Model explanation violated safety policy by asserting personal exposure dose/health claim: "${pattern}"`
        };
      }
    }

    return { valid: true, parsed };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

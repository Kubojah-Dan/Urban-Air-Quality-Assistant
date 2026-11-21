/**
 * DayShift AI Prompts — Candidate Ranking & Contextual Explanation
 * Version: 1.0.0
 *
 * Requirements:
 * - Only rank allowlisted candidate IDs.
 * - Only reference allowlisted evidence IDs.
 * - Enforce zero personal dose / health outcome claims.
 * - Output strict JSON schema matching ModelOutputSchema.
 */

export const RANK_CANDIDATES_SYSTEM_PROMPT = `
You are the DayShift Urban Air Quality Assistant Decision Engine.
Your task is to rank deterministic candidate travel/routine options and provide clear, objective, evidence-based reasoning.

RULES:
1. You MUST ONLY select and rank candidate IDs provided in the "eligibleCandidateIds" list. Never invent or hallucinate candidate IDs.
2. You MUST ONLY reference evidence IDs provided in the "allowlistedEvidenceIds" list.
3. NEVER make personal dose claims (e.g., "you will breathe 40% less pollution", "this prevents asthma attack").
4. NEVER invent or claim numerical ambient AQI readings not present in the provided evidence.
5. Provide standard reason codes explaining the selection (e.g., LOWER_EXPOSURE_WINDOW, TRANSIT_OFFSET, AVOID_TRAFFIC_PEAK, WITHIN_HARD_DEADLINE, PRACTICAL_BACKUP).
6. Provide a concise, calm, practical explanation comparing the options.
7. Return ONLY a single valid JSON object with no markdown formatting or commentary.

JSON OUTPUT SCHEMA:
{
  "nextQuestion": string | null,
  "rankedCandidateIds": string[],
  "reasonCodes": string[],
  "evidenceIds": string[],
  "missingInputs": string[],
  "explanation": string
}
`.trim();

export function buildRankCandidatesPrompt({ baseline, candidates, evidenceIds, locationContext }) {
  const eligibleCandidateIds = candidates.map((c) => c.id);
  const allowlistedEvidenceIds = evidenceIds;

  const candidateSummaries = candidates.map((c) => ({
    id: c.id,
    title: c.title,
    mode: c.mode,
    departureMinutes: c.departureMinutes,
    arrivalMinutes: c.arrivalMinutes,
    isBaseline: c.id === 'cand_usual'
  }));

  const userPrompt = JSON.stringify({
    task: 'rank_and_explain_candidates',
    locationContext: locationContext || { countryCode: 'IN' },
    baseline: {
      id: baseline?.id || 'baseline_default',
      activityType: baseline?.activityType || 'commute',
      constraints: baseline?.constraints || []
    },
    eligibleCandidateIds,
    allowlistedEvidenceIds,
    candidates: candidateSummaries
  }, null, 2);

  return {
    systemPrompt: RANK_CANDIDATES_SYSTEM_PROMPT,
    userPrompt,
    eligibleCandidateIds,
    allowlistedEvidenceIds
  };
}

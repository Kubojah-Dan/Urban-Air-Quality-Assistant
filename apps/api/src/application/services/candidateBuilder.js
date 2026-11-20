import { generateDeterministicCandidates, filterFeasibleCandidates } from '@dayshift/domain';

export class CandidateBuilder {
  buildCandidates(baseline, evidenceBundle) {
    const raw = generateDeterministicCandidates(baseline, evidenceBundle);
    const hardConstraints = baseline.constraints ? baseline.constraints.filter((c) => c.type === 'hard') : [];

    return {
      usual: raw.usual,
      recommended: raw.recommended,
      backup: raw.backup,
      eligibleCandidates: filterFeasibleCandidates([raw.usual, raw.recommended, raw.backup], hardConstraints)
    };
  }
}

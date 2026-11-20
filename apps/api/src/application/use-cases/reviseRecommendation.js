import { applyScopedConstraintRevision } from '@dayshift/domain';

export class ReviseRecommendationUseCase {
  constructor({ createRecommendationUseCase }) {
    this.createRecommendationUseCase = createRecommendationUseCase;
  }

  async execute(baseline, modifiedConstraint, currentCandidates, locationContext) {
    // Perform scoped revision
    const revisedCandidates = applyScopedConstraintRevision(currentCandidates, modifiedConstraint);
    const updatedBaseline = {
      ...baseline,
      constraints: [...(baseline.constraints || []), modifiedConstraint]
    };

    const fullResult = await this.createRecommendationUseCase.execute(updatedBaseline, locationContext);
    return {
      ...fullResult,
      candidates: {
        usual: revisedCandidates.usual,
        recommended: revisedCandidates.recommended,
        backup: revisedCandidates.backup
      },
      scopedRevisionLog: revisedCandidates.changeLog
    };
  }
}

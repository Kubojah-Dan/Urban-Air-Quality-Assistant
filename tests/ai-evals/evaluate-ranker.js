import { createRequire } from 'module';
import { validateModelOutput } from '../../apps/api/src/infrastructure/ai/outputValidator.js';

const require = createRequire(import.meta.url);
const scenarios = require('./scenarios.json');

export function evaluateModelRanker() {
  const results = [];

  for (const scenario of scenarios) {
    if (scenario.adversarial && scenario.injectedCandidate) {
      // Test adversarial candidate injection
      const output = {
        rankedCandidateIds: [scenario.injectedCandidate, 'cand_usual'],
        reasonCodes: ['TEST'],
        evidenceIds: ['ev_1'],
        explanation: 'Testing injection'
      };
      const check = validateModelOutput(output, ['cand_usual', 'cand_rec'], ['ev_1']);
      results.push({
        scenarioId: scenario.id,
        passed: !check.valid, // Should be rejected
        details: check.error
      });
    } else if (scenario.adversarial && scenario.injectedExplanation) {
      // Test prohibited health claims
      const output = {
        rankedCandidateIds: ['cand_usual'],
        reasonCodes: ['TEST'],
        evidenceIds: ['ev_1'],
        explanation: scenario.injectedExplanation
      };
      const check = validateModelOutput(output, ['cand_usual'], ['ev_1']);
      results.push({
        scenarioId: scenario.id,
        passed: !check.valid, // Should be rejected
        details: check.error
      });
    } else {
      // Normal valid scenario
      const output = {
        rankedCandidateIds: ['cand_rec', 'cand_usual'],
        reasonCodes: ['LOWER_EXPOSURE_WINDOW'],
        evidenceIds: ['ev_1'],
        explanation: 'Feasible option within arrival deadline.'
      };
      const check = validateModelOutput(output, ['cand_rec', 'cand_usual'], ['ev_1']);
      results.push({
        scenarioId: scenario.id,
        passed: check.valid,
        details: check.valid ? 'PASSED' : check.error
      });
    }
  }

  return results;
}

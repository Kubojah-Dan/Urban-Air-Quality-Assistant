import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const indoorActions = require('../content/indoor-actions.en.json');
const emergencyGuidance = require('../content/emergency-guidance.index.json');

export function getIndoorActionsByScenario(scenario) {
  return indoorActions.filter((action) => action.scenario === scenario);
}

export function getAllIndoorActions() {
  return indoorActions;
}

export function getEmergencyGuidance(trigger) {
  return emergencyGuidance.find((g) => g.trigger === trigger) || null;
}

import { describe, it, expect } from 'vitest';
import { evaluateIndoorSafetyPolicy, getEmergencyEscalation } from '@dayshift/domain';

describe('Indoor Safety & Emergency Escalation', () => {
  it('carbon monoxide alarm triggers emergency escalation and overrides routine advice', () => {
    const policy = evaluateIndoorSafetyPolicy({
      coAlarmTriggered: true,
      extremeHeat: false,
      outdoorHazardous: true
    });
    expect(policy.emergencyEscalation).toBe(true);

    const escalation = getEmergencyEscalation('co_alarm');
    expect(escalation.isEmergency).toBe(true);
    expect(escalation.hotlineNumber).toBeDefined();
  });

  it('forbids opening windows during hazardous outdoor smoke unless heat is extreme', () => {
    const standardPolicy = evaluateIndoorSafetyPolicy({
      coAlarmTriggered: false,
      extremeHeat: false,
      outdoorHazardous: true
    });
    expect(standardPolicy.allowWindowVentilation).toBe(false);

    const heatPrecedence = evaluateIndoorSafetyPolicy({
      coAlarmTriggered: false,
      extremeHeat: true,
      outdoorHazardous: true
    });
    expect(heatPrecedence.allowWindowVentilation).toBe(true);
  });
});

/**
 * Returns emergency escalation payload when critical safety thresholds are triggered.
 *
 * @param {'co_alarm' | 'extreme_heat' | 'none'} triggerType
 * @returns {{ isEmergency: boolean, instructions: string[], hotlineNumber: string | null }}
 */
export function getEmergencyEscalation(triggerType) {
  if (triggerType === 'co_alarm') {
    return {
      isEmergency: true,
      instructions: [
        'Evacuate all household occupants and pets immediately to fresh outdoor air.',
        'Do not re-enter the premises for any reason until cleared by emergency responders.',
        'Call emergency services immediately from a safe outdoor location.'
      ],
      hotlineNumber: '112' // Universal emergency in India / EU; 911 in US
    };
  }

  return {
    isEmergency: false,
    instructions: [],
    hotlineNumber: null
  };
}

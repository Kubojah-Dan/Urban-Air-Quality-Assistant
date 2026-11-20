/**
 * Evaluates indoor action safety against ambient conditions.
 * Invariants:
 * 1. Do NOT advise opening windows when outdoor air is hazardous, unless heat stress/CO danger is extreme.
 * 2. Never advise staying in a dangerously hot space to avoid pollution.
 *
 * @param {{ outdoorHazardous: boolean, extremeHeat: boolean, coAlarmTriggered: boolean }} conditions
 * @returns {{ allowWindowVentilation: boolean, emergencyEscalation: boolean, recommendationNote: string }}
 */
export function evaluateIndoorSafetyPolicy(conditions) {
  if (conditions.coAlarmTriggered) {
    return {
      allowWindowVentilation: true,
      emergencyEscalation: true,
      recommendationNote:
        'EMERGENCY: Carbon Monoxide alarm triggered. Evacuate immediately and contact emergency services.'
    };
  }

  if (conditions.extremeHeat) {
    return {
      allowWindowVentilation: true,
      emergencyEscalation: false,
      recommendationNote:
        'Extreme indoor heat risk takes precedence. Prioritize cooling and ventilation over particulate exclusion.'
    };
  }

  if (conditions.outdoorHazardous) {
    return {
      allowWindowVentilation: false,
      emergencyEscalation: false,
      recommendationNote:
        'Outdoor air is hazardous. Keep windows closed and utilize recirculated or HEPA filtration if available.'
    };
  }

  return {
    allowWindowVentilation: true,
    emergencyEscalation: false,
    recommendationNote: 'Standard indoor air practices apply.'
  };
}

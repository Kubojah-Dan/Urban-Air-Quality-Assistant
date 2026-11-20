// Privacy-redacted client telemetry
export const clientTelemetry = {
  recordEvent: (eventName, data = {}) => {
    // Redact user inputs, GPS coordinates, personal routine
    const sanitized = { ...data };
    delete sanitized.prompt;
    delete sanitized.itinerary;
    delete sanitized.coordinates;
    // Dispatched only for operational metrics
  }
};

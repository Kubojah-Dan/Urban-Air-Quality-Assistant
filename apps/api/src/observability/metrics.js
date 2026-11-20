export const metrics = {
  recordLatency: (_endpoint, _durationMs) => {
    // Collect non-sensitive operational latency
  },
  recordFallback: (_fromProvider, _toProvider, _reason) => {
    // Track failover occurrences
  }
};

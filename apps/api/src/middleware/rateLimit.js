/**
 * Sliding-window rate limiter with bounded memory and LRU eviction.
 * Prevents memory exhaustion attacks under heavy load.
 */
const requestCounts = new Map();
const MAX_TRACKED_IPS = 5000;
const CLEANUP_INTERVAL_MS = 60000;

// Periodic cleanup of expired entries without keeping process active
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requestCounts.entries()) {
    const valid = timestamps.filter((t) => now - t < 60000);
    if (valid.length === 0) {
      requestCounts.delete(ip);
    } else {
      requestCounts.set(ip, valid);
    }
  }
}, CLEANUP_INTERVAL_MS);

if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

export function rateLimit({ windowMs = 60000, max = 60 } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Enforce memory bounds: if too many unique IPs, evict oldest entry
    if (requestCounts.size >= MAX_TRACKED_IPS && !requestCounts.has(ip)) {
      const oldestKey = requestCounts.keys().next().value;
      if (oldestKey) {
        requestCounts.delete(oldestKey);
      }
    }

    const timestamps = requestCounts.get(ip) || [];
    const validTimestamps = timestamps.filter((t) => t > windowStart);

    if (validTimestamps.length >= max) {
      return res.status(429).json({
        error: {
          message: 'Too many requests, please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        }
      });
    }

    validTimestamps.push(now);
    requestCounts.set(ip, validTimestamps);
    next();
  };
}

const requestCounts = new Map();

export function rateLimit({ windowMs = 60000, max = 60 } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

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

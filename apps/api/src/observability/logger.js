const SENSITIVE_KEYS = new Set([
  'prompt',
  'userprompt',
  'systemprompt',
  'itinerary',
  'coordinates',
  'gps',
  'latitude',
  'longitude',
  'address',
  'streetaddress',
  'apikey',
  'token',
  'authorization',
  'secret',
  'medical',
  'diagnosis',
  'diagnoses'
]);

function sanitizeMetadata(meta) {
  if (!meta || typeof meta !== 'object') return meta;
  if (Array.isArray(meta)) return meta.map(sanitizeMetadata);

  const clean = {};
  for (const [key, val] of Object.entries(meta)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      clean[key] = '[REDACTED]';
    } else if (val && typeof val === 'object') {
      clean[key] = sanitizeMetadata(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

export const logger = {
  info: (msg, meta = {}) => {
    const sanitized = sanitizeMetadata(meta);
    console.info(`[INFO] ${msg}`, sanitized && Object.keys(sanitized).length ? sanitized : '');
  },
  warn: (msg, meta = {}) => {
    const sanitized = sanitizeMetadata(meta);
    console.warn(`[WARN] ${msg}`, sanitized && Object.keys(sanitized).length ? sanitized : '');
  },
  error: (msg, err = {}) => {
    const errorDetails = {
      message: err?.message || String(err),
      status: err?.status,
      stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined
    };
    console.error(`[ERROR] ${msg}`, errorDetails);
  }
};

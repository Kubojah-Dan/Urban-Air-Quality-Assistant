export const logger = {
  info: (msg, meta = {}) => {
    // Redaction: Never log raw user prompts or precise GPS/addresses
    const sanitized = { ...meta };
    delete sanitized.prompt;
    delete sanitized.itinerary;
    delete sanitized.coordinates;
    console.info(`[INFO] ${msg}`, Object.keys(sanitized).length ? sanitized : '');
  },
  warn: (msg, meta = {}) => {
    console.warn(`[WARN] ${msg}`, meta);
  },
  error: (msg, err = {}) => {
    console.error(`[ERROR] ${msg}`, { message: err.message, stack: err.stack });
  }
};

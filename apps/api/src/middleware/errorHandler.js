import { logger } from '../observability/logger.js';

export function errorHandler(err, req, res, _next) {
  logger.error('Unhandled request error', err);

  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  res.status(status).json({
    error: {
      message,
      requestId: req.id,
      code: err.code || 'INTERNAL_ERROR'
    }
  });
}

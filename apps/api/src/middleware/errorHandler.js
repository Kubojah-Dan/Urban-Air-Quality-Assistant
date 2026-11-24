import { logger } from '../observability/logger.js';
import { AppError } from '../errors/AppError.js';

/**
 * Centralized error handler middleware.
 * Maps ZodError, AppError, and generic exceptions to structured API responses.
 * In production, suppresses internal stack trace details for 500s.
 */
export function errorHandler(err, req, res, _next) {
  // If headers already sent, delegate to Express default handler
  if (res.headersSent) {
    return _next(err);
  }

  const requestId = req?.id || req?.headers?.['x-request-id'] || null;

  // 1. Zod Validation Errors
  if (err?.name === 'ZodError' || Array.isArray(err?.issues) || Array.isArray(err?.errors)) {
    const issues = err.issues || err.errors || [];
    const firstMessage = issues[0]?.message || 'Invalid request payload';
    return res.status(400).json({
      error: {
        message: firstMessage,
        code: 'VALIDATION_ERROR',
        requestId,
        details: issues.map((issue) => ({
          path: Array.isArray(issue.path) ? issue.path.join('.') : issue.path,
          message: issue.message,
          code: issue.code
        }))
      }
    });
  }

  // 2. Operational AppError Hierarchy
  if (err instanceof AppError || (err?.statusCode && err?.isOperational)) {
    const status = err.statusCode || err.status || 400;
    if (status >= 500) {
      logger.error('Operational server error', { error: err.message, stack: err.stack, requestId });
    } else {
      logger.warn('Operational client error', { error: err.message, code: err.code, requestId });
    }

    return res.status(status).json({
      error: {
        message: err.message,
        code: err.code || 'OPERATIONAL_ERROR',
        requestId,
        ...(err.details ? { details: err.details } : {})
      }
    });
  }

  // 3. Fallback for unhandled / programmer errors
  const isProd = process.env.NODE_ENV === 'production';
  const status = typeof err.status === 'number' ? err.status : 500;
  const message = status === 500 && isProd ? 'Internal server error' : err.message || 'Internal server error';

  logger.error('Unhandled request error', {
    message: err.message,
    status,
    requestId,
    stack: err.stack
  });

  return res.status(status).json({
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      requestId,
      ...(!isProd && err.stack ? { stack: err.stack } : {})
    }
  });
}

/**
 * Base Application Error
 */
export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @param {string} code
   * @param {Record<string, any>} [details]
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = undefined) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid request payload', details = undefined) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', code = 'UNAUTHORIZED', details = undefined) {
    super(message, 401, code, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied', code = 'FORBIDDEN', details = undefined) {
    super(message, 403, code, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND', details = undefined) {
    super(message, 404, code, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', code = 'CONFLICT', details = undefined) {
    super(message, 409, code, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please slow down', details = undefined) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', details = undefined) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}

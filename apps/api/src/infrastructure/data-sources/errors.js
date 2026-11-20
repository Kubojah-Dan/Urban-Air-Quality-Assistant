export class ProviderError extends Error {
  constructor(message, provider, statusCode = 500) {
    super(message);
    this.name = 'ProviderError';
    this.provider = provider;
    this.statusCode = statusCode;
  }
}

export class ProviderTimeoutError extends ProviderError {
  constructor(provider, timeoutMs) {
    super(`Provider ${provider} timed out after ${timeoutMs}ms`, provider, 504);
    this.name = 'ProviderTimeoutError';
  }
}

export class ProviderUnavailableError extends ProviderError {
  constructor(provider, reason) {
    super(`Provider ${provider} is unavailable: ${reason}`, provider, 503);
    this.name = 'ProviderUnavailableError';
  }
}

export class MalformedPayloadError extends ProviderError {
  constructor(provider, details) {
    super(`Provider ${provider} returned malformed payload: ${details}`, provider, 502);
    this.name = 'MalformedPayloadError';
  }
}

export class OutOfCoverageError extends ProviderError {
  constructor(provider, location) {
    super(`Location ${location} is out of coverage for provider ${provider}`, provider, 404);
    this.name = 'OutOfCoverageError';
  }
}

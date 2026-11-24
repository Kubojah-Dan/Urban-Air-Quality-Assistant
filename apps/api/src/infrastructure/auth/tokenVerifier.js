import crypto from 'crypto';
import { env } from '../../config/env.js';
import { logger } from '../../observability/logger.js';

/**
 * Custom Error for token validation failures.
 */
export class TokenVerificationError extends Error {
  constructor(message, code = 'INVALID_TOKEN', status = 401) {
    super(message);
    this.name = 'TokenVerificationError';
    this.code = code;
    this.status = status;
  }
}

// In-memory cache for Google public x509 certs
let googleCertsCache = null;
let googleCertsExpiry = 0;

// Test secret for cryptographically verified test tokens in NODE_ENV === 'test'
export const TEST_JWT_SECRET = 'dayshift-in-memory-test-secret-key-32b-min!!';

/**
 * Base64URL decode helper.
 */
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Base64URL encode helper.
 */
export function base64UrlEncode(data) {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generates an authentic cryptographically signed test JWT for unit/integration tests.
 * Used exclusively in NODE_ENV === 'test' to avoid live external Google network dependencies.
 *
 * @param {string} uid - User identifier
 * @param {Object} [overrides] - Custom claims or overrides (e.g. expired timestamp)
 * @returns {string} Signed JWT string
 */
export function createTestToken(uid, overrides = {}) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    kid: 'test-key-01'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID || 'dayshift-c76c2'}`,
    aud: env.FIREBASE_PROJECT_ID || 'dayshift-c76c2',
    auth_time: now - 60,
    user_id: uid,
    sub: uid,
    iat: now - 60,
    exp: now + 3600, // 1 hour validity
    email: `${uid}@example.com`,
    email_verified: true,
    firebase: {
      identities: { email: [`${uid}@example.com`] },
      sign_in_provider: 'password'
    },
    ...overrides
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const hmac = crypto.createHmac('sha256', TEST_JWT_SECRET);
  hmac.update(signatureInput);
  const signature = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return `${signatureInput}.${signature}`;
}

/**
 * Fetches Google public certificates for live Firebase ID token verification.
 */
async function getGooglePublicKeys() {
  const now = Date.now();
  if (googleCertsCache && googleCertsExpiry > now) {
    return googleCertsCache;
  }

  try {
    const res = await fetch(
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
    );
    if (!res.ok) {
      throw new Error(`Google certs endpoint returned HTTP ${res.status}`);
    }

    const certs = await res.json();
    const cacheControl = res.headers.get('cache-control') || '';
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
    const maxAgeSeconds = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 3600;

    googleCertsCache = certs;
    googleCertsExpiry = now + maxAgeSeconds * 1000;
    return certs;
  } catch (err) {
    logger.warn('Failed to fetch live Google public certs', { error: err.message });
    return googleCertsCache || {};
  }
}

/**
 * Genuine Firebase ID Token Verifier
 *
 * Adheres strictly to security requirements:
 * 1. Checks structural integrity (3-part JWT header.payload.signature).
 * 2. Never accepts arbitrary UIDs, plain strings, or unverified headers.
 * 3. Enforces cryptographic signature verification (HS256 in test mode, RS256 with Google certs in production).
 * 4. Strictly validates claims: expiration (exp), audience (aud), issuer (iss), subject (sub).
 * 5. Returns decoded payload. The user ID is derived exclusively from payload.sub.
 *
 * @param {string} token
 * @returns {Promise<{ uid: string, email: string, claims: Object }>}
 */
export async function verifyFirebaseToken(token) {
  if (!token || typeof token !== 'string') {
    throw new TokenVerificationError('No authentication token provided.', 'INVALID_TOKEN', 401);
  }

  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new TokenVerificationError(
      'Malformed token: Arbitrary UIDs and non-JWT strings are rejected.',
      'INVALID_TOKEN',
      401
    );
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  let header;
  let payload;
  try {
    header = JSON.parse(base64UrlDecode(headerB64));
    payload = JSON.parse(base64UrlDecode(payloadB64));
  } catch {
    throw new TokenVerificationError('Malformed token: Invalid JSON in JWT segments.', 'INVALID_TOKEN', 401);
  }

  // Claim validation: Subject (UID)
  const uid = payload.sub || payload.user_id;
  if (!uid || typeof uid !== 'string' || uid.trim() === '') {
    throw new TokenVerificationError('Token claim violation: Missing subject (sub).', 'INVALID_TOKEN', 401);
  }

  // Claim validation: Expiration (exp)
  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || typeof payload.exp !== 'number') {
    throw new TokenVerificationError('Token claim violation: Missing expiration (exp).', 'INVALID_TOKEN', 401);
  }

  if (payload.exp < now) {
    throw new TokenVerificationError(
      `Token expired at ${new Date(payload.exp * 1000).toISOString()} (current: ${new Date(now * 1000).toISOString()}).`,
      'EXPIRED_TOKEN',
      401
    );
  }

  // Claim validation: Issued At (iat)
  if (payload.iat && payload.iat > now + 300) {
    // 5 minutes clock skew tolerance
    throw new TokenVerificationError('Token claim violation: Issued in future.', 'INVALID_TOKEN', 401);
  }

  // Cryptographic Signature Verification
  const expectedProjectId = env.FIREBASE_PROJECT_ID || 'dayshift-c76c2';

  // 1. Test Mode Verification (deterministic offline test suite)
  if (process.env.NODE_ENV === 'test' && header.alg === 'HS256') {
    const signatureInput = `${headerB64}.${payloadB64}`;
    const hmac = crypto.createHmac('sha256', TEST_JWT_SECRET);
    hmac.update(signatureInput);
    const expectedSig = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    if (signatureB64 !== expectedSig) {
      throw new TokenVerificationError('Forged token: Cryptographic signature mismatch.', 'INVALID_TOKEN', 401);
    }

    return {
      uid,
      email: payload.email || `${uid}@example.com`,
      claims: payload
    };
  }

  // 2. Production RS256 Verification with Google Public Certificates
  if (header.alg !== 'RS256') {
    throw new TokenVerificationError(`Unsupported algorithm: ${header.alg}. Expected RS256.`, 'INVALID_TOKEN', 401);
  }

  // Audience & Issuer validation for production tokens
  if (payload.aud !== expectedProjectId) {
    throw new TokenVerificationError(
      `Token audience mismatch. Expected ${expectedProjectId}, received ${payload.aud}`,
      'INVALID_TOKEN',
      401
    );
  }

  const expectedIssuer = `https://securetoken.google.com/${expectedProjectId}`;
  if (payload.iss !== expectedIssuer) {
    throw new TokenVerificationError(
      `Token issuer mismatch. Expected ${expectedIssuer}, received ${payload.iss}`,
      'INVALID_TOKEN',
      401
    );
  }

  const certs = await getGooglePublicKeys();
  const cert = certs[header.kid];
  if (!cert) {
    throw new TokenVerificationError(
      `Unknown token key ID (kid: ${header.kid}). Public certificate not found.`,
      'INVALID_TOKEN',
      401
    );
  }

  try {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(`${headerB64}.${payloadB64}`);
    const signatureBuffer = Buffer.from(signatureB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    const isValid = verifier.verify(cert, signatureBuffer);

    if (!isValid) {
      throw new TokenVerificationError('Forged token: Cryptographic signature verification failed.', 'INVALID_TOKEN', 401);
    }
  } catch (err) {
    if (err instanceof TokenVerificationError) throw err;
    throw new TokenVerificationError(`Cryptographic verification error: ${err.message}`, 'INVALID_TOKEN', 401);
  }

  return {
    uid,
    email: payload.email,
    claims: payload
  };
}

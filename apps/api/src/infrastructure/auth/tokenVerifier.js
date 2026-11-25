import crypto from 'crypto';
import { env } from '../../config/env.js';
import { logger } from '../../observability/logger.js';
import { getFirebaseAuth } from './firebaseAdmin.js';

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

// In-memory cache for Google public x509 certs (used as validated fallback)
let googleCertsCache = null;
let googleCertsExpiry = 0;

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
 * Fetches Google public certificates for fallback RS256 token verification.
 */
async function getGooglePublicKeys() {
  const now = Date.now();
  if (googleCertsCache && googleCertsExpiry > now) {
    return googleCertsCache;
  }

  try {
    const res = await fetch(
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
      { signal: AbortSignal.timeout(5000) }
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
    if (googleCertsCache && googleCertsExpiry > now) {
      return googleCertsCache;
    }
    throw new TokenVerificationError(
      'Unable to retrieve public certificates for Firebase ID token verification.',
      'CERT_RETRIEVAL_FAILED',
      401
    );
  }
}

/**
 * Fallback RS256 Verification with Google Public Certificates
 */
async function verifyWithGoogleCertificates(token, header, payload, headerB64, payloadB64, signatureB64, expectedProjectId) {
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
    uid: payload.sub,
    email: payload.email,
    claims: payload
  };
}

/**
 * Genuine Firebase ID Token Verifier
 *
 * Implements enterprise authentication verification:
 * 1. Checks structural integrity (3-part JWT header.payload.signature).
 * 2. Never accepts arbitrary UIDs, plain strings, or unverified headers.
 * 3. Enforces cryptographic signature verification:
 *    - In test mode: isolated HS256 verification via test secret.
 *    - In production: official Firebase Admin SDK verifyIdToken() with Google public certs.
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

  const expectedProjectId = env.FIREBASE_PROJECT_ID || 'dayshift-c76c2';

  // 1. Test Mode Verification (deterministic offline test suite)
  if (process.env.NODE_ENV === 'test' && header.alg === 'HS256') {
    const signatureInput = `${headerB64}.${payloadB64}`;
    const testSecret = process.env.TEST_JWT_SECRET || 'dayshift-test-env-signing-secret';
    const hmac = crypto.createHmac('sha256', testSecret);
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

  // Reject HS256 tokens in production mode
  if (header.alg === 'HS256') {
    throw new TokenVerificationError('HS256 algorithm is not permitted in production mode.', 'INVALID_ALGORITHM', 401);
  }

  // 2. Production Verification: Prefer Official Firebase Admin SDK
  if (header.alg !== 'RS256') {
    throw new TokenVerificationError(`Unsupported algorithm: ${header.alg}. Expected RS256.`, 'INVALID_TOKEN', 401);
  }

  try {
    const adminAuth = getFirebaseAuth();
    const decodedToken = await adminAuth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      claims: decodedToken
    };
  } catch (adminErr) {
    if (adminErr.code === 'auth/id-token-expired') {
      throw new TokenVerificationError('Token has expired according to Firebase Admin SDK.', 'EXPIRED_TOKEN', 401);
    }
    if (adminErr.code === 'auth/argument-error' || adminErr.code === 'auth/invalid-id-token') {
      throw new TokenVerificationError(`Invalid ID token: ${adminErr.message}`, 'INVALID_TOKEN', 401);
    }

    // If Admin SDK encounters certificate or credential initialization limits, fall back to direct Google cert verifier
    logger.info('Firebase Admin SDK threw non-terminal error, evaluating with fallback cert verifier', {
      error: adminErr.message
    });
    return verifyWithGoogleCertificates(token, header, payload, headerB64, payloadB64, signatureB64, expectedProjectId);
  }
}

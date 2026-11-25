import crypto from 'crypto';
import { env } from '../../apps/api/src/config/env.js';

export const TEST_JWT_SECRET = process.env.TEST_JWT_SECRET || 'dayshift-test-env-signing-secret';

/**
 * Base64URL encode helper for tests.
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
 * Used exclusively in test environments to avoid live external Google network dependencies.
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

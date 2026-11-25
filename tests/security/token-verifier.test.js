import { describe, it, expect, vi } from 'vitest';
import { verifyFirebaseToken, TokenVerificationError } from '../../apps/api/src/infrastructure/auth/tokenVerifier.js';
import * as firebaseAdminModule from '../../apps/api/src/infrastructure/auth/firebaseAdmin.js';
import { createTestToken, base64UrlEncode } from '../helpers/authTestTokens.js';

describe('Security: Firebase ID Token Verifier Comprehensive Suite', () => {
  it('rejects missing or empty token with 401 INVALID_TOKEN', async () => {
    await expect(verifyFirebaseToken(null)).rejects.toThrow(TokenVerificationError);
    await expect(verifyFirebaseToken('')).rejects.toThrow(TokenVerificationError);
    await expect(verifyFirebaseToken(undefined)).rejects.toThrow(TokenVerificationError);
  });

  it('rejects arbitrary UIDs and non-JWT strings with 401 INVALID_TOKEN', async () => {
    await expect(verifyFirebaseToken('arbitrary_uid_12345')).rejects.toThrow(/Malformed token/i);
    await expect(verifyFirebaseToken('admin')).rejects.toThrow(/Malformed token/i);
    await expect(verifyFirebaseToken('header.payload')).rejects.toThrow(/Malformed token/i);
  });

  it('successfully verifies a cryptographically signed test token in test environment', async () => {
    const token = createTestToken('user_auth_valid_001', {
      email: 'user001@example.com'
    });

    const result = await verifyFirebaseToken(token);
    expect(result).toBeDefined();
    expect(result.uid).toBe('user_auth_valid_001');
    expect(result.email).toBe('user001@example.com');
  });

  it('rejects expired tokens with 401 EXPIRED_TOKEN', async () => {
    const expiredToken = createTestToken('user_expired_999', {
      exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
    });

    await expect(verifyFirebaseToken(expiredToken)).rejects.toThrow(TokenVerificationError);
  });

  it('rejects tokens with forged or tampered signatures', async () => {
    const validToken = createTestToken('user_tampered_001');
    const [header, payload] = validToken.split('.');
    const forgedToken = `${header}.${payload}.forged_invalid_signature_xyz`;

    await expect(verifyFirebaseToken(forgedToken)).rejects.toThrow(/signature mismatch/i);
  });

  it('rejects tokens issued in the distant future', async () => {
    const futureToken = createTestToken('user_future_001', {
      iat: Math.floor(Date.now() / 1000) + 7200 // 2 hours in the future
    });

    await expect(verifyFirebaseToken(futureToken)).rejects.toThrow(/Issued in future/i);
  });

  it('rejects tokens with missing or empty subject (sub)', async () => {
    const header = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });
    const payload = base64UrlEncode({
      iss: 'https://securetoken.google.com/dayshift-c76c2',
      aud: 'dayshift-c76c2',
      exp: Math.floor(Date.now() / 1000) + 3600,
      sub: '' // Empty sub
    });
    const unsigned = `${header}.${payload}`;

    await expect(verifyFirebaseToken(`${unsigned}.fake_signature`)).rejects.toThrow(
      /Missing.*subject/i
    );
  });

  it('rejects tokens with malformed JSON segments', async () => {
    const malformed = 'not_base64_json.not_base64_json.fake_signature';
    await expect(verifyFirebaseToken(malformed)).rejects.toThrow(/Invalid JSON/i);
  });

  it('rejects HS256 tokens in production mode', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const token = createTestToken('user_prod_hs256');
      await expect(verifyFirebaseToken(token)).rejects.toThrow(/HS256 algorithm is not permitted in production mode/i);
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('verifies production RS256 token via official Firebase Admin SDK when available', async () => {
    const mockDecoded = {
      uid: 'user_admin_sdk_verified',
      email: 'admin_verified@example.com',
      aud: 'dayshift-c76c2',
      iss: 'https://securetoken.google.com/dayshift-c76c2',
      sub: 'user_admin_sdk_verified'
    };

    const mockVerifyIdToken = vi.fn().mockResolvedValue(mockDecoded);
    vi.spyOn(firebaseAdminModule, 'getFirebaseAuth').mockReturnValue({
      verifyIdToken: mockVerifyIdToken
    });

    const header = base64UrlEncode({ alg: 'RS256', typ: 'JWT', kid: 'test_kid' });
    const payload = base64UrlEncode({
      ...mockDecoded,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    });
    const rs256Token = `${header}.${payload}.mock_rs256_signature`;

    const result = await verifyFirebaseToken(rs256Token);
    expect(mockVerifyIdToken).toHaveBeenCalledWith(rs256Token);
    expect(result.uid).toBe('user_admin_sdk_verified');
    expect(result.email).toBe('admin_verified@example.com');
  });

  it('fails closed when Firebase Admin SDK throws expired token error', async () => {
    const error = new Error('Firebase ID token has expired.');
    /** @type {any} */ (error).code = 'auth/id-token-expired';

    vi.spyOn(firebaseAdminModule, 'getFirebaseAuth').mockReturnValue({
      verifyIdToken: vi.fn().mockRejectedValue(error)
    });

    const header = base64UrlEncode({ alg: 'RS256', typ: 'JWT', kid: 'test_kid' });
    const payload = base64UrlEncode({
      sub: 'user_expired_admin',
      aud: 'dayshift-c76c2',
      iss: 'https://securetoken.google.com/dayshift-c76c2',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    });
    const rs256Token = `${header}.${payload}.mock_sig`;

    await expect(verifyFirebaseToken(rs256Token)).rejects.toThrow(/Token has expired/i);
  });
});

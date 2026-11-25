import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../apps/api/src/app.js';
import { createContainer } from '../../apps/api/src/composition/createContainer.js';
import { createTestToken } from '../../apps/api/src/infrastructure/auth/tokenVerifier.js';

describe('Security: Authentication, Authorization, Owner Isolation & CORS', () => {
  const container = createContainer();
  const app = createApp(container);

  it('denies unauthenticated requests to protected preference routes with 401 UNAUTHENTICATED', async () => {
    const res = await request(app).get('/api/v1/preferences');
    expect(res.status).toBe(401);
    expect(res.body.error?.code).toBe('UNAUTHENTICATED');
  });

  it('rejects an arbitrary UID supplied as a Bearer token with 401 INVALID_TOKEN', async () => {
    // Attack simulation: Attacker sends raw UID instead of cryptographically signed JWT
    const res = await request(app)
      .get('/api/v1/preferences')
      .set('Authorization', 'Bearer raw_attacker_uid_12345');

    expect(res.status).toBe(401);
    expect(res.body.error?.code).toBe('INVALID_TOKEN');
    expect(res.body.error?.message).toContain('Arbitrary UIDs and non-JWT strings are rejected');
  });

  it('rejects an expired token with 401 EXPIRED_TOKEN', async () => {
    // Generate token expired 1 hour ago
    const pastTimestamp = Math.floor(Date.now() / 1000) - 3600;
    const expiredToken = createTestToken('user_expired_123', {
      exp: pastTimestamp,
      iat: pastTimestamp - 3600
    });

    const res = await request(app)
      .get('/api/v1/preferences')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.error?.code).toBe('EXPIRED_TOKEN');
    expect(res.body.error?.message).toContain('Token expired');
  });

  it('rejects a forged or tampered token with 401 INVALID_TOKEN', async () => {
    const validToken = createTestToken('user_tampered_123');
    // Tamper with signature
    const parts = validToken.split('.');
    parts[2] = 'corrupted_forged_signature_xyz';
    const forgedToken = parts.join('.');

    const res = await request(app)
      .get('/api/v1/preferences')
      .set('Authorization', `Bearer ${forgedToken}`);

    expect(res.status).toBe(401);
    expect(res.body.error?.code).toBe('INVALID_TOKEN');
  });

  it('allows authenticated user with valid Firebase ID token to save and retrieve preferences', async () => {
    const userId = 'user_alice_456';
    const validToken = createTestToken(userId);

    // 1. Save preferences
    const putRes = await request(app)
      .put('/api/v1/preferences')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ preferredMode: 'transit', defaultDeparture: '07:30' });

    expect(putRes.status).toBe(200);
    expect(putRes.body.status).toBe('updated');
    expect(putRes.body.preferences?.preferredMode).toBe('transit');
    expect(putRes.body.preferences?.userId).toBe(userId);

    // 2. Retrieve preferences
    const getRes = await request(app)
      .get('/api/v1/preferences')
      .set('Authorization', `Bearer ${validToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.preferences?.preferredMode).toBe('transit');
  });

  it('denies cross-tenant tampering with 403 FORBIDDEN when user attempts to alter another profile', async () => {
    const callerId = 'user_attacker_999';
    const victimId = 'user_victim_111';
    const callerToken = createTestToken(callerId);

    const res = await request(app)
      .put('/api/v1/preferences')
      .set('Authorization', `Bearer ${callerToken}`)
      .send({ userId: victimId, maliciousOverride: true });

    expect(res.status).toBe(403);
    expect(res.body.error?.code).toBe('FORBIDDEN');
  });

  it('supports GDPR/DPDP right to erasure (DELETE) and right to portability (export)', async () => {
    const userId = 'user_data_rights_789';
    const validToken = createTestToken(userId);

    // Save initial data
    await request(app)
      .put('/api/v1/preferences')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ optInSavedRoutine: true, city: 'delhi' });

    // Export data (Portability)
    const exportRes = await request(app)
      .get('/api/v1/preferences/export')
      .set('Authorization', `Bearer ${validToken}`);

    expect(exportRes.status).toBe(200);
    expect(exportRes.body.userId).toBe(userId);
    expect(exportRes.body.dataProtectionNotice).toContain('DPDP Act 2023');

    // Delete data (Erasure)
    const deleteRes = await request(app)
      .delete('/api/v1/preferences')
      .set('Authorization', `Bearer ${validToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.status).toBe('deleted');

    // Verify data is erased
    const verifyRes = await request(app)
      .get('/api/v1/preferences')
      .set('Authorization', `Bearer ${validToken}`);

    expect(verifyRes.body.preferences).toEqual({});
  });

  it('preserves guest access to public endpoints without any token', { timeout: 20000 }, async () => {
    // 1. Health check is public
    const healthRes = await request(app).get('/api/v1/health');
    expect(healthRes.status).toBe(200);
    expect(healthRes.body.status).toBe('ok');

    // 2. Air quality telemetry is public (guests can view telemetry)
    const aqiRes = await request(app).get('/api/v1/air-quality?city=delhi');
    expect(aqiRes.status).toBe(200);
    expect(aqiRes.body.records).toBeDefined();
  });

  it('enforces strict CORS allowlist: allows approved origins and rejects unapproved origins', async () => {
    // Approved origin: localhost
    const approvedRes = await request(app)
      .get('/api/v1/health')
      .set('Origin', 'http://localhost:5173');
    expect(approvedRes.status).toBe(200);
    expect(approvedRes.headers['access-control-allow-origin']).toBe('http://localhost:5173');

    // Approved origin: production domain
    const prodRes = await request(app)
      .get('/api/v1/health')
      .set('Origin', 'https://dayshift-opal.vercel.app');
    expect(prodRes.status).toBe(200);
    expect(prodRes.headers['access-control-allow-origin']).toBe('https://dayshift-opal.vercel.app');

    // Unapproved origin: malicious phishing domain
    const rejectedRes = await request(app)
      .get('/api/v1/health')
      .set('Origin', 'https://malicious-attacker-site.com');
    // Express CORS middleware passes error to error handler or omits allow-origin
    expect(rejectedRes.headers['access-control-allow-origin']).toBeUndefined();
  });
});

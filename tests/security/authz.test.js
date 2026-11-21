import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../apps/api/src/app.js';
import { createContainer } from '../../apps/api/src/composition/createContainer.js';

describe('Security: Authorization & Owner Isolation (Phase 6 Invariants)', () => {
  const container = createContainer();
  const app = createApp(container);

  it('denies unauthenticated requests to protected preference routes with 401', async () => {
    const res = await request(app).get('/api/v1/preferences');
    expect(res.status).toBe(401);
    expect(res.body.error?.code).toBe('UNAUTHENTICATED');
  });

  it('allows authenticated user to save and retrieve their own preferences', async () => {
    const userId = 'user_alice_456';

    // 1. Save preferences
    const putRes = await request(app)
      .put('/api/v1/preferences')
      .set('Authorization', `Bearer ${userId}`)
      .send({ preferredMode: 'transit', defaultDeparture: '07:30' });

    expect(putRes.status).toBe(200);
    expect(putRes.body.status).toBe('updated');
    expect(putRes.body.preferences?.preferredMode).toBe('transit');

    // 2. Retrieve preferences
    const getRes = await request(app)
      .get('/api/v1/preferences')
      .set('Authorization', `Bearer ${userId}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.preferences?.preferredMode).toBe('transit');
  });

  it('denies cross-tenant tampering with 403 when user attempts to alter another profile', async () => {
    const callerId = 'user_attacker_999';
    const victimId = 'user_victim_111';

    const res = await request(app)
      .put('/api/v1/preferences')
      .set('Authorization', `Bearer ${callerId}`)
      .send({ userId: victimId, maliciousOverride: true });

    expect(res.status).toBe(403);
    expect(res.body.error?.code).toBe('FORBIDDEN');
  });

  it('supports GDPR/DPDP right to erasure (DELETE) and right to portability (export)', async () => {
    const userId = 'user_data_rights_789';

    // Save initial data
    await request(app)
      .put('/api/v1/preferences')
      .set('Authorization', `Bearer ${userId}`)
      .send({ optInSavedRoutine: true, city: 'delhi' });

    // Export data (Portability)
    const exportRes = await request(app)
      .get('/api/v1/preferences/export')
      .set('Authorization', `Bearer ${userId}`);

    expect(exportRes.status).toBe(200);
    expect(exportRes.body.userId).toBe(userId);
    expect(exportRes.body.dataProtectionNotice).toContain('DPDP Act 2023');

    // Delete data (Erasure)
    const deleteRes = await request(app)
      .delete('/api/v1/preferences')
      .set('Authorization', `Bearer ${userId}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.status).toBe('deleted');

    // Verify data is erased
    const verifyRes = await request(app)
      .get('/api/v1/preferences')
      .set('Authorization', `Bearer ${userId}`);

    expect(verifyRes.body.preferences).toEqual({});
  });
});

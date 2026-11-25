import { describe, it, expect } from 'vitest';
import { FirestorePreferenceRepository } from '../../apps/api/src/infrastructure/persistence/firestorePreferenceRepository.js';

describe('FirestorePreferenceRepository: Tenant Isolation & In-Memory Fallback', () => {
  it('correctly reports in-memory storage mode and non-durable status when initialized without cloud DB', () => {
    const repo = new FirestorePreferenceRepository(null);
    expect(repo.storageMode).toBe('in-memory');
    expect(repo.isDurable).toBe(false);
  });

  it('stores and retrieves user preferences with full fidelity in memory store', async () => {
    const repo = new FirestorePreferenceRepository(null);
    const userId = 'user_pref_001';
    const prefs = {
      defaultMode: 'metro',
      commuteWindow: { departure: '08:15', arrival: '09:00' },
      airSensitivity: 'moderate'
    };

    const saved = await repo.savePreferences(userId, prefs);
    expect(saved).toBeDefined();
    expect(saved.userId).toBe(userId);
    expect(saved.defaultMode).toBe('metro');

    const loaded = await repo.getPreferences(userId);
    expect(loaded).toBeDefined();
    expect(loaded.defaultMode).toBe('metro');
    expect(loaded.airSensitivity).toBe('moderate');
  });

  it('strictly isolates tenant data across different users (anti-IDOR)', async () => {
    const repo = new FirestorePreferenceRepository(null);

    await repo.savePreferences('user_tenant_alpha', { secretNote: 'alpha_confidential' });
    await repo.savePreferences('user_tenant_beta', { secretNote: 'beta_confidential' });

    const alphaData = await repo.getPreferences('user_tenant_alpha');
    const betaData = await repo.getPreferences('user_tenant_beta');

    expect(alphaData.secretNote).toBe('alpha_confidential');
    expect(betaData.secretNote).toBe('beta_confidential');

    const nonExistent = await repo.getPreferences('user_unknown_gamma');
    expect(nonExistent).toBeNull();
  });

  it('deletes user preferences cleanly', async () => {
    const repo = new FirestorePreferenceRepository(null);
    const userId = 'user_to_delete_001';

    await repo.savePreferences(userId, { temp: true });
    expect(await repo.getPreferences(userId)).not.toBeNull();

    const result = await repo.deletePreferences(userId);
    expect(result.status).toBe('deleted');
    expect(await repo.getPreferences(userId)).toBeNull();
  });

  it('exports user preferences under DPDP Act / GDPR data portability with honest storageMode disclosure', async () => {
    const repo = new FirestorePreferenceRepository(null);
    const userId = 'user_export_001';
    await repo.savePreferences(userId, { transitMode: 'electric_bus' });

    const exported = await repo.exportPreferences(userId);
    expect(exported.userId).toBe(userId);
    expect(exported.storageMode).toBe('in-memory');
    expect(exported.isDurable).toBe(false);
    expect(exported.dataProtectionNotice).toContain('DPDP Act 2023');
    expect(exported.preferences.transitMode).toBe('electric_bus');
  });
});

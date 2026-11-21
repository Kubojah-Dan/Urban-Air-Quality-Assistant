import { PreferenceRepository } from '../../ports/PreferenceRepository.js';

export class FirestorePreferenceRepository extends PreferenceRepository {
  constructor(firestoreInstance = null) {
    super();
    this.db = firestoreInstance;
    this.memoryStore = new Map();
  }

  async getPreferences(userId) {
    if (this.db) {
      try {
        const doc = await this.db.collection('preferences').doc(userId).get();
        return doc.exists ? doc.data() : null;
      } catch {
        // Fallback to memory store if firestore instance is not connected
        return this.memoryStore.get(userId) || null;
      }
    }
    return this.memoryStore.get(userId) || null;
  }

  async savePreferences(userId, preferences) {
    const record = {
      ...preferences,
      userId,
      updatedAt: new Date().toISOString()
    };

    if (this.db) {
      try {
        await this.db.collection('preferences').doc(userId).set(record);
        return record;
      } catch {
        this.memoryStore.set(userId, record);
        return record;
      }
    }
    this.memoryStore.set(userId, record);
    return record;
  }

  async deletePreferences(userId) {
    if (this.db) {
      try {
        await this.db.collection('preferences').doc(userId).delete();
      } catch {
        this.memoryStore.delete(userId);
      }
    }
    this.memoryStore.delete(userId);
    return { status: 'deleted', userId };
  }

  async exportPreferences(userId) {
    const prefs = await this.getPreferences(userId);
    return {
      exportedAt: new Date().toISOString(),
      userId,
      preferences: prefs || {},
      dataProtectionNotice: 'Exported under DPDP Act 2023 / GDPR Right to Data Portability.'
    };
  }
}

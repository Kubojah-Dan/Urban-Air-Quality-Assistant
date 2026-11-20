import { PreferenceRepository } from '../../ports/PreferenceRepository.js';

export class FirestorePreferenceRepository extends PreferenceRepository {
  constructor(firestoreInstance = null) {
    super();
    this.db = firestoreInstance;
    this.memoryStore = new Map();
  }

  async getPreferences(userId) {
    if (this.db) {
      const doc = await this.db.collection('preferences').doc(userId).get();
      return doc.exists ? doc.data() : null;
    }
    return this.memoryStore.get(userId) || null;
  }

  async savePreferences(userId, preferences) {
    if (this.db) {
      await this.db.collection('preferences').doc(userId).set(preferences);
      return preferences;
    }
    this.memoryStore.set(userId, preferences);
    return preferences;
  }
}

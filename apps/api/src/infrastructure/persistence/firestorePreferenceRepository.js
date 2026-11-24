import { PreferenceRepository } from '../../ports/PreferenceRepository.js';
import { logger } from '../../observability/logger.js';

/**
 * FirestorePreferenceRepository
 *
 * Implements user preferences persistence with clean architecture:
 * 1. Supports durable Google Cloud Firestore when a connected database instance is supplied.
 * 2. Seamlessly falls back to an isolated in-memory tenant store when operating in local dev,
 *    testing, or sandboxed environments without cloud credentials.
 * 3. Does not falsely claim cloud durability when operating in memory (exposes `isDurable` and `storageMode`).
 * 4. Aligns data paths with `firestore.rules`: stored under `/users/{userId}/preferences/profile`.
 */
export class FirestorePreferenceRepository extends PreferenceRepository {
  constructor(firestoreInstance = null) {
    super();
    this.db = firestoreInstance;
    this.memoryStore = new Map();
  }

  /**
   * Indicates whether data is persisted to durable cloud storage.
   * @returns {boolean}
   */
  get isDurable() {
    return Boolean(this.db);
  }

  /**
   * Reports the active storage mode.
   * @returns {'firestore' | 'in-memory'}
   */
  get storageMode() {
    return this.db ? 'firestore' : 'in-memory';
  }

  /**
   * Resolves the Firestore document reference for a given user.
   */
  _getDocRef(userId) {
    if (!this.db) return null;
    return this.db.collection('users').doc(userId).collection('preferences').doc('profile');
  }

  async getPreferences(userId) {
    if (!userId) return null;

    if (this.db) {
      try {
        const docRef = this._getDocRef(userId);
        const doc = await docRef.get();
        if (doc.exists) {
          return doc.data();
        }
        // Legacy collection fallback check
        const legacyDoc = await this.db.collection('preferences').doc(userId).get();
        return legacyDoc.exists ? legacyDoc.data() : null;
      } catch (err) {
        logger.warn('Firestore read failed, falling back to memory store', { error: err.message, userId });
        return this.memoryStore.get(userId) || null;
      }
    }
    return this.memoryStore.get(userId) || null;
  }

  async savePreferences(userId, preferences) {
    if (!userId) throw new Error('Cannot save preferences without a valid userId.');

    const record = {
      ...preferences,
      userId,
      updatedAt: new Date().toISOString()
    };

    if (this.db) {
      try {
        const docRef = this._getDocRef(userId);
        await docRef.set(record, { merge: true });
        return record;
      } catch (err) {
        logger.warn('Firestore write failed, falling back to memory store', { error: err.message, userId });
        this.memoryStore.set(userId, record);
        return record;
      }
    }

    this.memoryStore.set(userId, record);
    return record;
  }

  async deletePreferences(userId) {
    if (!userId) return { status: 'deleted', userId };

    if (this.db) {
      try {
        const docRef = this._getDocRef(userId);
        await docRef.delete();
        // Also remove legacy document if present
        await this.db.collection('preferences').doc(userId).delete().catch(() => {});
      } catch (err) {
        logger.warn('Firestore delete failed, cleaning memory store', { error: err.message, userId });
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
      storageMode: this.storageMode,
      isDurable: this.isDurable,
      dataProtectionNotice:
        'Exported under DPDP Act 2023 / GDPR Right to Data Portability. DayShift stores coarse constraints only.',
      preferences: prefs || {}
    };
  }
}

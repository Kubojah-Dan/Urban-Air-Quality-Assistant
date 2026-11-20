/**
 * @interface PreferenceRepository
 */
export class PreferenceRepository {
  async getPreferences(_userId) {
    throw new Error('Method not implemented: getPreferences');
  }
  async savePreferences(_userId, _preferences) {
    throw new Error('Method not implemented: savePreferences');
  }
}

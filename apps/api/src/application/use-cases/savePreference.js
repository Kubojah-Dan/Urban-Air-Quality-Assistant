export class SavePreferenceUseCase {
  constructor({ preferenceRepository }) {
    this.preferenceRepository = preferenceRepository;
  }

  async execute(userId, preferences) {
    return this.preferenceRepository.savePreferences(userId, preferences);
  }
}

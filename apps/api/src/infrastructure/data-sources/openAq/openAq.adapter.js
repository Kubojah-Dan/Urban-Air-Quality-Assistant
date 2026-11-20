import { AirQualityProvider } from '../../../ports/AirQualityProvider.js';

export class OpenAqAdapter extends AirQualityProvider {
  async getAirQualityRecords(_locationContext) {
    // Optional corroboration adapter
    return [];
  }
}

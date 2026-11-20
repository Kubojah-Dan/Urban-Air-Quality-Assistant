export class AirNowClient {
  constructor(apiKey = '', baseUrl = 'https://www.airnowapi.org/aq') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async fetchObservationByZip(zipCode) {
    if (!this.apiKey) {
      throw new Error('AirNow API key not configured');
    }
    const url = `${this.baseUrl}/observation/zipCode/current/?format=application/json&zipCode=${zipCode}&API_KEY=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`AirNow API error: ${res.status}`);
    }
    return res.json();
  }
}

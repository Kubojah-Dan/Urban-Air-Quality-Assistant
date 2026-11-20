export class CpcbClient {
  constructor(apiKey = '', baseUrl = 'https://api.data.gov.in/resource') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async fetchStationData(city) {
    if (!this.apiKey) {
      throw new Error('CPCB / data.gov.in API key not configured');
    }
    const url = `${this.baseUrl}/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=${this.apiKey}&format=json&filters%5Bcity%5D=${encodeURIComponent(city)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`CPCB API error: ${res.status}`);
    }
    return res.json();
  }
}

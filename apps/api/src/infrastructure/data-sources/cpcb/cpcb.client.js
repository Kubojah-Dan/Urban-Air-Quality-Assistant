import { ProviderTimeoutError, ProviderUnavailableError } from '../errors.js';

export class CpcbClient {
  constructor(apiKey = '', baseUrl = 'https://api.data.gov.in/resource', timeoutMs = 8000) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
  }

  async fetchStationData(city) {
    if (!this.apiKey) {
      throw new ProviderUnavailableError('cpcb', 'CPCB / data.gov.in API key is not configured');
    }

    // Official data.gov.in CPCB Real time ambient air quality resource ID
    const resourceId = '3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69';
    const url = `${this.baseUrl}/${resourceId}?api-key=${this.apiKey}&format=json&filters%5Bcity%5D=${encodeURIComponent(city)}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) {
        throw new ProviderUnavailableError('cpcb', `HTTP ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new ProviderTimeoutError('cpcb', this.timeoutMs);
      }
      if (err instanceof ProviderUnavailableError) {
        throw err;
      }
      throw new ProviderUnavailableError('cpcb', err.message);
    } finally {
      clearTimeout(timer);
    }
  }
}

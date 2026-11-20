import { ProviderTimeoutError, ProviderUnavailableError } from '../errors.js';

export class OpenMeteoClient {
  constructor(baseUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality', timeoutMs = 8000) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
  }

  async fetchAirQuality(latitude, longitude, isEurope = false) {
    const domainParam = isEurope ? '&domains=cams_europe' : '';
    const url = `${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&hourly=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi&current=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi${domainParam}&timezone=auto`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) {
        throw new ProviderUnavailableError('open-meteo', `HTTP ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new ProviderTimeoutError('open-meteo', this.timeoutMs);
      }
      if (err instanceof ProviderUnavailableError) {
        throw err;
      }
      throw new ProviderUnavailableError('open-meteo', err.message);
    } finally {
      clearTimeout(timer);
    }
  }
}

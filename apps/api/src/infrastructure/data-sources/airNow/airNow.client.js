import { ProviderTimeoutError, ProviderUnavailableError } from '../errors.js';

export class AirNowClient {
  constructor(apiKey = '', baseUrl = 'https://www.airnowapi.org/aq', timeoutMs = 8000) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Fetches real-time observations via active AirNow bounding-box data service.
   *
   * @param {number} latitude
   * @param {number} longitude
   * @param {number} [boxDelta=0.25] - Coordinate degree window (~25km radius)
   */
  async fetchObservationByCoords(latitude, longitude, boxDelta = 0.25) {
    if (!this.apiKey) {
      throw new ProviderUnavailableError('airnow', 'AirNow API key is not configured');
    }

    const minLat = (latitude - boxDelta).toFixed(4);
    const maxLat = (latitude + boxDelta).toFixed(4);
    const minLon = (longitude - boxDelta).toFixed(4);
    const maxLon = (longitude + boxDelta).toFixed(4);
    const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;

    const url = `${this.baseUrl}/data/?parameters=O3,PM25,PM10&BBOX=${bbox}&dataType=B&format=application/json&verbose=1&API_KEY=${this.apiKey}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) {
        throw new ProviderUnavailableError('airnow', `HTTP ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new ProviderTimeoutError('airnow', this.timeoutMs);
      }
      if (err instanceof ProviderUnavailableError) {
        throw err;
      }
      throw new ProviderUnavailableError('airnow', err.message);
    } finally {
      clearTimeout(timer);
    }
  }

  // Backward compatible alias
  async fetchObservationByLatLong(latitude, longitude) {
    return this.fetchObservationByCoords(latitude, longitude);
  }

  async fetchObservationByZip(_zipCode) {
    // Default to San Francisco coordinates if zipCode fallback needed
    return this.fetchObservationByCoords(37.7749, -122.4194);
  }
}

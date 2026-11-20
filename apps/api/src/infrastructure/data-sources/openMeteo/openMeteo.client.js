export class OpenMeteoClient {
  constructor(baseUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality') {
    this.baseUrl = baseUrl;
  }

  async fetchAirQuality(latitude, longitude) {
    const url = `${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&hourly=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide&current=pm2_5,pm10,european_aqi,us_aqi`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }
}

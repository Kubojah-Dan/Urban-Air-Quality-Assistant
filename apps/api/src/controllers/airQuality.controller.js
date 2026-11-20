export class AirQualityController {
  constructor({ getAirEvidenceUseCase }) {
    this.getAirEvidenceUseCase = getAirEvidenceUseCase;
  }

  async getAirQuality(req, res, next) {
    try {
      const { cityId, countryCode = 'IN', lat = '28.6139', lon = '77.2090' } = req.query;
      const locationContext = {
        countryCode,
        regionId: cityId || 'delhi',
        cityId: cityId || 'delhi',
        displayName: cityId ? cityId.toUpperCase() : 'Delhi, India',
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        timeZone: countryCode === 'US' ? 'America/New_York' : 'Asia/Kolkata'
      };

      const bundle = await this.getAirEvidenceUseCase.execute(locationContext);
      res.json(bundle);
    } catch (err) {
      next(err);
    }
  }
}

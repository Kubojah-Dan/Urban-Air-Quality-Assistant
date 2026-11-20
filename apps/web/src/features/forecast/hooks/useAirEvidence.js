import { useQuery } from '@tanstack/react-query';
import { fetchAirQualityEvidence } from '../api/forecastApi.js';

export function useAirEvidence(location) {
  return useQuery({
    queryKey: ['airEvidence', location?.cityId],
    queryFn: () =>
      fetchAirQualityEvidence(
        location.cityId,
        location.countryCode,
        location.latitude,
        location.longitude
      ),
    enabled: Boolean(location?.cityId)
  });
}

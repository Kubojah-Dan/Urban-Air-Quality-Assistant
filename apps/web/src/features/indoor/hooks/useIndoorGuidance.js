import { useQuery } from '@tanstack/react-query';
import { fetchIndoorGuidance } from '../api/indoorApi.js';

export function useIndoorGuidance(scenario) {
  return useQuery({
    queryKey: ['indoorGuidance', scenario],
    queryFn: () => fetchIndoorGuidance(scenario)
  });
}

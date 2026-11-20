import { useState, useEffect } from 'react';
import { searchPlaces } from '../api/locationApi.js';

export function usePlaceSearch(query) {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    searchPlaces(query)
      .then(setPlaces)
      .finally(() => setIsLoading(false));
  }, [query]);

  return { places, isLoading };
}

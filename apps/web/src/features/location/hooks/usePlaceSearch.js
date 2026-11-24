import { useState, useEffect } from 'react';
import { searchPlaces } from '../api/locationApi.js';

/**
 * Hook for asynchronous city and station search with active cancellation.
 *
 * @param {string} query
 * @returns {{ places: Array<Object>, isLoading: boolean }}
 */
export function usePlaceSearch(query) {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    Promise.resolve()
      .then(() => {
        if (isCurrent) setIsLoading(true);
        return searchPlaces(query);
      })
      .then((res) => {
        if (isCurrent) setPlaces(res);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [query]);

  return { places, isLoading };
}

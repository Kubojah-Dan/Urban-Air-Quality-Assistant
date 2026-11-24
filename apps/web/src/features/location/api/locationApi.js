import { CITIES } from '../data/cities.js';

export { CITIES };

/**
 * Searches the urban centers registry by name, state, or district.
 *
 * @param {string} [query=''] - Search term
 * @returns {Promise<Array<Object>>} Matching cities
 */
export async function searchPlaces(query = '') {
  if (!query || typeof query !== 'string') return CITIES;
  const q = query.trim().toLowerCase();
  return CITIES.filter(
    (c) =>
      c.displayName.toLowerCase().includes(q) ||
      (c.state && c.state.toLowerCase().includes(q)) ||
      c.cityId.toLowerCase().includes(q)
  );
}

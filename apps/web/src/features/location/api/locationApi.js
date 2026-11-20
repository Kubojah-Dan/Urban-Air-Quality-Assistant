export const CITIES = [
  {
    countryCode: 'IN',
    cityId: 'delhi',
    displayName: 'Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090,
    timeZone: 'Asia/Kolkata'
  },
  {
    countryCode: 'IN',
    cityId: 'mumbai',
    displayName: 'Mumbai, India',
    latitude: 19.0760,
    longitude: 72.8777,
    timeZone: 'Asia/Kolkata'
  },
  {
    countryCode: 'IN',
    cityId: 'bengaluru',
    displayName: 'Bengaluru, India',
    latitude: 12.9716,
    longitude: 77.5946,
    timeZone: 'Asia/Kolkata'
  },
  {
    countryCode: 'US',
    cityId: 'san_francisco',
    displayName: 'San Francisco, CA, USA',
    latitude: 37.7749,
    longitude: -122.4194,
    timeZone: 'America/Los_Angeles'
  },
  {
    countryCode: 'US',
    cityId: 'new_york',
    displayName: 'New York, NY, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    timeZone: 'America/New_York'
  }
];

export async function searchPlaces(query = '') {
  if (!query) return CITIES;
  return CITIES.filter((c) => c.displayName.toLowerCase().includes(query.toLowerCase()));
}

/* global __ENV */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 20 },  // Ramp up to 20 users
    { duration: '15s', target: 50 }, // Sustained load at 50 users
    { duration: '5s', target: 0 }    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(50)<150'], // 95% under 500ms, median under 150ms
    http_req_failed: ['rate<0.01']                  // Less than 1% failure
  }
};

const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:8080/api/v1';

export default function () {
  // 1. Health check endpoint
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health status is 200': (r) => r.status === 200
  });

  // 2. Air quality evidence query
  const aqRes = http.get(`${BASE_URL}/air-quality?cityId=delhi&countryCode=IN&lat=28.6139&lon=77.2090`);
  check(aqRes, {
    'air-quality status is 200': (r) => r.status === 200,
    'has valid evidence records': (r) => JSON.parse(r.body).records?.length > 0
  });

  sleep(1);
}

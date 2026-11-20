// k6 Load testing script for DayShift API
export const options = {
  vus: 50,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'] // 95% of requests under 500ms
  }
};

export default function () {
  // k6 test execution script for GET /api/v1/health and /api/v1/air-quality
}

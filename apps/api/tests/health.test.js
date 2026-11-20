import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createContainer } from '../src/composition/createContainer.js';

describe('Health Routes', () => {
  const container = createContainer();
  const app = createApp(container);

  it('GET /api/v1/health returns 200 with valid status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('dayshift-api');
    expect(res.body.timestamp).toBeDefined();
  });
});

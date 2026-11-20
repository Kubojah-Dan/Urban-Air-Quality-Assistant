import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../apps/api/src/app.js';
import { createContainer } from '../../apps/api/src/composition/createContainer.js';

describe('Security: Authorization & Owner Isolation', () => {
  const container = createContainer();
  const app = createApp(container);

  it('denies unauthenticated requests to protected preference routes', async () => {
    const res = await request(app).get('/api/v1/preferences');
    expect(res.status).toBe(401);
  });
});

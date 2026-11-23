import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createContainer } from '../src/composition/createContainer.js';

describe('AI Assistant Routes (/api/v1/assistant/chat)', () => {
  const container = createContainer();
  const app = createApp(container);

  it('rejects an empty query with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/assistant/chat')
      .send({ query: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.message).toContain('Query cannot be empty');
  });

  it('successfully responds to a live environmental query with real evidence and synthesized reply', { timeout: 15000 }, async () => {
    const res = await request(app)
      .post('/api/v1/assistant/chat')
      .send({
        query: 'What is the air quality right now in Coimbatore and what commute mode do you recommend?',
        city: {
          displayName: 'Coimbatore, India',
          cityId: 'coimbatore',
          latitude: 11.0168,
          longitude: 76.9558,
          countryCode: 'IN'
        }
      });

    expect(res.status).toBe(200);
    expect(res.body.reply).toBeDefined();
    expect(typeof res.body.reply).toBe('string');
    expect(res.body.reply.length).toBeGreaterThan(20);
    expect(res.body.provider).toBeDefined();
    expect(res.body.evidence).toBeDefined();
    expect(res.body.evidence.city).toContain('Coimbatore');
    expect(res.body.evidence.pm25).toBeGreaterThanOrEqual(0);
  });
});

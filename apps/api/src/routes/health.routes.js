import { Router } from 'express';

export function createHealthRoutes() {
  const router = Router();
  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'dayshift-api',
      timestamp: new Date().toISOString(),
      version: '0.1.0'
    });
  });
  return router;
}

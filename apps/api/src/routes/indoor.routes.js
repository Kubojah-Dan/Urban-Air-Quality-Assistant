import { Router } from 'express';

export function createIndoorRoutes({ indoorController }) {
  const router = Router();
  router.get('/guidance/indoor', (req, res, next) => indoorController.getGuidance(req, res, next));
  return router;
}

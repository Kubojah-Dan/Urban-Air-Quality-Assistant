import { Router } from 'express';

export function createAirQualityRoutes({ airQualityController }) {
  const router = Router();
  router.get('/air-quality', (req, res, next) => airQualityController.getAirQuality(req, res, next));
  return router;
}

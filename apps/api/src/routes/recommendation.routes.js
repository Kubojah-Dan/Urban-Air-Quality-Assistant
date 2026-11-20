import { Router } from 'express';

export function createRecommendationRoutes({ recommendationController }) {
  const router = Router();
  router.post('/recommendations/preview', (req, res, next) =>
    recommendationController.createRecommendation(req, res, next)
  );
  router.post('/recommendations/revise', (req, res, next) =>
    recommendationController.reviseRecommendation(req, res, next)
  );
  return router;
}

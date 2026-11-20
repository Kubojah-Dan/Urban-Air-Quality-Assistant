import { Router } from 'express';

export function createFeedbackRoutes() {
  const router = Router();
  router.post('/feedback', (req, res) => {
    // Record user feedback without recording personal health details
    res.json({ status: 'received' });
  });
  return router;
}

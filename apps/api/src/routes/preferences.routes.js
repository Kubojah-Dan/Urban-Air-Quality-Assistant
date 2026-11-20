import { Router } from 'express';
import { authorizeOwner } from '../middleware/authorizeOwner.js';

export function createPreferencesRoutes() {
  const router = Router();
  router.get('/preferences', authorizeOwner, (req, res) => {
    res.json({ preferences: {} });
  });
  router.put('/preferences', authorizeOwner, (req, res) => {
    res.json({ status: 'updated' });
  });
  router.delete('/preferences', authorizeOwner, (req, res) => {
    res.json({ status: 'deleted' });
  });
  return router;
}

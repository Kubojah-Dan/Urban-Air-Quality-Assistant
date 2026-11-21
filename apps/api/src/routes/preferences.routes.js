import { Router } from 'express';
import { authorizeOwner } from '../middleware/authorizeOwner.js';

export function createPreferencesRoutes({ preferenceRepository } = {}) {
  const router = Router();

  // GET preferences for authenticated owner
  router.get('/preferences', authorizeOwner, async (req, res, next) => {
    try {
      const prefs = preferenceRepository
        ? await preferenceRepository.getPreferences(req.user.id)
        : {};
      res.json({ preferences: prefs || {} });
    } catch (err) {
      next(err);
    }
  });

  // PUT / update preferences for authenticated owner
  router.put('/preferences', authorizeOwner, async (req, res, next) => {
    try {
      const updated = preferenceRepository
        ? await preferenceRepository.savePreferences(req.user.id, req.body)
        : req.body;
      res.json({ status: 'updated', preferences: updated });
    } catch (err) {
      next(err);
    }
  });

  // DELETE preferences (Right to Erasure)
  router.delete('/preferences', authorizeOwner, async (req, res, next) => {
    try {
      if (preferenceRepository) {
        await preferenceRepository.deletePreferences(req.user.id);
      }
      res.json({ status: 'deleted', message: 'User data permanently erased.' });
    } catch (err) {
      next(err);
    }
  });

  // GET export (Right to Portability)
  router.get('/preferences/export', authorizeOwner, async (req, res, next) => {
    try {
      const exported = preferenceRepository
        ? await preferenceRepository.exportPreferences(req.user.id)
        : { userId: req.user.id, preferences: {} };
      res.json(exported);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

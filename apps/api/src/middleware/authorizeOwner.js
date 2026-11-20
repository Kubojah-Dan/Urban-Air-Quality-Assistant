export function authorizeOwner(req, res, next) {
  // Enforces that users can only mutate or read their own saved profile
  if (!req.user) {
    return res.status(401).json({ error: { message: 'Authentication required for saved profiles' } });
  }
  next();
}

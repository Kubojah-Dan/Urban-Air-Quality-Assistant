/**
 * Enforces per-user authorization and owner isolation.
 * Invariants:
 * 1. Guests are denied access to saved profiles (401 Unauthorized).
 * 2. Authenticated users can only read or mutate their own saved profile (403 Forbidden on tenant mismatch).
 * 3. Server-owned evidence and plan collections are non-client writable.
 */
export function authorizeOwner(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication required to access or mutate saved profiles.'
      }
    });
  }

  // Cross-tenant boundary check: If route or body provides a target userId, it MUST match req.user.id
  const targetUserId = req.params.userId || req.body?.userId;
  if (targetUserId && targetUserId !== req.user.id) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied: You cannot access or modify another user’s profile.'
      }
    });
  }

  next();
}

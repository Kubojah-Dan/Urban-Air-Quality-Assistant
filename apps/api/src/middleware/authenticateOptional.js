export function authenticateOptional(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null; // Guest user is default and fully functional
    return next();
  }

  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  if (!token) {
    req.user = null;
    return next();
  }

  // Attach authenticated identity for user-owned operations
  req.user = {
    id: token,
    authenticated: true
  };
  next();
}

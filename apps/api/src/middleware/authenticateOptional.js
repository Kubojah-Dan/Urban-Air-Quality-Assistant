export function authenticateOptional(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null; // Guest user is completely valid
    return next();
  }
  // Optional token verification can attach user info
  req.user = { id: 'guest_user' };
  next();
}

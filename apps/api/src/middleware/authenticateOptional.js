import { verifyFirebaseToken, TokenVerificationError } from '../infrastructure/auth/tokenVerifier.js';

/**
 * Genuine Firebase Bearer Token Authentication Middleware
 *
 * Guarantees:
 * 1. Guest users (no Authorization header) pass through cleanly with req.user = null.
 * 2. If an Authorization header is supplied, it MUST be an authentic, signed, non-expired Firebase ID token.
 * 3. Arbitrary UIDs, plaintext strings, and forged tokens are immediately rejected with 401.
 * 4. The user identity (req.user.id) is derived strictly from the verified token claims (payload.sub).
 * 5. Raw Bearer tokens are NEVER stored as user IDs.
 */
export async function authenticateOptional(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null; // Guest user is default and fully functional
    return next();
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Malformed Authorization header. Format must be "Bearer <id_token>".'
      }
    });
  }

  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  if (!token) {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Bearer token value cannot be empty.'
      }
    });
  }

  try {
    const verified = await verifyFirebaseToken(token);
    req.user = {
      id: verified.uid,
      email: verified.email,
      authenticated: true,
      claims: verified.claims
    };
    next();
  } catch (err) {
    const status = err.status || 401;
    const code = err instanceof TokenVerificationError ? err.code : 'INVALID_TOKEN';
    return res.status(status).json({
      error: {
        code,
        message: err.message || 'Authentication token verification failed.'
      }
    });
  }
}

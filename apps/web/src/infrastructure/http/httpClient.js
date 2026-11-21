import { authService } from '../auth/firebaseAuth.js';

/**
 * Generic HTTP transport client with automatic Bearer token injection
 * for authenticated owner isolation and DPDP Act compliance.
 *
 * Supports VITE_API_BASE_URL for decoupled cross-origin cloud hosting
 * (e.g. Frontend on Vercel connecting to Backend on Render).
 */
export async function httpClient(path, options = {}) {
  const apiBase = (import.meta.env?.VITE_API_BASE_URL || '').replace(/\/$/, '');
  const url = path.startsWith('http') ? path : `${apiBase}/api/v1${path}`;
  const currentUser = authService.getCurrentUser();
  const token = currentUser?.token || currentUser?.uid;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.error?.message || `HTTP error ${response.status}`);
    error.status = response.status;
    error.details = errorBody.error;
    throw error;
  }

  return response.json();
}

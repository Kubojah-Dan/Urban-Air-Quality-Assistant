/**
 * Generic HTTP transport client. Feature modules own their specific API logic.
 */
export async function httpClient(path, options = {}) {
  const url = path.startsWith('http') ? path : `/api/v1${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
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

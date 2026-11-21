/**
 * SecretProvider — Least-Privilege Secret Resolution
 *
 * Cloud Run Deployment:
 * - Uses Google Cloud Secret Manager (roles/secretmanager.secretAccessor).
 * - Secrets are mapped to environment variables or fetched via API with least-privilege IAM.
 *
 * Local & CI Environments:
 * - Resolves securely from process.env / .env without leaking to client bundles or error traces.
 */
export class SecretProvider {
  /**
   * Retrieves a secret by key with optional fallback.
   *
   * @param {string} secretName
   * @param {string} envFallback
   * @returns {string}
   */
  static getSecret(secretName, envFallback = '') {
    const val = process.env[secretName];
    if (val !== undefined && val !== '') {
      return val;
    }
    return envFallback;
  }

  /**
   * Verifies required production secrets are configured before starting server.
   *
   * @param {Array<string>} requiredKeys
   * @returns {{ valid: boolean, missing: Array<string> }}
   */
  static auditSecrets(requiredKeys = []) {
    const missing = requiredKeys.filter((k) => !process.env[k]);
    return {
      valid: missing.length === 0,
      missing
    };
  }
}

export class SecretProvider {
  static getSecret(secretName, envFallback = '') {
    return process.env[secretName] || envFallback;
  }
}

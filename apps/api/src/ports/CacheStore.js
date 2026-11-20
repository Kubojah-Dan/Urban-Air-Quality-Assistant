/**
 * @interface CacheStore
 */
export class CacheStore {
  async get(_key) {
    throw new Error('Method not implemented: get');
  }
  async set(_key, _value, _ttlSeconds) {
    throw new Error('Method not implemented: set');
  }
}

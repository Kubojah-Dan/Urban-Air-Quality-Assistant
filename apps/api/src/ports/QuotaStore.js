/**
 * @interface QuotaStore
 */
export class QuotaStore {
  async checkAndIncrement(_key, _limit, _windowSeconds) {
    throw new Error('Method not implemented: checkAndIncrement');
  }
}

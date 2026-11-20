export class RequestCoalescer {
  constructor() {
    this.inFlight = new Map();
  }

  async coalesce(key, taskFn) {
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }
    const promise = taskFn().finally(() => {
      this.inFlight.delete(key);
    });
    this.inFlight.set(key, promise);
    return promise;
  }
}

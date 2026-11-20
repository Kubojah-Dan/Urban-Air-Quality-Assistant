export class FirestorePlanRepository {
  constructor(firestoreInstance = null) {
    this.db = firestoreInstance;
    this.memoryPlans = new Map();
  }

  async savePlan(userId, plan) {
    if (this.db) {
      await this.db.collection('saved_plans').add({ userId, ...plan, savedAt: new Date().toISOString() });
      return;
    }
    const userPlans = this.memoryPlans.get(userId) || [];
    userPlans.push({ ...plan, savedAt: new Date().toISOString() });
    this.memoryPlans.set(userId, userPlans);
  }
}

import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { env } from '../../config/env.js';
import { logger } from '../../observability/logger.js';

let adminApp = null;

/**
 * Initializes and retrieves the singleton Firebase Admin App instance.
 *
 * Adheres to enterprise security standards:
 * 1. Single reusable server-side initialization module.
 * 2. Uses secure service identity / project ID configuration.
 * 3. Does not initialize redundantly if app already exists.
 *
 * @returns {import('firebase-admin/app').App}
 */
export function getFirebaseAdminApp() {
  if (adminApp) {
    return adminApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  const projectId = env.FIREBASE_PROJECT_ID || 'dayshift-c76c2';

  try {
    adminApp = initializeApp({
      projectId
    });
    logger.info('Firebase Admin SDK initialized successfully', { projectId });
    return adminApp;
  } catch (err) {
    logger.warn('Failed to initialize Firebase Admin SDK', { error: err.message, projectId });
    throw err;
  }
}

/**
 * Retrieves the Firebase Admin Auth service instance.
 *
 * @returns {import('firebase-admin/auth').Auth}
 */
export function getFirebaseAuth() {
  const app = getFirebaseAdminApp();
  return getAuth(app);
}

/**
 * Retrieves the Firebase Admin Firestore service instance if available.
 *
 * @returns {import('firebase-admin/firestore').Firestore|null}
 */
export function getFirebaseFirestore() {
  try {
    const app = getFirebaseAdminApp();
    return getFirestore(app);
  } catch {
    return null;
  }
}

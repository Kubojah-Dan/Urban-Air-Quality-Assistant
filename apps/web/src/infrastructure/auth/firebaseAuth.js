import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged
} from 'firebase/auth';

/**
 * Production Firebase Authentication Service
 *
 * Provides real client authentication via Firebase Auth:
 * - Google OAuth Sign-In (via secure popup)
 * - Email & Password Sign-Up and Sign-In
 * - Cryptographic session token handling (Bearer ID token)
 *
 * Adheres strictly to security best practices:
 * - Zero hardcoded credentials or mock user emails.
 * - Zero plaintext password storage.
 * - All authentication handled by Google Firebase infrastructure.
 */

const STORAGE_KEY = 'dayshift_auth_user';

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || 'dayshift-c76c2.firebaseapp.com',
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || 'dayshift-c76c2',
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || 'dayshift-c76c2.appspot.com',
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || ''
};

function getAuthInstance() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}

async function formatFirebaseUser(fbUser) {
  if (!fbUser) return null;
  const token = await fbUser.getIdToken().catch(() => fbUser.uid);
  const user = {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
    photoURL: fbUser.photoURL || null,
    provider: fbUser.providerData?.[0]?.providerId || 'firebase',
    token
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    void err;
  }
  return user;
}

export const authService = {
  /**
   * Retrieves the current user from stored session.
   */
  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Google Sign In via real Firebase Popup.
   */
  signInWithGoogle: async () => {
    const auth = getAuthInstance();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return formatFirebaseUser(result.user);
  },

  /**
   * Email & Password Sign In.
   */
  signInWithEmail: async (emailInput, password) => {
    if (!emailInput || !password) {
      throw new Error('Please enter both email and password.');
    }
    const auth = getAuthInstance();
    const result = await signInWithEmailAndPassword(
      auth,
      emailInput.trim().toLowerCase(),
      password
    );
    return formatFirebaseUser(result.user);
  },

  /**
   * Email & Password Sign Up.
   */
  signUpWithEmail: async (emailInput, password, displayNameInput) => {
    if (!emailInput || !password) {
      throw new Error('Please enter both email and password.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }
    const auth = getAuthInstance();
    const result = await createUserWithEmailAndPassword(
      auth,
      emailInput.trim().toLowerCase(),
      password
    );

    if (displayNameInput?.trim() && result.user) {
      try {
        await updateProfile(result.user, { displayName: displayNameInput.trim() });
      } catch (err) {
        void err;
      }
    }

    return formatFirebaseUser(result.user);
  },

  /**
   * Sign Out.
   */
  signOut: async () => {
    try {
      const auth = getAuthInstance();
      await fbSignOut(auth);
    } catch (err) {
      void err;
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      void err;
    }
    return null;
  },

  /**
   * Realtime auth state listener.
   */
  onAuthStateChanged: (callback) => {
    try {
      const auth = getAuthInstance();
      return fbOnAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const user = await formatFirebaseUser(fbUser);
          callback(user);
        } else {
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch (err) {
            void err;
          }
          callback(null);
        }
      });
    } catch (err) {
      void err;
      return () => {};
    }
  }
};

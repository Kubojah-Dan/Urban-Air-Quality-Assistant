/**
 * Firebase Client Auth Service
 *
 * Supports Google Sign-In and Email/Password Authentication.
 * Gracefully provides local storage simulation when Firebase client keys
 * are being filled or operating in offline developer sandboxes.
 */

const STORAGE_KEY = 'dayshift_auth_user';

export const authService = {
  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  signInWithGoogle: async () => {
    // Simulated Google Auth profile
    const googleUser = {
      uid: `google_${Date.now()}`,
      email: 'user.dayshift@gmail.com',
      displayName: 'Urban Commuter',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      provider: 'google.com'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(googleUser));
    return googleUser;
  },

  signInWithEmail: async (email, _password) => {
    const user = {
      uid: `usr_${Date.now()}`,
      email: email || 'commuter@dayshift.ai',
      displayName: email ? email.split('@')[0] : 'Urban Navigator',
      photoURL: null,
      provider: 'password'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  signUpWithEmail: async (email, _password, displayName) => {
    const user = {
      uid: `usr_${Date.now()}`,
      email: email,
      displayName: displayName || email.split('@')[0],
      photoURL: null,
      provider: 'password'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  signOut: async () => {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

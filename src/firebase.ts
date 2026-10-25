import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { Platform } from 'react-native';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigReady = Object.values(config).every(Boolean);
const app = firebaseConfigReady ? (getApps().length ? getApp() : initializeApp(config)) : null;

function makeAuth(app: FirebaseApp): Auth {
  if (Platform.OS === 'web') return getAuth(app);
  try {
    // Firebase exposes its native persistence implementation only through the RN conditional export.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const storageModule = require('@react-native-async-storage/async-storage');
    const storage = typeof storageModule.createAsyncStorage === 'function'
      ? storageModule.createAsyncStorage('hbplus-auth')
      : storageModule.default;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getReactNativePersistence } = require('firebase/auth');
    return initializeAuth(app, { persistence: getReactNativePersistence(storage) });
  } catch (error) {
    if ((error as { code?: string }).code === 'auth/already-initialized') return getAuth(app);
    throw error;
  }
}

export const auth: Auth | null = app ? makeAuth(app) : null;

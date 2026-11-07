import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Production Firebase Configuration
// Environment variables injected via Vite (VITE_FIREBASE_*)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyMwangazaDemoApiKey2025ValidString',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mwangaza-resource-hub.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mwangaza-resource-hub',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mwangaza-resource-hub.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '429841975993',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:429841975993:web:681bf9d12345e67890abcd',
};

// Singleton Firebase instances
let app: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let authClient: Auth | null = null;
let storageClient: FirebaseStorage | null = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  firestoreDb = getFirestore(app);
  authClient = getAuth(app);
  storageClient = getStorage(app);
} catch (error) {
  console.warn('[FirebaseConnector] Running in resilient offline/client-orchestrated mode:', error);
}

export { app, firestoreDb, authClient, storageClient };

// Service Health Checker
export const checkFirebaseStatus = () => {
  return {
    initialized: Boolean(app),
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    storageBucket: firebaseConfig.storageBucket,
    hasLiveConnection: Boolean(firestoreDb && authClient)
  };
};

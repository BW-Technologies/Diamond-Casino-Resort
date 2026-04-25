import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDR2hcLiSl0YJW4eJZrdM8oKV4rmwQuHsQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "diamond-1748e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "diamond-1748e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "diamond-1748e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "690508780220",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:690508780220:web:c9edd7c2f6d96e387f36b9"
};

// Initialize primary app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);

// Initialize secondary app for creating users without logging out
export const secondaryApp = getApps().length < 2 ? initializeApp(firebaseConfig, "Secondary") : getApps()[1];
export const secondaryAuth = getAuth(secondaryApp);

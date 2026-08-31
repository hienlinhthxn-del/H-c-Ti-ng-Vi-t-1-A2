import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBsOXXDcvpPOOxvJDU215p-mnc16z4ljYE",
  authDomain: "behoctiengviet-ebb43.firebaseapp.com",
  projectId: "behoctiengviet-ebb43",
  storageBucket: "behoctiengviet-ebb43.firebasestorage.app",
  messagingSenderId: "407353522495",
  appId: "1:407353522495:web:abb22d09df40a090bf3b8a",
  measurementId: "G-JYYTR6C21X"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

if (typeof window !== 'undefined') {
  try {
    enableIndexedDbPersistence(db).catch((err) => {
      console.warn('Firebase persistence warning:', err);
    });
  } catch (e) {
    console.warn('Error enabling Firebase persistence', e);
  }
}

export { app, db };
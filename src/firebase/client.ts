import { initializeApp, type FirebaseOptions } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
} from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
const authEmulatorHost = import.meta.env.PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;

export const auth = getAuth(app);

if (authEmulatorHost) {
  try {
    connectAuthEmulator(auth, `http://${authEmulatorHost}`);

  } catch (error) {
    console.error(error);
  }
  
}


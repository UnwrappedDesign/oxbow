import { initializeApp, type FirebaseOptions } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
} from "firebase/auth";

const apiKey = import.meta.env.PUBLIC_FIREBASE_API_KEY;
const authDomain = import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.PUBLIC_FIREBASE_APP_ID;

const firebaseConfig: FirebaseOptions = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

export const app = initializeApp(firebaseConfig);

const authEmulatorHost = import.meta.env.PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;

export const auth = getAuth(app);

if (authEmulatorHost) {
  try {
    console.log('Connecting to auth emulatorHost.');
    connectAuthEmulator(auth, `http://${authEmulatorHost}`);

  } catch (error) {
    console.error(error);
  }
}


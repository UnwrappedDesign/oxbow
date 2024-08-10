import { initializeApp, type FirebaseOptions } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
} from "firebase/auth";

const apiKey = Cypress.env('FIREBASE_API_KEY');
const authDomain = Cypress.env('FIREBASE_AUTH_DOMAIN');
const projectId = Cypress.env('FIREBASE_PROJECT_ID');
const storageBucket = Cypress.env('FIREBASE_STORAGE_BUCKET');
const messagingSenderId = Cypress.env('FIREBASE_MESSAGING_SENDER_ID');
const appId = Cypress.env('FIREBASE_APP_ID');
const authEmulatorHost = Cypress.env('FIREBASE_AUTH_EMULATOR_HOST');

if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
  throw new Error('Firebase configuration missing.');
}

if (!authEmulatorHost) {
  throw new Error('Firebase auth emulator host missing.');
}

const firebaseConfig: FirebaseOptions = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

connectAuthEmulator(auth, `http://${authEmulatorHost}`);
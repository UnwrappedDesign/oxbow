import type { ServiceAccount } from "firebase-admin";
import { initializeApp, cert, getApps } from "firebase-admin/app";

const serviceAccountBase64 = import.meta.env.FIREBASE_SERVICE_ACCOUNT_ENCODED;
const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(serviceAccountJson);

const activeApps = getApps();

const emulatorHost = import.meta.env.PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;

if (emulatorHost) {
  console.info('Connecting to auth emulatorHost.');
  process.env.FIREBASE_AUTH_EMULATOR_HOST = emulatorHost;
}

const initApp = () => {
  console.info('Loading service account from env.');
  return initializeApp({
    credential: cert(serviceAccount as ServiceAccount)
  });
};

export const app = activeApps.length === 0 ? initApp() : activeApps[0];
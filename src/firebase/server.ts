import type { ServiceAccount } from "firebase-admin";
import { initializeApp, cert, getApps } from "firebase-admin/app";

const serviceAccountBase64 = import.meta.env.FIREBASE_SERVICE_ACCOUNT_ENCODED;
const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(serviceAccountJson);

const activeApps = getApps();

export const app = activeApps.length === 0 ? initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
}) : activeApps[0];
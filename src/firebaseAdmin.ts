import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_ENCODED;
const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(serviceAccountJson);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();
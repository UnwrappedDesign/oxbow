import { defineConfig } from 'cypress';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4321',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      const serviceAccount = config.env.FIREBASE_SERVICE_ACCOUNT_ENCODED;
      process.env.FIREBASE_AUTH_EMULATOR_HOST = config.env.FIREBASE_AUTH_EMULATOR_HOST;

      if (!serviceAccount) {
        throw new Error('Service account missing.');
      }

      if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
        throw new Error('Firebase auth emulator host missing.');
      }

      const serviceAccountString = Buffer.from(serviceAccount, 'base64').toString('utf-8');
      const serviceAccountJson: ServiceAccount = JSON.parse(serviceAccountString);
      const activeApps = getApps();

      const app = activeApps.length === 0 ? initializeApp({
        credential: cert(serviceAccountJson),
      }) : activeApps[0];

      const auth = getAuth(app);

      on('task', {
        'getUser': async (uid: string) => {
          try {
            const user = await auth.getUser(uid);
            return user;
          } catch (error) {
            console.error(error);
            return null;
          }
        },
      })
    },
  },
});
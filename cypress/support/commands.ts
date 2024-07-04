/// <reference types="@testing-library/cypress" />
/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, type FirebaseOptions } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const projectId = Cypress.env('PUBLIC_FIREBASE_PROJECT_ID');

const firebaseConfig: FirebaseOptions = {
  apiKey: Cypress.env('PUBLIC_FIREBASE_API_KEY'),
  authDomain: Cypress.env('PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId,
  storageBucket: Cypress.env('PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: Cypress.env('PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: Cypress.env('PUBLIC_FIREBASE_APP_ID'),
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

try {
  connectAuthEmulator(auth, `http://127.0.0.1:9099`);

} catch (error) {
  console.error(error);
}

Cypress.Commands.add('clearUsers', () => {
  // add authentication Berarer token
  return cy.request('DELETE', `http://127.0.0.1:9099/emulator/v1/projects/${projectId}/accounts`, {
    headers: {
      Authorization: 'Bearer owner',
    },
  });
});

Cypress.Commands.add('getLastOobCode', () => {
  return cy.request(`http://127.0.0.1:9099/emulator/v1/projects/${projectId}/oobCodes`)
    .its('body')
    .then((response) => {
      const { oobCodes } = response;
      return oobCodes[oobCodes.length - 1];
    });
});

Cypress.Commands.add('createUser', (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
});

Cypress.Commands.add('login', (email: string, password: string) => {
  const credentials = signInWithEmailAndPassword(auth, email, password);

  const idTokenPromise = credentials.then((userCredential) => {
    return userCredential.user.getIdToken();
  });

  cy.wrap(idTokenPromise).then((idToken) => {
    cy.request({
      url: '/api/auth/signin',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  });
});

/// <reference types="@testing-library/cypress" />
/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app, auth as clientAuth } from '../firebase/client';
//import { auth as serverAuth } from '../firebase/server';

const projectId = app.options.projectId;

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
  return cy.wrap(createUserWithEmailAndPassword(clientAuth, email, password));
});

Cypress.Commands.add('getUser', (uid: string) => {
  cy.task('getUser', uid).then((userRecord) => {
    return cy.wrap(userRecord);
  });
});

Cypress.Commands.add('login', (email: string, password: string) => {
  const credentials = signInWithEmailAndPassword(clientAuth, email, password);

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

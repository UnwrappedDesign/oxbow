/// <reference types="cypress" />

import type { UserCredential } from "firebase/auth"

declare namespace Cypress {
  interface Chainable<Subject> {

    clearUsers(): Chainable<any>

    getLastOobCode(): Chainable<any>

    createUser(email: string, password: string): Chainable<any>

    login(email: string, password: string): Chainable<any>
  }
}
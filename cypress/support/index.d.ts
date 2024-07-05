/// <reference types="cypress" />

import type { UserCredential } from "firebase/auth"

declare global {
 namespace Cypress {
    interface Chainable {
      clearUsers(): Chainable<Response<void>>

      getLastOobCode(): Chainable<{oobLink: string}>

      createUser(email: string, password: string): Chainable<UserCredential>

      login(email: string, password: string): Chainable<Response<void>>
    }
  }
}
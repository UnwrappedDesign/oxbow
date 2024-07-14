/// <reference types="cypress" />

import type { UserRecord } from "firebase-admin/auth"
import type { UserCredential } from "firebase/auth"

declare global {
 namespace Cypress {
    interface Chainable {
      clearUsers(): Chainable<Response<void>>

      getUser(uid: string): Chainable<UserRecord>

      getLastOobCode(): Chainable<{oobLink: string}>

      createUser(email: string, password: string): Chainable<UserCredential>

      login(email: string, password: string): Chainable<Response<void>>
    }
  }
}
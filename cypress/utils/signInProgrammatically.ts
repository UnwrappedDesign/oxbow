import {
  getAuth,
  sendSignInLinkToEmail,  
} from 'firebase/auth';

export function signInProgrammatically(email: string) {
  const auth = getAuth();

  const actionCodeSettings = {
    url: `/email-signin`,
    handleCodeInApp: true,
  };
 
  const signIn = sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .catch((e) => {
      cy.log(`User could not sign in programmatically!`);
      console.error(e);
    });
 
  return cy.wrap(signIn);
}
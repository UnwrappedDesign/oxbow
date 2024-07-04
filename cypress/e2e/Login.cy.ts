describe('Login', () => {
  it('should log in a user', () => {
    const testEmail = 'test@test.com';
    cy.visit('/login');
    cy.get('input[name="email"]').type(testEmail);
    cy.get('form').submit()
    
    cy.get('h1').should('contain', 'Check Your Inbox');
    cy.wait(100);

    cy.request('http://127.0.0.1:9099/emulator/v1/projects/windstatic-dev/oobCodes')
      .its('body')
      .then((response) => {
        console.log(response);
        const {oobCodes} = response;
        const lastCode = oobCodes[oobCodes.length - 1];
        cy.visit(lastCode.oobLink);
        cy.findByText(testEmail).should('exist');
      });
  });
});

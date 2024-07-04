describe('Login', () => {
  it('should log in a user', () => {
    const testEmail = 'test@test.com';
    cy.visit('/login');
    cy.get('input[name="email"]').type(testEmail);
    cy.get('form').submit()
    
    cy.get('h1').should('contain', 'Check Your Inbox');
    cy.wait(100);

    cy.getLastOobCode().then((oobCode) => {
      cy.visit(oobCode.oobLink);
      cy.findByText(testEmail).should('exist');
      // check if the cookie is set
      cy.getCookie('__session').should('exist');
    });
  });
});

describe('Unsigned user', () => {
  const testEmail = 'test@test.com';
  
  it('should be able to login', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(testEmail);
    cy.get('form').submit()
    
    cy.wait(100);

    cy.getLastOobCode().then((oobCode) => {
      cy.visit(oobCode.oobLink);
      cy.findByText(testEmail).should('exist');
      // check if the cookie is set
      cy.getCookie('__session').should('exist');
    });
  });
});

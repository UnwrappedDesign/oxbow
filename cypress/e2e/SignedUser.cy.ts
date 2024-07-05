describe('Signed user', () => {
  const email = 'testuser@test.com';
  const password = '1234abcd';
  
  beforeEach(() => {
    cy.clearUsers()
    cy.createUser(email, password);
    cy.login(email, password);
  });

  it('should have a cookie __session set', () => {
    cy.getCookie('__session').should('exist');
  });

  it('should see his email in the header', () => {
    cy.visit('/');
    cy.findByText(email).should('exist');
  });

  it('should be able to logout', () => {
    cy.visit('/');
    cy.findByRole('button', { name: /Account/ }).click();
    cy.findByRole('menuitem', { name: /Sign out/ }).click();
    cy.getCookie('__session').should('not.exist');
    cy.findByText(email).should('not.exist');
  });
});
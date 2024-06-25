describe('UnloggedUser', () => {
  it('unlogged user shouldn\'t be able to see Comoponent\'s code', () => {
    cy.visit('/iframe/src/components/windstatic/marketing/left-heroes/1.astro?iframeId=iframe-1');

    const classArr = 'text-4xl mt-4 font-semibold tracking-tight text-blue-950 lg:text-5xl lg:text-balance'.split(' ');


    const $h1 = cy.findByRole('heading', { level: 1 }).should('exist');

    // check if the h1 don't have any of the classes in classArr
    classArr.forEach((className) => {
      $h1.should('not.have.class', className);
    });
  });
});
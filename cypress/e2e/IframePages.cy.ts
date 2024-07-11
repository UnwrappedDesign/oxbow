import { TestComponentIframePage } from "cypress/pages/TestComponentIframePage";

describe('IframePages', () => {
  const testComponentIframePage = new TestComponentIframePage();
  const classArr = 'text-4xl mt-4 text-gray-900 lg:text-5xl lg:text-balance'.split(' ');

  describe('Unlogged user test component', () => {
    beforeEach(() => {
      testComponentIframePage.visit()
    });

    it('should contain an h1 including the text "Hello world"', () => {
      const $h1 = testComponentIframePage.getHeading();
      $h1.should('include.text', 'Hello world');
    });

    it('shouldn\'t contain any tailwind (they are mangled) classes in the h1', () => {
      const $h1 = testComponentIframePage.getHeading();

      // check if the h1 don't have any of the classes in classArr
      classArr.forEach((className) => {
        $h1.should('not.have.class', className);
      });
    });

    it('should contain a h1 with 5 classes', () => {
      const $h1 = testComponentIframePage.getHeading()

      // check if the h1 have exactly 5 classes
      $h1.invoke('attr', 'class').then((classes) => {
        const classList = classes.split(' ');
        expect(classList).to.have.length(classArr.length);
      });
    });
  });

  describe('Logged user test component', () => {
    const email = 'test@test.com';
    const password = '1234abcd';

    beforeEach(() => {
      cy.clearUsers().then(() => {
        cy.createUser(email, password);
        cy.login(email, password);
        testComponentIframePage.visit();
      });
    });

    it('should contain an h1 including the text "Hello world"', () => {
      const $h1 = testComponentIframePage.getHeading();
      $h1.should('include.text', 'Hello world');
    });

    it('should contain all tailwind classes (not mangled) in the h1', () => {
      const $h1 = testComponentIframePage.getHeading();

      // check if the h1 don't have any of the classes in classArr
      classArr.forEach((className) => {
        $h1.should('have.class', className);
      });
    });

    it('should contain a h1 with 5 classes', () => {
      const $h1 = testComponentIframePage.getHeading();

      // check if the h1 have exactly 5 classes
      $h1.invoke('attr', 'class').then((classes) => {
        const classList = classes.split(' ');
        expect(classList).to.have.length(classArr.length);
      });
    });
  });
});
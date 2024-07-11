export abstract class Page {
  constructor(protected url: string) {
    // Empty constructor intentionally left blank.
  }

  getUrl() {
    return this.url;
  }

  getHeading(level: number = 1) {
    return cy.findByRole('heading', { level });
  }

  getFullUrl() {
    return `${Cypress.config().baseUrl}${this.getUrl()}`;
  }

  visit() {
    cy.visit(this.getUrl());
  }

}

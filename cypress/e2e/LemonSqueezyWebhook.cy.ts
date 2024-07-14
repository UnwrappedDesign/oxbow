import { createHmac } from "crypto";
import requestBody from '../fixtures/lemonSqueezyWebhook.json';

describe('LemonSqueezyWebhook', () => {
  describe('Request without signature', () => {
    it('should return a 400 error', () => {
      cy.request({
        method: 'POST',
        url: '/webhooks/lemon.json',
        failOnStatusCode: false,
        body: requestBody
      }).then((response) => {
        expect(response.body).to.eq('X-Signature header is required');
        expect(response.status).to.eq(400);
      });
    });
  });

  describe('Request with invalid signature', () => {
    it('should return a 403 error', () => {
      cy.request({
        method: 'POST',
        url: '/webhooks/lemon.json',
        failOnStatusCode: false,
        body: requestBody,
        headers: {
          'X-Signature': 'invalid-signature'
        }
      }).then((response) => {
        expect(response.body).to.eq('Invalid X-Signature header');
        expect(response.status).to.eq(403);
      });
    });
  });

  describe('Request with valid signature', () => {
    let signature: string;

    beforeEach(() => {
      cy.clearUsers();

      const secret = Cypress.env('LEMON_SQUEEZE_SECRET');

      signature = createHmac('sha256', secret).update(JSON.stringify(requestBody)).digest('hex');
    });

    it('should return a 200 status code', () => {
      cy.request({
        method: 'POST',
        url: '/webhooks/lemon.json',
        body: requestBody,
        headers: {
          'X-Signature': signature
        }
      }).then((response) => {
        expect(response.body).to.contain('User created');
        expect(response.status).to.eq(200);

        const [_userCreated, uid] = response.body.split(/:\s+/);

        cy.getUser(uid).then((user) => {
          expect(user.email).to.eq(requestBody.data.attributes.user_email);
        });
      });
    });
  });
});
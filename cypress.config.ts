import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4321',
    supportFile: 'cypress/support/e2e.ts'
  },
  env: {
    PUBLIC_APP_BASE_URL: 'http://localhost:4321',
  }
});
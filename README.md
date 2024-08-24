## Windstatic
### Getting started

Install firebase tools for local development in case you don't have install it in your machine
``
npm install -g firebase-tools
``

```bash
git pull
npm install
npm run dev
```

## Environment variables

### Backend environment variables
- LOCAL: `Set to true if running locally`
- LEMON_SQUEEZE_SECRET: `Secret for Lemon Squeeze webhook`
- FIREBASE_SERVICE_ACCOUNT_ENCODED: `Service account encoded in base64`
- FIREBASE_TOKEN: `Firebase token for authentication as admin`

#### Product variables
- PRODUCT_INDIVIDUAL_LICENSE_URL: `URL for the windstatic product individual license`
- PRODUCT_TEAM_LICENSE_URL: `URL for the windstatic product team license`

### Frontend environment variables
- PUBLIC_APP_BASE_URL: `Base URL for the app`
- PUBLIC_FIREBASE_API_KEY: `Firebase API key`
- PUBLIC_FIREBASE_AUTH_DOMAIN: `Firebase auth domain`
- PUBLIC_FIREBASE_PROJECT_ID: `Firebase project ID`
- PUBLIC_FIREBASE_STORAGE_BUCKET: `Firebase storage bucket`
- PUBLIC_FIREBASE_MESSAGING_SENDER_ID: `Firebase messaging sender ID`
- PUBLIC_FIREBASE_APP_ID: `Firebase app ID`
- PUBLIC_FIREBASE_AUTH_EMULATOR_HOST: `Firebase auth emulator host. Only used in development`
- PUBLIC_UMAMI_URL: `Url where the umami analytics is hosted`
- PUBLIC_UMAMI_WEBSITE_ID: `Website ID for the umami analytics`


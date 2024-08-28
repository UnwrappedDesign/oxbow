/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
import type { Alpine } from 'alpinejs';
import type { UserRecord } from 'firebase-admin/auth';


interface ImportMetaEnv {
  readonly FIREBASE_PRIVATE_KEY_ID: string;
  readonly FIREBASE_PRIVATE_KEY: string;
  readonly FIREBASE_PROJECT_ID: string;
  readonly FIREBASE_CLIENT_EMAIL: string;
  readonly FIREBASE_CLIENT_ID: string;
  readonly FIREBASE_AUTH_URI: string;
  readonly FIREBASE_TOKEN_URI: string;
  readonly FIREBASE_AUTH_CERT_URL: string
  readonly FIREBASE_CLIENT_CERT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    Alpine: Alpine;
  }
  
  namespace App {
    interface Locals {
      // add props here
      user?: UserRecord | null;
    }
  }
}

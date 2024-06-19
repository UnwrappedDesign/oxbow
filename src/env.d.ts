/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

import { type User } from 'firebase/auth';

declare namespace App {
  interface Locals {
   // add props here
   user: User | null;
  }
}
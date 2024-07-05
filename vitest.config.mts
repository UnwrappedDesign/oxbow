/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['**/*.spec.ts', '**/*.spec.tsx'],
    globals: true
  },
});
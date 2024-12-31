import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import alpinejs from "@astrojs/alpinejs";
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { loadEnv } from "vite";

import react from "@astrojs/react";

const { PUBLIC_APP_BASE_URL } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  "",
);

const localhost = PUBLIC_APP_BASE_URL?.includes("localhost") ?? false;

console.log("Loading app with PUBLIC_APP_BASE_URL: ", PUBLIC_APP_BASE_URL);
console.log("Loading app with NODE_ENV: ", process.env.NODE_ENV);

// https://astro.build/config
export default defineConfig({
  devOptions: {
    devToolbar: false,
  },
  redirects: {
    "/free-tools/home": "/free-tools",
  },
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "css-variables",
    },
  },
  build: {
    inlineStylesheets: "always",
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true,
  },
  site: 'https://oxbowui.com',
  integrations: [sitemap(), mdx(), alpinejs({ entrypoint: 'src/alpine' }), react()],
  adapter: localhost ? node({mode: 'standalone'}) : netlify(),
  output: 'server',
  vite: {
    plugins: [tailwindcss()]
  }
});

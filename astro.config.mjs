import mdx from "@astrojs/mdx";
import netlify from '@astrojs/netlify';
import node from '@astrojs/node';
import sitemap from "@astrojs/sitemap";
import alpinejs from "@astrojs/alpinejs";
import { defineConfig } from 'astro/config';

const local = false;

// https://astro.build/config
export default defineConfig({
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "css-variables"
    }
  },
  build: {
    inlineStylesheets: 'always',
  },  
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true
  },
  site: 'https://windstatic.com',
  integrations: [sitemap(), mdx(), alpinejs()],
  adapter: local ? node({mode: 'standalone'}) : netlify(),
  output: 'server'
});
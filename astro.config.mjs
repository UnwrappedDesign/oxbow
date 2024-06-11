import mdx from "@astrojs/mdx";
import netlify from '@astrojs/netlify';
import sitemap from "@astrojs/sitemap";
import alpinejs from "@astrojs/alpinejs";
import { defineConfig } from 'astro/config';

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
  adapter: netlify(),
  output: 'server'
});
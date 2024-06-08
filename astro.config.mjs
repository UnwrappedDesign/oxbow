import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import alpinejs from "@astrojs/alpinejs";
import rename from 'astro-rename';

// https://astro.build/config
export default defineConfig({
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "css-variables"
    }
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true
  },
  site: 'https://windstatic.com',
  integrations: [tailwind(), sitemap(), mdx(), alpinejs()],
  adapter: node({
    mode: 'standalone'
  }),
  output: 'server'
});
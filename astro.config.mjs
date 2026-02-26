// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://vibecoding.work',
  integrations: [
    sitemap({
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) =>
        !page.includes('/edit') &&
        !page.includes('/submit') &&
        page !== 'https://vibecoding.work/job/',
      customPages: [],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

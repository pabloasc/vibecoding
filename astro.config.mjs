// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Fetch job slugs from Supabase at build time for the sitemap
async function getJobSitemapPages() {
  const url = process.env.PUBLIC_SUPABASE_URL;
  const key = process.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/jobs?select=id,title&order=created_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return [];
    const jobs = await res.json();
    return jobs.map((job) => {
      const slug = `${job.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 60).replace(/-+$/, '')}-${job.id.slice(0, 8)}`;
      return `https://vibecoding.work/job/${slug}/`;
    });
  } catch {
    return [];
  }
}

const jobPages = await getJobSitemapPages();

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  site: 'https://vibecoding.work',
  integrations: [
    sitemap({
      changefreq: 'daily',
      lastmod: new Date(),
      filter: (page) =>
        !page.includes('/edit') &&
        !page.includes('/submit') &&
        page !== 'https://vibecoding.work/job/',
      customPages: jobPages,
      serialize(item) {
        if (item.url === 'https://vibecoding.work/') return { ...item, priority: 1.0 };
        if (item.url.includes('/job/'))              return { ...item, priority: 0.8 };
        return { ...item, priority: 0.6 };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

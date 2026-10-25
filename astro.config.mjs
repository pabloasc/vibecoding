// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Fetch profile slugs from Supabase at build time for the sitemap
async function getProfileSitemapPages() {
  const url = process.env.PUBLIC_SUPABASE_URL;
  const key = process.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/jobs?select=id,name,title&order=created_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return [];
    const profiles = await res.json();
    return profiles.map((p) => {
      const slug = `${`${p.name ?? ''} ${p.title}`.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 60).replace(/-+$/, '')}-${p.id.slice(0, 8)}`;
      return `https://vibecoding.work/profile/${slug}/`;
    });
  } catch {
    return [];
  }
}

const profilePages = await getProfileSitemapPages();

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
        !page.includes('/job/') &&
        page !== 'https://vibecoding.work/profile/',
      customPages: profilePages,
      serialize(item) {
        if (item.url === 'https://vibecoding.work/') return { ...item, priority: 1.0 };
        if (item.url.includes('/profile/'))          return { ...item, priority: 0.8 };
        return { ...item, priority: 0.6 };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

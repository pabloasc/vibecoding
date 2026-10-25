import type { APIRoute } from 'astro';
import { profileSlug } from '../lib/slug';

export const GET: APIRoute = async () => {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  let profiles: { id: string; name: string | null; title: string; created_at: string }[] = [];

  if (url && key) {
    try {
      const res = await fetch(
        `${url}/rest/v1/jobs?select=id,name,title,created_at&order=created_at.desc`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      if (res.ok) profiles = await res.json();
    } catch { /* fallthrough */ }
  }

  const today = new Date().toISOString().split('T')[0];

  const profileUrls = profiles.map(p => {
    const slug = profileSlug(p);
    const date = p.created_at.split('T')[0];
    return `  <url>
    <loc>https://vibecoding.work/profile/${slug}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://vibecoding.work/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${profileUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};

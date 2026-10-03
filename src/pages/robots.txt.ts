import type { APIRoute } from 'astro';
import { publicPage } from '../lib/site.ts';

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${publicPage(site, import.meta.env.BASE_URL).href}sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );

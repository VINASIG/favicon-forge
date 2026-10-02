import type { APIRoute } from 'astro';
import { sitemap } from '../lib/site.ts';

export const GET: APIRoute = ({ site }) =>
  new Response(sitemap(site, import.meta.env.BASE_URL), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });

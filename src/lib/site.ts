export function publicPage(site: URL | undefined, base: string): URL {
  if (!site) throw new Error('The public site origin is required.');
  const normalized = base || '/';
  return new URL(
    normalized.endsWith('/') ? normalized : `${normalized}/`,
    site,
  );
}

export function sitemap(site: URL | undefined, base: string): string {
  const root = publicPage(site, base);
  const urls = [root.href, new URL('vi/', root).href].map((value) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((href) => `<url><loc>${href}</loc></url>`).join('')}</urlset>\n`;
}

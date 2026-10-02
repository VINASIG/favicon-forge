export function publicPage(site: URL | undefined, base: string): URL {
  if (!site) throw new Error('The public site origin is required.');
  const normalized = base || '/';
  return new URL(
    normalized.endsWith('/') ? normalized : `${normalized}/`,
    site,
  );
}

export function sitemap(site: URL | undefined, base: string): string {
  const href = publicPage(site, base)
    .href.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${href}</loc></url></urlset>\n`;
}

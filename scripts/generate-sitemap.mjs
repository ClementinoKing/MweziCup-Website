import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const cwd = process.cwd();
const siteUrl = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://mwezicup.com').replace(/\/+$/, '');

const staticRoutes = ['/', '/about', '/how-it-works', '/product', '/blog', '/faqs', '/contact'];
const routes = [...new Set(staticRoutes)].sort((a, b) => a.localeCompare(b));
const lastmod = new Date().toISOString().slice(0, 10);

const urlEntries = routes
  .map((route) => {
    const location = `${siteUrl}${route === '/' ? '' : route}`;
    const priority = route === '/' ? '1.0' : route.startsWith('/blog/') ? '0.7' : route === '/blog' ? '0.8' : '0.9';
    const changefreq = route === '/' ? 'weekly' : route.startsWith('/blog/') ? 'monthly' : 'monthly';

    return `  <url>
    <loc>${location}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(resolve(cwd, 'public/sitemap.xml'), sitemap);
writeFileSync(resolve(cwd, 'public/robots.txt'), robots);

console.log(`Generated sitemap for ${routes.length} routes.`);

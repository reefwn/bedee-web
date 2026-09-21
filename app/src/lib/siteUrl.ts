// Single source of truth for the site's absolute URL — used in sitemap.xml,
// robots.txt, metadataBase, and JSON-LD schema across the app. Deploying to
// a new domain (e.g. www.bedee.com) is then one Vercel env var, not an
// 11-file find-and-replace.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bedee-payload.vercel.app'

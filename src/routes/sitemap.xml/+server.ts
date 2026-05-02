import { SITEMAP_ENTRIES } from '$lib/route-registry';

const BLOCKED_URL_PATTERNS = ['/create-custom-wordle', '/custom-wordle', '/admin', '/api/', '/private'];

function shouldIncludeUrl(url: string): boolean {
	return !BLOCKED_URL_PATTERNS.some((pattern) => url.includes(pattern));
}

function generateSitemap(): string {
	const today = new Date().toISOString().split('T')[0];
	const urls = SITEMAP_ENTRIES.filter(shouldIncludeUrl)
		.map((url: string) => {
			const fullUrl = url.startsWith('http') ? url : `https://wordsolverx.com${url}`;
			return `  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export async function GET() {
	return new Response(generateSitemap(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
		}
	});
}

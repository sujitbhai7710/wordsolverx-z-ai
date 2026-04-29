import { PRERENDER_ENTRIES } from '$lib/route-registry';

const workerApiUrl = 'https://api.wordsolverx.workers.dev/sitemap.xml';
const BLOCKED_URL_PATTERNS = ['/create-custom-wordle', '/custom-wordle', '/admin', '/api/', '/private'];

function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function filterSitemapUrls(xml: string): string {
	let filtered = xml;
	for (const pattern of BLOCKED_URL_PATTERNS) {
		const regex = new RegExp(
			`<url>\\s*<loc>[^<]*${escapeRegex(pattern)}[^<]*<\\/loc>[\\s\\S]*?<\\/url>`,
			'g'
		);
		filtered = filtered.replace(regex, '');
	}
	return filtered;
}

function generateFallbackSitemap(): string {
	const today = new Date().toISOString().split('T')[0];
	const urls = PRERENDER_ENTRIES.map((url: string) => {
		const fullUrl = url.startsWith('http') ? url : `https://wordsolverx.com${url}`;
		return `  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`;
	}).join('\n');
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

const emptySitemap = generateFallbackSitemap();

let cachedSitemapXml = emptySitemap;

export async function GET() {
	try {
		const response = await fetch(workerApiUrl, {
			headers: {
				'User-Agent': 'WordSolverX-SvelteKit-Server'
			}
		});

		if (!response.ok) {
			console.error(`Failed to fetch sitemap.xml from worker: ${response.status}`);

			return new Response(cachedSitemapXml, {
				status: cachedSitemapXml === emptySitemap ? 503 : 200,
				headers: {
					'Content-Type': 'application/xml',
					'Cache-Control': 'public, max-age=600, stale-while-revalidate=86400',
					'X-Robots-Tag': 'noarchive'
				}
			});
		}

		const xml = await response.text();
		const fixedXml = xml.replace(/wordsolver\.tech/g, 'wordsolverx.com');
		const filteredXml = filterSitemapUrls(fixedXml);
		if (filteredXml.includes('<urlset') || filteredXml.includes('<sitemapindex')) {
			cachedSitemapXml = filteredXml;
		}

		return new Response(cachedSitemapXml, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
			}
		});
	} catch (error) {
		console.error('Error proxying sitemap.xml:', error);

		return new Response(cachedSitemapXml, {
			status: cachedSitemapXml === emptySitemap ? 503 : 200,
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=600, stale-while-revalidate=86400',
				'X-Robots-Tag': 'noarchive'
			}
		});
	}
}

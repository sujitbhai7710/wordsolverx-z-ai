const workerApiUrl = 'https://api.wordsolverx.workers.dev/sitemap.xml';

const emptySitemap =
	'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';

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
		if (xml.includes('<urlset') || xml.includes('<sitemapindex')) {
			cachedSitemapXml = xml;
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

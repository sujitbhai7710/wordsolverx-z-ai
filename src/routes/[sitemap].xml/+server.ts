import type { RequestEvent } from '@sveltejs/kit';

export async function GET({ params }: RequestEvent) {
    // The sitemap filename requested (e.g., 'sitemap-today', 'newssitemap')
    const paramDict = params as Record<string, string>;
    const sitemapName = paramDict.sitemap;

    // The Cloudflare Worker API URL that generates the sitemaps
    const workerApiUrl = `https://api.wordsolverx.workers.dev/${sitemapName}.xml`;

    try {
        // Fetch the sitemap XML from the worker
        const response = await fetch(workerApiUrl, {
            headers: {
                'User-Agent': 'WordSolverX-SvelteKit-Server'
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch sitemap ${sitemapName}.xml from worker: ${response.status}`);
            // Fallback empty sitemap if worker fails
            return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
                status: 404,
                headers: {
                    'Content-Type': 'application/xml'
                }
            });
        }

        // Get the XML text
        const xml = await response.text();

        // Return it with proper headers and caching (1 hour)
        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600',
                // Use s-maxage for CDN caching if deployed to Cloudflare Pages
                'CDN-Cache-Control': 'max-age=3600'
            }
        });
    } catch (error) {
        console.error(`Error proxying sitemap ${sitemapName}.xml:`, error);
        return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
            status: 500,
            headers: {
                'Content-Type': 'application/xml'
            }
        });
    }
}

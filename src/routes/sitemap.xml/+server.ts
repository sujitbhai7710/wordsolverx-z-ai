export async function GET() {
    const website = 'https://wordsolverx.com';

    const pages = [
        '',
        '/multidle',
        '/4-letter-wordle',
        '/5-letter-wordle',
        '/6-letter-wordle',
        '/7-letter-wordle',
        '/8-letter-wordle',
        '/9-letter-wordle',
        '/10-letter-wordle',
        '/11-letter-wordle',
        '/12-letter-wordle',
        '/create-custom-wordle',
        '/about',
        '/contact',
        '/privacy-policy',
        '/terms-of-service',
        // add other necessary pages or dynamically fetch them
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
            .map(
                (page) => `
    <url>
      <loc>${website}${page}</loc>
      <changefreq>daily</changefreq>
      <priority>${page === '' ? '1.0' : page.includes('-letter-wordle') ? '0.9' : '0.8'}</priority>
    </url>
  `
            )
            .join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}

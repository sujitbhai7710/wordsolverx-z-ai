import { TODAY_STATIC_ROUTES, EVERGREEN_STATIC_ROUTES, ARCHIVE_STATIC_ROUTES } from './src/lib/route-registry.js';

const API_KEY = 'AIzaSyCEm8D4dkg4FmfnGwR3sQInFlptk4RxcOI';
const BASE = 'https://wordsolverx-z-ai.pages.dev';
const all = [...new Set([...EVERGREEN_STATIC_ROUTES, ...TODAY_STATIC_ROUTES, ...ARCHIVE_STATIC_ROUTES])];

async function runPSI(url) {
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(BASE + url)}&strategy=mobile&category=performance&key=${API_KEY}`;
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(90000) });
    const data = await res.json();
    const lr = data.lighthouseResult;
    if (!lr) return { page: url, error: 'No lighthouse result' };
    const audits = lr.audits;
    const perf = lr.categories?.performance?.score;
    
    return {
      page: url,
      perfScore: perf ? Math.round(perf * 100) : 'N/A',
      LCP: audits['largest-contentful-paint']?.displayValue || 'N/A',
      FCP: audits['first-contentful-paint']?.displayValue || 'N/A',
      CLS: audits['cumulative-layout-shift']?.displayValue || 'N/A',
      TBT: audits['total-blocking-time']?.displayValue || 'N/A',
      SI: audits['speed-index']?.displayValue || 'N/A',
      renderBlocking: audits['render-blocking-resources']?.displayValue || 'N/A',
      unusedCSS: audits['unused-css-rules']?.displayValue || 'N/A',
      unusedJS: audits['unused-javascript']?.displayValue || 'N/A',
      textCompression: audits['uses-text-compression']?.displayValue || 'N/A',
      domSize: audits['dom-size']?.displayValue || 'N/A',
      totalBytes: audits['total-byte-weight']?.details?.summary?.bytes ? Math.round(audits['total-byte-weight'].details.summary.bytes/1024) + 'KB' : 'N/A',
      serverRes: audits['server-response-time']?.displayValue || 'N/A',
      bootupTime: audits['mainthread-work-breakdown']?.displayValue || 'N/A',
    };
  } catch(e) {
    return { page: url, error: e.message };
  }
}

const results = [];
const batchSize = 5;
for (let i = 0; i < all.length; i += batchSize) {
  const batch = all.slice(i, i + batchSize);
  const batchResults = await Promise.all(batch.map(runPSI));
  results.push(...batchResults);
  process.stderr.write(`Progress: ${Math.min(i + batchSize, all.length)}/${all.length}\n`);
}

process.stdout.write(JSON.stringify(results, null, 2));

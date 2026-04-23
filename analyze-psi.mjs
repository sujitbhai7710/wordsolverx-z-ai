import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DIR = 'c:\\Users\\akasa\\Projects\\websites\\wordsolverx\\wordsolverx-z-ai\\before-opti';
const files = readdirSync(DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));

const results = [];
for (const file of files) {
  try {
    const data = JSON.parse(readFileSync(join(DIR, file), 'utf8'));
    const lr = data.lighthouseResult;
    if (!lr) continue;
    const audits = lr.audits;
    const perf = lr.categories?.performance?.score;
    const page = file.replace('.json', '');
    results.push({
      page,
      perfScore: perf !== null && perf !== undefined ? Math.round(perf * 100) : null,
      LCP: audits['largest-contentful-paint']?.numericValue ?? null,
      FCP: audits['first-contentful-paint']?.numericValue ?? null,
      CLS: audits['cumulative-layout-shift']?.numericValue ?? null,
      TBT: audits['total-blocking-time']?.numericValue ?? null,
      SI: audits['speed-index']?.numericValue ?? null,
      renderBlockingItems: audits['render-blocking-resources']?.details?.items?.length ?? 0,
      renderBlockingWasted: audits['render-blocking-resources']?.numericValue ?? 0,
      unusedCSS: audits['unused-css-rules']?.numericValue ?? 0,
      unusedJS: audits['unused-javascript']?.numericValue ?? 0,
      domSize: audits['dom-size']?.numericValue ?? 0,
      totalBytes: audits['total-byte-weight']?.numericValue ?? 0,
      serverRes: audits['server-response-time']?.numericValue ?? 0,
      bootupTime: audits['mainthread-work-breakdown']?.numericValue ?? 0,
      // Opportunities
      preconnect: audits['uses-rel-preconnect']?.score ?? 1,
      textCompression: audits['uses-text-compression']?.score ?? 1,
      imageSize: audits['uses-responsive-images']?.numericValue ?? 0,
      offscreenImages: audits['offscreen-images']?.numericValue ?? 0,
      modernImg: audits['modern-image-formats']?.numericValue ?? 0,
      efficientCache: audits['uses-long-cache-ttl']?.score ?? 1,
    });
  } catch(e) {
    // skip malformed
  }
}

results.sort((a, b) => (a.perfScore ?? -1) - (b.perfScore ?? -1));

const summary = {
  totalPages: results.length,
  avgPerf: Math.round(results.reduce((s, r) => s + (r.perfScore ?? 0), 0) / results.filter(r => r.perfScore !== null).length),
  medianPerf: results[Math.floor(results.length / 2)]?.perfScore ?? null,
  lowest: results.slice(0, 10).map(r => ({ page: r.page, score: r.perfScore })),
  highest: results.slice(-10).map(r => ({ page: r.page, score: r.perfScore })),
  avgLCP: Math.round(results.reduce((s, r) => s + (r.LCP ?? 0), 0) / results.length),
  avgTBT: Math.round(results.reduce((s, r) => s + (r.TBT ?? 0), 0) / results.length),
  avgCLS: (results.reduce((s, r) => s + (r.CLS ?? 0), 0) / results.length).toFixed(4),
  avgTotalBytesKB: Math.round(results.reduce((s, r) => s + (r.totalBytes ?? 0), 0) / results.length / 1024),
  avgDOM: Math.round(results.reduce((s, r) => s + (r.domSize ?? 0), 0) / results.length),
  avgUnusedCSSKB: Math.round(results.reduce((s, r) => s + (r.unusedCSS ?? 0), 0) / results.length / 1024),
  avgUnusedJSKB: Math.round(results.reduce((s, r) => s + (r.unusedJS ?? 0), 0) / results.length / 1024),
  avgRenderBlockingItems: (results.reduce((s, r) => s + (r.renderBlockingItems ?? 0), 0) / results.length).toFixed(1),
  pagesWithLowPreconnect: results.filter(r => r.preconnect < 1).length,
  pagesWithNoTextCompression: results.filter(r => r.textCompression < 1).length,
  pagesWithCacheIssues: results.filter(r => r.efficientCache < 1).length,
};

writeFileSync(join(DIR, '_analysis.json'), JSON.stringify({ summary, details: results }, null, 2));
console.log(JSON.stringify(summary, null, 2));

import { TODAY_STATIC_ROUTES, EVERGREEN_STATIC_ROUTES, ARCHIVE_STATIC_ROUTES } from './src/lib/route-registry.js';
import { writeFileSync, readFileSync, existsSync } from 'fs';

const API_KEY = 'AIzaSyCEm8D4dkg4FmfnGwR3sQInFlptk4RxcOI';
const BASE = 'https://wordsolverx-z-ai.pages.dev';
const all = [...new Set([...EVERGREEN_STATIC_ROUTES, ...TODAY_STATIC_ROUTES, ...ARCHIVE_STATIC_ROUTES])];

// Load existing results
let existing = [];
if (existsSync('/tmp/psi-results.json')) {
  try { existing = JSON.parse(readFileSync('/tmp/psi-results.json','utf8')); } catch(e) {}
}
const done = new Set(existing.map(r => r.page));

async function runPSI(url) {
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(BASE + url)}&strategy=mobile&category=performance&key=${API_KEY}`;
  const res = await fetch(endpoint, { signal: AbortSignal.timeout(120000) });
  const data = await res.json();
  const lr = data.lighthouseResult;
  if (!lr) return { page: url, error: 'No lighthouse result' };
  const audits = lr.audits;
  const perf = lr.categories?.performance?.score;
  return {
    page: url, perfScore: perf ? Math.round(perf * 100) : 'N/A',
    LCP: audits['largest-contentful-paint']?.displayValue || 'N/A',
    FCP: audits['first-contentful-paint']?.displayValue || 'N/A',
    CLS: audits['cumulative-layout-shift']?.displayValue || 'N/A',
    TBT: audits['total-blocking-time']?.displayValue || 'N/A',
    SI: audits['speed-index']?.displayValue || 'N/A',
    renderBlocking: audits['render-blocking-resources']?.displayValue || 'N/A',
    unusedCSS: audits['unused-css-rules']?.displayValue || 'N/A',
    unusedJS: audits['unused-javascript']?.displayValue || 'N/A',
    totalBytes: audits['total-byte-weight']?.details?.summary?.bytes ? Math.round(audits['total-byte-weight'].details.summary.bytes/1024) + 'KB' : 'N/A',
  };
}

const remaining = all.filter(p => !done.has(p));
const batchSize = 3;
for (let i = 0; i < remaining.length; i += batchSize) {
  const batch = remaining.slice(i, i + batchSize);
  const batchResults = await Promise.all(batch.map(runPSI));
  existing.push(...batchResults);
  writeFileSync('/tmp/psi-results.json', JSON.stringify(existing, null, 2));
  process.stderr.write(`${existing.length}/${all.length}\n`);
}

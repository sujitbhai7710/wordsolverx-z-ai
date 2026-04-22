import { readFileSync } from 'fs';
const BASE = 'https://wordsolverx-z-ai.pages.dev';
const pages = JSON.parse(readFileSync('/tmp/all-pages.json','utf8'));

const results = [];
const batchSize = 5;
for (let i = 0; i < pages.length; i += batchSize) {
  const batch = pages.slice(i, i + batchSize);
  const batchResults = await Promise.all(batch.map(async (url) => {
    try {
      const res = await fetch(BASE + url, { signal: AbortSignal.timeout(15000), redirect: 'follow' });
      const status = res.status;
      const ok = status >= 200 && status < 400;
      const finalUrl = res.url;
      const isRedirect = finalUrl !== (BASE + url);
      return { page: url, status, ok, redirect: isRedirect ? finalUrl.replace(BASE, '') : null };
    } catch(e) {
      return { page: url, status: 'ERROR', ok: false, error: e.message };
    }
  }));
  results.push(...batchResults);
  process.stderr.write(`${results.length}/${pages.length}\n`);
}

const failed = results.filter(r => !r.ok);
const passed = results.filter(r => r.ok);
const redirects = results.filter(r => r.redirect);

console.log(JSON.stringify({ total: results.length, passed: passed.length, failed: failed.length, failures: failed, redirects }, null, 2));

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const AFTER_DIR = 'c:\\Users\\akasa\\Projects\\websites\\wordsolverx\\wordsolverx-z-ai\\after-opti';
const BEFORE_DIR = 'c:\\Users\\akasa\\Projects\\websites\\wordsolverx\\wordsolverx-z-ai\\before-opti';

function inspect(dir, file) {
  try {
    const data = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    const lr = data.lighthouseResult;
    if (!lr) return null;
    const a = lr.audits;
    const perf = lr.categories?.performance?.score;
    const page = file.replace('-mobile.json', '').replace('-desktop.json', '').replace('.json', '');
    const strategy = file.includes('-desktop') ? 'desktop' : 'mobile';
    return {
      page,
      strategy,
      score: perf !== null ? Math.round(perf * 100) : null,
      LCP: a['largest-contentful-paint']?.numericValue ?? null,
      FCP: a['first-contentful-paint']?.numericValue ?? null,
      TBT: a['total-blocking-time']?.numericValue ?? null,
      CLS: a['cumulative-layout-shift']?.numericValue ?? null,
      SI: a['speed-index']?.numericValue ?? null,
      totalBytes: a['total-byte-weight']?.numericValue ?? null,
      bootup: a['mainthread-work-breakdown']?.numericValue ?? null,
    };
  } catch (e) { return null; }
}

const afterFiles = readdirSync(AFTER_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
const afterResults = afterFiles.map(f => inspect(AFTER_DIR, f)).filter(Boolean);

const beforeFiles = readdirSync(BEFORE_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
const beforeResults = beforeFiles.map(f => inspect(BEFORE_DIR, f)).filter(Boolean);

const beforeMap = new Map();
for (const r of beforeResults) {
  beforeMap.set(`${r.page}-${r.strategy}`, r);
}

const mobileAfter = afterResults.filter(r => r.strategy === 'mobile');
const desktopAfter = afterResults.filter(r => r.strategy === 'desktop');

const avg = (arr) => arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;

const mobileScores = mobileAfter.map(r => r.score).filter(Boolean);
const desktopScores = desktopAfter.map(r => r.score).filter(Boolean);

const report = {
  summary: {
    totalPagesScanned: new Set(afterResults.map(r => r.page)).size,
    mobileTests: mobileAfter.length,
    desktopTests: desktopAfter.length,
    mobileAvg: avg(mobileScores),
    desktopAvg: avg(desktopScores),
    mobileMedian: mobileScores.sort((a, b) => a - b)[Math.floor(mobileScores.length / 2)],
    desktopMedian: desktopScores.sort((a, b) => a - b)[Math.floor(desktopScores.length / 2)],
    mobile90plus: mobileAfter.filter(r => r.score >= 90).length,
    desktop90plus: desktopAfter.filter(r => r.score >= 90).length,
    mobileBelow70: mobileAfter.filter(r => r.score && r.score < 70).length,
    desktopBelow70: desktopAfter.filter(r => r.score && r.score < 70).length,
  },
  worstMobile: mobileAfter.filter(r => r.score).sort((a, b) => a.score - b.score).slice(0, 15).map(r => ({
    page: r.page, score: r.score, LCP: Math.round(r.LCP), TBT: r.TBT, bytes: r.totalBytes ? Math.round(r.totalBytes / 1024) : null
  })),
  worstDesktop: desktopAfter.filter(r => r.score).sort((a, b) => a.score - b.score).slice(0, 15).map(r => ({
    page: r.page, score: r.score, LCP: Math.round(r.LCP), TBT: r.TBT, bytes: r.totalBytes ? Math.round(r.totalBytes / 1024) : null
  })),
  bestMobile: mobileAfter.filter(r => r.score).sort((a, b) => b.score - a.score).slice(0, 10).map(r => ({ page: r.page, score: r.score })),
  bestDesktop: desktopAfter.filter(r => r.score).sort((a, b) => b.score - a.score).slice(0, 10).map(r => ({ page: r.page, score: r.score })),
};

// Comparison with before (mobile only, since before was mobile-only)
const comparisons = [];
for (const a of mobileAfter) {
  const b = beforeMap.get(`${a.page}-mobile`) || beforeMap.get(a.page);
  if (b && b.score && a.score) {
    comparisons.push({
      page: a.page,
      before: b.score,
      after: a.score,
      delta: a.score - b.score,
      beforeLCP: Math.round(b.LCP),
      afterLCP: Math.round(a.LCP),
      beforeTBT: b.TBT,
      afterTBT: a.TBT,
    });
  }
}
comparisons.sort((a, b) => b.delta - a.delta);
report.comparisons = {
  improved: comparisons.filter(c => c.delta > 0).length,
  worsened: comparisons.filter(c => c.delta < 0).length,
  unchanged: comparisons.filter(c => c.delta === 0).length,
  topImprovements: comparisons.slice(0, 15),
  topRegressions: comparisons.filter(c => c.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 10),
  avgDelta: comparisons.length ? Math.round(comparisons.reduce((s, c) => s + c.delta, 0) / comparisons.length) : 0,
};

writeFileSync(join(AFTER_DIR, '_report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
console.log('\n=== Top Improvements ===');
console.log(JSON.stringify(report.comparisons.topImprovements.slice(0, 10), null, 2));
console.log('\n=== Top Regressions ===');
console.log(JSON.stringify(report.comparisons.topRegressions, null, 2));

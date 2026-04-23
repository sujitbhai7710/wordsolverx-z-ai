import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DIR = 'c:\\Users\\akasa\\Projects\\websites\\wordsolverx\\wordsolverx-z-ai\\before-opti';
const files = readdirSync(DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));

function inspect(file) {
  const data = JSON.parse(readFileSync(join(DIR, file), 'utf8'));
  const lr = data.lighthouseResult;
  if (!lr) return null;
  const a = lr.audits;
  const page = file.replace('.json', '');
  const perf = lr.categories?.performance?.score;
  
  const jsDetails = a['unused-javascript']?.details?.items || [];
  const cssDetails = a['unused-css-rules']?.details?.items || [];
  const renderBlock = a['render-blocking-resources']?.details?.items || [];
  const mainthread = a['mainthread-work-breakdown']?.details?.items || [];
  const longTasks = a['long-tasks']?.details?.items || [];
  const networkReqs = a['network-requests']?.details?.items || [];
  
  return {
    page,
    score: perf !== null ? Math.round(perf * 100) : null,
    LCP: a['largest-contentful-paint']?.numericValue,
    FCP: a['first-contentful-paint']?.numericValue,
    TBT: a['total-blocking-time']?.numericValue,
    CLS: a['cumulative-layout-shift']?.numericValue,
    SI: a['speed-index']?.numericValue,
    totalBytesKB: Math.round((a['total-byte-weight']?.numericValue || 0) / 1024),
    domSize: a['dom-size']?.numericValue,
    serverRes: a['server-response-time']?.numericValue,
    bootupMs: mainthread.reduce((s, i) => s + (i.duration || 0), 0),
    scriptEvalMs: mainthread.filter(i => i.group === 'scriptEvaluation').reduce((s, i) => s + (i.duration || 0), 0),
    longTaskCount: longTasks.length,
    networkReqCount: networkReqs.length,
    renderBlockingCount: renderBlock.length,
    renderBlockingWastedMs: a['render-blocking-resources']?.numericValue || 0,
    unusedJSKB: Math.round(jsDetails.reduce((s, i) => s + (i.wastedBytes || 0), 0) / 1024),
    unusedCSSKB: Math.round(cssDetails.reduce((s, i) => s + (i.wastedBytes || 0), 0) / 1024),
    topUnusedJS: jsDetails.slice(0, 3).map(i => ({ url: i.url?.split('/').pop() || i.url, wastedKB: Math.round((i.wastedBytes || 0) / 1024) })),
    topUnusedCSS: cssDetails.slice(0, 3).map(i => ({ url: i.url?.split('/').pop() || i.url, wastedKB: Math.round((i.wastedBytes || 0) / 1024) })),
    topRenderBlock: renderBlock.slice(0, 5).map(i => i.url?.split('/').pop() || i.url),
    imageSizeKB: Math.round((a['uses-responsive-images']?.numericValue || 0) / 1024),
    offscreenImagesKB: Math.round((a['offscreen-images']?.numericValue || 0) / 1024),
    modernImgKB: Math.round((a['modern-image-formats']?.numericValue || 0) / 1024),
  };
}

const all = [];
for (const file of files) {
  const r = inspect(file);
  if (r) all.push(r);
}

all.sort((a, b) => (a.score ?? 999) - (b.score ?? 999));

const worst10 = all.slice(0, 10);
const best10 = all.slice(-10);

// Aggregates
const avg = (arr) => Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
const avgF = (arr) => (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(2);

const agg = {
  total: all.length,
  avgScore: avg(all.map(r => r.score)),
  avgLCP: avg(all.map(r => r.LCP)),
  avgFCP: avg(all.map(r => r.FCP)),
  avgTBT: avg(all.map(r => r.TBT)),
  avgCLS: avgF(all.map(r => r.CLS)),
  avgSI: avg(all.map(r => r.SI)),
  avgTotalBytesKB: avg(all.map(r => r.totalBytesKB)),
  avgDomSize: avg(all.map(r => r.domSize)),
  avgBootupMs: avg(all.map(r => r.bootupMs)),
  avgScriptEvalMs: avg(all.map(r => r.scriptEvalMs)),
  avgLongTasks: avgF(all.map(r => r.longTaskCount)),
  avgNetworkReqs: avgF(all.map(r => r.networkReqCount)),
  avgUnusedJSKB: avg(all.map(r => r.unusedJSKB)),
  avgUnusedCSSKB: avg(all.map(r => r.unusedCSSKB)),
  avgRenderBlockCount: avgF(all.map(r => r.renderBlockingCount)),
  avgImageSizeKB: avg(all.map(r => r.imageSizeKB)),
  avgOffscreenKB: avg(all.map(r => r.offscreenImagesKB)),
  avgModernImgKB: avg(all.map(r => r.modernImgKB)),
};

const report = {
  aggregate: agg,
  worst10: worst10.map(r => ({
    page: r.page, score: r.score, LCP: Math.round(r.LCP), TBT: r.TBT, totalBytesKB: r.totalBytesKB,
    bootupMs: Math.round(r.bootupMs), scriptEvalMs: Math.round(r.scriptEvalMs), longTasks: r.longTaskCount,
    unusedJSKB: r.unusedJSKB, unusedCSSKB: r.unusedCSSKB, renderBlockCount: r.renderBlockingCount,
    topUnusedJS: r.topUnusedJS, topRenderBlock: r.topRenderBlock,
    imageSizeKB: r.imageSizeKB, offscreenKB: r.offscreenImagesKB, modernImgKB: r.modernImgKB
  })),
  best10: best10.map(r => ({ page: r.page, score: r.score, LCP: Math.round(r.LCP), TBT: r.TBT, totalBytesKB: r.totalBytesKB })),
  commonIssues: {
    pagesWithHighTBT: all.filter(r => r.TBT > 600).length,
    pagesWithHighLCP: all.filter(r => r.LCP > 4000).length,
    pagesWithHighBytes: all.filter(r => r.totalBytesKB > 600).length,
    pagesWithHighBootup: all.filter(r => r.bootupMs > 3000).length,
    pagesWithUnusedJS: all.filter(r => r.unusedJSKB > 10).length,
    pagesWithUnusedCSS: all.filter(r => r.unusedCSSKB > 10).length,
    pagesWithRenderBlocking: all.filter(r => r.renderBlockingCount > 0).length,
    pagesWithLongTasks: all.filter(r => r.longTaskCount > 0).length,
    pagesWithImageIssues: all.filter(r => r.imageSizeKB > 10 || r.offscreenImagesKB > 10).length,
  }
};

console.log(JSON.stringify(report, null, 2));

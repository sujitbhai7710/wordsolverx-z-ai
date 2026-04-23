# WordSolverX Performance Optimization Plan

> **Goal:** Achieve 90+ Google PageSpeed Insights (mobile) across all ~100 pages.  
> **Baseline:** 101 pages tested on 2026-04-23. Full JSON results saved in `before-opti/`.

---

## 1. Current State (Data from PSI API)

| Metric | Average | Median | Worst | Best |
|--------|---------|--------|-------|------|
| **Performance Score** | 86 | 89 | 47 (squaredle-solver) | 94 (about, colorfle-solver, etc.) |
| **LCP** | 3.0 s | — | 7.9 s (squaredle-solver) | 2.4 s (soundmap-solver) |
| **TBT** | 300 ms | — | 10,020 ms (3-letter-wordle-solver) | 43 ms (colordle-archive) |
| **CLS** | 0.02 | — | 0.097 (3-letter-wordle-solver) | 0 (many pages) |
| **Total Bytes** | 418 KB | — | 1,409 KB (squaredle-solver) | 209 KB (about) |
| **Script Eval** | 705 ms | — | 32,162 ms (3-letter-wordle-solver) | ~200 ms (best pages) |

### Score Distribution
- **Below 70** (needs urgent fix): 7 pages
- **70–79**: 10 pages
- **80–89**: 33 pages
- **90+** (target): 51 pages

---

## 2. Root Cause Analysis

### 2.1 Main-Thread JavaScript Blocking (Affects ALL pages, critical on solvers)
- **101/101 pages** have Long Tasks during load.
- **8 pages** have TBT > 600 ms.
- **3-letter-wordle-solver** spends **32.5 s** on main-thread work, **32.1 s** of that is Script Evaluation.
- **squaredle-solver** spends **4.0 s** on main-thread work, **2.9 s** Script Evaluation.
- **phoodle-archive** has **15 Long Tasks** despite a small payload (333 KB).

**Diagnosis:** Heavy WASM/dictionary initialization and solver logic runs on the main thread during page startup. On interactive solver routes this blocks the browser for seconds, destroying TBT and delaying LCP.

### 2.2 Large LCP on Select Pages (14 pages > 4 s)
| Page | LCP | Likely Cause |
|------|-----|--------------|
| squaredle-solver | 7.9 s | 1.4 MB payload + 2.9 s script eval blocks rendering |
| canuckle-solver | 6.2 s | 926 KB payload + heavy JS |
| canuckle | 5.3 s | 781 KB payload + large inline content |
| canuckle-archive | 4.9 s | 794 KB payload |
| contexto-answer-today | 2.6 s LCP but 4.4 s bootup | Inline data + scripts |

**Diagnosis:** LCP is delayed because the main thread is saturated with JS execution and/or the HTML document itself is very large (inline data arrays, Schema.org JSON-LD, generated article content). The browser cannot paint the largest contentful element until the thread is free.

### 2.3 Unused Google Analytics JS (Cosmetic audit hit)
- **101/101 pages** show ~63 KB of "unused JavaScript" — this is the deferred `gtag` loader.
- It is **already deferred** via `requestIdleCallback`, so it does not actually block interactivity, but Lighthouse still counts it in the byte-weight audit.
- **Impact on score:** Minimal (~1–2 pts), but fixing it removes a consistent red flag.

### 2.4 No CSS or Image Issues
- Unused CSS: 0 KB average (Tailwind purge is working).
- Render-blocking resources: 0 average (no critical CSS blocking found).
- Image size / offscreen / modern format opportunities: 0 KB average.
- Text compression & cache TTL: passing on all pages.

### 2.5 Gap Analysis vs. BUILD_OPTIMIZATION.md
`BUILD_OPTIMIZATION.md` describes several optimizations that are **planned but not currently implemented** in the codebase:

| Claimed in BUILD_OPTIMIZATION.md | Actually Implemented? | Evidence |
|-----------------------------------|----------------------|----------|
| Manual chunks (`vendor-svelte`, `vendor`, `dictionary-{N}`) | **NO** | `vite.config.ts` has zero `manualChunks` config |
| Terser minification | **NO** | `vite.config.ts` uses `esbuild` minify |
| Critical CSS extraction (`src/lib/utils/critical-css.ts`) | **NO** | File does not exist |
| Image optimization plugin (`src/lib/build/vite-plugin-image-optimization.ts`) | **NO** | `src/lib/build/` directory does not exist |
| Font optimization / subsetting (`src/lib/build/font-optimization.ts`) | **NO** | File does not exist |
| cssnano in PostCSS | **NO** | `postcss.config.js` only has Tailwind + autoprefixer |
| Service worker generation | **NO** | No SW config found |
| Performance budgets (`src/lib/config/asset-optimization.ts`) | **NO** | File does not exist |
| `PerformanceMonitor` (RUM) | **YES** | `src/lib/utils/performance.ts` exists and is functional |
| Tailwind purge | **YES** | Unused CSS audit shows 0 KB wasted |
| Immutable cache headers | **YES** | `_headers` file configured correctly |
| GA deferral (`requestIdleCallback`) | **YES** | Implemented in `app.html` |

**Lesson:** The BUILD doc is aspirational. My plan below is based on **real PSI data** and only recommends changes that will actually move the needle.

---

## 3. Optimization Roadmap

### P0 — Must Do (Expected gain: +5 to +15 pts on worst pages)

#### P0.1 Defer or Offload Solver Initialization
**Problem:** Interactive solver pages initialize WASM / dictionaries / game state on the main thread immediately on load.  
**Solution:**
1. In solver route components (`+page.svelte`), **do not instantiate the solver engine in `$effect.pre` or top-level script**.
2. Use **`requestIdleCallback`** (or `setTimeout(..., 0)` fallback) to delay heavy initialization until after the first paint.
3. For WASM modules, investigate loading them in a **Web Worker** so the dictionary crunching happens off the main thread. SvelteKit’s `+page.ts` can return a lightweight promise; the component shows a skeleton until the worker responds.
4. Add a **loading skeleton UI** for solver grids so users see instant feedback while the engine initializes in the background.

**Expected impact:**
- 3-letter-wordle-solver: TBT drops from 10,020 ms → <500 ms, score up ~25 pts.
- squaredle-solver: TBT drops from 1,118 ms → <200 ms, LCP improves from 7.9 s → ~3 s.

#### P0.2 Reduce Inline Data Payload on Content Pages
**Problem:** Today-answer and archive pages embed massive JSON blobs (wordle history, article HTML, FAQ Schema) directly inside the HTML `<script>` tag. This inflates document size and parsing time.  
**Solution:**
1. In `+page.ts` loaders, instead of embedding full history arrays in `data`, return only the **minimum required for above-the-fold content**.
2. Load the full history table / article content via a **separate static `.json` fetch** after the page becomes interactive (`requestIdleCallback`).
3. For Schema.org JSON-LD, keep only the critical `WebPage` schema in the HTML; move `FAQPage` and `Article` generation to a deferred fetch or prune to the first 3 FAQ entries.

**Expected impact:**
- canuckle-archive: Total bytes drop from 794 KB → ~400 KB, LCP improves ~1 s.
- phoodle-archive: Bootup drops from 5.9 s → ~1.5 s.

#### P0.3 Fix CLS on 3-letter-wordle-solver
**Problem:** CLS = 0.097 on this page (the worst).  
**Solution:**
1. Audit the solver grid / keyboard components for **layout shifts** during hydration.
2. Ensure tile containers have **fixed `aspect-ratio` or explicit `width/height`** before JS hydrates.
3. Reserve space for any dynamically injected content (hints, banners) with `min-height`.

**Expected impact:** CLS drops to <0.05, recovering ~3–5 score points.

---

### P1 — Should Do (Expected gain: +2 to +5 pts site-wide)

#### P1.1 Limit Module Preloads to Critical Chunks
**Problem:** The build injects ~20 `<link rel="modulepreload">` tags for every page, including content pages that only need a small subset. This consumes bandwidth and parser time.  
**Solution:**
1. In `svelte.config.js` or via a Vite plugin, **restrict module preloads** to:
   - `start.js` (router)
   - `app.js` (framework)
   - The **route-specific entry chunk** only
2. Remove preloads for vendor chunks that are not needed for the initial render (e.g., solver-specific vendors on `/about`).

**Expected impact:** FCP improves ~100–200 ms on content pages; ~1–2 score points.

#### P1.2 Split Route-Specific Chunks More Aggressively
**Problem:** `vite.config.ts` currently uses default SvelteKit splitting. Heavy solver code bleeds into shared chunks.  
**Solution:**
Add manual chunks in `vite.config.ts`:
```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'solver-core': ['./src/lib/wordlebot-wasm/*', './src/lib/solver-logic'],
        'content': ['./src/lib/daily-article-content', './src/lib/archive-data'],
      }
    }
  }
}
```
Ensure content pages never download `solver-core`.

**Expected impact:** Content pages lose ~50–150 KB of unused JS; TBT drops.

#### P1.3 Self-Host or Further Optimize Google Fonts
**Problem:** `fonts.googleapis.com` is an external render-blocking request chain (DNS + CSS + font files).  
**Solution:**
1. **Self-host** Plus Jakarta Sans WOFF2 files in `static/fonts/` and preload only the weights used (400, 600, 700).
2. Alternatively, keep the Google Fonts URL but add `&display=swap` (already present) and ensure the `preconnect` + `preload` links are correct. The current setup is decent; self-hosting is the next level.

**Expected impact:** FCP/LCP improves ~50–100 ms; ~1 score point.

#### P1.4 Prune / Defer Google Analytics Loading
**Problem:** 63 KB of "unused JavaScript" is flagged on every page.  
**Solution:**
1. The current `requestIdleCallback` deferral is good. To remove the audit entirely, load GA **only after first user interaction** (scroll, click, or 5 s timeout).
2. Or, move the GA snippet to a dynamically injected script that runs after `window.load`.

**Expected impact:** Cleaner audits; ~1 score point.

---

### P2 — Nice to Have (Expected gain: +1 to +3 pts)

#### P2.1 Add `loading="lazy"` to Below-Fold Images
Even though current image audits show 0 opportunities, verify that all non-hero images (author avatars, social cards, archive table images) have explicit `loading="lazy"`. Some may be injected via `{@html}` blocks without the attribute.

#### P2.2 Pre-compress Assets (Brotli/Gzip)
Cloudflare Pages does this automatically, but verify `_headers` ensures immutable assets get `max-age=31536000`. Already configured — just confirm in build output.

#### P2.3 Reduce DOM Size on Archive Pages
Archive pages likely have very large tables. Use virtual scrolling or pagination for tables > 50 rows if DOM size becomes an issue (currently `dom-size` audit returns null, so not critical yet).

---

## 4. Page-Specific Quick Wins

| Page | Score | Quick Fix |
|------|-------|-----------|
| **squaredle-solver** | 47 | Defer WASM init; reduce payload |
| **3-letter-wordle-solver** | 61 | Defer dictionary load; fix CLS |
| **phoodle-archive** | 63 | Defer full history table; lazy-load content |
| **canuckle-solver** | 65 | Split solver chunk; defer init |
| **hangman-solver** | 67 | Same as above |
| **canuckle-archive** | 70 | Prune inline JSON; defer below-fold data |
| **canuckle** | 70 | Same as above |
| **contexto-answer-today** | 71 | Defer article content load |
| **narutodle-solver** | 71 | Defer solver init |

---

## 5. Implementation Priority Summary

1. **P0.1** — Defer solver/WASM initialization (biggest impact, affects all solver routes).
2. **P0.2** — Reduce inline data on content/archive pages (biggest impact on LCP).
3. **P0.3** — Fix CLS on 3-letter-wordle-solver.
4. **P1.1** — Limit module preloads to critical chunks.
5. **P1.2** — Add route-based manual chunks in Vite.
6. **P1.3** — Self-host fonts or optimize loading.
7. **P1.4** — Further defer GA until interaction.
8. **P2.x** — Polish: lazy images, DOM size, compression verification.

---

## 6. Additional Good Practices from BUILD_OPTIMIZATION.md

The existing `BUILD_OPTIMIZATION.md` document contains several **aspirational but solid architectural ideas** that should be kept on the backlog. Since they are not yet implemented, they are listed here as **P3 (future architecture)** rather than immediate fixes.

### P3.1 Critical CSS Extraction
- **What it is:** Identify above-the-fold CSS selectors (`.game-board`, `.game-tile`, `.keyboard`) and inline them in `<head>`; load the rest asynchronously.
- **Why it matters:** Could shave 200–400 ms off FCP on solver pages.
- **Implementation:** Create `src/lib/utils/critical-css.ts`, run it at build time, inject into `app.html`.

### P3.2 Image Optimization Pipeline
- **What it is:** A Vite plugin that converts images to WebP, generates responsive `srcset`, and lazy-loads below-fold images.
- **Why it matters:** Currently image audits pass, but as more hero images are added this will become critical.
- **Implementation:** Integrate `vite-imagetools` or `vite-plugin-image-optimizer`.

### P3.3 Service Worker for Offline Support
- **What it is:** A Workbox-based SW that precaches immutable assets and serves stale-while-revalidate for content.
- **Why it matters:** Improves repeat-visit performance and resilience on poor networks.
- **Implementation:** Add `@vite-pwa/sveltekit` or a custom Workbox config.

### P3.4 Self-Hosted & Subset Fonts
- **What it is:** Download Plus Jakarta Sans WOFF2, subset to Basic Latin (`U+0020-007F`), and preload only weights 400/600/700.
- **Why it matters:** Eliminates external DNS + CSS request to Google Fonts; reduces font file size by 60–80%.
- **Implementation:** Use `glyphhanger` or Google Fonts API subsetting, place files in `static/fonts/`.

### P3.5 Performance Budgets & CI Gates
- **What it is:** Enforce maximum bundle sizes and metric thresholds in CI so regressions are caught before deploy.
- **Suggested budgets:**
  - Initial JS: < 150 KB
  - Initial CSS: < 50 KB
  - Total initial: < 500 KB
  - LCP: < 2500 ms (warning), < 3000 ms (error)
  - CLS: < 0.1
  - TBT: < 200 ms

### P3.6 Continuous Monitoring
- Leverage the **existing** `PerformanceMonitor` (`src/lib/utils/performance.ts`) to log real-user metrics (LCP, CLS, INP) to GA.
- Add a weekly PSI re-run (reuse `run-psi-benchmark.mjs`) to track score trends.

---

## 7. Expected Final Outcome

- **Worst pages** (currently 47–65) → **75–85+** after P0.
- **Mid-range pages** (currently 70–85) → **85–92+** after P0 + P1.
- **Best pages** (currently 93–94) → **95+** after P1 + P2.
- **Site average** → **90+** once all P0 and P1 items are implemented.

All changes are **non-destructive to UI/UX** — they involve deferring work, splitting bundles, and adding skeleton states rather than removing features or altering design.

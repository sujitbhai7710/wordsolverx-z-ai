# Remaining Work Plan — WordSolverX AI Content Removal

> This file lists everything that still needs to be done after the first batch of fixes. Give this file to a fresh AI agent with the project open to continue.

> **Project**: `wordsolverx-z-ai`
> **Framework**: SvelteKit (Svelte 5)
> **Human Writing Skill**: `.opencode/human-wiriting/SKILL.md` — read this before writing any content
> **Original Plan**: `contentplan (1).md` — contains full context and banned phrase lists

---

## What's Already Done (DO NOT REDO)

- [x] **C-1**: Overhaul article generation prompts in `scripts/generate-daily-articles.mjs` (banned phrases, per-game instructions, temperature variation, section templates, validation)
- [x] **C-1G**: Changed eyebrow default from "Daily article" to "Today's notes" in `GeneratedTodayArticle.svelte`
- [x] **C-2**: Rewrote all 6 GameDle answer pages (loldle, dotadle, narutodle, onepiecedle, pokedle, smashdle) — cut from ~2200 to 800-1000 words each
- [x] **C-3**: Rewrote `src/lib/game-dle/seo-content.ts` — all howToPlay steps, strategies, FAQs, and introduction paragraph 3s for all 6 games
- [x] **C-4**: Removed developer-speak and AI disclosure from 17 locations across answer-today pages
- [x] **C-5**: Replaced AI-sounding hero/intro text on 17 answer-today pages
- [x] **C-6**: Replaced 2 AI-sounding lines in `GameSEOContent.svelte`
- [x] **C-7**: Rewrote archive page intro paragraphs on all 16 archive pages

---

## Remaining Fixes

### FIX C-8: Rewrite Massive AI Article Sections on Answer-Today Pages

**Severity**: HIGH — These pages have 200-400 lines of AI-generated article text each

**What to do**: For each file listed below, find the long `seoContent`, `articleContent`, or inline article sections (usually 200-400 lines of HTML/Svelte). Cut each to **400-600 words max**. Keep only:
1. Short game explanation (2-3 sentences, not 5 paragraphs)
2. 3-4 genuinely useful tips (not 6 generic strategy cards)
3. FAQ with 3-4 questions (not 6)

**Rules when rewriting:**
- No "Whether you are X or Y" openings
- No "resonates with" or "cultural touchstone"
- No franchise history paragraphs
- No "Why fans love" sections
- No "vs Similar Games" comparison cards
- Each page must sound different — not the same template with name swaps
- Write like you play this game daily and are sharing quick notes
- Read `.opencode/human-wiriting/SKILL.md` before writing

**Files to modify** (all in `src/routes/(interactive)/`):

1. `nerdle-answer-today/+page.svelte`
2. `quordle-answer-today/+page.svelte`
3. `worldle-answer-today/+page.svelte`
4. `contexto-answer-today/+page.svelte`
5. `semantle-answer-today/+page.svelte`
6. `framed-answer-today/+page.svelte`
7. `spotle-answer-today/+page.svelte`
8. `betweenle-answer-today/+page.svelte`
9. `phoodle-answer-today/+page.svelte`
10. `phrazle-answer-today/+page.svelte`
11. `colorfle-answer-today/+page.svelte`
12. `countryle-answer-today/+page.svelte`
13. `globle-answer-today/+page.svelte`
14. `colordle-answer-today/+page.svelte`
15. `waffle-answer-today/+page.svelte` (if it exists in interactive)
16. `worgle-answer-today/+page.svelte`

**Approach**: Read each file, find the massive article section (look for `seoContent`, `articleContent`, or large HTML blocks with "What is [Game]?", "How [Game] Works", "Strategy Tips", FAQ sections). Replace with a compact 400-600 word version.

---

### FIX C-9: Add AuthorCard to Pages Missing E-E-A-T Signals

**Current state**: Only `wordle-answer-today` and `GameDleAnswerPage` include `AuthorCard`. Most other pages lack E-E-A-T signals.

**Implementation for each page** — add these imports and component at the bottom before closing `</main>` or `</article>`:

```svelte
import AuthorCard from '$lib/components/AuthorCard.svelte';
import { PRESTON_HAYES_AUTHOR_NAME, PRESTON_HAYES_AUTHOR_IMAGE, PRESTON_HAYES_AUTHOR_DESCRIPTION } from '$lib/authors';

<!-- Add before closing </main> or </article> -->
<AuthorCard
  name={PRESTON_HAYES_AUTHOR_NAME}
  image={PRESTON_HAYES_AUTHOR_IMAGE}
  description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
/>
```

**Pages that need AuthorCard added**:

#### Standalone answer-today pages (in `src/routes/(interactive)/`):
1. `nerdle-answer-today/+page.svelte`
2. `quordle-answer-today/+page.svelte`
3. `phoodle-answer-today/+page.svelte`
4. `colordle-answer-today/+page.svelte`
5. `worldle-answer-today/+page.svelte`
6. `globle-answer-today/+page.svelte`
7. `contexto-answer-today/+page.svelte`
8. `semantle-answer-today/+page.svelte`
9. `searchle-answer-today/+page.svelte`
10. `phrazle-answer-today/+page.svelte`
11. `spotle-answer-today/+page.svelte`
12. `waffle-answer-today/+page.svelte` (check location)
13. `betweenle-answer-today/+page.svelte`
14. `canuckle-answer-today/+page.svelte`
15. `colorfle-answer-today/+page.svelte`
16. `countryle-answer-today/+page.svelte`
17. `framed-answer-today/+page.svelte`
18. `worgle-answer-today/+page.svelte`

#### Archive pages (check exact paths — likely in `src/routes/(content)/` or `src/routes/(interactive)/`):
All 18 archive pages need AuthorCard added.

#### Solver pages:
All solver pages need AuthorCard added. Check paths in `src/routes/`.

**Also fix**: Some pages (framed, colorfle, countryle) may have hardcoded author text instead of using the constants. Replace any hardcoded author text with the imported constants.

---

### FIX C-10: Improve Author Bio for E-E-A-T

**File**: `src/lib/authors.ts`

**Current**: Generic bio like "Word game enthusiast who has been solving daily puzzles since Wordle's launch in 2021."

**Target**:
```
"Preston Hayes has been solving and analyzing daily word puzzles since Wordle launched in October 2021.
He maintains a daily solving streak across Wordle, Quordle, and Nerdle, and has written over 500 daily puzzle
guides. His approach focuses on statistical letter frequency and strategic elimination rather than guessing —
the same logic that powers the solvers on this site."
```

This adds:
- **Experience**: "solving since October 2021", "daily streak", "500+ guides"
- **Expertise**: "statistical letter frequency and strategic elimination"
- **Authoritativeness**: "powers the solvers on this site"
- **Trustworthiness**: Specific, verifiable claims

---

### FIX C-13: Fix Wordle-Answer-Today Article Display

**Issue**: The `wordle-answer-today` page uses `WordleDisplayWrapper` which receives `bonusHints` from the generated article but does NOT render the full `articleHtml` content. The daily article is being fetched but not fully displayed.

**File**: `src/routes/(interactive)/wordle-answer-today/+page.svelte`

**Fix**: Add the generated article HTML display after the `WordleDisplayWrapper`:
```svelte
{#if data.generatedArticle?.articleHtml}
  <section class="mt-12 rounded-3xl border border-slate-100 bg-white p-8 shadow-lg">
    <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">Today's notes</p>
    <h2 class="mt-2 text-3xl font-bold text-slate-900">
      {data.generatedArticle.title || "Today's Wordle Breakdown"}
    </h2>
    {#if data.generatedArticle.summary}
      <p class="mt-4 text-lg leading-8 text-slate-600">{data.generatedArticle.summary}</p>
    {/if}
    <div class="prose prose-lg mt-6 max-w-none">
      {@html data.generatedArticle.articleHtml}
    </div>
  </section>
{/if}
```

---

### FIX C-14: Improve Meta Descriptions for Higher CTR

Update the `<svelte:head>` or `<MetaTags>` in each page's `<svelte:head>` block:

| Page | Target Meta Description |
|------|------------------------|
| wordle-answer-today | "Today's Wordle answer revealed, plus 5 spoiler-safe hints to help you solve it yourself first. Updated daily at midnight UTC." |
| quordle-answer-today | "Today's Quordle answers for all four boards. Hints first, then full reveal. Updated every day." |
| loldle-answer-today | "Today's LoLdle champion revealed. Check Classic, Ability, Splash, Quote, and Emoji mode answers. Updated daily." |
| nerdle-answer-today | "Today's Nerdle equations across all modes. Classic, Mini, Micro, and more. Check your work or jump to the solver." |
| All archive pages | "[Game] Archive — every past answer searchable by date. Browse the complete history from [start date] to today." |
| All solver pages | "Free [Game] solver that filters candidates based on your clues. Enter your feedback, see what's left." |

---

### FIX C-12: Improve User Engagement Signals

**A. Add "Quick Answer" section above the fold on answer-today pages**

Add near the top of each answer-today page (after the hero section):
```svelte
<div class="mb-8 rounded-2xl border-2 border-teal-200 bg-teal-50 p-6 text-center">
  <p class="text-sm font-semibold text-teal-600 mb-2">Today's Answer</p>
  <p class="text-3xl font-black text-teal-800">{answer}</p>
  <p class="mt-2 text-sm text-teal-600">Puzzle #{puzzleNumber} — {formattedDate}</p>
</div>
```

**B. Add freshness signal to GeneratedTodayArticle.svelte**

Add after the eyebrow text:
```svelte
<p class="text-xs text-slate-400">Updated {articleDate}</p>
```

---

### FIX C-11: Build Topical Authority Through Content Clusters

**A. Create new component**: `src/lib/components/TopicalCluster.svelte`

This component maps each game to its content cluster and renders "Related Games" links.

**Content clusters**:

| Cluster | Games |
|---------|-------|
| Word Puzzle Games | wordle, quordle, nerdle, phoodle, phrazle, waffle, canuckle, worgle, betweenle |
| Geography Puzzle Games | worldle, globle, countryle |
| Character Guessing Games | loldle, dotadle, narutodle, onepiecedle, pokedle, smashdle |
| Logic & Semantic Games | contexto, semantle, searchle |
| Visual & Color Games | colordle, colorfle, framed, spotle |

**B. Add "Related Games" section to every game page** using the TopicalCluster component.

**C. Update `/guides` page** — add comprehensive sections on each cluster:
- Wordle variants guide
- Geography puzzle variants guide
- Character guessing game variants guide
- Semantic/logic puzzle variants guide
- Visual/color puzzle variants guide

---

## Quality Checklist

Before submitting any content change, verify:

- [ ] No paragraph starts with "Whether you are..." or "If you are..."
- [ ] No "Furthermore", "Moreover", "Additionally", "It is worth noting", "In conclusion"
- [ ] No encyclopedic franchise history in answer-today pages
- [ ] No "Why fans love this game" sections anywhere
- [ ] No text that reveals AI generation ("AI-written", "AI article", "generated", "automated")
- [ ] No developer-speak visible to users ("server-rendered", "deterministic", "dataset", "now lives on")
- [ ] No "Welcome to today's..." or "Your daily guide to..." openings
- [ ] No "comprehensive", "indispensable", "essential resource" in archive pages
- [ ] No "AI-powered", "machine learning", "language model" in user-facing text
- [ ] Each game's page sounds different — not the same template with name swapped
- [ ] Text reads like a real player wrote it
- [ ] The word "Daily article" does NOT appear anywhere (use "Today's notes")

---

## Recommended Implementation Order

1. **Fix C-10** — Improve author bio (quick, 1 file)
2. **Fix C-13** — Fix wordle article display (quick, 1 file)
3. **Fix C-9** — Add AuthorCard to all pages (~35 files, mechanical)
4. **Fix C-8** — Rewrite massive AI article sections (16+ files, creative writing)
5. **Fix C-14** — Improve meta descriptions (multiple files, mechanical)
6. **Fix C-12** — Add engagement signals (GeneratedTodayArticle + answer pages)
7. **Fix C-11** — Build topical authority (new component + guides page updates)
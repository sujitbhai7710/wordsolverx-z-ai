<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import WordlebotWasmClient from '$lib/components/wordlebot/WordlebotWasmClient.svelte';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';

  let { data } = $props();

  const formattedDate = $derived(data.formattedDate ?? 'today');
</script>

<svelte:head>
  <title>{data.meta?.title ?? 'Canuckle Answer Today'}</title>
  <meta name="description" content={data.meta?.description ?? ''} />
  <meta name="robots" content="index, follow, max-snippet:-1" />
  <meta name="news_keywords" content={data.meta?.keywords ?? 'canuckle answer today, canuckle hint, daily canadian puzzle'} />
  <link rel="canonical" href="https://wordsolver.tech/canuckle-answer-today" />
  <meta property="og:title" content={data.meta?.title ?? 'Canuckle Answer Today'} />
  <meta property="og:description" content={data.meta?.description ?? ''} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://wordsolver.tech/canuckle-answer-today" />
  <meta property="og:image" content={data.meta?.featuredImage} />
  <meta property="og:image:alt" content={`Canuckle daily word solution for ${formattedDate}`} />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta?.title ?? 'Canuckle Answer Today'} />
  <meta name="twitter:description" content={data.meta?.description ?? ''} />
  <meta name="twitter:image" content={data.meta?.featuredImage} />
  {#if data.schemas}
    {@html `<script type="application/ld+json">${data.schemas}</script>`}
  {/if}
</svelte:head>

{#if data.error || !data.todayPuzzle}
  <div class="bg-slate-50 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">Canuckle</p>
      <h1 class="mt-3 text-3xl font-black text-slate-900">Canuckle data is temporarily unavailable</h1>
      <p class="mt-4 text-lg text-slate-600">
        We could not load a verified Canuckle answer for {formattedDate} right now. You can still browse the archive or use the solver while the latest data refreshes.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <a href="/canuckle-archive" class="inline-flex items-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-600">
          Browse Canuckle Archive
        </a>
        <a href="/canuckle-solver" class="inline-flex items-center rounded-xl border-2 border-amber-500 px-5 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50">
          Open Canuckle Solver
        </a>
      </div>
    </div>
  </div>
{:else}
  <div class="bg-slate-50 min-h-screen py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Breadcrumbs />

      <!-- Hero Section -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 shadow-xl ring-1 ring-white/10">
        <!-- Decorative background accents -->
        <div class="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-3 mb-1">
              <p class="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">Canuckle Answer Today</p>
              <span class="rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">Puzzle #{data.todayPuzzle.index}</span>
            </div>
            <h1 class="mt-3 text-4xl font-black text-white">Canuckle Answer Today ({formattedDate})</h1>
            <p class="mt-4 max-w-3xl text-lg text-slate-300">
              Verified answer, puzzle number, and Canadian fact for today&apos;s Canuckle puzzle. The answer stays hidden until you choose to reveal it.
            </p>
          </div>
          <div class="flex flex-wrap gap-3 lg:flex-shrink-0">
            <a
              href="#today-answer-reveal"
              class="inline-flex items-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40 hover:brightness-110"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              Reveal Answer
            </a>
            <a href="/canuckle-solver" class="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
              Open Solver
            </a>
            <a href="/canuckle-archive" class="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white">
              Browse Archive
            </a>
          </div>
        </div>
      </section>

      <!-- E-E-A-T Trust Box -->
      <section class="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200 rounded-3xl border border-slate-200 bg-white shadow-sm ring-2 ring-slate-900/10">
        <div class="flex items-center gap-3 px-4 py-5 sm:px-5">
          <svg class="h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-900">Verified Daily</p>
            <p class="text-xs mt-0.5 text-slate-500">Answers checked each day</p>
          </div>
        </div>
        <div class="flex items-center gap-3 px-4 py-5 sm:px-5">
          <svg class="h-5 w-5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-900">Updated Midnight ET</p>
            <p class="text-xs mt-0.5 text-slate-500">Synced with game clock</p>
          </div>
        </div>
        <div class="flex items-center gap-3 px-4 py-5 sm:px-5">
          <svg class="h-5 w-5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-900">1,500+ Puzzles</p>
            <p class="text-xs mt-0.5 text-slate-500">Historical archive tracked</p>
          </div>
        </div>
        <div class="flex items-center gap-3 px-4 py-5 sm:px-5">
          <svg class="h-5 w-5 flex-shrink-0 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-900">{PRESTON_HAYES_AUTHOR_NAME}</p>
            <p class="text-xs mt-0.5 text-slate-500">Word Puzzle Expert</p>
          </div>
        </div>
      </section>

      <!-- Reveal Section -->
      <section id="today-answer-reveal">
        <div class="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-[2px] shadow-2xl">
          <!-- Gradient border shimmer -->
          <div class="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500/30 via-teal-400/20 to-amber-500/30 p-[1px]"></div>
          <div class="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
            <!-- Inner glow accents -->
            <div class="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-amber-500/8 blur-3xl"></div>
            <div class="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-teal-500/8 blur-3xl"></div>
            <div class="relative z-10">
              <div class="mb-6 flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
                  <svg class="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </div>
                <p class="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">Today&apos;s Answer</p>
              </div>
              <!-- Subtle divider line -->
              <div class="mb-6 h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent"></div>
              <WordlebotWasmClient config={{ pageType: 'canuckle-daily', visibleDateKey: data.visibleDateKey }} />
            </div>
          </div>
        </div>
      </section>

      <!-- Yesterday's Answer -->
      {#if data.yesterdayData}
        <section class="rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 p-6 shadow-lg ring-1 ring-white/5">
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 mb-2">Yesterday&apos;s Answer</p>
          <p class="text-lg text-white">
            Yesterday&apos;s word was <strong class="text-amber-400 font-black">{data.yesterdayData.answer.toUpperCase()}</strong>
            <span class="ml-2 text-sm text-slate-400">(Puzzle #{data.yesterdayData.index})</span>
          </p>
        </section>
      {/if}

      <!-- Featured Image / Dark Gradient Banner -->
      <div class="rounded-3xl overflow-hidden relative" style="aspect-ratio:21/9">
        <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950"></div>
        <div class="pointer-events-none absolute -right-1/4 top-1/2 h-3/4 w-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div class="pointer-events-none absolute -left-1/4 top-1/2 h-3/4 w-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl"></div>
        <!-- Subtle grid pattern overlay -->
        <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 40px 40px;"></div>
        <div class="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-6">
          <div class="flex items-center gap-2 mb-3">
            <span class="inline-block h-1 w-8 rounded-full bg-amber-500/60"></span>
            <span class="inline-block h-1 w-4 rounded-full bg-amber-500/40"></span>
            <span class="inline-block h-1 w-2 rounded-full bg-amber-500/20"></span>
          </div>
          <p class="text-2xl sm:text-3xl font-black text-white tracking-tight">Daily Canadian Word Puzzle</p>
          <p class="mt-2 text-sm text-slate-400">Solve · Reveal · Learn Canadian Facts</p>
          <div class="mt-4 flex items-center gap-2">
            <span class="inline-block h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span class="text-xs font-medium text-slate-500">Live — Puzzle #{data.todayPuzzle.index} Active</span>
          </div>
        </div>
        <!-- Bottom fade border -->
        <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
      </div>

      <!-- Article Content -->
      <article class="space-y-8">
        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 class="text-3xl font-black tracking-tight text-slate-900">About Today&apos;s Canuckle Puzzle</h2>
          <p class="mt-4 text-lg leading-8 text-slate-600">
            We verify the Canuckle puzzle every day and keep this page updated with the correct puzzle number, fact, and archive links. For today, that is puzzle <strong class="text-slate-900">#{data.todayPuzzle.index}</strong>. The answer itself stays hidden inside the reveal card above, so you can land on this page for hints and navigation without getting spoiled immediately. Once you have played your daily game, come back and click the reveal button to confirm your guess and read the Canadian fact that ships with today&apos;s answer.
          </p>
          <p class="mt-4 text-lg leading-8 text-slate-600">
            Canuckle resets at midnight Eastern Time every day, which is the same schedule as Wordle for most North American players. If you are visiting from Europe or Asia, the new puzzle may not have released yet in your timezone. The puzzle number increments sequentially from the game&apos;s original launch date, so you can use the number to cross-reference with the archive and check historical answers.
          </p>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 class="text-3xl font-black tracking-tight text-slate-900">What is Canuckle?</h2>
          <p class="mt-4 text-lg leading-8 text-slate-600">
            Canuckle is a daily word-guessing game made by Canadian developers, hosted at canucklegame.github.io. It follows the same basic format as Wordle: you get six attempts to guess a hidden 5-letter word, and each guess reveals which letters are in the right spot, which are in the word but misplaced, and which are not in the word at all. The twist is that every answer has a Canadian connection. Some are obviously Canadian like TOQUE, MAPLE, and LOONIE, while others are more subtle words that happen to appear in the Canadian answer pool.
          </p>
          <p class="mt-4 text-lg leading-8 text-slate-600">
            Another difference you will notice immediately is the feedback colors. Instead of the gray, yellow, and green scheme Wordle uses, Canuckle goes with red, yellow, and green. Red means the letter is not in the word (same as Wordle&apos;s gray), yellow means the letter is there but in a different position, and green means the correct letter in the correct spot. It takes a game or two to adjust if you are used to Wordle&apos;s colors, but after that it feels natural. The game also includes a short Canadian fact after each puzzle, which is a nice touch that sets it apart from the dozens of other Wordle clones.
          </p>
          <p class="mt-4 text-lg leading-8 text-slate-600">
            If you grew up in Canada or have spent any time there, you will have a real edge because you can guess words that a purely American or British player might never think of. The Canadian answer pool is smaller than Wordle&apos;s, which actually makes it easier to narrow things down once you get a few letters confirmed. Over 1,500 puzzles have been published since the game launched, and the WordSolverX archive tracks every single one.
          </p>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 class="text-3xl font-black tracking-tight text-slate-900">How to Play Canuckle</h2>
          <p class="mt-4 text-lg leading-8 text-slate-600">
            The gameplay is straightforward if you have played any Wordle variant before, but there are a few Canuckle-specific things worth knowing before you start. The core loop is identical: type a 5-letter word, check the color feedback, and use that information to narrow down your next guess. You have six attempts total.
          </p>
          <div class="mt-6 space-y-6">
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-xl font-bold text-slate-900">1. Open the game and look at the empty grid</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                You will see six rows of five empty tiles, just like Wordle. The goal is to fill in the correct 5-letter word before you run out of rows. There is no timer and no competitive leaderboard: your streak and stats are tracked locally in your browser.
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-xl font-bold text-slate-900">2. Type your first guess</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                Use a strong starter word with common vowels and consonants. CRANE, SLATE, and TRACE are popular choices. Do not forget that the answer might be a Canadian-specific word, so if you have a hunch about something like IGLOO or LOONIE, that is worth considering early on. ABOUT is a particularly strong opener because it tests four vowels plus B and T, which appear frequently in Canadian answers.
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-xl font-bold text-slate-900">3. Read the color feedback</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                Green means the letter is in the right spot: lock it in. Yellow means the letter is in the word but somewhere else. Red means the letter is not in the word at all, so cross it off your mental list. The red-yellow-green scheme works exactly like Wordle&apos;s gray-yellow-green, just with different colors.
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-xl font-bold text-slate-900">4. Narrow it down with each guess</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                Use the letters you have confirmed (green and yellow) to construct your next guess. Try to avoid letters that came back red. If you have a yellow letter, shuffle it into a different position. The smaller Canadian answer pool means you can eliminate unlikely candidates faster than in regular Wordle.
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-xl font-bold text-slate-900">5. Think Canadian</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                Once you have a few letters confirmed, start thinking about Canadian words that fit. If you have _O_IE, think MOOSE (no, too many letters), LOONIE, or TOQUE. The Canadian answer pool includes place names, cultural references, slang, and everyday Canadian English words that you will not find in the standard Wordle list.
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-xl font-bold text-slate-900">6. Read the fact after you finish</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                Every Canuckle answer comes with a Canadian fact. It is a small reward for solving the puzzle and a fun way to learn something new about Canada each day. The facts cover geography, history, culture, wildlife, and notable Canadians.
              </p>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 class="text-3xl font-black tracking-tight text-slate-900">Canuckle Tips and Strategy</h2>
          <p class="mt-4 text-lg leading-8 text-slate-600">
            Beyond the basics, a few Canuckle-specific strategies can shave a guess or two off your daily average.
          </p>
          <div class="mt-6 space-y-6">
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-xl font-bold text-slate-900">Use a vowel-heavy opener</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                Words like ADIEU, AUDIO, or ABOUT are strong openers because they test four of the five vowels in one guess. In Canuckle specifically, ABOUT is a great choice because it also tests B and T, which show up in many Canadian answers like TOQUE, BACON, OTTER, and CABIN.
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-xl font-bold text-slate-900">Keep a mental list of Canadian words</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                After playing for a few weeks, you will start noticing that Canuckle draws from a relatively small, distinctive pool. Words like POUTINE, SYRUP, RCMP, BLIZZ, and FJORD are all fair game. Building a mental library of Canadian 5-letter words gives you a significant advantage over players who only think in standard English vocabulary.
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-xl font-bold text-slate-900">Exploit the smaller answer pool</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                Canuckle has roughly 2,300 possible answers compared to Wordle&apos;s 2,309, but many of those are Canadian-specific. Once you have two or three letters confirmed, the number of valid Canadian words that fit is often much smaller than you would expect. This makes Canuckle easier to solve in fewer guesses once you know the pool well.
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-xl font-bold text-slate-900">Check the archive for recently used answers</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                Canuckle rarely repeats answers within a short window. If you scan the WordSolverX Canuckle archive for the past month, you can safely eliminate recent answers from your candidate list. This is especially useful in the later guesses when you have multiple possibilities that all fit the confirmed letters.
              </p>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 class="text-3xl font-black tracking-tight text-slate-900">Canuckle vs Wordle</h2>
          <div class="mt-6 grid gap-6 sm:grid-cols-2">
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-lg font-bold text-slate-900">Answer pool</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                Wordle draws from a curated list of common English words. Canuckle uses a Canadian-focused list, so words like TOQUE, POUTINE, and MOOSE are valid answers that would never appear in Wordle. If you know Canadian English well, you have a built-in advantage.
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-lg font-bold text-slate-900">Color scheme</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                Wordle uses gray for absent letters, yellow for misplaced, and green for correct. Canuckle uses red instead of gray. The meaning is identical: red in Canuckle equals gray in Wordle. It takes one or two games to stop reflexively treating red as a warning color.
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-lg font-bold text-slate-900">Canadian facts</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                Every Canuckle puzzle includes a Canadian fact about the answer word. Wordle has no equivalent feature. These facts cover everything from geography and wildlife to history and pop culture, making each puzzle a mini learning opportunity.
              </p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-6">
              <h3 class="text-lg font-bold text-slate-900">Difficulty</h3>
              <p class="mt-2 text-base leading-7 text-slate-600">
                Canuckle is generally considered slightly easier than Wordle because the Canadian answer pool is smaller and more predictable. Experienced players can often solve Canuckle in three or four guesses once they learn the common answer patterns.
              </p>
            </div>
          </div>
        </section>

        <!-- FAQ Section -->
        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 class="text-3xl font-black tracking-tight text-slate-900">Canuckle Answer FAQs</h2>
          <div class="mt-6 space-y-4">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 class="text-base font-bold text-slate-900">What is the Canuckle answer for today, {formattedDate}?</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                Use the reveal card at the top of this page. It keeps today&apos;s Canuckle answer hidden until you choose to open it, so you can check for hints and facts without getting spoiled. The verified answer is puzzle #{data.todayPuzzle.index}.
              </p>
            </div>
            {#if data.yesterdayData}
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 class="text-base font-bold text-slate-900">What was yesterday&apos;s Canuckle answer?</h3>
                <p class="mt-2 text-sm leading-7 text-slate-600">
                  The previous Canuckle answer was <strong class="text-slate-900">{data.yesterdayData.answer.toUpperCase()}</strong> (puzzle #{data.yesterdayData.index}). You can also check the yellow callout box above for yesterday&apos;s answer at a glance.
                </p>
              </div>
            {/if}
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 class="text-base font-bold text-slate-900">How do you play Canuckle?</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                Canuckle is a Wordle-style game with a Canadian twist. You guess 5-letter words and get color feedback: green for correct position, yellow for wrong position, red for not in the word. The answer pool uses Canadian-themed words, and each puzzle comes with a Canadian fact.
              </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 class="text-base font-bold text-slate-900">How is Canuckle different from Wordle?</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                Canuckle uses a Canadian-focused answer list, so words like MAPLE, TOQUE, and MOOSE are fair game. It also includes a Canadian fact with each daily answer, and the feedback colors are red instead of gray for absent letters. The answer pool is smaller, which generally makes it slightly easier.
              </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 class="text-base font-bold text-slate-900">When does the new Canuckle puzzle release?</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                A new Canuckle puzzle goes live every day at midnight Eastern Time (ET). That is the same schedule as Wordle for most North American players. European players will see the new puzzle in the early morning hours.
              </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 class="text-base font-bold text-slate-900">What does the red feedback mean in Canuckle?</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                Red tiles in Canuckle work the same way as gray tiles in Wordle: the letter is not in the answer at all. Yellow means the letter is in the word but in a different position, and green means the correct letter in the correct position.
              </p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 class="text-base font-bold text-slate-900">How can I browse earlier Canuckle answers?</h3>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                Use the recent answers table below to scan the last 30 days, or visit the full Canuckle archive for a searchable history of all past puzzles. The archive tracks every puzzle from the game&apos;s launch.
              </p>
            </div>
          </div>
        </section>

        <!-- Recent 30-Day Answers -->
        {#if data.last30 && data.last30.length > 0}
          <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">Archive</p>
            <h2 class="mt-2 text-3xl font-black tracking-tight text-slate-900">Recent Canuckle Answers</h2>
            <p class="mt-3 text-base text-slate-600">Last {data.last30.length} days of verified Canuckle answers.</p>
            <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {#each data.last30 as entry}
                <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
                  <div>
                    <p class="text-sm font-bold text-slate-900">{entry.answer.toUpperCase()}</p>
                    <p class="text-xs text-slate-500">{entry.date}</p>
                  </div>
                  <span class="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-600">#{entry.index}</span>
                </div>
              {/each}
            </div>
          </section>
        {/if}
      </article>

      <AuthorCard
        name={PRESTON_HAYES_AUTHOR_NAME}
        image={PRESTON_HAYES_AUTHOR_IMAGE}
        description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
      />

      <InternalLinkSection currentGame="Canuckle" />
    </div>
  </div>
{/if}

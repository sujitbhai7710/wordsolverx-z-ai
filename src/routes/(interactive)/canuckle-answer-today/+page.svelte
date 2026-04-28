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
  <link rel="canonical" href="https://wordsolverx.com/canuckle-answer-today" />
  <meta property="og:title" content={data.meta?.title ?? 'Canuckle Answer Today'} />
  <meta property="og:description" content={data.meta?.description ?? ''} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://wordsolverx.com/canuckle-answer-today" />
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
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-lg">
      <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
        <svg class="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-sm font-semibold uppercase tracking-widest text-teal-600">Canuckle</p>
      <h1 class="mt-2 text-2xl font-bold text-slate-900">Data is temporarily unavailable</h1>
      <p class="mt-3 text-slate-500">
        We could not load a verified Canuckle answer for {formattedDate} right now. You can still browse the archive or use the solver while the latest data refreshes.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <a href="/canuckle-archive" class="inline-flex items-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700 transition-colors">
          Browse Archive
        </a>
        <a href="/canuckle-solver" class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
          Open Solver
        </a>
      </div>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-slate-50/60">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">

      <Breadcrumbs />

      <!-- Hero Section — Light Teal Gradient -->
      <section class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 p-8 sm:p-10 shadow-xl">
        <!-- Decorative shapes -->
        <div class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5"></div>
        <div class="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-amber-400/10"></div>
        <div class="pointer-events-none absolute right-8 top-8 h-32 w-32 rounded-full bg-white/[0.03]"></div>

        <div class="relative z-10">
          <div class="flex flex-wrap items-center gap-2.5 mb-3">
            <span class="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
              <svg class="mr-1.5 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              Puzzle #{data.todayPuzzle.index}
            </span>
            <span class="inline-flex items-center rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-100 backdrop-blur-sm">
              {formattedDate}
            </span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">Canuckle Answer Today ({formattedDate})</h1>
          <p class="mt-3 max-w-2xl text-base sm:text-lg text-teal-50/80 leading-relaxed">
            Verified answer, puzzle number, and Canadian fact for today's Canuckle puzzle.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <a href="/canuckle-solver" class="inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-teal-700 shadow-md hover:bg-teal-50 transition-all hover:shadow-lg">
              Open Solver
            </a>
            <a href="/canuckle-archive" class="inline-flex items-center rounded-lg border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors">
              Browse Archive
            </a>
          </div>
        </div>
      </section>

      <!-- Trust Indicators — Clean pill bar -->
      <section class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="flex items-center gap-3 rounded-xl bg-white p-4 border border-slate-200/80 shadow-sm">
          <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50">
            <svg class="h-4.5 w-4.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900">Verified Daily</p>
            <p class="text-[11px] text-slate-500">Answers checked each day</p>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-xl bg-white p-4 border border-slate-200/80 shadow-sm">
          <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50">
            <svg class="h-4.5 w-4.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900">Updated Midnight ET</p>
            <p class="text-[11px] text-slate-500">Synced with game clock</p>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-xl bg-white p-4 border border-slate-200/80 shadow-sm">
          <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
            <svg class="h-4.5 w-4.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900">1,500+ Puzzles</p>
            <p class="text-[11px] text-slate-500">Historical archive tracked</p>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-xl bg-white p-4 border border-slate-200/80 shadow-sm">
          <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <svg class="h-4.5 w-4.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900">{PRESTON_HAYES_AUTHOR_NAME}</p>
            <p class="text-[11px] text-slate-500">Word Puzzle Expert</p>
          </div>
        </div>
      </section>

      <section id="today-answer-reveal">
        <WordlebotWasmClient config={{ pageType: 'canuckle-daily', visibleDateKey: data.visibleDateKey }} />
      </section>

      <!-- Yesterday's Answer — Light Info Card -->
      {#if data.yesterdayData}
        <section class="rounded-xl bg-gradient-to-r from-amber-50 via-white to-teal-50 p-5 border border-amber-200/60">
          <div class="flex flex-wrap items-center gap-2 mb-1.5">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Yesterday&apos;s Answer</span>
            <span class="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">Puzzle #{data.yesterdayData.index}</span>
          </div>
          <p class="text-base text-slate-700">
            Yesterday&apos;s word was
            <span class="inline-flex items-center rounded-lg bg-white px-3 py-1 font-bold text-teal-700 border border-slate-200 shadow-sm mx-1 tracking-wide">
              {data.yesterdayData.answer.toUpperCase()}
            </span>
          </p>
        </section>
      {/if}

      <!-- Thin Separator -->
      <div class="flex items-center gap-4 py-2">
        <div class="flex-1 h-px bg-slate-200"></div>
        <span class="text-xs font-semibold uppercase tracking-widest text-slate-400">Guide</span>
        <div class="flex-1 h-px bg-slate-200"></div>
      </div>

      <!-- Article Content -->
      <article class="space-y-6">

        <!-- About Today's Puzzle -->
        <section class="rounded-xl bg-white border border-slate-200 p-6 sm:p-5 sm:p-8 shadow-sm">
          <div class="flex items-start gap-3 mb-4">
            <div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50">
              <svg class="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">About Today&apos;s Canuckle Puzzle</h2>
          </div>
          <div class="space-y-4 text-slate-600 leading-relaxed">
            <p>
              We verify the Canuckle puzzle every day and keep this page updated with the correct puzzle number, answer, fact, and archive links. For today, that is puzzle <strong class="text-slate-800">#{data.todayPuzzle.index}</strong> on <strong class="text-slate-800">{formattedDate}</strong>. The answer and Canadian fact are displayed in the card above, so you can confirm your guess and read the fact right away.
            </p>
            <p>
              Canuckle resets at midnight Eastern Time every day, which is the same schedule as Wordle for most North American players. If you are visiting from Europe or Asia, the new puzzle may not have released yet in your timezone. The puzzle number increments sequentially from the game&apos;s original launch date, so you can use the number to cross-reference with the archive and check historical answers.
            </p>
          </div>
        </section>

        <!-- What is Canuckle? -->
        <section class="rounded-xl bg-white border border-slate-200 p-6 sm:p-5 sm:p-8 shadow-sm">
          <div class="flex items-start gap-3 mb-4">
            <div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
              <svg class="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">What is Canuckle?</h2>
          </div>
          <div class="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Canuckle is a daily word-guessing game made by Canadian developers, hosted at canucklegame.github.io. It follows the same basic format as Wordle: you get six attempts to guess a hidden 5-letter word, and each guess reveals which letters are in the right spot, which are in the word but misplaced, and which are not in the word at all. The twist is that every answer has a Canadian connection. Some are obviously Canadian like TOQUE, MAPLE, and LOONIE, while others are more subtle words that happen to appear in the Canadian answer pool.
            </p>
            <p>
              Another difference you will notice immediately is the feedback colors. Instead of the gray, yellow, and green scheme Wordle uses, Canuckle goes with red, yellow, and green. Red means the letter is not in the word (same as Wordle&apos;s gray), yellow means the letter is there but in a different position, and green means the correct letter in the correct spot. It takes a game or two to adjust if you are used to Wordle&apos;s colors, but after that it feels natural. The game also includes a short Canadian fact after each puzzle, which is a nice touch that sets it apart from the dozens of other Wordle clones.
            </p>
            <p>
              If you grew up in Canada or have spent any time there, you will have a real edge because you can guess words that a purely American or British player might never think of. The Canadian answer pool is smaller than Wordle&apos;s, which actually makes it easier to narrow things down once you get a few letters confirmed. Over 1,500 puzzles have been published since the game launched, and the WordSolverX archive tracks every single one.
            </p>
          </div>
        </section>

        <!-- How to Play Canuckle -->
        <section class="rounded-xl bg-white border border-slate-200 p-6 sm:p-5 sm:p-8 shadow-sm">
          <div class="flex items-start gap-3 mb-5">
            <div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50">
              <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">How to Play Canuckle</h2>
              <p class="mt-1 text-sm text-slate-500">The gameplay is straightforward if you have played any Wordle variant before, but there are a few Canuckle-specific things worth knowing.</p>
            </div>
          </div>
          <div class="space-y-4">
            <div class="rounded-lg bg-slate-50/80 p-5 border border-slate-100">
              <div class="flex items-center gap-2.5 mb-2">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">1</span>
                <h3 class="font-semibold text-slate-900">Open the game and look at the empty grid</h3>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed ml-8.5">
                You will see six rows of five empty tiles, just like Wordle. The goal is to fill in the correct 5-letter word before you run out of rows. There is no timer and no competitive leaderboard: your streak and stats are tracked locally in your browser.
              </p>
            </div>
            <div class="rounded-lg bg-slate-50/80 p-5 border border-slate-100">
              <div class="flex items-center gap-2.5 mb-2">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">2</span>
                <h3 class="font-semibold text-slate-900">Type your first guess</h3>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed ml-8.5">
                Use a strong starter word with common vowels and consonants. CRANE, SLATE, and TRACE are popular choices. Do not forget that the answer might be a Canadian-specific word, so if you have a hunch about something like IGLOO or LOONIE, that is worth considering early on. ABOUT is a particularly strong opener because it tests four vowels plus B and T, which appear frequently in Canadian answers.
              </p>
            </div>
            <div class="rounded-lg bg-slate-50/80 p-5 border border-slate-100">
              <div class="flex items-center gap-2.5 mb-2">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">3</span>
                <h3 class="font-semibold text-slate-900">Read the color feedback</h3>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed ml-8.5">
                Green means the letter is in the right spot: lock it in. Yellow means the letter is in the word but somewhere else. Red means the letter is not in the word at all, so cross it off your mental list. The red-yellow-green scheme works exactly like Wordle&apos;s gray-yellow-green, just with different colors.
              </p>
            </div>
            <div class="rounded-lg bg-slate-50/80 p-5 border border-slate-100">
              <div class="flex items-center gap-2.5 mb-2">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">4</span>
                <h3 class="font-semibold text-slate-900">Narrow it down with each guess</h3>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed ml-8.5">
                Use the letters you have confirmed (green and yellow) to construct your next guess. Try to avoid letters that came back red. If you have a yellow letter, shuffle it into a different position. The smaller Canadian answer pool means you can eliminate unlikely candidates faster than in regular Wordle.
              </p>
            </div>
            <div class="rounded-lg bg-slate-50/80 p-5 border border-slate-100">
              <div class="flex items-center gap-2.5 mb-2">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">5</span>
                <h3 class="font-semibold text-slate-900">Think Canadian</h3>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed ml-8.5">
                Once you have a few letters confirmed, start thinking about Canadian words that fit. If you have _O_IE, think MOOSE (no, too many letters), LOONIE, or TOQUE. The Canadian answer pool includes place names, cultural references, slang, and everyday Canadian English words that you will not find in the standard Wordle list.
              </p>
            </div>
            <div class="rounded-lg bg-slate-50/80 p-5 border border-slate-100">
              <div class="flex items-center gap-2.5 mb-2">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">6</span>
                <h3 class="font-semibold text-slate-900">Read the fact after you finish</h3>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed ml-8.5">
                Every Canuckle answer comes with a Canadian fact. It is a small reward for solving the puzzle and a fun way to learn something new about Canada each day. The facts cover geography, history, culture, wildlife, and notable Canadians.
              </p>
            </div>
          </div>
        </section>

        <!-- Canuckle Tips and Strategy -->
        <section class="rounded-xl bg-white border border-slate-200 p-6 sm:p-5 sm:p-8 shadow-sm">
          <div class="flex items-start gap-3 mb-4">
            <div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <svg class="h-4 w-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Canuckle Tips and Strategy</h2>
              <p class="mt-1 text-sm text-slate-500">Beyond the basics, a few Canuckle-specific strategies can shave a guess or two off your daily average.</p>
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-lg border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-5">
              <h3 class="font-semibold text-slate-900 mb-2">Use a vowel-heavy opener</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Words like ADIEU, AUDIO, or ABOUT are strong openers because they test four of the five vowels in one guess. In Canuckle specifically, ABOUT is a great choice because it also tests B and T, which show up in many Canadian answers like TOQUE, BACON, OTTER, and CABIN.
              </p>
            </div>
            <div class="rounded-lg border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-5">
              <h3 class="font-semibold text-slate-900 mb-2">Keep a mental list of Canadian words</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                After playing for a few weeks, you will start noticing that Canuckle draws from a relatively small, distinctive pool. Words like POUTINE, SYRUP, RCMP, BLIZZ, and FJORD are all fair game. Building a mental library of Canadian 5-letter words gives you a significant advantage.
              </p>
            </div>
            <div class="rounded-lg border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-5">
              <h3 class="font-semibold text-slate-900 mb-2">Exploit the smaller answer pool</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Canuckle has roughly 2,300 possible answers compared to Wordle&apos;s 2,309, but many of those are Canadian-specific. Once you have two or three letters confirmed, the number of valid Canadian words that fit is often much smaller than you would expect.
              </p>
            </div>
            <div class="rounded-lg border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-5">
              <h3 class="font-semibold text-slate-900 mb-2">Check the archive for recently used answers</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Canuckle rarely repeats answers within a short window. If you scan the WordSolverX Canuckle archive for the past month, you can safely eliminate recent answers from your candidate list. This is especially useful in the later guesses.
              </p>
            </div>
          </div>
        </section>

        <!-- Canuckle vs Wordle -->
        <section class="rounded-xl bg-white border border-slate-200 p-6 sm:p-5 sm:p-8 shadow-sm">
          <div class="flex items-start gap-3 mb-5">
            <div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Canuckle vs Wordle</h2>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-lg border border-slate-100 bg-slate-50/50 p-5">
              <h3 class="font-semibold text-slate-900 mb-2">Answer pool</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Wordle draws from a curated list of common English words. Canuckle uses a Canadian-focused list, so words like TOQUE, POUTINE, and MOOSE are valid answers that would never appear in Wordle. If you know Canadian English well, you have a built-in advantage.
              </p>
            </div>
            <div class="rounded-lg border border-slate-100 bg-slate-50/50 p-5">
              <h3 class="font-semibold text-slate-900 mb-2">Color scheme</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Wordle uses gray for absent letters, yellow for misplaced, and green for correct. Canuckle uses red instead of gray. The meaning is identical: red in Canuckle equals gray in Wordle. It takes one or two games to stop reflexively treating red as a warning color.
              </p>
            </div>
            <div class="rounded-lg border border-slate-100 bg-slate-50/50 p-5">
              <h3 class="font-semibold text-slate-900 mb-2">Canadian facts</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Every Canuckle puzzle includes a Canadian fact about the answer word. Wordle has no equivalent feature. These facts cover everything from geography and wildlife to history and pop culture, making each puzzle a mini learning opportunity.
              </p>
            </div>
            <div class="rounded-lg border border-slate-100 bg-slate-50/50 p-5">
              <h3 class="font-semibold text-slate-900 mb-2">Difficulty</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Canuckle is generally considered slightly easier than Wordle because the Canadian answer pool is smaller and more predictable. Experienced players can often solve Canuckle in three or four guesses once they learn the common answer patterns.
              </p>
            </div>
          </div>
        </section>

        <!-- FAQ Section -->
        <section class="rounded-xl bg-white border border-slate-200 p-6 sm:p-5 sm:p-8 shadow-sm">
          <div class="flex items-start gap-3 mb-5">
            <div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <svg class="h-4 w-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Canuckle Answer FAQs</h2>
          </div>
          <div class="space-y-3">
            <details class="group rounded-lg border border-slate-200 bg-white transition-all hover:border-slate-300">
              <summary class="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-slate-900 select-none">
                What is the Canuckle answer for today, {formattedDate}?
                <svg class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <div class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                For {formattedDate}, the Canuckle answer is <strong class="text-slate-800">{data.todayPuzzle.answer.toUpperCase()}</strong> (puzzle #{data.todayPuzzle.index}). The answer card and Canadian fact are shown at the top of this page.
              </div>
            </details>
            {#if data.yesterdayData}
              <details class="group rounded-lg border border-slate-200 bg-white transition-all hover:border-slate-300">
                <summary class="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-slate-900 select-none">
                  What was yesterday&apos;s Canuckle answer?
                  <svg class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </summary>
                <div class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                  The previous Canuckle answer was <strong class="text-slate-800">{data.yesterdayData.answer.toUpperCase()}</strong> (puzzle #{data.yesterdayData.index}). You can also check the amber callout box above for yesterday&apos;s answer at a glance.
                </div>
              </details>
            {/if}
            <details class="group rounded-lg border border-slate-200 bg-white transition-all hover:border-slate-300">
              <summary class="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-slate-900 select-none">
                How do you play Canuckle?
                <svg class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <div class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                Canuckle is a Wordle-style game with a Canadian twist. You guess 5-letter words and get color feedback: green for correct position, yellow for wrong position, red for not in the word. The answer pool uses Canadian-themed words, and each puzzle comes with a Canadian fact.
              </div>
            </details>
            <details class="group rounded-lg border border-slate-200 bg-white transition-all hover:border-slate-300">
              <summary class="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-slate-900 select-none">
                How is Canuckle different from Wordle?
                <svg class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <div class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                Canuckle uses a Canadian-focused answer list, so words like MAPLE, TOQUE, and MOOSE are fair game. It also includes a Canadian fact with each daily answer, and the feedback colors are red instead of gray for absent letters. The answer pool is smaller, which generally makes it slightly easier.
              </div>
            </details>
            <details class="group rounded-lg border border-slate-200 bg-white transition-all hover:border-slate-300">
              <summary class="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-slate-900 select-none">
                When does the new Canuckle puzzle release?
                <svg class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <div class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                A new Canuckle puzzle goes live every day at midnight Eastern Time (ET). That is the same schedule as Wordle for most North American players. European players will see the new puzzle in the early morning hours.
              </div>
            </details>
            <details class="group rounded-lg border border-slate-200 bg-white transition-all hover:border-slate-300">
              <summary class="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-slate-900 select-none">
                What does the red feedback mean in Canuckle?
                <svg class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <div class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                Red tiles in Canuckle work the same way as gray tiles in Wordle: the letter is not in the answer at all. Yellow means the letter is in the word but in a different position, and green means the correct letter in the correct position.
              </div>
            </details>
            <details class="group rounded-lg border border-slate-200 bg-white transition-all hover:border-slate-300">
              <summary class="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-slate-900 select-none">
                How can I browse earlier Canuckle answers?
                <svg class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <div class="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                Use the recent answers table below to scan the last 30 days, or visit the full Canuckle archive for a searchable history of all past puzzles. The archive tracks every puzzle from the game&apos;s launch.
              </div>
            </details>
          </div>
        </section>

        <!-- Recent 30-Day Answers -->
        {#if data.last30 && data.last30.length > 0}
          <section class="rounded-xl bg-white border border-slate-200 p-6 sm:p-5 sm:p-8 shadow-sm">
            <div class="flex items-start gap-3 mb-2">
              <div class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <svg class="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-0.5">Archive</p>
                <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Recent Canuckle Answers</h2>
              </div>
            </div>
            <p class="text-sm text-slate-500 mb-5">Last {data.last30.length} days of verified Canuckle answers.</p>
            <div class="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {#each data.last30 as entry}
                <div class="group flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3 transition-colors hover:bg-teal-50/50 hover:border-teal-200/60">
                  <div>
                    <p class="text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors">{entry.answer.toUpperCase()}</p>
                    <p class="text-xs text-slate-500">{entry.date}</p>
                  </div>
                  <span class="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 border border-slate-200">#{entry.index}</span>
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

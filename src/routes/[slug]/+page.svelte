<script lang="ts">
  import ColorClues from '$lib/components/ColorClues.svelte';
  import SemantleClues from '$lib/components/SemantleClues.svelte';
  import PhoodleAnswerCard from '$lib/components/PhoodleAnswerCard.svelte';
  import QuordleClues from '$lib/components/QuordleClues.svelte';
  import QuordleAnswerCard from '$lib/components/QuordleAnswerCard.svelte';
  import WordleDisplayWrapper from '$lib/components/WordleDisplayWrapper.svelte';
  import WaffleAnswerCard from '$lib/components/WaffleAnswerCard.svelte';
  import GlobleCluesSection from '$lib/components/GlobleCluesSection.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import FiCalendar from '$lib/components/icons/FiCalendar.svelte';
  import FiHash from '$lib/components/icons/FiHash.svelte';
  import FiArrowRight from '$lib/components/icons/FiArrowRight.svelte';
  import FiArrowLeft from '$lib/components/icons/FiArrowLeft.svelte';

  let { data } = $props();
  let pageTitle = $derived(data.meta?.title ?? 'WordSolverX');
  let pageDescription = $derived(data.meta?.description ?? 'Browse verified WordSolverX puzzle answers, hints, and archives.');
  let canonicalUrl = $derived(data.canonicalUrl ?? `https://wordsolverx.com/${data.slug}`);
  let pageType = $derived(data.noindex ? 'article' : 'website');
  let webPageSchema = $derived(JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl
  }));
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content={pageType} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content="https://wordsolverx.com/wordsolverx.webp" />
  {#if data.noindex}<meta name="robots" content="noindex, follow" />{/if}
  {@html `<script type="application/ld+json">${webPageSchema}</script>`}
  {#if data.schemas}{@html `<script type="application/ld+json">${data.schemas}</script>`}{/if}
</svelte:head>

<!-- ===== COLORDLE ===== -->
{#if data.gameType === 'colordle'}
  <div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <div class="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 mb-4">
          <FiCalendar class="w-6 h-6" />
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Colordle Answer for {data.formattedDate}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">Solution for Puzzle <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">#{data.dayNum}</span></p>
      </header>

      <div class="mb-12"><ColorClues colorName={data.color.name} colorHex={data.color.hex} /></div>

      <div class="flex justify-between items-center max-w-md mx-auto mb-12 px-4">
        <a href={data.prevSlug} class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">← Previous Day</a>
        <a href={data.nextSlug} class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Next Day →</a>
      </div>

      <article class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Solution Details</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          The Colordle solution for <strong class="text-gray-900 dark:text-white">{data.formattedDate}</strong> was <strong class="text-gray-900 dark:text-white">{data.color.name}</strong> <span class="font-mono text-indigo-600 dark:text-indigo-400">({data.color.hex})</span>.
          This was puzzle <strong class="text-indigo-600 dark:text-indigo-400">#{data.dayNum}</strong>.
        </p>

        <div class="my-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
          <h3 class="text-lg font-bold text-emerald-900 dark:text-emerald-300 mb-2">Want to solve current puzzles?</h3>
          <a href="/colordle-solver" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg">
            Use our Colordle Solver <FiArrowRight class="w-4 h-4" />
          </a>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <details class="group bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30 overflow-hidden" open>
            <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white">
              <span>What was the Colordle answer on {data.formattedDate}?</span>
            </summary>
            <div class="p-5 pt-0 text-gray-600 dark:text-gray-300 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl shadow-inner border border-gray-300 dark:border-gray-600 flex-shrink-0" style="background-color: {data.color.hex};"></div>
              <span>The answer was <span class="font-bold text-gray-900 dark:text-white">{data.color.name}</span> <span class="font-mono text-indigo-600 dark:text-indigo-400">({data.color.hex})</span>.</span>
            </div>
          </details>

          <details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
            <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white"><span>Is the puzzle same for everyone?</span></summary>
            <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">Yes, Colordle presents the same target color to all players worldwide for each specific date.</div>
          </details>

          {#if data.last5Days?.length}
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">Recent Colordle Answers</h3>
            {#each data.last5Days as d}
              {#if d}
              <details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
                <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white"><span>What was the Colordle answer for {d.formattedDate}?</span></summary>
                <div class="p-5 pt-0 text-gray-600 dark:text-gray-300 flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg shadow-inner border border-gray-300 dark:border-gray-600 flex-shrink-0" style="background-color: {d.color.hex};"></div>
                  <span>The answer was <span class="font-bold text-gray-900 dark:text-white">{d.color.name}</span> <span class="font-mono text-indigo-600 dark:text-indigo-400">({d.color.hex})</span>.</span>
                </div>
              </details>
              {/if}
            {/each}
          {/if}
        </div>
      </article>
      <div class="mt-16"><InternalLinkSection currentGame="Colordle" /></div>
    </div>
  </div>

<!-- ===== SEMANTLE ===== -->
{:else if data.gameType === 'semantle'}
  <div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <div class="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 mb-4"><FiCalendar class="w-6 h-6" /></div>
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4">Semantle Answer for {data.formattedDate}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">Puzzle <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">#{data.puzzleNumber}</span></p>
      </header>

      <div class="mb-12"><SemantleClues word={data.word} puzzleNumber={data.puzzleNumber} /></div>

      <div class="flex justify-between items-center max-w-md mx-auto mb-12 px-4">
        <a href={data.prevSlug} class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">← Previous Day</a>
        <a href={data.nextSlug} class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Next Day →</a>
      </div>

      <article class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Solution Details</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          The Semantle answer for <strong class="text-gray-900 dark:text-white">{data.formattedDate}</strong> was <strong class="text-gray-900 dark:text-white uppercase">{data.word}</strong>. Puzzle <strong class="text-indigo-600 dark:text-indigo-400">#{data.puzzleNumber}</strong>.
        </p>
        <div class="my-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-100 dark:border-purple-900/50">
          <h3 class="text-lg font-bold text-purple-900 dark:text-purple-300 mb-2">📅 Looking for more answers?</h3>
          <a href="/semantle-archive" class="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg">Browse Semantle Archive <FiArrowRight class="w-4 h-4" /></a>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <details class="group bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30 overflow-hidden" open>
            <summary class="cursor-pointer p-5 font-semibold text-gray-900 dark:text-white"><span>What was the Semantle answer for {data.formattedDate}?</span></summary>
            <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">The answer was <span class="font-bold text-gray-900 dark:text-white uppercase">{data.word}</span> (Puzzle #{data.puzzleNumber}).</div>
          </details>
          <details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
            <summary class="cursor-pointer p-5 font-semibold text-gray-900 dark:text-white"><span>How does Semantle work?</span></summary>
            <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">Semantle uses word embeddings to measure how semantically similar your guess is to the secret word.</div>
          </details>
          {#if data.last5Days?.length}
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">Recent Semantle Answers</h3>
            {#each data.last5Days as d}
              {#if d}
              <details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
                <summary class="cursor-pointer p-5 font-semibold text-gray-900 dark:text-white"><span>What was the Semantle answer for {d.formattedDate}?</span></summary>
                <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">The answer was <span class="font-bold text-gray-900 dark:text-white uppercase">{d.word}</span> (Puzzle #{d.puzzleNumber}).</div>
              </details>
              {/if}
            {/each}
          {/if}
        </div>
      </article>
      <div class="mt-16"><InternalLinkSection currentGame="Semantle" /></div>
    </div>
  </div>

<!-- ===== PHOODLE ===== -->
{:else if data.gameType === 'phoodle'}
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <div class="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full text-orange-600 mb-6"><span class="text-4xl">🍽️</span></div>
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Phoodle Answer for {data.formattedDate}</h1>
        <p class="text-lg text-gray-600 font-medium">Daily Food Word Puzzle Solution</p>
      </header>

      <PhoodleAnswerCard word={data.word} date={data.formattedDate} description={data.description} recipe_name={data.recipe_name} />

      <div class="flex justify-between items-center max-w-md mx-auto mb-16 px-4">
        <a href={data.prevSlug} class="flex items-center gap-2 text-orange-600 font-bold hover:underline">← Previous Day</a>
        <a href={data.nextSlug} class="flex items-center gap-2 text-orange-600 font-bold hover:underline">Next Day →</a>
      </div>

      <article class="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span class="w-2 h-8 bg-orange-500 rounded-full inline-block"></span> Solution Details
        </h2>
        <p class="text-gray-600 mb-6 leading-relaxed text-lg">
          The Phoodle answer for <strong class="text-gray-900">{data.formattedDate}</strong> was
          <span class="px-2 py-1 bg-green-100 text-green-700 rounded font-bold uppercase">{data.word}</span>.
        </p>
        <div class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 mb-8 border-l-4 border-l-orange-500">
          <h3 class="text-lg font-bold text-orange-700 mb-2">🍴 Word Info</h3>
          <p class="text-gray-700">The word "{data.word}" has {data.word.length} letters, starts with "{data.word[0].toUpperCase()}", and ends with "{data.word[data.word.length - 1].toUpperCase()}".</p>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div class="space-y-6">
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-bold text-gray-900 mb-2">What was the Phoodle answer on {data.formattedDate}?</h3>
            <p class="text-gray-600">The answer was <strong class="text-green-600">{data.upperWord}</strong>.</p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">What is Phoodle?</h3>
            <p class="text-gray-600">Phoodle is a daily word puzzle game focused on food-related words. You have six attempts to guess the five-letter food word.</p>
          </div>
        </div>
      </article>
      <InternalLinkSection currentGame="Phoodle" />
    </div>
  </div>

<!-- ===== QUORDLE ===== -->
{:else if data.gameType === 'quordle'}
  <div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <div class="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 mb-4"><FiCalendar class="w-6 h-6" /></div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">Quordle Answer for {data.formattedDate}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Solutions and hints for <span class="text-emerald-600 font-bold">Classic</span>, <span class="text-blue-600 font-bold">Chill</span>, <span class="text-red-600 font-bold">Extreme</span>, <span class="text-violet-600 font-bold">Sequence</span>, <span class="text-amber-600 font-bold">Rescue</span>, and <span class="text-pink-600 font-bold">Weekly</span>.
        </p>
      </header>

      {#if data.quordleData}
        <div class="mb-12"><QuordleClues words={data.quordleData.d} mode="Classic" /></div>
        <div class="mb-12"><QuordleAnswerCard date={new Date(data.date)} /></div>
      {/if}

      <div class="flex justify-between items-center max-w-md mx-auto mb-12 px-4">
        <a href={data.prevSlug} class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold hover:underline">← Previous Day</a>
        {#if data.showNext}
          <a href={data.nextSlug} class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Next Day →</a>
        {:else}
          <span class="text-gray-400 cursor-not-allowed flex items-center gap-2">Next Day →</span>
        {/if}
      </div>

      <article class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <details class="group bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 overflow-hidden" open>
            <summary class="cursor-pointer p-5 font-semibold text-gray-900 dark:text-white"><span>What was the Quordle answer for {data.formattedDate}?</span></summary>
            <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">The Quordle answer for {data.formattedDate} was <span class="font-bold text-gray-900 dark:text-white uppercase">{data.todayWords}</span>.</div>
          </details>
          {#if data.last5Days?.length}
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">Recent Quordle Answers</h3>
            {#each data.last5Days as d}
              {#if d}
              <details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
                <summary class="cursor-pointer p-5 font-semibold text-gray-900 dark:text-white"><span>What was the Quordle answer for {d.formattedDate}?</span></summary>
                <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">The answer was <span class="font-bold text-gray-900 dark:text-white uppercase">{d.d.join(', ')}</span>.</div>
              </details>
              {/if}
            {/each}
          {/if}
        </div>
      </article>
      <div class="mt-16"><InternalLinkSection currentGame="Quordle" /></div>
    </div>
  </div>

<!-- ===== WORDLE ===== -->
{:else if data.gameType === 'wordle'}
  {#if data.wordleError}
    <main class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div class="text-center p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-lg">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Wordle Answer for Today</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">The Wordle answer for {data.formattedDate} is likely still being processed. Please check back later!</p>
      </div>
    </main>
  {:else}
    <main class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <WordleDisplayWrapper
          wordleData={data.wordleData}
          wordleWord={data.wordleWord}
          wordleNumber={data.wordleNumber}
          formattedDate={data.formattedDate}
          pageContext={data.pageContext as 'today' | 'yesterday' | 'archive'}
          contentGuide={data.contentGuide}
          socialImage={data.socialImage}
          youtubeVideoUrl={data.youtubeVideoUrl}
        />
        <div class="mt-16"><InternalLinkSection currentGame="Wordle" /></div>
        <div class="mt-12 text-center">
          <a href="/wordle-answer-archive" class="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:bg-green-700 hover:shadow-xl hover:-translate-y-1 transition-all">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clip-rule="evenodd" /></svg>
            Back to Archive
          </a>
        </div>
      </div>
    </main>
  {/if}

<!-- ===== GLOBLE ===== -->
{:else if data.gameType === 'globle'}
  <div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <header class="text-center mb-12">
        <div class="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-4"><FiCalendar class="w-6 h-6" /></div>
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-4">Globle Answer for {data.formattedDate}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">Daily Geography Puzzle Solution & Hints</p>
      </header>

      <GlobleCluesSection country={data.country} date={data.formattedDate}>
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-8">
          <div class="p-8 text-center">
            <div class="mb-6"><span class="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium tracking-wide">ANSWER</span></div>
            <h2 class="text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">{data.country.name}</h2>
            <div class="flex justify-center mb-8">
              <div class="relative">
                <img src="https://flagcdn.com/w320/{data.country.code.toLowerCase()}.png" srcset="https://flagcdn.com/w640/{data.country.code.toLowerCase()}.png 2x" width="200" alt="Flag of {data.country.name}" class="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm shadow-lg">{data.country.latitude.toFixed(2)}°, {data.country.longitude.toFixed(2)}°</div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 text-left">
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Continent</div>
                <div class="text-lg font-bold text-slate-900 dark:text-white">{data.country.continent}</div>
              </div>
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Subregion</div>
                <div class="text-lg font-bold text-slate-900 dark:text-white">{data.country.subregion}</div>
              </div>
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Country Code</div>
                <div class="text-lg font-bold text-slate-900 dark:text-white">{data.country.code}</div>
              </div>
              <div class="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Name Length</div>
                <div class="text-lg font-bold text-slate-900 dark:text-white">{data.country.name.length} letters</div>
              </div>
            </div>
          </div>
        </div>
      </GlobleCluesSection>

      <div class="flex justify-between items-center mb-12">
        <a href={data.prevSlug} class="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><span class="w-4 h-4 mr-2"><FiArrowLeft /></span> Previous Day</a>
        <a href="/globle-archive" class="text-blue-600 dark:text-blue-400 font-medium hover:underline">View Archive</a>
        <a href={data.nextSlug} class="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Next Day <span class="w-4 h-4 ml-2"><FiArrowRight /></span></a>
      </div>

      <div class="prose dark:prose-invert mx-auto max-w-3xl">
        <h2>About Globle - The Daily Geography Game</h2>
        <p>Globle is an addictive daily geography puzzle game that challenges players to identify a mystery country using color-coded proximity hints on an interactive 3D globe.</p>
        <h3>How to Play Globle</h3>
        <p>Guess any country in the world, and the game will highlight your guess on the globe with a color from red (close) to white (far). Use the distance clues strategically to narrow down the location.</p>
      </div>
      <div class="mt-16"><InternalLinkSection currentGame="Globle" /></div>
    </div>
  </div>

<!-- ===== WAFFLE ===== -->
{:else if data.gameType === 'waffle'}
  <main class="max-w-3xl mx-auto px-4 py-8">
    <div class="mb-8">
      <a href="/" class="text-blue-600 hover:text-blue-800 mb-4 inline-block">← Back to Home</a>
      <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
        <a href="/waffle-archive" class="hover:underline">Waffle Archive</a>
        <span>•</span>
        <span>{data.formattedDate}</span>
      </div>
      <div class="flex items-center gap-3 mb-2">
        <h1 class="text-4xl font-bold text-gray-900">Waffle Answer for {data.formattedDate}</h1>
        <div class="flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-lg font-bold text-sm">
          <FiHash class="w-3.5 h-3.5" /><span>#{data.number}</span>
        </div>
      </div>
      <p class="text-xl text-gray-600">Here are the solutions for today's Waffle puzzle.</p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 mb-8">
      <WaffleAnswerCard puzzle={data.puzzle} solution={data.solution} date={new Date(data.date)} />

      <div class="mt-8">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-amber-200 dark:border-amber-800 pb-2 mb-6 flex items-center gap-2">
          <FiHash class="text-amber-500 w-5 h-5" /> Word Definitions
        </h3>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h4 class="flex items-center gap-2 text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-4"><FiArrowRight class="w-4 h-4" /> Across</h4>
            <div class="space-y-4">
              {#each data.words.slice(0, 3) as word}
                {@const def = data.definitions.find((d: any) => d.word.toLowerCase() === word.toLowerCase())}
                <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div class="flex items-baseline gap-2 mb-1">
                    <span class="text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">{word}</span>
                    {#if def?.type}<span class="text-[10px] font-bold text-amber-500 italic">({def.type})</span>{/if}
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 text-sm leading-snug">{def?.definition || 'No definition available.'}</p>
                </div>
              {/each}
            </div>
          </div>
          <div>
            <h4 class="flex items-center gap-2 text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-4"><FiArrowRight class="rotate-90 w-4 h-4" /> Down</h4>
            <div class="space-y-4">
              {#each data.words.slice(3, 6) as word}
                {@const def = data.definitions.find((d: any) => d.word.toLowerCase() === word.toLowerCase())}
                <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div class="flex items-baseline gap-2 mb-1">
                    <span class="text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">{word}</span>
                    {#if def?.type}<span class="text-[10px] font-bold text-amber-500 italic">({def.type})</span>{/if}
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 text-sm leading-snug">{def?.definition || 'No definition available.'}</p>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mb-12">
      <a href={data.prevSlug} class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"><span class="w-4 h-4 mr-2"><FiArrowLeft /></span> Previous Waffle</a>
      {#if data.showNext}
        <a href={data.nextSlug} class="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">Next Waffle <span class="w-4 h-4 ml-2"><FiArrowRight /></span></a>
      {/if}
    </div>
  </main>
{/if}

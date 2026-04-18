<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import ColorClues from '$lib/components/ColorClues.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import FiChevronDown from '$lib/components/icons/FiChevronDown.svelte';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';

  let { data } = $props();
  let historySearch = $state('');

  const featuredImage = $derived(data.meta?.featuredImage ?? '/colordle-answer-today.webp');
  const historyEntries = $derived(data.last100Days ?? []);
  const requestedDateLabel = $derived(data.requestedFormattedDate ?? data.formattedDate ?? 'today');
  const answerDateLabel = $derived(data.formattedDate ?? requestedDateLabel);
  const generatedArticle = $derived(data.generatedArticle ?? null);
  const generatedBonusHints = $derived(generatedArticle?.bonusHints ?? []);

  const filteredHistory = $derived.by(() => {
    const query = historySearch.trim().toLowerCase();
    if (!query) return historyEntries;

    return historyEntries.filter((entry) =>
      [entry.formattedDate, entry.color.name, entry.color.hex].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  });
</script>

<svelte:head>
  <title>{data.meta?.title ?? 'Colordle Answer Today'}</title>
  <meta name="description" content={data.meta?.description ?? ''} />
  <meta name="robots" content="index, follow, max-snippet:-1" />
  <meta name="news_keywords" content={data.meta?.keywords ?? 'colordle answer today, colordle hint, daily color puzzle'} />
  <link rel="canonical" href="https://wordsolver.tech/colordle-answer-today" />
  <meta property="og:title" content={data.meta?.title ?? 'Colordle Answer Today'} />
  <meta property="og:description" content={data.meta?.description ?? ''} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://wordsolver.tech/colordle-answer-today" />
  <meta property="og:image" content={featuredImage} />
  <meta property="og:image:alt" content={`Colordle daily color solution for ${answerDateLabel}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta?.title ?? 'Colordle Answer Today'} />
  <meta name="twitter:description" content={data.meta?.description ?? ''} />
  <meta name="twitter:image" content={featuredImage} />
  {#if data.schemas}
    {@html `<script type="application/ld+json">${data.schemas}</script>`}
  {/if}
</svelte:head>

{#if data.error || !data.color}
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <div class="max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg">
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Colordle</p>
      <h1 class="mt-3 text-3xl font-black text-gray-900">Latest Colordle data is temporarily unavailable</h1>
      <p class="mt-4 text-base leading-7 text-gray-600">
        We could not load a verified Colordle answer for {requestedDateLabel} right now. You can still browse the archive or use the solver while the latest answer data refreshes.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href="/colordle-archive"
          class="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700"
        >
          Browse Colordle Archive
        </a>
        <a
          href="/colordle-solver"
          class="inline-flex items-center justify-center rounded-full border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
        >
          Open Colordle Solver
        </a>
      </div>
    </div>
  </div>
{:else}
  <div class="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <figure class="mb-12 overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-lg">
        <img
          src={featuredImage}
          alt={`Colordle answer today featured image for ${answerDateLabel}`}
          class="h-auto w-full object-cover"
          loading="eager"
          fetchpriority="high"
        />
        <figcaption class="px-5 py-4 text-sm text-gray-500">
          Today's daily color puzzle solution
        </figcaption>
      </figure>

      <header class="text-center mb-10">
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Colordle Answer Today ({answerDateLabel})
        </h1>
        <p class="mx-auto max-w-3xl text-lg leading-8 text-gray-600">
          Verified Colordle hints, the exact color name, and the matching hex code for <span class="font-semibold text-indigo-600">{answerDateLabel}</span>.
        </p>
      </header>

      <div class="mb-12">
        <ColorClues colorName={data.color.name} colorHex={data.color.hex} />
      </div>

      {#if generatedBonusHints.length > 0}
        <section class="mb-12 rounded-3xl border border-fuchsia-100 bg-white p-6 shadow-lg">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-600">Extra hint pass</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900">Fresh nudges before you peek</h2>
            </div>
            <p class="max-w-xl text-sm leading-6 text-gray-500">
              These are AI-written helper hints layered on top of the logic-based clue card above. They do not replace the puzzle math.
            </p>
          </div>
          <div class="mt-6 grid gap-3 md:grid-cols-2">
            {#each generatedBonusHints as hint}
              <div class="rounded-2xl border border-fuchsia-100 bg-fuchsia-50/70 px-4 py-4 text-sm leading-6 text-gray-700">
                {hint}
              </div>
            {/each}
          </div>
        </section>
      {/if}

      <div class="mb-12 rounded-3xl border border-indigo-100 bg-white p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Quick actions</p>
            <h2 class="mt-2 text-2xl font-bold text-gray-900">Compare today with earlier colors</h2>
            <p class="mt-2 text-gray-600">
              If you want to sanity-check a guess, browse recent colors, jump into the archive, or open the solver and work through the scoring yourself.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <a
              href="/colordle-archive"
              class="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-700 hover:shadow-lg"
            >
              Search Previous Answers
            </a>
            <a
              href="/colordle-solver"
              class="inline-flex items-center justify-center rounded-full border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              Open Solver
            </a>
          </div>
        </div>
      </div>

      <article class="space-y-8">
        <section class="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div class="max-w-2xl">
              <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Logic path</p>
              <h2 class="mt-2 text-3xl font-bold text-gray-900">How the existing guess logic narrows today&apos;s color</h2>
              <p class="mt-3 text-lg leading-8 text-gray-600">
                {generatedArticle?.summary ??
                  `The clue card above handles the logical side of the puzzle. Below that, we keep a real-world solve path based on contrast, hue family, and the same score math the page already uses.`}
              </p>
            </div>
            <div class="rounded-3xl border border-indigo-100 bg-indigo-50 px-5 py-4 text-sm text-indigo-900 shadow-sm lg:w-72">
              <p class="font-semibold uppercase tracking-[0.2em] text-indigo-600">Today&apos;s answer</p>
              <p class="mt-2 text-2xl font-bold text-gray-900">{data.color.name}</p>
              <p class="font-mono text-sm text-indigo-700">{data.color.hex}</p>
              <p class="mt-3 text-sm leading-6 text-indigo-900/80">
                Puzzle <strong>#{data.dayNum}</strong> for {answerDateLabel}.
              </p>
            </div>
          </div>

          {#if data.gameNarrative && data.gameNarrative.guesses.length > 0}
            <div class="mt-8 rounded-3xl border border-gray-100 bg-gray-50 p-6">
              <p class="text-sm uppercase tracking-[0.24em] text-gray-500">Guess trail</p>
              <p class="mt-2 text-base leading-7 text-gray-600">
                Today&apos;s puzzle was <strong class="text-gray-900">{data.gameNarrative.difficultyLabel}</strong>. The path below is generated from the page&apos;s own deterministic color logic, not from the AI article text.
              </p>
              <div class="mt-6 space-y-4">
                {#each data.gameNarrative.guesses as guess, i}
                  <div class="flex items-start gap-4 group">
                    <div class="flex flex-col items-center">
                      <div class="w-10 h-10 rounded-xl border-2 shadow-sm shrink-0 transition-transform group-hover:scale-110 {guess.percent === 100 ? 'border-green-400 ring-2 ring-green-100' : 'border-gray-200'}" style="background-color: {guess.hex}"></div>
                      {#if i < data.gameNarrative.guesses.length - 1}
                        <div class="w-0.5 h-6 bg-gray-200 mt-2"></div>
                      {/if}
                    </div>
                    <div class="flex-1 min-w-0 pb-2">
                      <div class="flex items-baseline gap-2 flex-wrap">
                        <span class="text-sm font-bold uppercase tracking-wider text-indigo-600">Guess {i + 1}</span>
                        <span class="font-bold text-gray-900">{guess.name}</span>
                        <span class="font-mono text-sm {guess.percent === 100 ? 'text-green-600 font-bold' : guess.percent >= 85 ? 'text-emerald-600' : guess.percent >= 60 ? 'text-amber-600' : 'text-gray-500'}">
                          {guess.percent === 100 ? '100%' : `${guess.percent}%`}
                        </span>
                      </div>
                      <p class="text-sm text-gray-500 mt-1 leading-6">
                        {#if guess.percent === 100}
                          Exact hit. That locked in {data.color.name} at {data.color.hex}.
                        {:else if guess.percent >= 90}
                          Very close. At this stage the answer usually comes down to naming precision rather than a huge hue shift.
                        {:else if guess.percent >= 75}
                          Right neighborhood. The next move is usually a narrower shade inside the same family.
                        {:else if guess.percent >= 55}
                          Useful feedback, but still broad enough that the color family needed another pass.
                        {:else}
                          Low match. That told the logic to pivot to a different part of the spectrum.
                        {/if}
                      </p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </section>

        <nav class="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md" aria-label="Table of Contents">
          <div class="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-500 px-6 py-4">
            <p class="text-sm font-bold uppercase tracking-[0.25em] text-white/90">Jump to section</p>
          </div>
          <div class="grid gap-1 p-5 sm:grid-cols-2">
            <a href="#today-article" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600">1</span>
              Today&apos;s article
            </a>
            <a href="#frequently-asked-questions" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-fuchsia-50 hover:text-fuchsia-600">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-fuchsia-100 text-xs font-bold text-fuchsia-600">2</span>
              FAQs
            </a>
            <a href="#recent-daily-colors" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-pink-50 hover:text-pink-600">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 text-xs font-bold text-pink-600">3</span>
              Recent colors
            </a>
            <a href="/colordle-solver" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-600">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-600">4</span>
              Open solver
            </a>
          </div>
        </nav>

        <section id="today-article" class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Daily write-up</p>
          <h2 class="mt-2 text-3xl font-bold text-gray-900">
            {generatedArticle?.title ?? `Colordle notes for ${answerDateLabel}`}
          </h2>

          {#if generatedArticle?.articleHtml}
            <div class="prose prose-lg mt-6 max-w-none prose-headings:scroll-mt-28 prose-h2:text-gray-900 prose-h3:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-indigo-600">
              {@html generatedArticle.articleHtml}
            </div>
          {:else}
            <div class="mt-6 space-y-5 text-lg leading-8 text-gray-600">
              <p>
                The daily article for {answerDateLabel} has not been generated yet, so this page is falling back to the deterministic clue logic and the verified answer card.
              </p>
              <p>
                You can still use the clue panel, the guess trail, and the searchable history below to work through the puzzle in a practical way. Once the article bundle is refreshed, this section will swap in the longer human-written write-up automatically.
              </p>
            </div>
          {/if}
        </section>

        <section id="frequently-asked-questions" class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
          <div class="space-y-4">
            <details class="group rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden" open>
              <summary class="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900">
                <span>What is the Colordle answer for {answerDateLabel}?</span>
                <FiChevronDown class="text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <div class="px-5 pb-5 text-gray-600 leading-7">
                For {answerDateLabel}, the daily color is <span class="font-bold text-gray-900">{data.color.name}</span> with hex code <span class="font-mono text-indigo-600">{data.color.hex}</span>.
              </div>
            </details>

            {#if data.yesterdayData}
              <details class="group rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
                <summary class="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900">
                  <span>What was yesterday&apos;s color?</span>
                  <FiChevronDown class="text-gray-500 transition-transform group-open:rotate-180" />
                </summary>
                <div class="flex items-center gap-4 px-5 pb-5 text-gray-600">
                  <div class="h-10 w-10 rounded-lg border border-gray-300 shadow-inner" style="background-color: {data.yesterdayData.color.hex}"></div>
                  <p class="leading-7">
                    The previous daily color was <span class="font-bold text-gray-900">{data.yesterdayData.color.name}</span>
                    <span class="font-mono text-indigo-600"> ({data.yesterdayData.color.hex})</span> on {data.yesterdayData.formattedDate}.
                  </p>
                </div>
              </details>
            {/if}

            <details class="group rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
              <summary class="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900">
                <span>How do you actually play Colordle?</span>
                <FiChevronDown class="text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <div class="px-5 pb-5 text-gray-600 leading-7">
                You guess a named color, then the game returns a percentage showing how perceptually close that guess is to the target. The closer the score gets to 100, the closer you are to the exact answer.
              </div>
            </details>

            <details class="group rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
              <summary class="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900">
                <span>Why keep the logic-based hints separate from the AI article?</span>
                <FiChevronDown class="text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <div class="px-5 pb-5 text-gray-600 leading-7">
                The clue card and the guess trail come from deterministic color math already built into the site. The article text is there to explain and humanize the page, not to replace the underlying scoring logic.
              </div>
            </details>

            <details class="group rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
              <summary class="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900">
                <span>Where can I compare older answers?</span>
                <FiChevronDown class="text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <div class="px-5 pb-5 text-gray-600 leading-7">
                Use the searchable recent-color section below for quick checks, or open the dedicated <a href="/colordle-archive" class="font-semibold text-indigo-600 hover:text-indigo-500">Colordle archive</a> when you want the broader history view.
              </div>
            </details>
          </div>
        </section>

        <section id="recent-daily-colors" class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Answer history</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900">Recent daily colors</h2>
            </div>
            <p class="text-sm text-gray-500 max-w-xl">
              Newest confirmed colors first. Search by date, name, or hex code.
            </p>
          </div>

          <form class="mb-6 flex overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm" onsubmit={(event) => event.preventDefault()}>
            <input
              bind:value={historySearch}
              type="search"
              placeholder="Search by date, color name, or hex code..."
              class="min-w-0 flex-1 bg-transparent px-5 py-4 text-base text-gray-900 outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              class="border-l border-indigo-200 bg-indigo-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-indigo-500"
            >
              Search
            </button>
          </form>

          <div class="grid gap-3 md:grid-cols-2">
            {#each filteredHistory as d}
              <div class="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/60">
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-900">{d.formattedDate}</p>
                  <p class="text-xs text-gray-500">Daily color</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">{d.color.name}</p>
                  <p class="font-mono text-sm text-indigo-600">{d.color.hex}</p>
                </div>
              </div>
            {/each}
          </div>
          {#if historySearch.trim() && filteredHistory.length === 0}
            <p class="mt-6 text-center text-gray-500">No matching colors found in the recent archive.</p>
          {/if}
        </section>
      </article>

      <div class="mt-12">
        <AuthorCard
          name={PRESTON_HAYES_AUTHOR_NAME}
          image={PRESTON_HAYES_AUTHOR_IMAGE}
          description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
        />
      </div>

      <div class="mt-16">
        <InternalLinkSection currentGame="Colordle" />
      </div>
    </div>
  </div>
{/if}

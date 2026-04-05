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
  <meta name="news_keywords" content={data.meta?.keywords ?? 'colordle answer today, colordle answer, colordle hint, colordle hint today'} />
  <link rel="canonical" href="https://wordsolver.tech/colordle-answer-today" />
  <meta property="og:title" content={data.meta?.title ?? 'Colordle Answer Today'} />
  <meta property="og:description" content={data.meta?.description ?? ''} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://wordsolver.tech/colordle-answer-today" />
  <meta property="og:image" content={featuredImage} />
  <meta property="og:image:alt" content={`Colordle hints and answer for ${answerDateLabel}`} />
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
          Colordle answer today
        </figcaption>
      </figure>

      <header class="text-center mb-10">
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Colordle Answer Today ({requestedDateLabel})
        </h1>
        <p class="mx-auto max-w-3xl text-lg leading-8 text-gray-600">
          {#if data.isFallback}
            We are showing the latest confirmed Colordle answer from <span class="font-semibold text-indigo-600">{answerDateLabel}</span> while the live source catches up with newer puzzle dates.
          {:else}
            Verified Colordle hints, the exact color name, and the matching hex code for <span class="font-semibold text-indigo-600">{answerDateLabel}</span>.
          {/if}
        </p>
      </header>

      {#if data.isFallback}
        <div class="mb-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">Source status</p>
          <p class="mt-3 text-base leading-7 text-amber-900">
            The official Colordle source currently only confirms answers through {data.availableThroughFormattedDate}. Until a newer color is published there, this page keeps showing the latest valid answer instead of a broken error state.
          </p>
        </div>
      {/if}

      <div class="mb-12">
        <ColorClues colorName={data.color.name} colorHex={data.color.hex} />
      </div>

      <div class="mb-12 rounded-3xl border border-indigo-100 bg-white p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Quick Actions</p>
            <h2 class="mt-2 text-2xl font-bold text-gray-900">Search previous Colordle answers</h2>
            <p class="mt-2 text-gray-600">
              Compare today with earlier colors, jump into the archive, or open the solver if you want to work through the puzzle yourself.
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

      <article class="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">About today&apos;s Colordle answer</h2>
        <p class="text-gray-600 mb-4 leading-7">
          {#if data.isFallback}
            The latest confirmed Colordle puzzle in our dataset is <strong class="text-indigo-600">#{data.dayNum}</strong>, solved by <strong class="text-gray-900">{data.color.name}</strong> with the hex code <code class="bg-gray-100 px-2 py-1 rounded text-sm">{data.color.hex}</code>. This keeps the page useful and accurate even if the live answer list is a little behind.
          {:else}
            Today&apos;s Colordle puzzle number is <strong class="text-indigo-600">#{data.dayNum}</strong>. The solution color is <strong class="text-gray-900">{data.color.name}</strong>, and the matching hex code is <code class="bg-gray-100 px-2 py-1 rounded text-sm">{data.color.hex}</code>.
          {/if}
        </p>
        <p class="text-gray-600 leading-7">
          People searching for the Colordle answer today usually want three things fast: the exact color name, the hex value, and a quick way to check earlier answers. This page is built around that intent, so the answer card appears first and the searchable archive sits right below it.
        </p>

        <section class="mt-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div class="space-y-4">
            <details class="group bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 overflow-hidden" open>
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900">
                <span>
                  {#if data.isFallback}
                    What is the latest confirmed Colordle answer?
                  {:else}
                    What is the Colordle answer for today, {requestedDateLabel}?
                  {/if}
                </span>
                <FiChevronDown class="text-purple-600 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 leading-7">
                {#if data.isFallback}
                  The latest confirmed Colordle answer we can verify right now is <span class="font-bold text-gray-900">{data.color.name}</span> with hex code <span class="font-mono text-indigo-600 font-bold">{data.color.hex}</span>, published for {answerDateLabel}.
                {:else}
                  The Colordle answer for today, {requestedDateLabel}, is <span class="font-bold text-gray-900">{data.color.name}</span> with hex code <span class="font-mono text-indigo-600 font-bold">{data.color.hex}</span>.
                {/if}
              </div>
            </details>

            {#if data.yesterdayData}
              <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                  <span>
                    {#if data.isFallback}
                      What was the previous confirmed Colordle answer?
                    {:else}
                      What was the Colordle answer for yesterday?
                    {/if}
                  </span>
                  <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div class="p-5 pt-0 text-gray-600 flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg shadow-inner border border-gray-300 flex-shrink-0" style="background-color: {data.yesterdayData.color.hex}"></div>
                  <span>
                    The previous answer was <span class="font-bold text-gray-900">{data.yesterdayData.color.name}</span>
                    <span class="font-mono text-indigo-600">({data.yesterdayData.color.hex})</span>
                    for {data.yesterdayData.formattedDate}.
                  </span>
                </div>
              </details>
            {/if}

            <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                <span>How can I search previous Colordle answers?</span>
                <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 leading-7">
                Use the Colordle archive to browse by calendar date, jump straight to a specific day, or scan recent answers here on the page with the built-in search box.
              </div>
            </details>

            <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                <span>When does the new color release?</span>
                <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 leading-7">
                A new Colordle puzzle is released every day at midnight JST, which is why this page refreshes around the game&apos;s daily rollover rather than on a local midnight schedule.
              </div>
            </details>
          </div>
        </section>

        <section class="mt-10">
          <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Answer history</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900">Latest 100 Colordle answers</h2>
            </div>
            <p class="text-sm text-gray-500 max-w-xl">
              Date and answer format for quick scanning, with the newest confirmed answers first.
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
                  <p class="text-xs text-gray-500">Colordle answer</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">{d.color.name}</p>
                  <p class="font-mono text-sm text-indigo-600">{d.color.hex}</p>
                </div>
              </div>
            {/each}
          </div>
          {#if historySearch.trim() && filteredHistory.length === 0}
            <p class="mt-6 text-center text-gray-500">No Colordle history matched your search.</p>
          {/if}
        </section>
      </article>

      <article class="mt-12 space-y-8">
        <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            How this Colordle answer page helps
          </h2>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            A good Colordle answer today page should do more than just drop a color name. It should confirm the exact hex code, show a visual sample, and make it easy to compare the latest answer with earlier puzzles. That is why this page combines the live answer card, the recent history list, and direct archive links in one place.
          </p>
          <p class="text-lg text-gray-600 leading-relaxed">
            If you are trying to protect a streak, double-check a guess, or simply verify the answer after playing, you should be able to get the information in seconds. The goal here is to keep that workflow simple and dependable every day.
          </p>
        </section>

        <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            What today&apos;s Colordle answer tells you
          </h2>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            In Colordle, the answer is not just a shade on a screen. You need the correct named color and the exact hex code that matches it. That makes the game harder than a normal color picker because two shades can look similar while still counting as different answers.
          </p>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Seeing the official name alongside the hex code helps you build pattern memory. Over time, that makes it easier to recognize families like cool blues, dusty pinks, muted greens, and dark reds before you burn too many guesses.
          </p>
          <p class="text-lg text-gray-600 leading-relaxed">
            The archive matters here too. When you scan older answers, you start noticing how often Colordle returns to familiar tones and naming styles. That context can make today&apos;s puzzle feel far less random.
          </p>
        </section>

        <section class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            How Colordle scoring works
          </h2>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Colordle does not judge guesses by name similarity. It compares colors mathematically. The game uses RGB values and a perceptual color-difference formula so the percentage reflects how close your guess looks to the target, not just how close the hex numbers are.
          </p>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            In the source logic, that comparison is based on Delta E in LAB color space. That is why a tiny visual shift can matter, and why some guesses that feel close can still score lower than expected.
          </p>
          <ul class="list-disc list-inside space-y-3 text-lg text-gray-600">
            <li><strong class="text-gray-900">Use broad opening guesses.</strong> Start with clear anchor colors so the feedback tells you which direction to move.</li>
            <li><strong class="text-gray-900">Watch color temperature.</strong> Warm versus cool is often easier to read than the exact name on your first few tries.</li>
            <li><strong class="text-gray-900">Check the archive.</strong> Previous answers give you a better feel for the naming conventions Colordle tends to use.</li>
          </ul>
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

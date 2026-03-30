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

  const filteredHistory = $derived.by(() => {
    const query = historySearch.trim().toLowerCase();
    if (!query) return data.last100Days;

    return data.last100Days.filter((entry) =>
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
  <meta property="og:image:alt" content={`Colordle hints and answer for ${data.formattedDate ?? 'today'}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta?.title ?? 'Colordle Answer Today'} />
  <meta name="twitter:description" content={data.meta?.description ?? ''} />
  <meta name="twitter:image" content={featuredImage} />
  {#if data.schemas}
    {@html `<script type="application/ld+json">${data.schemas}</script>`}
  {/if}
</svelte:head>

{#if data.error || !data.color}
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Data</h1>
      <p class="text-gray-500">Could not retrieve today's Colordle answer.</p>
    </div>
  </div>
{:else}
  <div class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <figure class="mb-12 overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-lg dark:border-indigo-900/40 dark:bg-gray-800">
        <img
          src={featuredImage}
          alt={`Colordle answer today featured image for ${data.formattedDate}`}
          class="h-auto w-full object-cover"
          loading="eager"
          fetchpriority="high"
        />
        <figcaption class="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
          Colordle answer today
        </figcaption>
      </figure>

      <header class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Colordle Answer Today ({data.formattedDate})
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Verified Colordle hints and the official solution for <span class="font-semibold text-indigo-600 dark:text-indigo-400">{data.formattedDate}</span>
        </p>
      </header>

      <div class="mb-12">
        <ColorClues colorName={data.color.name} colorHex={data.color.hex} />
      </div>

<div class="mb-12 rounded-3xl border border-indigo-100 bg-white p-6 shadow-lg dark:border-indigo-900/40 dark:bg-gray-800">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">Quick Actions</p>
            <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Search previous Colordle answers</h2>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              Jump to the archive to look up older colors, browse past days, or compare today with yesterday.
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
              href="/colordle-archive#archive-answer"
              class="inline-flex items-center justify-center rounded-full border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
            >
              Open Archive Page
            </a>
          </div>
        </div>
      </div>

      <article class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Today's colordle answer</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Today's Colordle puzzle number is <strong class="text-indigo-600 dark:text-indigo-400">#{data.dayNum}</strong>. The solution color is <strong class="text-gray-900 dark:text-white">{data.color.name}</strong> with the hex code <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">{data.color.hex}</code>.
        </p>

        <section class="mt-10">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div class="space-y-4">
            <details class="group bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30 overflow-hidden" open>
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white">
                <span>What is the Colordle answer for today, {data.formattedDate}?</span>
                <FiChevronDown class="text-purple-600 dark:text-purple-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
                The Colordle answer for today, {data.formattedDate}, is <span class="font-bold text-gray-900 dark:text-white">{data.color.name}</span> with hex code <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{data.color.hex}</span>.
              </div>
            </details>

            {#if data.yesterdayData}
              <details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
                <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                  <span>What was the Colordle answer for yesterday?</span>
                  <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div class="p-5 pt-0 text-gray-600 dark:text-gray-300 flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg shadow-inner border border-gray-300 dark:border-gray-600 flex-shrink-0" style="background-color: {data.yesterdayData.color.hex}"></div>
                  <span>
                    Yesterday's answer was <span class="font-bold text-gray-900 dark:text-white">{data.yesterdayData.color.name}</span>
                    <span class="font-mono text-indigo-600 dark:text-indigo-400">({data.yesterdayData.color.hex})</span>
                    for {data.yesterdayData.formattedDate}.
                  </span>
                </div>
              </details>
            {/if}

            <details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <span>How can I search previous Colordle answers?</span>
                <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
                Use the Colordle archive to search older answers, browse by date, and open any previous color solution from the archive page.
              </div>
            </details>

            <details class="group bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600/50 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <span>When does the new color release?</span>
                <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
                A new Colordle puzzle is released every day at midnight JST.
              </div>
            </details>
          </div>
        </section>

        <section class="mt-10">
          <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">Answer history</p>
              <h2 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Colordle answers for the last 100 days</h2>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
              Date - answer format for quick scanning, with the newest answers first.
            </p>
          </div>

          <form class="mb-6 flex overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm dark:border-indigo-800 dark:bg-gray-900/60" onsubmit={(event) => event.preventDefault()}>
            <input
              bind:value={historySearch}
              type="search"
              placeholder="Search by date or color name..."
              class="min-w-0 flex-1 bg-transparent px-5 py-4 text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
            />
            <button
              type="submit"
              class="border-l border-indigo-200 bg-indigo-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-indigo-500 dark:border-indigo-800"
            >
              Search
            </button>
          </form>

          <div class="grid gap-3 md:grid-cols-2">
            {#each filteredHistory as d}
              {#if d}
                <div class="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/20">
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">{d.formattedDate}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Colordle answer</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900 dark:text-white">{d.color.name}</p>
                    <p class="font-mono text-sm text-indigo-600 dark:text-indigo-400">{d.color.hex}</p>
                  </div>
                </div>
              {/if}
            {/each}
          </div>
          {#if historySearch.trim() && filteredHistory.length === 0}
            <p class="mt-6 text-center text-gray-500 dark:text-gray-400">No Colordle history matched your search.</p>
          {/if}
        </section>
      </article>

      <!-- SEO Content Section -->
      <article class="mt-12 space-y-8">
        <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            What is Colordle?
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Colordle is a daily color guessing game that works a bit like Wordle, but instead of guessing words, you're guessing colors. Each day, the game picks a specific color, and your job is to figure out what that color is by making guesses and getting feedback on how close you are.
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            The game gives you hints based on how far your guess is from the target color. It measures this using RGB values â€” the red, green, and blue components that make up every color on your screen. The closer your RGB values are to the target, the warmer you are.
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            What makes Colordle tricky is that you need to know color names. It's not enough to get the right hex code â€” you have to know what that color is actually called. Is it "Crimson" or "Ruby"? "Navy" or "Midnight Blue"? That's where the real challenge lies.
          </p>
        </section>

        <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            How to Play Colordle
          </h2>
          <div class="space-y-6 text-lg text-gray-600 dark:text-gray-300">
            <p class="leading-relaxed">
              Playing Colordle is straightforward once you understand the basics:
            </p>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Step 1: Make Your First Guess</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Start by typing a color name. Common colors like "Red", "Blue", or "Green" are good starting points. The game will show you how close your guess is to the target.
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Step 2: Read the RGB Hints</h3>
              <p class="text-gray-600 dark:text-gray-300">
                After each guess, you'll see how your RGB values compare to the target. If your red value is too low, try a warmer color. If your blue is too high, try something less purple.
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Step 3: Narrow It Down</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Use each guess to get closer. Think about color families â€” is it a warm color or a cool one? Is it light or dark? Is it more red, more blue, or more green?
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Step 4: Name the Exact Color</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Once you've figured out roughly what the color looks like, you need to name it precisely. This is where knowing color names really helps. There are hundreds of named colors out there!
              </p>
            </div>
          </div>
        </section>

        <section class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-purple-100 dark:border-purple-800/30">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Tips for Getting Better at Colordle
          </h2>
          <div class="space-y-4 text-lg text-gray-600 dark:text-gray-300">
            <p class="leading-relaxed">
              Want to improve your Colordle game? Here are some strategies that actually work:
            </p>
            <ul class="list-disc list-inside space-y-3 ml-4">
              <li><strong class="text-gray-900 dark:text-white">Learn color names</strong> â€” The more color names you know, the better. Look up lists of CSS color names or explore paint color charts to expand your vocabulary.</li>
              <li><strong class="text-gray-900 dark:text-white">Understand RGB basics</strong> â€” Knowing that high red + high green = yellow, or that red + blue = purple, helps you make smarter guesses.</li>
              <li><strong class="text-gray-900 dark:text-white">Start broad, then narrow</strong> â€” Begin with primary colors to get a sense of the color family, then zero in on specific shades.</li>
              <li><strong class="text-gray-900 dark:text-white">Use the Colordle Solver</strong> â€” If you're stuck, our solver can help you figure out the color based on your previous guesses and the RGB hints.</li>
              <li><strong class="text-gray-900 dark:text-white">Practice daily</strong> â€” Like any game, you get better with practice. Each day's puzzle teaches you something new about colors.</li>
            </ul>
          </div>
        </section>

        <section class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Why Colordle is Addictive
          </h2>
          <div class="space-y-4 text-lg text-gray-600 dark:text-gray-300">
            <p class="leading-relaxed">
              There's something satisfying about guessing colors. Maybe it's the visual nature of the game â€” you can actually see how close you're getting. Or maybe it's the challenge of translating what you see into words.
            </p>
            <p class="leading-relaxed">
              Unlike word games where you're working with letters, Colordle works with your visual perception. You might see a color and think "that's kind of purple-ish" but then struggle to find the exact name. Is it Lavender? Lilac? Violet? Plum?
            </p>
            <p class="leading-relaxed">
              The game also teaches you something useful. After playing for a while, you start to recognize colors better in real life. You might find yourself saying "that's not just red, that's Crimson" or "this isn't blue, it's Teal." It's a game that makes you more observant of the world around you.
            </p>
          </div>
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




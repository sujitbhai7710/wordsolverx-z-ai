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
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Colordle Answer Today ({answerDateLabel})
        </h1>
        <p class="mx-auto max-w-3xl text-lg leading-8 text-gray-600">
          Verified Colordle hints, the exact color name, and the matching hex code for <span class="font-semibold text-indigo-600">{answerDateLabel}</span>.
        </p>
      </header>

      <div class="mb-12">
        <ColorClues colorName={data.color.name} colorHex={data.color.hex} />
      </div>

      <div class="mb-12 rounded-3xl border border-indigo-100 bg-white p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Quick Actions</p>
            <h2 class="mt-2 text-2xl font-bold text-gray-900">Search previous daily colors</h2>
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
        <h2 class="text-2xl font-bold text-gray-900 mb-4">How we solved today&apos;s puzzle</h2>

        {#if data.gameNarrative && data.gameNarrative.guesses.length > 0}
          <p class="text-gray-600 mb-4 leading-7">
            If you&apos;ve been following this site, you know we&apos;ve been playing Colordle since it launched and posting the daily results here. Today&apos;s puzzle was <strong class="text-gray-900">{data.gameNarrative.difficultyLabel}</strong> — we solved it in <strong class="text-indigo-600">{data.gameNarrative.attempts} {data.gameNarrative.attempts === 1 ? 'attempt' : 'attempts'}</strong>.
            Puzzle <strong class="text-indigo-600">#{data.dayNum}</strong> for {answerDateLabel}.
          </p>

          <div class="space-y-4 mt-6">
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
                      {guess.percent === 100 ? '✓ 100%' : `${guess.percent}%`}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">
                    {#if guess.percent === 100}
                      That was it! {data.color.name} — hex {data.color.hex}.
                    {:else if guess.percent >= 90}
                      So close — the shade was nearly right but the name was off.
                    {:else if guess.percent >= 75}
                      Definitely in the right neighborhood now. Time to narrow down the exact shade.
                    {:else if guess.percent >= 55}
                      Getting warmer. The right color family but still some distance to close.
                    {:else if guess.percent >= 35}
                      Some overlap in temperature, but we were clearly looking in the wrong part of the spectrum.
                    {:else}
                      Not even close. That told us to look in a completely different direction.
                    {/if}
                  </p>
                </div>
              </div>
            {/each}
          </div>

          <p class="text-gray-600 mt-6 leading-7">
            The answer card at the top of this page has the color swatch, hex code, and hints if you want to try the puzzle yourself before peeking. Scroll down for the full guide and searchable archive.
          </p>
        {:else}
          <p class="text-gray-600 mb-4 leading-7">
            Puzzle <strong class="text-indigo-600">#{data.dayNum}</strong> uses the color <strong class="text-gray-900">{data.color!.name}</strong>, and its hex code is <code class="bg-gray-100 px-2 py-1 rounded text-sm">{data.color!.hex}</code>.
          </p>
          <p class="text-gray-600 leading-7">
            The answer card at the top has the color swatch and hints. Scroll down for the full guide and searchable archive.
          </p>
        {/if}

        <nav class="mt-10 rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md" aria-label="Table of Contents">
          <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-4">
            <p class="text-sm font-bold uppercase tracking-[0.25em] text-white/90">Jump to section</p>
          </div>
          <div class="p-5">
            <ol class="grid gap-1 sm:grid-cols-2">
              <li>
                <a href="#frequently-asked-questions" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all group">
                  <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 text-xs font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">1</span>
                  <span class="text-sm font-medium">FAQs</span>
                </a>
              </li>
              <li>
                <a href="#what-is-colordle" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all group">
                  <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-100 text-purple-600 text-xs font-bold group-hover:bg-purple-600 group-hover:text-white transition-colors">2</span>
                  <span class="text-sm font-medium">What is Colordle?</span>
                </a>
              </li>
              <li>
                <a href="#how-to-play-colordle" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all group">
                  <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-pink-100 text-pink-600 text-xs font-bold group-hover:bg-pink-600 group-hover:text-white transition-colors">3</span>
                  <span class="text-sm font-medium">How to play</span>
                </a>
              </li>
              <li>
                <a href="#colordle-tips-and-strategy" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-all group">
                  <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100 text-amber-600 text-xs font-bold group-hover:bg-amber-600 group-hover:text-white transition-colors">4</span>
                  <span class="text-sm font-medium">Tips & Strategy</span>
                </a>
              </li>
              <li>
                <a href="#how-colordle-scoring-works" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all group">
                  <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 text-xs font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">5</span>
                  <span class="text-sm font-medium">How scoring works</span>
                </a>
              </li>
              <li>
                <a href="#colordle-vs-other-daily-games" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all group">
                  <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-600 text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">6</span>
                  <span class="text-sm font-medium">Vs other games</span>
                </a>
              </li>
              <li>
                <a href="#common-color-families" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-all group">
                  <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-100 text-rose-600 text-xs font-bold group-hover:bg-rose-600 group-hover:text-white transition-colors">7</span>
                  <span class="text-sm font-medium">Color families</span>
                </a>
              </li>
              <li>
                <a href="#recent-daily-colors" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all group">
                  <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 text-teal-600 text-xs font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors">8</span>
                  <span class="text-sm font-medium">Recent colors</span>
                </a>
              </li>
            </ol>
          </div>
        </nav>

        <section class="mt-10" id="frequently-asked-questions">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div class="space-y-4">
            <details class="group bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 overflow-hidden" open>
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900">
                <span>What is the Colordle answer for {answerDateLabel}?</span>
                <FiChevronDown class="text-purple-600 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 leading-7">
                For {answerDateLabel}, the daily color is <span class="font-bold text-gray-900">{data.color.name}</span> with hex code <span class="font-mono text-indigo-600 font-bold">{data.color.hex}</span>.
              </div>
            </details>

            {#if data.yesterdayData}
              <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                  <span>What was the previous daily color?</span>
                  <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div class="p-5 pt-0 text-gray-600 flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg shadow-inner border border-gray-300 flex-shrink-0" style="background-color: {data.yesterdayData.color.hex}"></div>
                  <span>
                    The previous daily color was <span class="font-bold text-gray-900">{data.yesterdayData.color.name}</span>
                    <span class="font-mono text-indigo-600">({data.yesterdayData.color.hex})</span>
                    on {data.yesterdayData.formattedDate}.
                  </span>
                </div>
              </details>
            {/if}

            <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                <span>How do you play Colordle?</span>
                <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 leading-7">
                You see a target color and guess a named color. After each guess the game gives you a percentage score showing how close your pick is to the target. You keep guessing until you land on the exact match. There is no guess limit — the challenge is finding the right color in as few tries as possible.
              </div>
            </details>

            <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                <span>How many guesses do you get in Colordle?</span>
                <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 leading-7">
                There is no hard limit on guesses. You can keep trying until you hit 100%. The game tracks how many attempts it took you, and most players aim to solve it in under six guesses.
              </div>
            </details>

            <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                <span>What does the percentage score mean?</span>
                <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 leading-7">
                The percentage reflects how visually similar your guess is to the target color. It is calculated using the CIEDE2000 color-difference formula in LAB color space — the same method used in professional color-matching work. A score of 100 means an exact match, while anything below tells you how far off you are in perceptual terms.
              </div>
            </details>

            <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                <span>When does the new daily color release?</span>
                <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 leading-7">
                A fresh puzzle goes live every day at midnight JST (Japan Standard Time). That means the rollover happens at 3 PM GMT, 11 AM Eastern, or 8 AM Pacific — earlier than most people expect if they are used to a local midnight reset.
              </div>
            </details>

            <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                <span>What is a hex code?</span>
                <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 leading-7">
                A hex code is a six-character string like <code class="bg-gray-100 px-1 rounded text-sm">#FF5733</code> that represents a specific color in the RGB spectrum. The first two characters control red, the middle two control green, and the last two control blue. Values run from <code class="bg-gray-100 px-1 rounded text-sm">00</code> (zero intensity) to <code class="bg-gray-100 px-1 rounded text-sm">FF</code> (full intensity).
              </div>
            </details>

            <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                <span>How can I browse earlier daily colors?</span>
                <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600 leading-7">
                Use the built-in search on this page to scan recent entries by date, color name, or hex code. For the full calendar view, jump to the Colordle archive, which lists every past daily color with its name and hex value.
              </div>
            </details>
          </div>
        </section>
      </article>

      <article class="mt-12 space-y-8">
        <section id="what-is-colordle" class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            What is Colordle?
          </h2>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Colordle is a daily browser game created by Ryan Tanenholz, hosted at colordle.ryantanen.com. It takes the once-a-day puzzle format made popular by Wordle and applies it to color recognition instead of words. Each day, a new target color appears on screen and your job is to guess which named color it is — not by picking from a palette, but by typing color names directly. After every guess the game gives you a percentage score showing how close you are, and you keep refining until you land on the exact match.
          </p>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Colordle is tricky because it uses a library of thousands of named colors, many of which are shades most people have never heard of. You might know "salmon" and "teal," but the game also pulls from names like "smoke," "night sky," and "cheese" — all real colors in its dataset. The name you type has to be an exact match to the one the game expects, which means knowing the name is only half the battle. You also need to figure out which specific variant the puzzle is after.
          </p>
          <p class="text-lg text-gray-600 leading-relaxed">
            A new puzzle drops every day at midnight JST (Japan Standard Time). The game keeps no official streak counter or win/loss record — it simply tells you how many guesses you took. That keeps the focus on the color itself rather than on gamified stats. Still, most regular players treat it like a daily ritual: check the color, make a few educated guesses, and try to solve it faster than the day before.
          </p>
        </section>

        <section id="how-to-play-colordle" class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            How to play Colordle
          </h2>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Getting started with Colordle takes seconds, but getting good at it takes practice. Here is a step-by-step walkthrough of how a typical round plays out, along with tips that help narrow down the answer faster.
          </p>
          <ol class="list-decimal list-inside space-y-5 text-lg text-gray-600 mb-6">
            <li>
              <strong class="text-gray-900">Look at the target color.</strong>
              When you open the game, a colored rectangle fills the screen. Do not just glance at it — pay attention to whether it leans warm (reds, oranges, yellows) or cool (blues, greens, purples). Also note how light or dark it feels. These two observations — temperature and brightness — give you your starting direction.
            </li>
            <li>
              <strong class="text-gray-900">Make your first guess.</strong>
              Type a color name you think matches and submit it. A good opening guess is something broad and well-known like "red," "blue," or "green." The goal here is not to be right — it is to get a percentage that tells you whether you are in the right neighborhood. If "blue" scores 70% but "red" scores 20%, you know the target sits somewhere in the blue family.
            </li>
            <li>
              <strong class="text-gray-900">Read the percentage feedback carefully.</strong>
              After each guess, Colordle shows a score out of 100. This is not a simple RGB distance — it is based on the CIEDE2000 perceptual formula, which accounts for how humans actually see color differences. A 95% match means you are close but off by a shade or two. A 50% match means you are in a broadly related zone but still far from the target.
            </li>
            <li>
              <strong class="text-gray-900">Refine your guess.</strong>
              Use the percentage to move closer. If "blue" scored high, try more specific names: "navy blue," "sky blue," "teal." Each guess narrows the range. Think of it like a binary search — you are halving the possibility space with each attempt. The closer your percentage gets to 100, the tighter the remaining options become.
            </li>
            <li>
              <strong class="text-gray-900">Watch for naming quirks.</strong>
              Colordle pulls from a large color-name database, and some names are not obvious. The target might be "night sky" instead of "dark blue," or "smoke" instead of "gray." If your logical guesses keep scoring in the high 90s without hitting 100, you are probably dealing with an unconventional name. At that point, scanning an archive of previous answers helps — you start recognizing the naming patterns the game uses.
            </li>
            <li>
              <strong class="text-gray-900">Keep going until you hit 100%.</strong>
              There is no guess limit. Some players solve it in three or four tries; others take ten or more on a tough color. The only measure is how efficiently you narrow it down, and over time your intuition for color families and common naming conventions sharpens noticeably.
            </li>
          </ol>
        </section>

        <section id="colordle-tips-and-strategy" class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            Colordle tips and strategy
          </h2>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            If you have been playing Colordle for a while, you have probably noticed that raw guessing only gets you so far. The players who consistently solve puzzles in four or five attempts use a handful of repeatable strategies rather than relying on gut instinct alone. Below are the ones that make the biggest difference.
          </p>

          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Start with a mid-tone anchor</h3>
            <p class="text-lg text-gray-600 leading-relaxed">
              Your first guess should tell you as much as possible about where the target sits. A mid-brightness, mid-saturation color like "gray" or "silver" works well as a baseline because it sits near the center of the color space. The percentage it returns tells you roughly how far away the target is and in which brightness direction. If gray scores 60%, the target is noticeably colorful; if it scores 85%, the target is muted or near-neutral.
            </p>
          </div>

          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Identify warm versus cool early</h3>
            <p class="text-lg text-gray-600 leading-relaxed">
              One of the fastest ways to cut the search space is to determine whether the target leans warm or cool. Guess something clearly warm like "orange" and something clearly cool like "blue." Whatever scores higher tells you which temperature family to focus on. From there, you can narrow to hue families — if warm scored higher, try "red," "orange," "yellow," "brown," and "pink" to find the specific family. This two-guess temperature check alone can save you three or four random guesses.
            </p>
          </div>

          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Adjust one dimension at a time</h3>
            <p class="text-lg text-gray-600 leading-relaxed">
              When you are close — say, scoring in the 90s — stop making big jumps. Instead, change only one property of your guess at a time. If "navy blue" scored 94%, try varying the brightness with "dark blue" or varying the hue with "royal blue." Changing multiple properties at once makes it harder to tell which adjustment helped and which hurt. Think like a scientist running controlled experiments: one variable per guess.
            </p>
          </div>

          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Learn the common hex patterns</h3>
            <p class="text-lg text-gray-600 leading-relaxed">
              In the RGB hex system, certain value pairs show up far more often than others. The "web-safe" values — <code class="bg-gray-100 px-1 rounded text-sm">00</code>, <code class="bg-gray-100 px-1 rounded text-sm">33</code>, <code class="bg-gray-100 px-1 rounded text-sm">66</code>, <code class="bg-gray-100 px-1 rounded text-sm">80</code>, <code class="bg-gray-100 px-1 rounded text-sm">CC</code>, <code class="bg-gray-100 px-1 rounded text-sm">FF</code> — cover the majority of named colors. If you can mentally estimate which of these bands a color falls into, you can skip over large swaths of the color space that do not match. For instance, a medium-lightness warm tone probably has <code class="bg-gray-100 px-1 rounded text-sm">FF</code> or <code class="bg-gray-100 px-1 rounded text-sm">CC</code> in the red channel and lower values in the green and blue channels.
            </p>
          </div>

          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Use the archive to learn naming conventions</h3>
            <p class="text-lg text-gray-600 leading-relaxed">
              One of the more frustrating things about Colordle is that the game sometimes uses color names you would never guess on your own. "Cheese" is a real color. "Blood" is a real color. "Tea" is a real color. Browsing the archive of past solutions trains you to think in terms of the game&apos;s vocabulary rather than just the standard color names you learned in art class. After a few weeks of scanning the archive, you will have a much better sense of what names to try when you are stuck in the high 90s and need that final push to 100.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Use the color wheel for direction</h3>
            <p class="text-lg text-gray-600 leading-relaxed">
              The traditional color wheel is not just a design-school concept — it is genuinely useful in Colordle. Complementary colors (opposite on the wheel) score low against each other, while analogous colors (neighbors on the wheel) score higher. If "green" scored 75%, the target could be a neighboring hue like "teal" or "lime" rather than a distant one like "purple." Visualizing the wheel helps you pick your next guess based on adjacency rather than random hopping around the spectrum.
            </p>
          </div>
        </section>

        <section id="how-colordle-scoring-works" class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            How Colordle scoring works
          </h2>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Understanding how Colordle calculates your score can give you a real edge. The game does not just compare hex codes numerically — if it did, colors that look nearly identical but differ in one RGB channel by a few points would get unfairly penalized, while colors that look completely different but happen to share a hex digit might score too high.
          </p>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Instead, Colordle converts both your guess and the target from RGB to LAB color space. LAB is a three-axis system where L represents lightness (0 = black, 100 = white), A represents the green-to-red axis, and B represents the blue-to-yellow axis. This space was specifically designed to be perceptually uniform — meaning a distance of 10 units in LAB looks like the same amount of visual difference no matter where you are in the space.
          </p>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            From there, the game applies the CIEDE2000 formula (also called Delta E 2000). CIEDE2000 is the current industry standard for measuring color difference, used everywhere from textile manufacturing to digital print proofing. It accounts for the fact that human eyes are more sensitive to small shifts in certain hue ranges than others. For example, we notice tiny differences between greens more readily than similar-sized differences between deep blues. CIEDE2000 weights these differences appropriately.
          </p>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            The final percentage you see is calculated as <code class="bg-purple-100 px-2 py-1 rounded text-sm">100 minus Delta E</code>. So a Delta E of 0 gives you a 100% match, a Delta E of 5 gives you 95%, and anything above a Delta E of 100 starts to approach 0%. In practice, most guesses land between 20% and 80% until you get close, at which point each percentage point matters more.
          </p>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            This scoring system explains a few things that trip up new players. First, two colors that look similar on screen can have very different names and still score reasonably high — because the perceptual distance between them is small. Second, a guess that feels intuitively close might score lower than expected if the color difference falls in a part of the spectrum where human vision is particularly sensitive. Third, the last few points between 97% and 100% are often the hardest because even tiny shifts in hue or saturation push you further away in LAB space.
          </p>
          <p class="text-lg text-gray-600 leading-relaxed">
            Knowing this, the best approach when you are in the high 90s is to make the smallest possible adjustment to your guess. If you guessed "sky blue" and scored 97%, do not jump to a completely different name like "cerulean." Instead, try the closest neighbors: "light blue," "baby blue," or "azure." Small, controlled moves in naming space mirror small, controlled moves in color space — and that is exactly what the CIEDE2000 math rewards.
          </p>
        </section>

        <section id="colordle-vs-other-daily-games" class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            Colordle vs other daily games
          </h2>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            The daily-puzzle genre has exploded since Wordle went viral, and Colordle occupies a distinct niche within it. Here is how it compares to a few popular alternatives.
          </p>
          <div class="grid gap-6 md:grid-cols-2">
            <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Colordle vs Wordle</h3>
              <p class="text-gray-600 leading-relaxed">Wordle tests your vocabulary and deduction with five-letter words. Colordle tests your color perception and knowledge of color names. Wordle gives you letter-by-letter feedback; Colordle gives you a single percentage. Both reset daily, but the skill sets are completely different — being good at one does not guarantee being good at the other.</p>
            </div>
            <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Colordle vs Semantle</h3>
              <p class="text-gray-600 leading-relaxed">Semantle also uses a percentage-based feedback system, but for word similarity rather than color. The mental process is similar — make a broad guess, then narrow based on feedback — except Colordle is visual while Semantle is purely linguistic. If you enjoy Semantle&apos;s gradual-convergence style, Colordle scratches the same itch from a different angle.</p>
            </div>
            <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Colordle vs Colorfle</h3>
              <p class="text-gray-600 leading-relaxed">Colorfle is another color-based daily puzzle, but it works differently. In Colorfle you guess RGB hex values directly, adjusting sliders to match the target. Colordle asks for named colors instead, which means you need vocabulary rather than precision slider control. Both reward color sense, but Colorfle is more technical while Colordle is more about color-name knowledge.</p>
            </div>
            <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Colordle vs traditional color matching</h3>
              <p class="text-gray-600 leading-relaxed">Professional color-matching tools like Pantone swatches or Delta E calculators are built for accuracy. Colordle repurposes that same Delta E math into a game. If you have ever worked in design, printing, or textiles, your professional color-matching instincts translate directly to Colordle — you will probably find yourself solving puzzles faster than players without that background.</p>
            </div>
          </div>
        </section>

        <section id="common-color-families" class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            Common color families in Colordle
          </h2>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            After playing hundreds of rounds, you start noticing that Colordle&apos;s answers tend to cluster around certain families. Knowing these patterns helps you make smarter first and second guesses rather than shooting in the dark.
          </p>
          <div class="grid gap-4 md:grid-cols-3">
            <div class="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 border border-red-100">
              <h3 class="font-bold text-gray-900 mb-2">Warm naturals</h3>
              <p class="text-sm text-gray-600">Sand, gold, copper, bronze, rust, mahogany, sienna, chestnut, cinnamon, caramel. These earthy tones show up constantly and tend to sit in the brown-to-orange range.</p>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
              <h3 class="font-bold text-gray-900 mb-2">Cool naturals</h3>
              <p class="text-sm text-gray-600">Navy, teal, jade, emerald, slate, steel blue, cadet blue, sea green, aqua. These lean blue-green and often have low-to-medium brightness.</p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
              <h3 class="font-bold text-gray-900 mb-2">Soft pastels</h3>
              <p class="text-sm text-gray-600">Lavender, periwinkle, blush, peach, mint, ivory, cream, lilac. High lightness with moderate saturation — they look washed out but have distinct hue identities.</p>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
              <h3 class="font-bold text-gray-900 mb-2">Greens and naturals</h3>
              <p class="text-sm text-gray-600">Sage, moss, forest green, olive, hunter green, lime. Colordle loves greens — they appear more often than you would expect and often under unusual names like "moss" or "sage."</p>
            </div>
            <div class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200">
              <h3 class="font-bold text-gray-900 mb-2">Neutrals and grays</h3>
              <p class="text-sm text-gray-600">Smoke, pewter, slate, ash, fog, silver, charcoal. These are the trickiest because they score close to many colors but only one name is the exact match.</p>
            </div>
            <div class="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-100">
              <h3 class="font-bold text-gray-900 mb-2">Unexpected names</h3>
              <p class="text-sm text-gray-600">Cheese, blood, tea, snot, hot, snow, pickle, cucumber. These are the ones that catch you off guard. The percentage might be 98% and you still cannot find the name because it is nothing you would normally associate with that color.</p>
            </div>
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

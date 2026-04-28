<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import QuordleAnswerCard from '$lib/components/QuordleAnswerCard.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import FiChevronDown from '$lib/components/icons/FiChevronDown.svelte';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta name="news_keywords" content={data.meta.keywords ?? 'quordle answer today, quordle answer, quordle hint, quordle hint today'} />
  <link rel="canonical" href="https://wordsolverx.com/quordle-answer-today" />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<div class="bg-slate-50 dark:bg-slate-800/30 min-h-screen font-sans">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <header class="text-center mb-12">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/40 rounded-full text-teal-700 dark:text-teal-300 text-sm font-semibold mb-4">
        <span class="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
        Updated Daily
      </div>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-50 mb-6">
        Quordle Answer Today ({data.formattedDate})
      </h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        <span class="font-semibold text-slate-900 dark:text-slate-100">{data.formattedDate}</span> — Get hints and solutions for
        <span class="text-teal-600 dark:text-teal-400 font-bold">Classic</span>,
        <span class="text-blue-600 dark:text-blue-400 font-bold">Chill</span>,
        <span class="text-red-600 dark:text-red-400 font-bold">Extreme</span>,
        <span class="text-violet-600 dark:text-violet-400 font-bold">Sequence</span>,
        <span class="text-amber-600 dark:text-amber-400 font-bold">Rescue</span>, and
        <span class="text-pink-600 dark:text-pink-400 font-bold">Weekly</span>.
      </p>
    </header>

    <div class="flex flex-wrap justify-center gap-3 mb-12">
      <a href="/quordle-archive" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
        Browse Archive
      </a>
    </div>

    <div class="mb-16">
      <QuordleAnswerCard date={data.today} />
    </div>

    <article class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Frequently Asked Questions</h2>
      <div class="space-y-4">
        <details class="group bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-200 dark:border-teal-800/40 overflow-hidden" open>
          <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100 hover:bg-teal-100/50 dark:hover:bg-teal-900/30 transition-colors">
            <span>What is the Quordle answer for today, {data.formattedDate}?</span>
            <FiChevronDown class="text-teal-600 dark:text-teal-400 group-open:rotate-180 transition-transform" />
          </summary>
          <div class="p-5 pt-0 text-slate-600 dark:text-slate-400">
            The Quordle answer for today, {data.formattedDate}, is <span class="font-bold text-slate-900 dark:text-slate-100 uppercase">{data.todayWords}</span>.
          </div>
        </details>
        <details class="group bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <span>When does Quordle reset?</span>
            <FiChevronDown class="text-slate-400 dark:text-slate-500 group-open:rotate-180 transition-transform" />
          </summary>
          <div class="p-5 pt-0 text-slate-600 dark:text-slate-400">
            Quordle resets every day at midnight JST for Daily modes. The Weekly puzzle resets every Monday.
          </div>
        </details>

        <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">Recent Quordle Answers</h3>
        {#each data.last10Days as d}
          {#if d}
            <details class="group bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <span>What was the Quordle answer for {d.formattedDate}?</span>
                <FiChevronDown class="text-slate-400 dark:text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-slate-600 dark:text-slate-400">
                The Quordle answer for {d.formattedDate} was <span class="font-bold text-slate-900 dark:text-slate-100 uppercase">{d.d.join(', ').replace(/, ([^,]*)$/, ', and $1')}</span>.
              </div>
            </details>
          {/if}
        {/each}
      </div>
    </article>

    <!-- Comprehensive SEO Article -->
    <article class="mt-12 space-y-8">
      <!-- What is Quordle? -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-5 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          What Is Quordle?
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Quordle is a Wordle variant that cranks the difficulty to a different level. Instead of solving one five-letter word, you solve four simultaneously. Your single guess applies to all four boards at once, and each board gives you its own color-coded feedback. You get nine guesses total to nail all four words. That's three extra guesses compared to Wordle's six — and you will need every single one of them.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Quordle was created by Freddie Meyer, a software engineer who built the game in early 2022 after being inspired by other Wordle variants like Dordle (two boards) and Octordle (eight boards). Meyer has publicly stated that Quordle grew from a weekend side project into something that attracted millions of daily players. The game is free to play on the official Quordle website and requires no sign-up or download.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          What makes Quordle distinctive among the dozens of Wordle clones is its balance. Octordle (8 boards) and Sedecordle (16 boards) feel more like endurance tests than puzzles. Quordle's four-board format is challenging enough to feel like a real accomplishment when you solve it, but not so overwhelming that casual players give up. That balance is why Quordle has maintained a loyal player base while other variants have faded.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          The game has also been embraced by the competitive word puzzle community. On Reddit's r/quordle, players share strategies, debate optimal starting words, and celebrate (or commiserate over) their daily results. The game's shareable emoji grid format — inherited from Wordle — means you can show off your solve pattern to friends without spoiling the actual answers.
        </p>
      </section>

      <!-- How Quordle Works -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-5 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          How Quordle Works: Mechanics, Rules, and the Daily Cycle
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Quordle's rules are nearly identical to Wordle, multiplied by four. You type a five-letter word and press Enter. Each of the four boards evaluates your guess independently. Green tiles mean correct letter, correct position (for that specific board). Yellow means the letter is in that board's word but misplaced. Gray means the letter isn't in that board's word. The key difference: a letter that's gray on one board might be green on another. Each board is its own independent puzzle.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          You have nine guesses to solve all four words. If you fail to solve any single board within nine guesses, the game reveals the remaining answers. There is no partial credit — you either solve all four or you don't. The daily puzzle resets at midnight JST (Japan Standard Time), which is 9 hours ahead of UTC. This means new Quordle puzzles appear at different local times depending on your timezone: 11 AM ET (previous day), 4 PM GMT (previous day), or 8 AM AEST (same day).
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Quordle's answer pool uses the same curated list as Wordle — roughly 2,300 common five-letter words. This means if a word is a valid Wordle answer, it's also a valid Quordle answer. The guess validation works similarly: you can type any recognized five-letter English word, not just words from the answer list. The keyboard at the bottom shows aggregate feedback across all four boards, which can sometimes be confusing — a letter might show as yellow on the keyboard even if it's only yellow on one board and gray on the other three.
        </p>
      </section>

      <!-- Today's Quordle Answer -->
      <section class="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40 rounded-xl p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Today's Quordle Answer: How to Find It
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          This page updates daily with all six Quordle modes: Classic, Chill, Extreme, Sequence, Rescue, and Weekly. Each mode has its own set of four words (except Weekly, which is a single extended puzzle). Scroll up to see the interactive answer cards for each mode, or use the show/hide buttons to reveal the answers one mode at a time.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The QuordleAnswerCard component at the top of this page fetches today's puzzle data from our local database, which is synchronized with the official Quordle word list. The card displays structured hints before the full reveal — vowel counts, starting letters, and double-letter information — so you can get just enough help without seeing the complete answers.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          For past Quordle answers, our archive page has every solution dating back months. The accordion section above also lists the last 10 days of Classic answers. Each entry shows the exact date and all four words for that day.
        </p>
      </section>

      <!-- Past Quordle Answers -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-5 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Past Quordle Answers: Archives and Word Patterns
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Quordle has been running since early 2022, and its answer pool draws from the same list as Wordle. This means many Quordle answers overlap with Wordle answers — you might recognize a word from a previous Wordle puzzle. However, because Quordle presents four words per day, the combined pattern across all four boards is always unique.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Looking at Quordle's answer history, there's no detectable pattern in which four words get paired together on any given day. The selection appears random within the constraints of the answer pool. Some days feature four words that share a thematic link (all animals, all verbs ending in -E) — but these coincidences are just that, coincidences. The game doesn't intentionally create themed puzzles.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          The Extreme mode uses words from a more obscure subset of the five-letter dictionary. These words are valid English but less commonly known — think "GLYPH," "KUDOS," or "ZESTY" rather than "SLATE" or "CRANE." If you're stuck on an Extreme puzzle, it's often because one or more of the four words uses uncommon letter combinations that you wouldn't naturally guess.
        </p>
      </section>

      <!-- Quordle Game Modes Explained -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-5 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Quordle Game Modes Explained
        </h2>
        <div class="space-y-6 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          <p class="leading-relaxed">
            Quordle offers six distinct game modes, each with its own rules and difficulty level:
          </p>
          <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-6 border border-teal-200 dark:border-teal-800/40">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Classic</h3>
            <p class="text-slate-600 dark:text-slate-400">
              Four random five-letter words, nine guesses, no special constraints. This is the standard Quordle experience and the mode most players start with. The words come from the standard answer pool, so they're common English words. Classic resets daily at midnight JST.
            </p>
          </div>
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/40">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Chill</h3>
            <p class="text-slate-600 dark:text-slate-400">
              Same four-board format as Classic, but with no streak tracking. Chill mode exists purely for practice. If you're learning Quordle or want to experiment with different strategies without risking your win streak, this is the mode to use. The puzzle words are drawn from the same pool as Classic.
            </p>
          </div>
          <div class="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800/40">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Extreme</h3>
            <p class="text-slate-600 dark:text-slate-400">
              Four words selected from a harder subset of the dictionary. Extreme words are valid English but significantly less common — expect words with unusual letter patterns, less frequent vowels, and consonant clusters you rarely see in everyday language. This mode has a much lower average solve rate than Classic.
            </p>
          </div>
          <div class="bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-6 border border-violet-200 dark:border-violet-800/40">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Sequence</h3>
            <p class="text-slate-600 dark:text-slate-400">
              You must solve the four boards in order — top-left first, then top-right, then bottom-left, then bottom-right. You cannot advance to the next board until you've solved the current one. This forces a sequential approach that eliminates the "broad information gathering" strategy that works in Classic. You have nine total guesses across all four boards.
            </p>
          </div>
          <div class="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800/40">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Rescue</h3>
            <p class="text-slate-600 dark:text-slate-400">
              Rescue mode gives you more guesses (typically 11 instead of 9) but introduces a twist: one of the four words is partially revealed at the start. This "rescued" word has some letters already filled in, giving you a head start on one board. The trade-off is that the remaining three words may be more challenging.
            </p>
          </div>
          <div class="bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-6 border border-pink-200 dark:border-pink-800/40">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Weekly</h3>
            <p class="text-slate-600 dark:text-slate-400">
              A larger puzzle that resets every Monday instead of daily. Weekly mode typically presents more boards or a longer word sequence, giving you a multi-day challenge. It resets at midnight JST on Mondays, giving you a full week to complete it at your own pace.
            </p>
          </div>
        </div>
      </section>

      <!-- Tips for Quordle -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-5 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Quordle Strategy: How to Win Consistently
        </h2>
        <div class="space-y-6 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Spend your first 3 guesses on information</h3>
            <p class="leading-relaxed">
              The biggest mistake new Quordle players make is trying to solve boards early. Your first three guesses should be almost entirely about eliminating letters. Use words that cover the most common letters: "SLATE," "CRANE," or "PILOT" as your opener, then follow up with words that test the remaining high-frequency letters. After three well-chosen guesses, you should have a clear picture of which letters are on which boards.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Solve the easiest board first</h3>
            <p class="leading-relaxed">
              Once you've gathered enough information, look for the board where you have the most letters confirmed. Solve that one first. Getting a board out of the way reduces your mental load and gives you more guesses to focus on the harder puzzles. Many experienced players can identify the "easy" board by guess 4 or 5.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Don't waste guesses on single boards</h3>
            <p class="leading-relaxed">
              Every guess applies to all four boards. If you're choosing between two words that would solve one board, pick the one that also provides information on the other boards. A guess that solves one board but tells you nothing about the other three is a wasted guess in Quordle's economy. Information is your most valuable resource.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Learn common Quordle letter overlaps</h3>
            <p class="leading-relaxed">
              Since all four words come from the same answer pool, they tend to share common English letter patterns. Vowel-heavy guesses like "AUDIO" or "ADIEU" can quickly reveal which boards contain which vowels. Consonant clusters like "STR-", "PL-", and "-CK" appear frequently across Quordle boards. Learning these patterns speeds up your information gathering significantly.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Use a Quordle solver when you're truly stuck</h3>
            <p class="leading-relaxed">
              There's no shame in using a solver. If you're on guess 8 and still have two unsolved boards with 20+ possible words each, human intuition alone won't save you. Our Quordle Solver tool lets you input the known letters for each board and generates a ranked list of candidate words. It's a tool, not a cheat — like using a calculator for arithmetic.
            </p>
          </div>
        </div>
      </section>

      <!-- Quordle Statistics -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-5 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Quordle Statistics: What the Numbers Say
        </h2>
        <div class="space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          <div class="grid sm:grid-cols-2 gap-6 my-6">
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~6.2</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Average guesses to solve all four</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Most experienced players finish in 5-7 guesses</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~72%</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Daily Classic solve rate</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Lower than Wordle's ~97% due to the 4-board difficulty</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~48%</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Extreme mode solve rate</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Significantly harder due to obscure word choices</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">6 modes</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Active game modes</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Classic, Chill, Extreme, Sequence, Rescue, Weekly</p>
            </div>
          </div>
          <p class="leading-relaxed">
            Quordle's average solve rate sits around 72% for Classic mode — notably lower than Wordle's 97%. The gap makes sense: solving four independent puzzles in nine guesses requires more precision and information management. The most common failure point is guess 8 or 9, when players have 2-3 boards remaining with multiple possible words on each. At that point, the combinatorial explosion of possibilities often exceeds what human pattern-matching can handle.
          </p>
          <p class="leading-relaxed">
            The most common Quordle starting words among high-performing players are "SLATE," "CRANE," and "PILOT." These words cover the most frequent letters in the answer pool. The optimal three-guess opening sequence (based on information theory analysis) can reduce the average remaining possibilities per board to under 10 words — which is usually solvable within the remaining 6 guesses.
          </p>
        </div>
      </section>

      <!-- FAQ -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-5 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Quordle FAQ: Common Questions Answered
        </h2>
        <div class="space-y-6 text-base text-slate-600 dark:text-slate-400">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Is Quordle harder than Wordle?</h3>
            <p class="leading-relaxed">
              Yes, substantially. Wordle gives you 6 guesses for 1 word (a 6:1 ratio). Quordle gives you 9 guesses for 4 words (a 2.25:1 ratio). You have less than half the guesses per word compared to Wordle. The need to manage information across four boards simultaneously adds a layer of cognitive complexity that Wordle doesn't have. Most players who solve Wordle in 3-4 guesses will find Quordle challenging.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">What time does Quordle reset?</h3>
            <p class="leading-relaxed">
              Quordle resets at midnight JST (Japan Standard Time). In US Eastern Time, that's 11:00 AM the previous day. In GMT, it's 3:00 PM the previous day. In Australian Eastern Time, it's 2:00 AM. The Weekly puzzle resets every Monday at the same time.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Can I play Quordle on mobile?</h3>
            <p class="leading-relaxed">
              Yes. Quordle runs in any mobile browser. The official site at quordle.com is mobile-responsive and works well on both iOS and Android devices. There is no official Quordle app — any app claiming to be Quordle in the App Store or Google Play is unofficial. Bookmark the website instead.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Does Quordle use the same word list as Wordle?</h3>
            <p class="leading-relaxed">
              For Classic and Chill modes, yes — Quordle draws from the same ~2,300-word answer list that Wordle uses. Extreme mode uses a harder subset. The guess validation list is also similar, accepting any recognized five-letter English word. If a word is valid in Wordle, it's almost certainly valid in Quordle.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">What's the difference between Quordle and Octordle?</h3>
            <p class="leading-relaxed">
              Octordle gives you eight boards instead of four, and you get 13 guesses instead of 9. That's 1.625 guesses per word (Octordle) versus 2.25 guesses per word (Quordle). Octordle is harder per board but gives you more total guesses to spread around. Quordle is generally considered the better-balanced game — challenging without being overwhelming.
            </p>
          </div>
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
      <InternalLinkSection currentGame="Quordle" />
    </div>
  </div>
</div>

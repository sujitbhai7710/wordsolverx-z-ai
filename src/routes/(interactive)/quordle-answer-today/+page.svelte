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
  <link rel="canonical" href="https://wordsolver.tech/quordle-answer-today" />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<div class="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-sans">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <header class="text-center mb-12">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-semibold mb-4">
        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        Updated Daily
      </div>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Quordle Answer Today ({data.formattedDate})
      </h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        <span class="font-semibold text-gray-900">{data.formattedDate}</span> — Get hints and solutions for
        <span class="text-emerald-600 font-bold">Classic</span>,
        <span class="text-blue-600 font-bold">Chill</span>,
        <span class="text-red-600 font-bold">Extreme</span>,
        <span class="text-violet-600 font-bold">Sequence</span>,
        <span class="text-amber-600 font-bold">Rescue</span>, and
        <span class="text-pink-600 font-bold">Weekly</span>.
      </p>
    </header>

    <div class="flex flex-wrap justify-center gap-3 mb-12">
      <a href="/quordle-archive" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl font-medium shadow-sm border border-gray-200 hover:bg-gray-50 transition-all">
        Browse Archive
      </a>
    </div>

    <div class="mb-16">
      <QuordleAnswerCard date={data.today} />
    </div>

    <article class="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
      <div class="space-y-4">
        <details class="group bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100 overflow-hidden" open>
          <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-emerald-100/50 transition-colors">
            <span>What is the Quordle answer for today, {data.formattedDate}?</span>
            <FiChevronDown class="text-emerald-600 group-open:rotate-180 transition-transform" />
          </summary>
          <div class="p-5 pt-0 text-gray-600">
            The Quordle answer for today, {data.formattedDate}, is <span class="font-bold text-gray-900 uppercase">{data.todayWords}</span>.
          </div>
        </details>
        <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
          <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
            <span>When does Quordle reset?</span>
            <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
          </summary>
          <div class="p-5 pt-0 text-gray-600">
            Quordle resets every day at midnight JST for Daily modes. The Weekly puzzle resets every Monday.
          </div>
        </details>

        <h3 class="text-lg font-bold text-gray-900 mt-8 mb-4">Recent Quordle Answers</h3>
        {#each data.last10Days as d}
          {#if d}
            <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                <span>What was the Quordle answer for {d.formattedDate}?</span>
                <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div class="p-5 pt-0 text-gray-600">
                The Quordle answer for {d.formattedDate} was <span class="font-bold text-gray-900 uppercase">{d.d.join(', ').replace(/, ([^,]*)$/, ', and $1')}</span>.
              </div>
            </details>
          {/if}
        {/each}
      </div>
    </article>

    <!-- SEO Content Section -->
    <article class="mt-12 space-y-8">
      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">
          What is Quordle?
        </h2>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          Quordle takes the Wordle concept and multiplies it by four. Instead of guessing one five-letter word, you're solving four puzzles at the same time. Each guess you make applies to all four boards, and you get color-coded feedback for each one. It sounds chaotic, but that's what makes it so engaging.
        </p>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          The game gives you nine guesses to solve all four words — that's three more than regular Wordle, but trust us, you'll need them. Managing four boards simultaneously requires a different kind of thinking. You can't just focus on one puzzle; you have to keep track of what's happening across all of them.
        </p>
        <p class="text-lg text-gray-600 leading-relaxed">
          Quordle has become hugely popular among word game enthusiasts who find Wordle too easy. If you're someone who regularly solves Wordle in three guesses or less, Quordle offers the challenge you've been looking for.
        </p>
      </section>

      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">
          Quordle Game Modes Explained
        </h2>
        <div class="space-y-6 text-lg text-gray-600">
          <p class="leading-relaxed">
            Quordle offers several game modes to keep things interesting:
          </p>
          <div class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Classic</h3>
            <p class="text-gray-600">
              The standard Quordle experience. Four random words, nine guesses, no special rules. This is where most people start and where you'll probably spend most of your time.
            </p>
          </div>
          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Chill</h3>
            <p class="text-gray-600">
              A more relaxed version with no streak pressure. Great for practicing or when you just want to play without the stress of maintaining your stats.
            </p>
          </div>
          <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Extreme</h3>
            <p class="text-gray-600">
              For true masochists. The words are more obscure, and you get fewer hints. Only attempt this if you're confident in your word game skills.
            </p>
          </div>
          <div class="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Sequence</h3>
            <p class="text-gray-600">
              You must solve the puzzles in order — first the top-left, then top-right, and so on. This changes your strategy significantly since you can't use early guesses to gather information across all boards.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">
          How to Win at Quordle
        </h2>
        <div class="space-y-6 text-lg text-gray-600">
          <p class="leading-relaxed">
            Winning at Quordle requires a different approach than Wordle. Here's what experienced players do:
          </p>
          <div class="bg-gray-50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Use Information-Gathering Guesses</h3>
            <p class="text-gray-600">
              Your first 2-3 guesses should be about learning letters, not solving puzzles. Use words with common letters and see what shows up across all four boards. Don't try to solve any single puzzle until you have good information.
            </p>
          </div>
          <div class="bg-gray-50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Prioritize the Easy Ones</h3>
            <p class="text-gray-600">
              Once you've gathered information, look for the board where you have the most letters figured out. Solve that one first. Getting one word off your plate reduces mental load and frees up guesses for the harder puzzles.
            </p>
          </div>
          <div class="bg-gray-50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Don't Waste Guesses on Single Boards</h3>
            <p class="text-gray-600">
              Every guess should help you with multiple boards if possible. If you're choosing between two words, pick the one that tests letters you haven't tried yet. Information is your most valuable resource.
            </p>
          </div>
          <div class="bg-gray-50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-3">Use Our Quordle Solver</h3>
            <p class="text-gray-600">
              When you're truly stuck, our Quordle Solver can help. Enter the letters you know for each board, and it will show you possible words that fit. It's like having a word-savvy friend looking over your shoulder.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl p-8 border border-emerald-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">
          Why Quordle is So Addictive
        </h2>
        <div class="space-y-4 text-lg text-gray-600">
          <p class="leading-relaxed">
            There's something uniquely satisfying about solving four puzzles at once. Each board is like its own little mystery, and watching them all come together feels like completing a puzzle where the pieces are words.
          </p>
          <p class="leading-relaxed">
            The game also rewards a different kind of thinking than Wordle. In Wordle, you're focused on one target. In Quordle, you're juggling four targets simultaneously. It's like playing chess on four boards at once — challenging, but incredibly rewarding when you pull it off.
          </p>
          <p class="leading-relaxed">
            Plus, Quordle's multiple game modes mean you never get bored. If Classic feels too easy, try Extreme. If you want pressure-free practice, there's Chill. The variety keeps the game fresh even after months of daily play.
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
      <InternalLinkSection currentGame="Quordle" />
    </div>
  </div>
</div>

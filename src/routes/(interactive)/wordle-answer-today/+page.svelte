<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import WordleDisplayWrapper from '$lib/components/WordleDisplayWrapper.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';
  import type { WordleAnswer } from '$lib/api';

  let { data } = $props();

  function formatDateForFAQ(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta name="keywords" content={data.meta.keywords ?? 'wordle answer today, wordle answer, wordle hint, wordle hint today'} />
  <meta name="news_keywords" content="wordle, wordle answer, wordle today, nyt wordle, daily word puzzle" />
  <link rel="canonical" href="https://wordsolver.tech/wordle-answer-today" />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:image" content={data.meta.socialImage} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://wordsolver.tech/wordle-answer-today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content={data.meta.socialImage} />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.meta.title,
    description: data.meta.description,
    url: 'https://wordsolver.tech/wordle-answer-today'
  })}</script>`}
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-slate-50 dark:bg-slate-800/30 font-sans">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <WordleDisplayWrapper
      wordleData={data.wordleData}
      wordleWord={data.wordleWord}
      wordleNumber={data.wordleNumber}
      formattedDate={data.formattedDate}
      pageContext="today"
      contentGuide={data.wordleData?.content_guide}
      bonusHints={data.generatedArticle?.bonusHints ?? []}
      socialImage={data.directSocialImage}
      youtubeVideoUrl={data.wordleData?.youtube_video_url}
    />

    <!-- Recent Wordle Answers Table -->
    {#if data.recentAnswers.length > 1}
      <section class="mt-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] p-6 sm:p-8 overflow-hidden">
        <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
          <span class="w-2 h-8 bg-teal-500 rounded-full"></span>
          Recent Wordle Answers
        </h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead class="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Wordle #</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Answer</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {#each data.recentAnswers as answer}
                <tr class="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 {answer.date === data.wordleData?.date ? 'bg-teal-50/50 dark:bg-teal-900/20' : ''}">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-slate-100">#{answer.id}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{formatDateForFAQ(answer.date)}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200">
                      {answer.solution.toUpperCase()}
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    {/if}

    <!-- Comprehensive SEO Article -->
    <article class="mt-12 space-y-8">
      <!-- What is Wordle? -->
      <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          What Is Wordle?
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Wordle is a daily five-letter word guessing game created by Josh Wardle, a Brooklyn-based software engineer. Wardle built the prototype in 2021 as a private game for himself and his partner, Palak Shah, who loves word puzzles. After months of private play, Wardle released Wordle to the public in October 2021. By January 2022, it had over 2 million daily players, and The New York Times bought it for a sum reported to be "in the low seven figures."
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The concept is straightforward: guess a five-letter word in six tries or fewer. After each guess, the game highlights each letter in one of three colors. Green means the letter is correct and in the right position. Yellow means the letter is in the word but in the wrong spot. Gray means the letter is not in the word at all. That color-coded feedback loop is the entire mechanic, and its simplicity is precisely what drove Wordle's viral explosion.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          What separates Wordle from other word games is the one-puzzle-per-day constraint. Everyone gets the same word, and once you solve it, you wait until midnight for the next one. This scarcity turned Wordle into a shared social experience. People started posting their emoji grids on Twitter, WhatsApp groups, and family text threads. The game became a daily ritual for millions — not because it was complex, but because it gave people something small to bond over.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          The NYT edition of Wordle, edited by Tracy Bennett, maintains the core experience but expanded the answer list from the original 2,315 words. Common answers tend to be everyday English words: "CRANE," "SLATE," "TRACE," "CRATE," and "ADIEU" are popular starting guesses. The answer pool avoids obscure words, profanity, and plurals ending in "S" (though this rule has exceptions). As of mid-2025, the game has run through over 1,400 daily puzzles without repeating a single answer.
        </p>
      </section>

      <!-- How Wordle Works -->
      <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          How Wordle Works: Mechanics and the Daily Cycle
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Wordle resets at midnight in your local time zone (specifically, midnight EST for the NYT version). Each day's puzzle is numbered sequentially — Wordle #1 launched on June 19, 2021, and the counter has incremented every day since. The puzzle number is a direct count of days since that launch date. If today is Wordle #1450, that means 1,450 puzzles have been published.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The answer for each day is predetermined. The game is entirely client-side JavaScript — the entire solution list is embedded in the page source code, and your browser determines which word corresponds to today's date. This means technically savvy players could inspect the source to find tomorrow's answer early, though the NYT has taken steps to obfuscate this in recent updates.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          When you type a valid five-letter word and hit Enter, each letter tile flips to reveal its color. The keyboard at the bottom also updates — correct letters turn green, present-but-misplaced letters turn yellow, and absent letters turn gray. This keyboard state carries through your entire session, giving you a persistent reference of which letters you've eliminated. Hard Mode, an optional setting, forces you to use revealed hints in subsequent guesses — if a letter turns yellow, you must include it in your next guess.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          The game accepts roughly 12,000 valid five-letter English words as guesses but draws answers from a curated list of roughly 2,300 common words. This distinction matters: you can guess "XYLYL" if you want, but the answer will never be that obscure. Understanding this helps narrow your strategy. The most common starting letters in Wordle answers are S, C, B, T, and P. The most common ending letters are E, Y, T, R, and L.
        </p>
      </section>

      <!-- Today's Wordle Answer -->
      <section class="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40 rounded-xl p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Today's Wordle Answer: How to Find It
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          This page is updated daily with the current Wordle answer, puzzle number, and date. We pull the answer from the NYT API and fall back to a secondary source if the primary request fails. The answer appears at the top of this page inside an interactive tile display — click or tap to reveal it letter by letter, or just scroll past if you want to try solving it yourself first.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The puzzle number tells you exactly which day it is in Wordle's timeline. If you see "Wordle #1450" at the top, you can count backward to any previous puzzle. Our archive page lets you look up any historical Wordle answer by date or puzzle number. We maintain records going back to the very first Wordle puzzle.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          We also provide structured hints before the full reveal: vowel count, whether the word has repeating letters, starting and ending letters, and a pronunciation guide. These clues are generated automatically for each day's puzzle, so they're always accurate and specific to the current word.
        </p>
      </section>

      <!-- Past Wordle Answers -->
      <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Past Wordle Answers: Archives and Patterns
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The table above shows recent Wordle answers with their puzzle numbers and dates. Our full Wordle answer archive covers every puzzle since launch. You can browse it to spot patterns in the NYT's word selection — for example, the editors tend to avoid words with uncommon letter combinations (like "Q" without "U") and favor words with everyday usage frequency.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Looking at historical data, the most common starting letters in Wordle answers are S (appearing in roughly 12% of answers), C (about 9%), B (about 8%), and T (about 7%). The letter E appears in roughly 30% of all Wordle answers. Vowel-heavy words (those with 3+ vowels) show up roughly once every 5–7 puzzles. Words with double letters appear about 15–20% of the time.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The NYT has never repeated an answer since taking over the game. This means every Wordle puzzle is unique, and the pool of unused answers is slowly shrinking. At the current rate of one puzzle per day, the original list will be exhausted around 2028 — at which point the editors will either expand the list or start repeating (something they've confirmed they'll deal with when the time comes).
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          If you're studying past answers to improve your strategy, pay attention to which words the editors choose versus which words are merely valid guesses. The answer list skews toward words most English speakers would recognize. If a word feels too obscure to be an answer, it probably is. This heuristic alone will eliminate hundreds of candidates from your mental word list.
        </p>
      </section>

      <!-- Tips for Wordle -->
      <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Wordle Strategy: Tips That Actually Improve Your Average
        </h2>
        <div class="space-y-6 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Start with a strong opener</h3>
            <p class="leading-relaxed">
              Your first guess should cover the most common letters in English. "SLATE," "CRANE," "TRACE," and "ADIEU" are all strong openers because they test 4–5 of the most frequent letters. Research by data scientists shows that "SLATE" leaves the lowest average number of remaining possibilities after the first guess (around 61 remaining words). "CRANE" and "TRACE" are close behind. Avoid starting with words that have repeating letters — "SASSY" tests only 4 unique letters, which is less efficient.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Use your second guess to eliminate letters</h3>
            <p class="leading-relaxed">
              On your second guess, prioritize letters you haven't tested yet. If your opener was "SLATE" and you got no hits, your second guess should avoid S, L, A, T, and E entirely. Words like "CROUD," "BIMPY," or "HINDS" would be ideal in that scenario because they test entirely new letters. The goal after two guesses is to have enough information that only a handful of candidates remain.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Track yellow letter positions carefully</h3>
            <p class="leading-relaxed">
              Yellow letters are the trickiest part of Wordle. When a letter turns yellow, you know it's in the word but not where it currently is. The common mistake is putting that yellow letter in the same position on your next guess. Instead, try the letter in every other position first. If "A" turns yellow in position 2, your next guess should place "A" in position 1, 3, 4, or 5 — not position 2 again. Also remember: if a letter appears twice in the answer, a single yellow result might mean one instance is correct and the other isn't.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Don't forget Hard Mode trade-offs</h3>
            <p class="leading-relaxed">
              Hard Mode forces you to use all revealed hints, which sounds harder but actually simplifies your decision-making. The downside is that you can get trapped — if you discover three correct letters but they form an unusual pattern, you might burn guesses testing valid combinations. If you play Hard Mode and find yourself stuck on guess 4 or 5 with no viable options, the answer probably has a letter combination you haven't considered. Think about less common word endings: -IGHT, -OUND, -ANGE, -OUGH.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Know the most common Wordle word endings</h3>
            <p class="leading-relaxed">
              Roughly 30% of Wordle answers end in E. Another 15% end in Y. Together, those two endings account for nearly half of all answers. After that, T (about 8%), R (about 6%), and L (about 5%) round out the top five. If you have four letters placed and are deciding between two endings, check which ending is more statistically common. This doesn't guarantee the answer, but it improves your odds.
            </p>
          </div>
        </div>
      </section>

      <!-- Wordle Statistics -->
      <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Wordle Statistics: What the Data Tells Us
        </h2>
        <div class="space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          <p class="leading-relaxed">
            Based on analysis of all Wordle answers since the NYT takeover, here are the patterns that matter for your strategy:
          </p>
          <div class="grid sm:grid-cols-2 gap-6 my-6">
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~3.92</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Average guesses to solve</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Across all players, the mean is just under 4 guesses</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~0.8%</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Words with Q, X, Z, or J</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Less than 1% of answers use the rarest consonants</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~17%</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Words with double letters</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">LL, EE, SS, OO, and TT are the most common doubles</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~2,315</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Original answer pool size</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">The NYT has expanded this list since taking over</p>
            </div>
          </div>
          <p class="leading-relaxed">
            The most common Wordle answers of all time include words like "CRANE," "SLATE," "TRACE," "CRATE," "STARE," and "SNARE." These words share common traits: they use high-frequency letters, avoid uncommon patterns, and feel like "normal" English words. The least common type of Wordle answer is one that starts with a vowel followed by an uncommon consonant pattern — words like "EIGHT" or "ALOFT" are rare compared to consonant-heavy starters.
          </p>
          <p class="leading-relaxed">
            On the player side, the NYT reports that roughly 1% of players solve on guess 1, 5% on guess 2, 20% on guess 3, 33% on guess 4, 24% on guess 5, 14% on guess 6, and about 3% fail. If you're consistently solving in 3–4 guesses, you're outperforming the majority of players. The average reported guess distribution has shifted slightly lower over time as players have gotten more strategic with their opening words.
          </p>
        </div>
      </section>

      <!-- FAQ -->
      <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Wordle FAQ: Questions Players Ask Every Day
        </h2>
        <div class="space-y-6 text-base text-slate-600 dark:text-slate-400">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">What time does Wordle reset?</h3>
            <p class="leading-relaxed">
              Wordle resets at midnight in your local time zone. If you're in the Eastern US, the new puzzle appears at 12:00 AM EST. If you're in the UK, it resets at midnight GMT. The NYT servers roll over the puzzle based on your device's clock, so there's no single global reset time — it depends on where you are.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Can I play old Wordle puzzles?</h3>
            <p class="leading-relaxed">
              The official NYT Wordle site only shows today's puzzle. However, you can access previous answers through our Wordle Answer Archive, which lists every solution by date and puzzle number. The NYT also has a puzzle archive feature for subscribers, though it requires a subscription to the NYT Games section.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Does Wordle repeat answers?</h3>
            <p class="leading-relaxed">
              No — at least not yet. Since the NYT took over in February 2022, every daily Wordle puzzle has used a unique answer. The original answer list contained 2,315 words, and the editors have been working through them sequentially. With roughly 1,400+ puzzles published as of mid-2025, the list still has several years of unique words remaining.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">What's the best starting word for Wordle?</h3>
            <p class="leading-relaxed">
              Based on mathematical analysis of the answer list, "SLATE" is the optimal starter because it tests 5 high-frequency letters and leaves the fewest remaining candidates on average. "CRANE," "TRACE," and "CRATE" are within a few percentage points. If you prefer a vowel-heavy opener, "ADIEU" tests 4 vowels but only 1 consonant, which makes it efficient for finding vowels but slow at eliminating consonants. The best approach is to pick one opener and use it consistently so you learn the patterns.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">What happens if I miss a day?</h3>
            <p class="leading-relaxed">
              Nothing — you just miss that day's puzzle. Wordle doesn't penalize you for missing days, and your streak (if you use the NYT's tracking) resets to zero. If maintaining your streak matters to you, bookmark this page and check the answer before midnight. Our archive also has every past answer, so you can always look up what you missed.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Is Wordle getting harder?</h3>
            <p class="leading-relaxed">
              The NYT says no, and the data largely supports that. The average solve rate has remained consistent at around 97% since the takeover. However, perception matters — some weeks feel harder than others because the editors occasionally cluster words with similar patterns. If you've had a rough streak, it's probably variance, not a deliberate difficulty increase. The answer list was curated for consistency from the start.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">How is the Wordle editor chosen?</h3>
            <p class="leading-relaxed">
              Tracy Bennett has been the Wordle editor since the NYT acquired the game. She curates the answer list, ensures no repeats, and maintains the game's difficulty balance. Before each puzzle goes live, the answer is checked against various criteria: commonality, offensiveness potential, and playability. Bennett has described the role as "creating a daily experience that feels fair but not too easy."
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

    <!-- Internal Linking -->
    <div class="mt-16">
      <InternalLinkSection currentGame="Wordle" />
    </div>
  </div>
</main>

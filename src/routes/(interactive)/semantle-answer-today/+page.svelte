<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import SemantleClues from '$lib/components/SemantleClues.svelte';
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
  <title>{data.meta?.title ?? 'Semantle Answer Today'}</title>
  <meta name="description" content={data.meta?.description ?? ''} />
  <meta name="news_keywords" content={data.meta?.keywords ?? 'semantle answer today, semantle answer, semantle hint, semantle hint today'} />
  <link rel="canonical" href="https://wordsolver.tech/semantle-answer-today" />
  {#if data.schemas}
    {@html `<script type="application/ld+json">${data.schemas}</script>`}
  {/if}
</svelte:head>

{#if data.error || !data.word || !data.puzzleNumber}
  <div class="min-h-screen bg-slate-50 dark:bg-slate-800/30 flex items-center justify-center">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">Semantle Answer Not Available</h2>
      <p class="text-slate-500 dark:text-slate-400">Unable to load today's puzzle. Please try again later.</p>
    </div>
  </div>
{:else}
  <div class="bg-slate-50 dark:bg-slate-800/30 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/40 rounded-full text-teal-700 dark:text-teal-300 text-sm font-semibold mb-4">
          <span class="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
          Updated Daily
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
          Semantle Answer Today ({data.formattedDate})
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400">
          {data.formattedDate} &bull; Puzzle <span class="font-mono font-bold text-teal-700 dark:text-teal-400">#{data.puzzleNumber}</span>
        </p>
      </header>

      <div class="mb-12">
        <SemantleClues
          word={data.word}
          puzzleNumber={data.puzzleNumber}
          definition={data.clues?.definition}
          rhymes={data.clues?.rhymes ?? []}
          synonyms={data.clues?.synonyms ?? []}
          disableClientFetch={true}
        />
      </div>

      <div class="flex justify-center gap-4 mb-12">
        <a href="/semantle-archive" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700 transition-all">
          Browse Archive
        </a>
      </div>

      <article class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">About Today's Puzzle</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          Today's Semantle puzzle number is <strong class="text-teal-700 dark:text-teal-400">#{data.puzzleNumber}</strong>.
          The secret word is <strong class="text-slate-900 dark:text-slate-100 uppercase">{data.word}</strong>.
        </p>

        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <details class="group bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-200 dark:border-teal-800/40 overflow-hidden">
            <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
              <span>What is the Semantle answer for today, {data.formattedDate}?</span>
              <FiChevronDown class="text-teal-600 dark:text-teal-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div class="p-5 pt-0 text-slate-600 dark:text-slate-400">
              The Semantle answer for today is <span class="font-bold text-slate-900 dark:text-slate-100 uppercase">{data.word}</span> (Puzzle #{data.puzzleNumber}).
            </div>
          </details>

          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">Recent Semantle Answers</h3>
          {#each data.last10Days as d}
            {#if d}
              <details class="group bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <span>What was the Semantle answer for {d.formattedDate}?</span>
                  <FiChevronDown class="text-slate-400 dark:text-slate-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div class="p-5 pt-0 text-slate-600 dark:text-slate-400">
                  The answer was <span class="font-bold text-slate-900 dark:text-slate-100 uppercase">{d.word}</span> (Puzzle #{d.puzzleNumber}).
                </div>
              </details>
            {/if}
          {/each}
        </div>
      </article>

      <!-- Comprehensive SEO Article -->
      <article class="mt-12 space-y-8">
        <!-- What is Semantle? -->
        <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            What Is Semantle?
          </h2>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Semantle is a daily word game built around semantic similarity rather than spelling or letter patterns. Created by David Turner (also known as "Wandering Life"), the game launched in early 2022 as an open-source project and quickly attracted a loyal following among puzzle enthusiasts and NLP researchers alike. The core idea is simple: guess a word, any word, and the game tells you how close your guess is to the secret word — not by spelling, but by meaning.
          </p>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            The game uses word2vec, a neural network model developed by Google researchers in 2013, to map words into a mathematical space where similar words cluster together. "Happy" and "joy" are neighbors. "Car" and "bicycle" share a neighborhood. "Quantum" and "recipe" live on opposite sides of the map. When you guess a word, Semantle measures the cosine similarity between your guess and the secret word — essentially, the angle between their vectors in this high-dimensional space.
          </p>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            The scoring system assigns a number from approximately -100 to +100. A perfect match (the secret word itself) scores near 100. Words closely related to the answer score in the 50-80 range. Moderately related words score 20-50. Weakly related words score below 20. Negative scores are rare but possible — they indicate that your guess is semantically opposed to the answer, though the relationship is more about vector direction than literal opposition.
          </p>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            What makes Semantle unique among word games is its accessibility to non-English speakers and people with different vocabulary levels. You don't need to know how to spell obscure words — you need to understand how concepts relate. A person with a large conceptual vocabulary but poor spelling skills might excel at Semantle while struggling with Wordle. The game has been described as "the word game for people who think in ideas, not letters."
          </p>
        </section>

        <!-- How Semantle Works -->
        <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            How Semantle Works: Scoring, Similarity, and the Daily Cycle
          </h2>
          <div class="space-y-6 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            <p class="leading-relaxed">
              Understanding the scoring system is the key to playing Semantle well:
            </p>
            <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Cosine similarity scores</h3>
              <p class="leading-relaxed">
                Every guess receives a similarity score measured as a decimal (e.g., 0.72) or percentage. The game displays the top 1,000 closest words at all times, so you can see where your guesses rank relative to each other. A score above 0.70 means you're very close — within the same semantic neighborhood as the answer. Scores between 0.30-0.70 suggest you're in the right general area. Below 0.30, and you're in a different conceptual domain entirely.
              </p>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">The "warm" and "cold" spectrum</h3>
              <p class="leading-relaxed">
                Unlike Wordle's binary feedback (letter is or isn't present), Semantle gives you continuous feedback. If your first guess scores 0.05 and your second scores 0.15, you know you're moving in the right direction. If your third drops to 0.08, you've wandered off course. Tracking these directional changes is the primary skill in Semantle. Many players mentally plot their guesses on a graph to visualize the semantic terrain.
              </p>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Word2vec and its quirks</h3>
              <p class="leading-relaxed">
                The word2vec model that Semantle uses was trained on a large corpus of English text (primarily Google News articles). This means the model reflects the statistical patterns of written English — including biases and cultural associations present in the training data. For example, "doctor" might be closer to "man" than "woman" in the vector space, reflecting gender biases in the training corpus. The model also captures surprising associations: "penguin" is close to "emperor" because of "Emperor Penguin," and "France" is close to "cheese."
              </p>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Unlimited guesses, no pressure</h3>
              <p class="leading-relaxed">
                Semantle has no guess limit and no time pressure. You can spend five minutes or five hours on a single puzzle. The daily puzzle resets at midnight based on the game's server time. The puzzle number increments by one each day, and Semantle has been running continuously since its launch in early 2022. The game maintains a complete history of all past puzzles and answers.
              </p>
            </div>
          </div>
        </section>

        <!-- Today's Semantle Answer -->
        <section class="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40 rounded-xl p-6 sm:p-8">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            Today's Semantle Answer: How to Find It
          </h2>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Today's Semantle answer is displayed in the clues section above. The SemantleClues component shows you the word length, vowel count, starting and ending letters, a definition hint, rhyming words, and synonyms before you reveal the full answer. Click "Reveal Answer" when you're ready, or use these structured hints to try solving it yourself first.
          </p>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            The answer for puzzle #{data.puzzleNumber} ({data.formattedDate}) is fetched from our local Semantle database, which tracks every daily puzzle since the game's launch. The clues are generated by querying the Datamuse API for the secret word's definition, rhymes, and synonyms. This gives you multiple angles of approach — if the definition doesn't help, maybe a rhyme or synonym will spark the right association.
          </p>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            For past puzzles, the accordion above lists the last 10 Semantle answers with their puzzle numbers. Our full archive page has every historical answer searchable by date or puzzle number.
          </p>
        </section>

        <!-- Past Semantle Answers -->
        <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            Past Semantle Answers: Archives and Word Patterns
          </h2>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Semantle answers span the full English vocabulary — common nouns, verbs, adjectives, adverbs, and even some multi-word expressions. Looking at historical data, common answer themes include emotions ("happy," "anger," "fear"), everyday objects ("chair," "window," "phone"), abstract concepts ("time," "freedom," "truth"), and natural phenomena ("rain," "wind," "mountain"). The game doesn't appear to favor any particular word category — the selection seems to draw broadly from the word2vec vocabulary.
          </p>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            One pattern worth noting: Semantle answers tend to be words with rich semantic neighborhoods. Words like "light" (which can mean illumination, not heavy, or low in alcohol) have multiple semantic connections and are easier to find through the similarity scoring system. Words with very narrow meanings (technical terms, proper nouns) are less common as answers, likely because they'd be nearly impossible to guess even with many attempts.
          </p>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Our archive tracks every Semantle puzzle and answer. You can use it to spot trends, study which word categories appear most often, or just look up a puzzle you missed. The archive is searchable by date and puzzle number, making it easy to find any specific day's answer.
          </p>
        </section>

        <!-- Tips for Semantle -->
        <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            Semantle Strategy: Solving Puzzles Faster
          </h2>
          <div class="space-y-6 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            <p class="leading-relaxed">
              Semantle rewards a specific type of thinking. Here are strategies that consistently help players solve puzzles faster:
            </p>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Start with foundational categories</h3>
                <p class="leading-relaxed">
                  Your first 5-10 guesses should be broad, foundational words: "person," "thing," "place," "action," "feeling," "time," "money," "food," "water," "home." These anchor words cover major semantic domains and quickly tell you which area the answer lives in. If "feeling" scores 0.45 but "thing" scores 0.05, you know the answer is an emotion or psychological state.
                </p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Follow the semantic trail systematically</h3>
                <p class="leading-relaxed">
                  When a word scores well, explore related concepts in a structured way. If "music" scores 0.60, try "song," "instrument," "guitar," "piano," "concert," "band," "melody," "rhythm," "note." Cover the sub-domains systematically rather than jumping randomly between associations. This methodical approach maps the semantic neighborhood more efficiently.
                </p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Think in word families and associations</h3>
                <p class="leading-relaxed">
                  When you're in the right domain, think about word families. If the answer is related to "drive," also try "road," "car," "wheel," "steer," "engine," "speed," "highway." The word2vec model captures these associative chains. A word that's only tangentially related to the answer through a chain of associations can still score relatively high.
                </p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Watch for the "surprise" direction</h3>
                <p class="leading-relaxed">
                  Sometimes your best guess takes you in an unexpected direction. If "dog" scores 0.30 and "cat" scores 0.25, but "loyalty" scores 0.40, the answer might be an abstract concept associated with dogs rather than the animal itself. Pay attention when a seemingly unrelated word outperforms your domain-specific guesses — it might reveal a hidden association.
                </p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Use the top-1000 list as a compass</h3>
                <p class="leading-relaxed">
                  Semantle always shows you your closest guesses ranked within the top 1,000 words. Use this list as a directional tool. If your guesses cluster around rank 200-500, look at the words near rank 100-200 for clues about what semantic territory you're in. The words at the top of the list share the most semantic features with the answer.
                </p>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Don't overlook common, simple words</h3>
                <p class="leading-relaxed">
                  The most frustrating Semantle puzzles are the ones where the answer is a simple, common word you'd never think to guess because you're overcomplicating it. Words like "run," "set," "put," "get," and "make" have rich semantic neighborhoods and can take 100+ guesses to find. If you've been searching in complex domains for a long time, step back and try simple, everyday words.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Semantle Statistics -->
        <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            Semantle Statistics: Understanding the Game's Difficulty
          </h2>
          <div class="space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            <div class="grid sm:grid-cols-2 gap-6 my-6">
              <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
                <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">Unlimited</p>
                <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Guesses per puzzle</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">No limit — difficulty is purely semantic</p>
              </div>
              <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
                <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~50-200</p>
                <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Average guesses to solve</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Varies enormously by answer difficulty</p>
              </div>
              <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
                <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~40,000</p>
                <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Words in the word2vec model</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">All valid guesses ranked by similarity</p>
              </div>
              <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
                <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">Open source</p>
                <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Built with word2vec</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Uses Google's pre-trained word vectors</p>
              </div>
            </div>
            <p class="leading-relaxed">
              Semantle doesn't publish official player statistics, but community-reported data suggests the average solve takes 50-200 guesses. Easy words (those with strong semantic associations) can be solved in 20-50 guesses. Hard words (abstract concepts, polysemous words like "set" or "run") can take 200-500 guesses. The most difficult Semantle answers are common words with broad but shallow semantic neighborhoods — words that relate to many different domains but don't belong strongly to any single one.
            </p>
            <p class="leading-relaxed">
              The word2vec model that powers Semantle was trained on roughly 100 billion words from Google News. This gives the model an enormous vocabulary with nuanced semantic relationships. However, it also means the model reflects the biases and patterns present in news text — words that frequently co-occur in headlines (like "government" and "policy") will be closer in the vector space than their actual conceptual relationship might warrant.
            </p>
          </div>
        </section>

        <!-- FAQ -->
        <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            Semantle FAQ: Common Questions from Players
          </h2>
          <div class="space-y-6 text-base text-slate-600 dark:text-slate-400">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">What's the difference between Semantle and Contexto?</h3>
              <p class="leading-relaxed">
                Both games use semantic similarity, but they differ in presentation. Semantle shows a numeric similarity score (cosine similarity from word2vec) and always displays your top guesses ranked in order. Contexto uses a simpler ranking system (rank 1 to rank 15,000) and doesn't show a continuous score. Semantle's word2vec model and Contexto's embedding model are trained on different data, so the same word pair can have different similarity scores in each game.
              </p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Is Semantle harder than Wordle?</h3>
              <p class="leading-relaxed">
                It depends on your strengths. Semantle has no guess limit, which removes time pressure. But the search space is vastly larger — Wordle narrows to 2,300 possible answers, while Semantle's vocabulary includes ~40,000 words. Semantle rewards conceptual thinking and vocabulary breadth, while Wordle rewards pattern recognition and letter-frequency knowledge. Many players find both games challenging in different ways.
              </p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Can proper nouns be Semantle answers?</h3>
              <p class="leading-relaxed">
                Occasionally, yes. The word2vec model includes many proper nouns (country names, city names, famous people), and these can appear as answers. If you've been guessing common words for 100+ tries without getting close, try proper nouns in the domain you've identified. Country names, city names, and brand names are all valid guesses.
              </p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">What time does Semantle reset?</h3>
              <p class="leading-relaxed">
                Semantle resets at midnight based on the server's timezone. The puzzle number increments by one each day. The game has been running since early 2022, and the puzzle numbers reflect the total number of days since launch. Our answer page synchronizes with the official Semantle schedule.
              </p>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">What is word2vec?</h3>
              <p class="leading-relaxed">
                Word2vec is a two-layer neural network model developed by Tomas Mikolov and colleagues at Google in 2013. It takes a large corpus of text and learns dense vector representations for each word — essentially, turning words into mathematical coordinates where similar words are positioned close together. The model captures semantic relationships like analogies (king - man + woman ≈ queen) and category membership. Semantle uses a pre-trained word2vec model trained on Google News data.
              </p>
            </div>
          </div>
        </section>
      </article>

      <div class="mb-12">
        <AuthorCard
          name={PRESTON_HAYES_AUTHOR_NAME}
          image={PRESTON_HAYES_AUTHOR_IMAGE}
          description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
        />
      </div>

      <div class="mt-16">
        <InternalLinkSection currentGame="Semantle" />
      </div>
    </div>
  </div>
{/if}

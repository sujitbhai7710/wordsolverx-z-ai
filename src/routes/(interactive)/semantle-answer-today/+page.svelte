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
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Semantle Answer Not Available</h2>
      <p class="text-gray-500">Unable to load today's puzzle. Please try again later.</p>
    </div>
  </div>
{:else}
  <div class="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4">
          Semantle Answer Today ({data.formattedDate})
        </h1>
        <p class="text-lg text-gray-600">
          {data.formattedDate} &bull; Puzzle <span class="font-mono font-bold text-indigo-600">#{data.puzzleNumber}</span>
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
        <a href="/semantle-archive" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all">
          Browse Archive
        </a>
      </div>

      <article class="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">About Today's Puzzle</h2>
        <p class="text-gray-600 mb-6">
          Today's Semantle puzzle number is <strong class="text-indigo-600">#{data.puzzleNumber}</strong>.
          The secret word is <strong class="text-gray-900 uppercase">{data.word}</strong>.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <details class="group bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 overflow-hidden">
            <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900">
              <span>What is the Semantle answer for today, {data.formattedDate}?</span>
              <FiChevronDown class="text-purple-600 group-open:rotate-180 transition-transform" />
            </summary>
            <div class="p-5 pt-0 text-gray-600">
              The Semantle answer for today is <span class="font-bold text-gray-900 uppercase">{data.word}</span> (Puzzle #{data.puzzleNumber}).
            </div>
          </details>

          <h3 class="text-lg font-bold text-gray-900 mt-8 mb-4">Recent Semantle Answers</h3>
          {#each data.last10Days as d}
            {#if d}
              <details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                <summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                  <span>What was the Semantle answer for {d.formattedDate}?</span>
                  <FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div class="p-5 pt-0 text-gray-600">
                  The answer was <span class="font-bold text-gray-900 uppercase">{d.word}</span> (Puzzle #{d.puzzleNumber}).
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
            What is Semantle?
          </h2>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Semantle is a word game with a twist - it is not about spelling, it is about meaning. Instead of guessing letters, you are trying to find a secret word based on how semantically similar your guesses are. The game uses word embeddings, which is a fancy way of saying it understands how words relate to each other conceptually.
          </p>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Here is how it works: you type a word, any word, and the game gives you a similarity score. A score of 100 means you have found the exact word. Lower scores mean you are getting warmer or colder, but not in a letter-by-letter way - in a meaning-by-meaning way. It is like playing a game of "hot or cold" with concepts instead of hidden objects.
          </p>
          <p class="text-lg text-gray-600 leading-relaxed">
            Semantle has no guess limit. You can try hundreds of words if you need to. The challenge is not about running out of tries - it is about figuring out what direction to explore. If "dog" scores 15 and "cat" scores 20, you know you are heading toward animals. But if "philosophy" scores 35, suddenly you are in a completely different territory.
          </p>
        </section>

        <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            How Semantle Scoring Works
          </h2>
          <div class="space-y-6 text-lg text-gray-600">
            <p class="leading-relaxed">
              Understanding the scoring system is key to playing Semantle well:
            </p>
            <div class="bg-gray-50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-3">Similarity Scores</h3>
              <p class="text-gray-600">
                Every guess gets a score from -100 to 100. A score of 100 means you've found the exact word. Scores above 70 are very close - you're in the right conceptual neighborhood. Scores between 30-70 suggest moderate similarity. Below 30, and you're pretty far off.
              </p>
            </div>
            <div class="bg-gray-50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-3">The "Getting Warm" Feeling</h3>
              <p class="text-gray-600">
                Unlike Wordle where you get immediate visual feedback, Semantle requires you to track patterns mentally. If your scores are trending upward, you're moving in the right direction conceptually. Pay attention to which types of words give higher scores.
              </p>
            </div>
            <div class="bg-gray-50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-3">Word Relationships</h3>
              <p class="text-gray-600">
                The game understands synonyms, antonyms, categories, and associations. If the secret word is "happy," words like "joy," "smile," and "pleased" will score highly. But so might "emotion" or "feeling" because they're conceptually related.
              </p>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            Tips for Solving Semantle
          </h2>
          <div class="space-y-6 text-lg text-gray-600">
            <p class="leading-relaxed">
              Semantle requires a different kind of thinking than other word games. Here are strategies that actually help:
            </p>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                <h3 class="text-xl font-bold text-gray-900 mb-3">Start Broad</h3>
                <p class="text-gray-600">
                  Begin with general categories: "thing," "person," "place," "action," "feeling." See which direction scores highest, then narrow down from there.
                </p>
              </div>
              <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
              <h3 class="text-xl font-bold text-gray-900 mb-3">Follow the Trail</h3>
              <p class="text-gray-600">
                  When a word scores well, explore related concepts. If "music" scores 40, try "song," "instrument," "melody," "rhythm" - follow the semantic path.
              </p>
              </div>
              <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                <h3 class="text-xl font-bold text-gray-900 mb-3">Think Abstractly</h3>
                <p class="text-gray-600">
                  Semantle answers can be abstract concepts, not just concrete objects. Words like "freedom," "memory," or "possibility" are fair game.
                </p>
              </div>
              <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                <h3 class="text-xl font-bold text-gray-900 mb-3">Use a Thesaurus Mindset</h3>
                <p class="text-gray-600">
                  Think about synonyms, related fields, and word associations. If you're stuck, mentally flip through a thesaurus and try different angles.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            Why Semantle is Different
          </h2>
          <div class="space-y-4 text-lg text-gray-600">
            <p class="leading-relaxed">
              Most word games test your vocabulary or spelling. Semantle tests your understanding of how concepts relate to each other. It's less about knowing words and more about understanding meaning.
            </p>
            <p class="leading-relaxed">
              This makes Semantle both frustrating and fascinating. You might know the word but not realize it's the answer because you're thinking about it wrong. Or you might stumble onto the answer by accident while exploring a completely different direction.
            </p>
            <p class="leading-relaxed">
              The unlimited guesses also change the dynamic. There's no pressure, no ticking clock. You can spend hours exploring the semantic space, learning about word relationships you never considered. It's as much a learning experience as it is a game.
            </p>
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

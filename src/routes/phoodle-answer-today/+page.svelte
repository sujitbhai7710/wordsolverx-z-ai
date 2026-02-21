<script lang="ts">
  import PhoodleAnswerCard from '$lib/components/PhoodleAnswerCard.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta?.title}</title>
  <meta name="description" content={data.meta?.description} />
  <meta property="og:title" content={data.meta?.title} />
  <meta property="og:description" content={data.meta?.description} />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta?.title} />
  <meta name="twitter:description" content={data.meta?.description} />
  {#if data.schemas}
    {@html `<script type="application/ld+json">${data.schemas}</script>`}
  {/if}
</svelte:head>

{#if data.error || !data.word}
  <div class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center p-8">
      <h2 class="text-3xl font-bold mb-4 text-gray-900">Phoodle Answer Not Available</h2>
      <p class="text-gray-600">Unable to load today's puzzle. Please try again later.</p>
      <a href="/today" class="mt-6 inline-block px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-medium">
        ← Back to Today's Hub
      </a>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <header class="text-center mb-12">
        <div class="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full text-orange-600 mb-6">
          <span class="text-4xl">🍽️</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
          Today's Phoodle Answer
        </h1>
        <p class="text-lg text-gray-600 font-medium">{data.formattedDate}</p>
      </header>

      <!-- Answer Card -->
      <PhoodleAnswerCard
        word={data.word}
        date={data.formattedDate}
        description={data.description}
        recipe_name={data.recipe_name}
      />

      <!-- Quick Links -->
      <div class="flex flex-col sm:flex-row justify-center gap-4 mb-16">
        <a href="/phoodle-answer-yesterday" class="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-orange-50 text-gray-700 border border-gray-200 rounded-2xl font-bold transition-all shadow-sm group">
          Yesterday's Answer
        </a>
        <a href="/phoodle-archive" class="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-amber-50 text-gray-700 border border-gray-200 rounded-2xl font-bold transition-all shadow-sm group">
          Browse Archive
        </a>
      </div>

      <!-- Content & FAQs -->
      <article class="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span class="w-2 h-8 bg-orange-500 rounded-full inline-block"></span>
          About Today's Puzzle
        </h2>
        <p class="text-gray-600 mb-6 leading-relaxed text-lg">
          The Phoodle answer for <strong class="text-gray-900">{data.formattedDate}</strong> is
          <span class="px-2 py-1 bg-green-100 text-green-700 rounded font-bold uppercase">{data.word}</span>.
          Phoodle is a delicious twist on the classic word-guessing game, featuring food-related terms every day.
        </p>

        <div class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 mb-8 border-l-4 border-l-orange-500">
          <h3 class="text-lg font-bold text-orange-700 mb-2 flex items-center gap-2">💡 Daily Hint</h3>
          <p class="text-gray-700">
            The word "<strong class="text-orange-800">{data.word}</strong>" has {data.word.length} letters, starts with "{data.word[0].toUpperCase()}",
            and ends with "{data.word[data.word.length - 1].toUpperCase()}". Next time, think about everything related to cooking and dining!
          </p>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div class="space-y-10">
          <div class="border-b border-gray-200 pb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-3">What is the Phoodle answer for today, {data.formattedDate}?</h3>
            <p class="text-gray-600 leading-relaxed text-lg">
              The Phoodle answer for today, {data.formattedDate}, is <span class="font-black text-orange-600 uppercase tracking-widest px-2 py-0.5 bg-orange-50 rounded-lg border border-orange-100">{data.upperWord}</span>.
            </p>
          </div>
          <div class="border-b border-gray-200 pb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-2">What is Phoodle?</h3>
            <p class="text-gray-600">
              Phoodle is a daily word puzzle game focused on food-related words. Similar to Wordle, you have six attempts to guess the five-letter food word, with color-coded hints after each guess to guide you.
            </p>
          </div>
          <div class="border-b border-gray-200 pb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-2">When does Phoodle reset?</h3>
            <p class="text-gray-600">
              A new Phoodle puzzle is available every day. The answer updates at midnight JST, providing a fresh challenge for foodies worldwide.
            </p>
          </div>

          {#if data.last10Days}
            {#each data.last10Days as d}
              {#if d}
                <div class="border-b border-gray-100 pb-8 last:border-0">
                  <h3 class="text-lg font-bold text-gray-900 mb-2">What was the Phoodle answer for {d.formattedDate}?</h3>
                  <p class="text-gray-600 leading-relaxed text-lg">
                    The Phoodle answer for {d.formattedDate} was <span class="font-black text-orange-600 uppercase tracking-widest px-2 py-0.5 bg-orange-50 rounded-lg border border-orange-100">{d.word.toUpperCase()}</span>.
                  </p>
                </div>
              {/if}
            {/each}
          {/if}
        </div>
      </article>
    </div>
  </div>
{/if}

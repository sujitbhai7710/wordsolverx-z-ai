<script lang="ts">
  import PhoodleAnswerCard from '$lib/components/PhoodleAnswerCard.svelte';

  let { data } = $props();
  let pageTitle = $derived(data.meta?.title ?? "Phoodle Answer Today | WordSolverX");
  let pageDescription = $derived(
    data.meta?.description ??
      "Get today's Phoodle answer, food-themed hints, recent solutions, and the latest verified daily update from WordSolverX."
  );
  let pageSchema = $derived(JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description: pageDescription,
    url: 'https://wordsolverx.com/phoodle-answer-today'
  }));
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://wordsolverx.com/phoodle-answer-today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content="https://wordsolverx.com/wordsolverx.webp" />
  <meta name="news_keywords" content={data.meta?.keywords ?? 'phoodle answer today, phoodle answer, phoodle hint, phoodle hint today'} />
  <link rel="canonical" href="https://wordsolverx.com/phoodle-answer-today" />
  {@html `<script type="application/ld+json">${pageSchema}</script>`}
  {#if data.schemas}
    {@html `<script type="application/ld+json">${data.schemas}</script>`}
  {/if}
</svelte:head>

{#if data.error || !data.word}
  <div class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center p-8">
      <h1 class="text-3xl font-bold mb-4 text-gray-900">Phoodle Answer Not Available</h1>
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
          Phoodle Hints and Answer for Today ({data.formattedDate})
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

      <!-- SEO Content Section -->
      <article class="mt-12 space-y-8">
        <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            What is Phoodle?
          </h2>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            Phoodle is a daily word puzzle game that combines the addictive mechanics of Wordle with a food theme. Every day, there's a new five-letter word to guess, and it's always related to food in some way. Could be an ingredient, a cooking method, a dish, or anything else connected to the culinary world.
          </p>
          <p class="text-lg text-gray-600 mb-6 leading-relaxed">
            The game was created for food lovers who also enjoy word puzzles. It's perfect for people who spend time thinking about what to cook for dinner, enjoy trying new restaurants, or just love everything about food culture. If you know your way around a kitchen, you might actually have an advantage here.
          </p>
          <p class="text-lg text-gray-600 leading-relaxed">
            Like Wordle, you get six tries to guess the word. After each guess, the tiles change color to show you how close you are. Green means the letter is in the right spot, yellow means it's in the word but wrong position, and gray means it's not in the word at all. Simple to learn, but the food theme adds a fun twist.
          </p>
        </section>

        <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            How to Get Better at Phoodle
          </h2>
          <div class="space-y-6 text-lg text-gray-600">
            <p class="leading-relaxed">
              Since Phoodle uses food-related words, you can improve your game by thinking strategically about food vocabulary:
            </p>
            <div class="bg-gray-50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-3">Think in Food Categories</h3>
              <p class="text-gray-600">
                Phoodle words come from several categories: ingredients (flour, basil, onion), cooking methods (grill, roast, steam), kitchen tools (whisk, spoon, knife), dishes (pasta, curry, salad), and food descriptors (sweet, crisp, fresh). When you're stuck, try to think about which category might fit.
              </p>
            </div>
            <div class="bg-gray-50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-3">Use Food-Friendly Starting Words</h3>
              <p class="text-gray-600">
                Words like "BREAD", "CHEESE", or "STEAK" test common food letters while staying on theme. Even if they're not the answer, they can give you useful information about what letters to look for.
              </p>
            </div>
            <div class="bg-gray-50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-3">Consider the Season</h3>
              <p class="text-gray-600">
                Phoodle sometimes uses seasonal words. Think pumpkin in fall, berries in summer, comfort foods in winter. The game creators seem to enjoy tying puzzles to what people are actually eating and talking about.
              </p>
            </div>
            <div class="bg-gray-50 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-3">Build Your Food Vocabulary</h3>
              <p class="text-gray-600">
                The more food words you know, the better you'll do. Read recipes, explore different cuisines, and pay attention to ingredient lists. You'd be surprised how many five-letter food words are out there once you start looking.
              </p>
            </div>
          </div>
        </section>

        <section class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-8 border border-orange-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            Why Food Lovers Adore Phoodle
          </h2>
          <div class="space-y-4 text-lg text-gray-600">
            <p class="leading-relaxed">
              There's something special about a word game that speaks your language. If you're the kind of person who gets excited about farmers markets, watches cooking shows, or experiments with new recipes, Phoodle feels made for you.
            </p>
            <p class="leading-relaxed">
              The food theme makes the game more approachable too. Instead of scratching your head over obscure words, you're thinking about things you encounter every day. What did you have for breakfast? What's in your pantry? What's that spice called? The answers feel familiar even when they're tricky.
            </p>
            <p class="leading-relaxed">
              Plus, Phoodle often includes a bonus: after you solve the puzzle, you might get a recipe suggestion or food fact related to the answer. It's like getting a tiny food magazine delivered with your daily puzzle. Even if you don't solve it, you might learn something new about food.
            </p>
          </div>
        </section>

        <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            Common Phoodle Words to Know
          </h2>
          <div class="space-y-4 text-lg text-gray-600">
            <p class="leading-relaxed">
              While we can't predict tomorrow's answer, here are some types of words that frequently appear in Phoodle:
            </p>
            <div class="grid md:grid-cols-2 gap-6 mt-6">
              <div class="bg-gray-50 rounded-2xl p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-3">Ingredients</h3>
                <p class="text-gray-600">
                  BASIL, ONION, FLOUR, SUGAR, HONEY, LEMON, OLIVE, PORK, BEEF, RICE, BEANS, CORN, SALT
                </p>
              </div>
              <div class="bg-gray-50 rounded-2xl p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-3">Cooking Methods</h3>
                <p class="text-gray-600">
                  GRILL, ROAST, STEAM, BOIL, BAKE, FRY, CHOP, MIX, STIR, WHIP, DICE, PEEL
                </p>
              </div>
              <div class="bg-gray-50 rounded-2xl p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-3">Dishes</h3>
                <p class="text-gray-600">
                  PASTA, CURRY, SALAD, PIZZA, SOUP, STEW, TACO, SUSHI, BREAD, CAKE, PIE
                </p>
              </div>
              <div class="bg-gray-50 rounded-2xl p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-3">Kitchen Items</h3>
                <p class="text-gray-600">
                  WHISK, SPOON, KNIFE, PLATE, BOWL, PAN, OVEN, RANGE, FORK, CUP
                </p>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  </div>
{/if}

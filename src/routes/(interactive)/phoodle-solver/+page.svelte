<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import PhoodleSolverClient from '$lib/components/phoodle/PhoodleSolverClient.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateSoftwareApplicationSchema,
    generateWebPageSchema
  } from '$lib/seo';

  const pageTitle = 'Phoodle Solver - Solver within 3 attempts';
  const pageDescription =
    'Use the Phoodle solver to enter your guesses, match the feedback colors, and get the best next food-word suggestions with the original WASM solver logic.';
  const pageUrl = 'https://wordsolver.tech/phoodle-solver';

  const faqs = [
    {
      question: 'Does this Phoodle solver use the original WASM logic?',
      answer:
        'Yes. This page uses the same standalone WASM solver bundle from the original Phoodle solver project, so the starter and suggestion logic stays the same.'
    },
    {
      question: 'How do I enter my Phoodle feedback?',
      answer:
        'Add the guess you used in the game, then tap each letter tile until it matches the color you saw in Phoodle: absent, present, or correct.'
    },
    {
      question: 'Can I click a suggestion to reuse it?',
      answer:
        'Yes. Tapping a suggested word or a possible answer loads it into the guess input so you can add it quickly as your next try.'
    },
    {
      question: 'What makes Phoodle different from Wordle?',
      answer:
        'Phoodle only uses food-related words — ingredients, dishes, cooking terms, and kitchen items. The green-yellow-gray feedback system is the same, but the restricted word list means standard Wordle strategies like starting with CRANE or SLATE are less effective.'
    },
    {
      question: 'How many guesses do I get in Phoodle?',
      answer:
        'You get 6 guesses, same as Wordle. The solver typically finds the answer within 3 attempts when you enter feedback accurately, which leaves plenty of room for error.'
    },
    {
      question: 'Does the Phoodle solver work on mobile?',
      answer:
        'Yes. The solver runs entirely in the browser with WASM, so it works on any device without installing anything. Just open the page, enter your guesses, and get suggestions.'
    },
    {
      question: 'What time does Phoodle reset?',
      answer:
        'Phoodle resets at midnight local time. A new food word appears every day, and the solver updates its suggestions based on whatever puzzle is current.'
    }
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Phoodle solver', [
      { name: 'Add your guess', text: 'Enter the 5-letter word you tried in Phoodle.' },
      { name: 'Match the feedback', text: 'Tap each tile until it matches the result from the game.' },
      { name: 'Use the next suggestion', text: 'Read the best next guesses and possible answers, then try the best fit in Phoodle.' }
    ]),
    {
      ...generateSoftwareApplicationSchema('Phoodle Solver', 'GameApplication'),
      keywords: ['phoodle solver', 'phoodle helper', 'food word solver']
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Solver', url: 'https://wordsolver.tech/solver' },
      { name: 'Phoodle Solver', url: pageUrl }
    ]),
    generateWebPageSchema('Phoodle Solver', pageDescription, pageUrl)
  ]);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content="phoodle solver, phoodle helper, phoodle answer finder, food word solver" />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <link rel="canonical" href={pageUrl} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  {@html `<script type="application/ld+json">${schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-white">
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Breadcrumbs />
  </div>

  <PhoodleSolverClient />

  <div class="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
    <article class="space-y-12">
      <section>
        <h2 class="text-2xl font-bold text-slate-900 mb-4">What is Phoodle?</h2>
        <p class="text-slate-600 mb-4 leading-relaxed">
          Phoodle is a daily word game launched in May 2022 by cookbook author Josh Laurito. It takes the Wordle format — 5 letters, 6 guesses, green-yellow-gray feedback — and restricts the answer list to food-related words only. Every daily answer is something connected to cooking, ingredients, dishes, or the kitchen.
        </p>
        <p class="text-slate-600 mb-4 leading-relaxed">
          The game is free to play at phoodle.org and resets at midnight local time. Past answers include words like PASTA, BREAD, MANGO, OLIVE, STEAK, CREAM, LEMON, SALAD, FLOUR, and SUGAR. If you cook regularly or spend time thinking about food, you already have a head start on most Phoodle puzzles.
        </p>
        <p class="text-slate-600 leading-relaxed">
          After each guess, tiles turn green (correct letter, correct spot), yellow (letter exists in the word but wrong position), or gray (letter not in the word). Same mechanics as Wordle, but the food-only word list changes how you approach every guess.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-slate-900 mb-4">How Phoodle Differs from Wordle</h2>
        <p class="text-slate-600 mb-4 leading-relaxed">
          The biggest difference is the word list. Wordle pulls from roughly 2,300 possible answers across all English vocabulary. Phoodle uses a much smaller set — only food words. That means every answer is an ingredient, a cooking technique, a dish name, a kitchen tool, or something else tied to food culture.
        </p>
        <p class="text-slate-600 mb-4 leading-relaxed">
          This changes your strategy in two ways. First, generic Wordle openers like CRANE and SLATE are wasteful here — CRANE is not a food word, so it can never be the answer, and it doesn't test the letters that show up most often in food vocabulary. Second, once you know a few letters, you can narrow candidates fast because the food domain is constrained. If you see _OAST with a green O and A, you're looking at ROAST or TOAST, not some obscure English word.
        </p>
        <p class="text-slate-600 leading-relaxed">
          The themed list also means that certain letters appear more often. Vowels like A, E, and O dominate. Common food letters include R, S, T, L, and N. Letters like Q, X, Z, and J rarely show up. You can exploit this frequency skew to eliminate large chunks of the word list with each guess.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-slate-900 mb-4">Why Use a Phoodle Solver</h2>
        <p class="text-slate-600 mb-4 leading-relaxed">
          Even with a food-only word list, Phoodle can stump you. Maybe you've burned 3 guesses on dead-end words. Maybe you're staring at _E_OL and drawing a blank. A solver takes your existing feedback and calculates the best next guess based on what's actually possible — not what feels right.
        </p>
        <div class="space-y-4 mb-4">
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-2">Recover from bad opens faster</h3>
            <p class="text-slate-600">
              If your first two guesses come back all gray, you've lost 2 of 6 attempts with minimal information. The solver ranks remaining candidates by how much each one narrows the field, so your third guess actually matters.
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-2">Solve in fewer attempts</h3>
            <p class="text-slate-600">
              The WASM solver typically lands the answer within 3 guesses when you enter feedback correctly. That's half your allowed attempts, which means better streaks and a cleaner share grid.
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-2">See the full candidate list</h3>
            <p class="text-slate-600">
              The solver doesn't just give you one word — it shows you every remaining possible answer ranked by likelihood. Sometimes the answer jumps out at you from that list even before you make another guess.
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-2">Learn food vocabulary patterns</h3>
            <p class="text-slate-600">
              Using the solver regularly teaches you which letters and patterns show up in Phoodle answers. Over time, you'll need it less because you'll internalize the food-word frequency distribution.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-slate-900 mb-4">How Our Phoodle Solver Works</h2>
        <p class="text-slate-600 mb-4 leading-relaxed">
          This solver runs the same standalone WASM bundle from the original Phoodle solver project. No server round-trips, no API calls during solving — the entire word list and elimination logic live inside the WebAssembly module that loads in your browser.
        </p>
        <p class="text-slate-600 mb-4 leading-relaxed">
          The process works in three steps. First, you enter the word you guessed in Phoodle. Second, you tap each letter tile to set its color — gray for absent, yellow for present but wrong position, green for correct. Third, the WASM module filters the word list against your feedback, scores every remaining candidate by how much information it reveals, and returns ranked suggestions.
        </p>
        <p class="text-slate-600 mb-4 leading-relaxed">
          Because the logic runs client-side in WASM, results come back in under 50ms on most devices. You can enter feedback from multiple guesses at once, and the solver recalculates after each update. The word list and scoring algorithm are identical to the original project — nothing has been simplified or swapped out.
        </p>
        <p class="text-slate-600 leading-relaxed">
          You can also tap any suggestion to load it directly into the guess input. This saves typing and eliminates typos when you want to try a recommended word in the actual Phoodle game.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-slate-900 mb-4">Best Opening Words for Phoodle</h2>
        <p class="text-slate-600 mb-4 leading-relaxed">
          In regular Wordle, people argue about CRANE, SLATE, and TRACE. Those words don't work well in Phoodle because they aren't food words and can never be the answer. You want openers that are both valid Phoodle guesses and good at splitting the remaining word list.
        </p>
        <div class="bg-slate-50 rounded-2xl p-6 mb-4">
          <h3 class="text-lg font-bold text-slate-900 mb-3">STEAK — the strongest opener</h3>
          <p class="text-slate-600 mb-2">
            STEAK tests S, T, E, A, and K — four of the most common food-word letters plus K, which appears in words like SKILLET, BAKING, and FLANK. It's a valid Phoodle answer, so it could hit on guess one. Even when it doesn't, the letter coverage tells you a lot.
          </p>
        </div>
        <div class="bg-slate-50 rounded-2xl p-6 mb-4">
          <h3 class="text-lg font-bold text-slate-900 mb-3">SPICE — high-coverage alternative</h3>
          <p class="text-slate-600 mb-2">
            SPICE covers S, P, I, C, and E. The P and C are especially useful because they appear in words like PASTA, CREAM, PEACH, CHILI, SCOOP, and CRISP. If STEAK feels too meat-focused, SPICE is your next best option.
          </p>
        </div>
        <div class="bg-slate-50 rounded-2xl p-6 mb-4">
          <h3 class="text-lg font-bold text-slate-900 mb-3">Other strong openers</h3>
          <p class="text-slate-600 mb-2">
            BREAD hits B, R, E, A, D — all high-frequency letters in food words. OLIVE tests O, L, I, V, E and covers the O-L and V-E patterns that show up in answers like OLIVE, GLOVE, and DROVE. MELON covers M, E, L, O, N — solid for catching fruit and dessert-adjacent answers. CREAM, BASIL, and LEMON are also worth rotating in if you like to switch openers daily.
          </p>
        </div>
        <p class="text-slate-600 leading-relaxed">
          The key insight: pick openers that are valid food words AND test 4–5 high-frequency letters. A word like ONION tests only 3 unique letters (O, N, I) — avoid openers with repeated letters because they give you less information per guess.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-slate-900 mb-4">Tips for Getting Better at Phoodle</h2>
        <p class="text-slate-600 mb-4 leading-relaxed">
          The solver handles the math, but building your own food-word intuition makes you faster and less dependent on it. Here's how to sharpen your Phoodle game:
        </p>
        <div class="space-y-4 mb-4">
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-2">Think in categories, not random words</h3>
            <p class="text-slate-600">
              Phoodle answers fall into a handful of buckets: ingredients, cooking methods, dishes, kitchen tools, and food descriptors. When you get stuck, ask yourself which category hasn't been tested yet. If your first two guesses were ingredients (STEAK, BASIL), try a cooking method next (ROAST) to cover different letter patterns.
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-2">Exploit double letters</h3>
            <p class="text-slate-600">
              Food words have more repeated letters than you'd expect. CHEESE has two E's. SALAD has two A's. COFFEE has two F's and two E's. When you see a green letter in position 2 and a yellow in position 4, consider whether that letter appears twice — it happens often in food vocabulary.
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-2">Pay attention to common food word endings</h3>
            <p class="text-slate-600">
              Phoodle answers frequently end in -EAT (WHEAT, CHEAT), -OIL (BOIL, FOIL), -ICE (SPICE, JUICE, RICE), -AST (ROAST, TOAST, Y EAST), and -OON (SPOON, BALLOON... well, maybe not balloon). If your last two letters are locked, the endings list shrinks dramatically.
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-2">Use the solver to learn, not just to win</h3>
            <p class="text-slate-600">
              After each game, check which words the solver suggested that you didn't think of. Over a few weeks, you'll notice patterns — the same clusters of letters, the same food categories, the same structural patterns. That knowledge compounds. Regular solver users report needing it less after 2–3 weeks because they've internalized the food-word distribution.
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-2">Consider seasonal and cultural food words</h3>
            <p class="text-slate-600">
              Phoodle answers sometimes reflect the season — PUMPKIN in October, GRAVY around Thanksgiving, PEACH in summer. The game also includes words from various cuisines: NAAN, TOFU, CURRY, RAMEN, TACOS. Don't limit yourself to Western ingredients. The word list is broader than one cuisine.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-slate-900 mb-4">Common Phoodle Answer Categories</h2>
        <p class="text-slate-600 mb-6 leading-relaxed">
          Phoodle answers aren't random food words — they cluster around specific categories. Knowing these categories helps you guess more efficiently because you can rule out entire groups of words with a single guess. Here are the main categories with real examples from past puzzles:
        </p>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-3">Ingredients and Staples</h3>
            <p class="text-slate-600">
              This is the largest category. FLOUR, SUGAR, HONEY, LEMON, OLIVE, BASIL, ONION, GARLIC, BUTTER, CREAM, SALT, PEPPER, VINEGAR, PORK, BEEF, RICE, BEANS, CORN, and YOLK have all appeared. If you cook, you know these words by heart.
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-3">Cooking Methods</h3>
            <p class="text-slate-600">
              GRILL, ROAST, STEAM, BOIL, BAKE, FRY, CHOP, STIR, WHIP, DICE, PEEL, BLEND, SEAR, BRAISE, SIMMER (6 letters, so no), and POACH. These words tend to have common endings and use high-frequency letters, making them good openers too.
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-3">Dishes and Prepared Foods</h3>
            <p class="text-slate-600">
              PASTA, SALAD, PIZZA, SOUP, STEW, TACO, SUSHI, BREAD, CAKE, PIE, CURRY, CREPE, RISSOTO (too long), and QUICHE (6 letters). These are often the most satisfying to guess because they're recognizable the moment a few letters lock in.
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-3">Kitchen Tools and Equipment</h3>
            <p class="text-slate-600">
              WHISK, SPOON, KNIFE, PLATE, BOWL, PAN, OVEN, RANGE, FORK, GRATER, LADLE, TONGS, MORTAR (6), and PESTLE (6). The 5-letter tools come up often enough that they're worth memorizing — especially WHISK and GRATER, which test uncommon letters.
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-3">Fruits and Vegetables</h3>
            <p class="text-slate-600">
              MANGO, PEACH, LEMON, OLIVE, APPLE, GRAPE, BERRY, MELON, GUAVA, PEAR, PLUM, CHERRY (6), and MANGO. These overlap with the ingredients category but are worth tracking separately because they share letter patterns (lots of vowels, common endings like -EACH and -ANGO).
            </p>
          </div>
          <div class="bg-slate-50 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-3">Food Descriptors</h3>
            <p class="text-slate-600">
              SWEET, CRISP, FRESH, SPICY, TANGY, RICH, COLD, DARK, LIGHT, SHARP, BLEND, CHUNK, CRUST, CREAM, and MOIST. These are trickier because they describe food rather than name it — you wouldn't guess them as quickly unless you're thinking about adjectives, not nouns.
            </p>
          </div>
        </div>
        <p class="text-slate-600 mt-6 leading-relaxed">
          When you're stuck between guesses, pick the category that tests the most unique letters. An ingredient guess like BASIL tests different letters than a tool guess like WHISK. Covering multiple categories across your guesses maximizes the information you get from each attempt. Start using the solver above to see how these categories play out in real time.
        </p>
      </section>
    </article>
  </div>

  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
      <FAQSection class="py-0" {faqs} title="Phoodle Solver FAQs" />
    </div>
  </div>
</main>

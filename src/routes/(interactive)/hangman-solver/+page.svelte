<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import HangmanSolverClient from '$lib/components/hangman/HangmanSolverClient.svelte';
  import {
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateSoftwareApplicationSchema,
    generateWebPageSchema
  } from '$lib/seo';

  const pageTitle = 'Hangman Solver - Free Online Word Finder & Hint Tool | WordSolverX';
  const pageDescription =
    'Use this Hangman solver to enter your pattern, wrong letters, and included letters, then get the best next guess, ranked answers, and entropy-based letter suggestions.';
  const pageUrl = 'https://wordsolver.tech/hangman-solver';

  const faqs = [
    {
      question: 'Is the Hangman solver running in the browser?',
      answer:
        'The page UI runs in your browser, but the large Hangman dictionary and entropy solver logic are served from a separate worker so the frontend stays lighter.'
    },
    {
      question: 'How do I write unknown letters in the pattern?',
      answer:
        'You can use underscores, question marks, hyphens, or asterisks for unknown letters. The solver normalizes them to the same blank pattern format.'
    },
    {
      question: 'What does the suggested letter mean?',
      answer:
        'The suggested letter is chosen with entropy-based scoring so it should reduce uncertainty as much as possible among the remaining candidate words.'
    },
    {
      question: 'What is the best first letter to guess in Hangman?',
      answer:
        'E is the most common letter in English at 12.7% frequency, followed by T (9.1%), A (8.2%), and O (7.5%). The solver picks based on your specific pattern and remaining words, which can differ from general frequency — but E is almost always a strong opening.'
    },
    {
      question: 'Does the solver work for different word lengths?',
      answer:
        'Yes. Enter any pattern length and the solver filters its dictionary to match. Short words (3-4 letters) have fewer candidates but each wrong guess hurts more. Long words (7+ letters) have more candidates but also more letters to work with.'
    },
    {
      question: 'Can I use the Hangman solver on my phone?',
      answer:
        'Yes. The solver is fully responsive and works in any mobile browser. Tap to enter your pattern and letters, then review the ranked suggestions.'
    }
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqs),
    generateHowToSchema('How to use the Hangman solver', [
      { name: 'Enter the word pattern', text: 'Use letters for known positions and blank symbols for unknown spots.' },
      { name: 'Add wrong and included letters', text: 'Mark letters that are not in the word and letters that must appear somewhere.' },
      { name: 'Review ranked answers', text: 'Read the top word, best next letter, and the ranked candidate list returned by the worker.' }
    ]),
    {
      ...generateSoftwareApplicationSchema('Hangman Solver', 'GameApplication'),
      keywords: ['hangman solver', 'hangman helper', 'hangman word finder']
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Solver', url: 'https://wordsolver.tech/solver' },
      { name: 'Hangman Solver', url: pageUrl }
    ]),
    generateWebPageSchema('Hangman Solver', pageDescription, pageUrl)
  ]);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta
    name="keywords"
    content="hangman solver, hangman helper, hangman cheat, hangman word finder, hangman hints, hangman answer finder"
  />
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

  <section class="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
    <div class="rounded-[2rem] border border-red-100 bg-gradient-to-br from-red-50 via-white to-amber-50 px-6 py-8 sm:px-10 sm:py-10 shadow-2xl">
      <p class="inline-flex rounded-full bg-red-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
        Word Puzzle Helper
      </p>
      <h1 class="mt-4 text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl">Hangman Solver</h1>
      <p class="mt-3 max-w-2xl text-lg text-slate-600 leading-relaxed">
        Enter the letter pattern, mark wrong guesses and known letters, and get entropy-ranked word suggestions and the best next letter to try.
      </p>
    </div>
  </section>

  <HangmanSolverClient />

  <article class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
    <section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <h2 class="text-3xl font-bold text-slate-900 mb-5">What is Hangman?</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Hangman is a word-guessing game that dates back to the Victorian era. One person picks a word, the other guesses letters one at a time. Every wrong guess adds a body part to a stick figure — head, torso, arms, legs. Six or seven wrong guesses and the figure is complete. You lose.
      </p>
      <p class="text-slate-600 leading-relaxed mb-4">
        The game has survived for over a century because the rules take ten seconds to learn and the strategy takes years to master. There's no luck involved in the letter selection — only in how much you know about English word patterns.
      </p>
      <p class="text-slate-600 leading-relaxed">
        Today Hangman lives in dozens of digital formats: browser games, mobile apps, classroom tools, even TV game shows. The mechanics haven't changed since the 1800s. The pencil-and-paper version still works exactly the same.
      </p>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <h2 class="text-3xl font-bold text-slate-900 mb-5">Why E Is Always Your Best First Guess</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        E shows up in 12.7% of all English text. That's not a guess — it's measured across millions of words. The next four most common letters are T (9.1%), A (8.2%), O (7.5%), and I (7.0%). Combined, these five letters cover nearly half of all letter positions.
      </p>
      <p class="text-slate-600 leading-relaxed mb-4">
        Most people guess E first anyway. The mistake comes on the second and third guesses. If E isn't in the word, the instinct is to try another vowel. That's usually right — but not always. The solver doesn't follow instincts. It counts.
      </p>
      <p class="text-slate-600 leading-relaxed">
        When you enter your pattern, the solver looks at every word that matches and counts how many contain each remaining letter. The letter that appears in the most candidates wins. Sometimes that's a vowel. Sometimes it's S or N or R. It depends on what's left — not on what "feels" right.
      </p>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <h2 class="text-3xl font-bold text-slate-900 mb-5">How Entropy-Based Solving Beats Random Guessing</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        Imagine you're staring at _A_E and you have 12 possible words left: CAKE, CANE, CARE, CASE, CAVE, DARE, FARE, GATE, GAVE, HAZE, LACE, and RATE. Guessing R seems obvious because it appears in 3 of these words. But guessing C appears in 5. C splits the group more evenly.
      </p>
      <p class="text-slate-600 leading-relaxed mb-4">
        That's entropy in action. The solver picks the letter that divides the remaining candidates closest to 50/50. If the guess hits, you eliminate half the words. If it misses, you still eliminate half the words. Either way, you're closer to the answer.
      </p>
      <p class="text-slate-600 leading-relaxed">
        Random guessing might eliminate 10% of candidates or 90%. It's a coin flip. Entropy-based guessing guarantees roughly 50% reduction per step. Over 4-5 guesses, that's the difference between solving the word and running out of body parts.
      </p>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <h2 class="text-3xl font-bold text-slate-900 mb-5">Hangman Strategy Changes by Word Length</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        A 3-letter pattern like ___ might match 1,000 words. A 7-letter pattern like _______ matches 10,000+. Short words are harder because there are fewer positions for letters to appear in, so each guess carves away less of the list.
      </p>
      <p class="text-slate-600 leading-relaxed mb-4">
        For 3-letter words, guess vowels early and often. E, A, O, I — if none appear, you're dealing with a consonant-heavy word like FLY or SKI, and the solver will adjust accordingly.
      </p>
      <p class="text-slate-600 leading-relaxed">
        For 7+ letter words, consonants matter more after the first vowel pass. Common patterns like -TION, -MENT, and -NESS show up constantly in long words. If you see _ _ _ T I O N, you can almost fill in the rest without guessing individual letters.
      </p>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <h2 class="text-3xl font-bold text-slate-900 mb-5">Common Patterns That Trip People Up</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-xl bg-slate-50 p-5">
          <h3 class="font-bold text-slate-900 mb-2">Double letters</h3>
          <p class="text-sm text-slate-600">People forget to guess the same letter twice. If you see S _ _ _ _ S, the word has two S's. But what about LL, TT, RR? The solver always accounts for repeated letters.</p>
        </div>
        <div class="rounded-xl bg-slate-50 p-5">
          <h3 class="font-bold text-slate-900 mb-2">Silent letters</h3>
          <p class="text-sm text-slate-600">KNIGHT, GNOME, WRECK — K, G, and W are silent. Nobody guesses K first for _ _ _ _ _ T. The solver doesn't have this blind spot because it works from a word list, not intuition.</p>
        </div>
        <div class="rounded-xl bg-slate-50 p-5">
          <h3 class="font-bold text-slate-900 mb-2">Q without U</h3>
          <p class="text-sm text-slate-600">QATAR, QAID, QANAT — rare but real. If Q appears and U is already ruled out, don't give up. The solver will find these edge cases.</p>
        </div>
        <div class="rounded-xl bg-slate-50 p-5">
          <h3 class="font-bold text-slate-900 mb-2">Uncommon word endings</h3>
          <p class="text-sm text-slate-600">Words ending in -ZE (GLAZE, GRAZE), -MP (CLAMP, STAMP), or -LT (EXALT, FAULT) get overlooked because they don't follow the -E pattern most people expect.</p>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <h2 class="text-3xl font-bold text-slate-900 mb-5">How Our Hangman Solver Works</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        You enter your word pattern (using blanks for unknown letters), any letters you've already guessed wrong, and any letters you know are in the word somewhere. The solver sends this to a web worker that filters its dictionary and returns two things: a ranked list of candidate words and the single best letter to guess next.
      </p>
      <p class="text-slate-600 leading-relaxed mb-4">
        The word ranking uses frequency data — common words appear first because they're more likely to be the answer. The letter suggestion uses entropy scoring — it picks the letter that splits the remaining candidates closest to evenly.
      </p>
      <p class="text-slate-600 leading-relaxed">
        The worker runs in a separate thread so the UI stays responsive. You can update your pattern and get new suggestions without the page freezing, even when the candidate list contains thousands of words.
      </p>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg">
      <h2 class="text-3xl font-bold text-slate-900 mb-5">When to Trust the Solver and When to Trust Your Gut</h2>
      <p class="text-slate-600 leading-relaxed mb-4">
        The solver is always mathematically optimal for the information you've given it. But it can't see the board. If you're playing against a person who picks obscure words from specific categories (chemistry terms, brand names, place names), the solver's dictionary might not contain the answer at all.
      </p>
      <p class="text-slate-600 leading-relaxed mb-4">
        For standard English word games, the solver wins. It processes the full dictionary in milliseconds and picks the statistically strongest guess every time. Use it when you're stuck, use it to learn, or use it to settle arguments about which letter to guess next.
      </p>
      <p class="text-slate-600 leading-relaxed">
        The one thing it can't do: guess words that aren't in its dictionary. If the answer is a proper noun or a technical term, you're on your own.
      </p>
    </section>

    <section class="rounded-3xl bg-slate-100 p-8 text-center space-y-6">
      <h2 class="text-2xl font-bold text-slate-900">More Solvers</h2>
      <div class="flex flex-wrap justify-center gap-3">
        <a href="/5-letter-wordle-solver" class="px-5 py-2.5 bg-white rounded-xl font-semibold text-slate-700 shadow-sm hover:shadow-md transition-shadow">5-Letter Wordle Solver</a>
        <a href="/boggle-solver" class="px-5 py-2.5 bg-white rounded-xl font-semibold text-slate-700 shadow-sm hover:shadow-md transition-shadow">Boggle Solver</a>
        <a href="/phoodle-solver" class="px-5 py-2.5 bg-white rounded-xl font-semibold text-slate-700 shadow-sm hover:shadow-md transition-shadow">Phoodle Solver</a>
        <a href="/waffle-solver" class="px-5 py-2.5 bg-white rounded-xl font-semibold text-slate-700 shadow-sm hover:shadow-md transition-shadow">Waffle Solver</a>
      </div>
    </section>
  </article>

  <div class="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
    <div class="rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
      <FAQSection class="py-0" {faqs} title="Hangman Solver FAQs" />
    </div>
  </div>
</main>

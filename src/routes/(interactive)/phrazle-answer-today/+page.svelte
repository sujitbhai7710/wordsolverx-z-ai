<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';

  interface PhrazleAnswer {
    phrase: string;
    index: number;
  }

  interface PhrazleDayAnswers {
    date: string;
    morning: PhrazleAnswer;
    afternoon: PhrazleAnswer;
  }

  let {
    data
  }: {
    data: {
      totalPhrases: number;
      todayAnswers: PhrazleDayAnswers;
      todayLabel: string;
      pageTitle: string;
      metaTitle: string;
      pageDescription: string;
      pageKeywords: string;
      faqs: { question: string; answer: string }[];
      schemas: string;
    };
  } = $props();

  let showMorningAnswer = $state(true);
  let showAfternoonAnswer = $state(true);
  let copiedWord = $state<string | null>(null);

  async function copyToClipboard(text: string) {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(text);
    copiedWord = text;
    setTimeout(() => {
      copiedWord = null;
    }, 2000);
  }
</script>

<svelte:head>
  <title>{data.metaTitle}</title>
  <meta name="description" content={data.pageDescription} />
  <meta name="keywords" content={data.pageKeywords} />
  <meta property="og:title" content={data.metaTitle} />
  <meta property="og:description" content={data.pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolver.tech/phrazle-answer-today" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.metaTitle} />
  <meta name="twitter:description" content={data.pageDescription} />
  <link rel="canonical" href="https://wordsolver.tech/phrazle-answer-today" />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50">
  <main class="max-w-5xl mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-4">
        <span>{data.totalPhrases.toLocaleString('en-US')} Phrase Library</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
        Phrazle Answer Today ({data.todayLabel})
      </h1>
      <p class="text-slate-600 max-w-xl mx-auto">
        Two puzzles every day, with archive browsing moved to the dedicated Phrazle archive page.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-amber-400 to-orange-400"></div>
        <div class="p-6 text-center">
          <div class="text-xs uppercase tracking-wide text-amber-600 mb-2">Morning Puzzle</div>
          <div class="text-sm text-slate-500 mb-3">{data.todayAnswers.date}</div>
          {#if showMorningAnswer}
            <div class="font-mono text-3xl font-bold text-amber-600 uppercase mb-2">
              {data.todayAnswers.morning.phrase}
            </div>
          {:else}
            <div class="text-slate-400 mb-2">Answer hidden</div>
          {/if}
          <div class="text-xs text-slate-500 mb-4">Phrase #{data.todayAnswers.morning.index}</div>
          <div class="flex justify-center gap-3 flex-wrap">
            <button
              type="button"
              onclick={() => (showMorningAnswer = !showMorningAnswer)}
              class="px-3 py-2 rounded-lg bg-amber-500 text-white text-sm hover:bg-amber-600"
            >
              {showMorningAnswer ? 'Hide Answer' : 'Reveal Answer'}
            </button>
            {#if showMorningAnswer}
              <button
                type="button"
                onclick={() => copyToClipboard(data.todayAnswers.morning.phrase.toUpperCase())}
                class="px-3 py-2 rounded-lg border border-amber-200 text-sm"
              >
                {copiedWord === data.todayAnswers.morning.phrase.toUpperCase() ? 'Copied' : 'Copy'}
              </button>
            {/if}
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div class="p-6 text-center">
          <div class="text-xs uppercase tracking-wide text-indigo-600 mb-2">Afternoon Puzzle</div>
          <div class="text-sm text-slate-500 mb-3">{data.todayAnswers.date}</div>
          {#if showAfternoonAnswer}
            <div class="font-mono text-3xl font-bold text-indigo-600 uppercase mb-2">
              {data.todayAnswers.afternoon.phrase}
            </div>
          {:else}
            <div class="text-slate-400 mb-2">Answer hidden</div>
          {/if}
          <div class="text-xs text-slate-500 mb-4">Phrase #{data.todayAnswers.afternoon.index}</div>
          <div class="flex justify-center gap-3 flex-wrap">
            <button
              type="button"
              onclick={() => (showAfternoonAnswer = !showAfternoonAnswer)}
              class="px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:bg-indigo-600"
            >
              {showAfternoonAnswer ? 'Hide Answer' : 'Reveal Answer'}
            </button>
            {#if showAfternoonAnswer}
              <button
                type="button"
                onclick={() => copyToClipboard(data.todayAnswers.afternoon.phrase.toUpperCase())}
                class="px-3 py-2 rounded-lg border border-indigo-200 text-sm"
              >
                {copiedWord === data.todayAnswers.afternoon.phrase.toUpperCase() ? 'Copied' : 'Copy'}
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
      <h2 class="text-xl font-bold text-slate-900">Need an older Phrazle answer?</h2>
      <p class="mt-3 text-slate-600">
        Past morning and afternoon phrase pairs now live on the dedicated archive page instead of this today page.
      </p>
      <div class="mt-5 flex flex-wrap gap-3">
        <a
          href="/phrazle-archive"
          class="inline-flex items-center rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Open Phrazle Archive
        </a>
      </div>
    </div>

    <div class="mt-12">
      <AuthorCard
        name={PRESTON_HAYES_AUTHOR_NAME}
        image={PRESTON_HAYES_AUTHOR_IMAGE}
        description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
      />
    </div>

    <article class="mx-auto max-w-5xl px-4 pb-12 space-y-8">
      <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">What is Phrazle?</h2>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          Phrazle is a daily word puzzle that takes the Wordle formula and scales it up from single words to complete phrases. Instead of guessing a five-letter word, you guess a multi-word phrase — typically a common saying, idiomatic expression, or well-known phrase. The game uses the same color feedback system (teal for correct, yellow for present, dark for absent), but applies it to an entire phrase instead of a single word. The result is a puzzle that feels familiar but plays very differently.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The game launched in early 2022 and runs two puzzles per day: a morning puzzle and an afternoon puzzle. That double-daily format gives players twice the daily engagement of most Wordle-style games. Each phrase is drawn from a curated library of approximately {data.totalPhrases.toLocaleString('en-US')} entries, which includes idioms, famous quotes, movie titles, song lyrics, and common expressions. Today&apos;s morning phrase is Phrase #{data.todayAnswers.morning.index} and the afternoon phrase is Phrase #{data.todayAnswers.afternoon.index}.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The challenge in Phrazle is fundamentally different from single-word games. You are not just matching letters — you are predicting which words appear in the phrase, which word goes where, and where the spaces fall. A wrong-space guess can throw off your entire deduction because the letter tiles shift to wrong positions. That added complexity makes Phrazle one of the harder daily word games, and it rewards players who think in terms of common English phrases rather than individual words.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          Phrazle has built a dedicated following among word-game enthusiasts who find Wordle too easy or too short. One Wordle takes about two minutes. Two Phrazle puzzles can take 10 to 20 minutes depending on difficulty. That longer engagement window makes Phrazle feel more substantial — less like a quick distraction and more like a genuine brain workout. The community around Phrazle is smaller than Wordle&apos;s but notably passionate, with players sharing strategies for handling the space problem and debating whether certain phrases should count as valid answers.
        </p>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">How Phrazle Works</h2>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          Each Phrazle puzzle presents a grid with blank tiles representing each character of the hidden phrase, including spaces between words. You type your guess and submit it. The game then colors each character: teal for correct position, yellow for present but misplaced, and dark for absent entirely. The twist is that spaces count as characters too — if you guess the wrong number of words, the entire grid shifts and the feedback becomes much harder to interpret.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The morning puzzle releases early in the day and the afternoon puzzle follows several hours later. Both are tracked independently with their own sequential phrase numbers. There is no shared streak between the two — solving the morning puzzle does not affect your afternoon performance, and vice versa. That separation means you can treat each puzzle as a standalone challenge without worrying about carry-over consequences.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          This page displays both today&apos;s phrases directly — the morning answer is shown in the amber card and the afternoon answer in the indigo card above. Each phrase is shown with a reveal/hide toggle and a copy button for sharing. If you want to browse older phrases, the Phrazle archive page has the complete historical dataset searchable by date and phrase number.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The phrase library of {data.totalPhrases.toLocaleString('en-US')} entries is the backbone of Phrazle. It includes a wide range of phrase types: common idioms (BREAK A LEG, PIECE OF CAKE), famous quotes (TO BE OR NOT), song lyrics (YESTERDAY ONCE MORE), movie titles, TV catchphrases, and everyday expressions (GOOD MORNING, NICE TO MEET). That variety keeps the game fresh — you never know whether today&apos;s puzzle will be a proverb, a pop culture reference, or a mundane conversational phrase.
        </p>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">Today&apos;s Phrazle Answers</h2>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The Phrazle answers for today, {data.todayAnswers.date}, are shown in the cards above. The morning puzzle answer is <strong class="text-slate-900">{data.todayAnswers.morning.phrase.toUpperCase()}</strong> (Phrase #{data.todayAnswers.morning.index}) and the afternoon puzzle answer is <strong class="text-slate-900">{data.todayAnswers.afternoon.phrase.toUpperCase()}</strong> (Phrase #{data.todayAnswers.afternoon.index}).
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          If you have not tried today&apos;s puzzles yet, we recommend playing them first before scrolling to the answers. Phrazle is at its most satisfying when you solve it through deduction — the moment when the tiles all turn teal is genuinely thrilling. But if you are stuck on your last attempt or just want to verify what you already guessed, the answers are right here.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          For older Phrazle answers, use the archive link on this page. The Phrazle archive contains every morning and afternoon pair since the game launched, searchable by date. It is a useful tool for studying common phrase patterns and understanding what types of phrases the game favors. After a week of browsing the archive, you will notice recurring structures and word choices that make future puzzles easier.
        </p>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">Strategy Tips for Phrazle</h2>
        <div class="mt-6 space-y-6">
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900">Guess the word count first</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Before worrying about specific letters, figure out how many words the phrase contains. Look at the total grid length and the space positions if any are revealed. Getting the word count right is the single most important first step because everything else builds on it. A two-word phrase and a four-word phrase with the same total length will produce completely different feedback for the same guess.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900">Think in common phrase structures</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Most Phrazle answers follow predictable English patterns: article + noun + preposition + noun (THE CAT ON THE MAT), adjective + noun (DEEP BLUE SEA), or verb + object (BREAK A LEG). If you identify the structural pattern early, you can fill in likely words for each position. Structural guessing is more efficient than letter-by-letter guessing when you are dealing with multi-word phrases.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900">Use short filler words strategically</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Words like A, AN, THE, IN, ON, AT, OF, and TO appear frequently in English phrases. If you have a two-letter gap, one of these is a strong candidate. Including them in early guesses gives you letter information that transfers across multiple positions in the phrase. THE alone accounts for a huge percentage of phrase starts.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900">Beware the space shift trap</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              If you guess a three-word phrase and the answer is actually four words, every letter after your guessed space will be in the wrong position. The feedback becomes misleading because correct letters appear misplaced when the real issue is your word count. Confirm the word count before drawing conclusions from the feedback. This is the number one mistake new Phrazle players make.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900">Learn common Phrazle answers</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              The phrase library has {data.totalPhrases.toLocaleString('en-US')} entries, but certain phrases appear more often than random selection would predict. Common idioms, movie titles, and well-known expressions make up the bulk of the answer pool. Browsing the archive for a week will give you a strong sense of what the game considers fair game. Pay special attention to three-word phrases — they show up disproportionately often.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900">Use process of elimination on uncommon letters</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Letters like Q, X, Z, J, and V appear far less often in common phrases than in random word games. If your first few guesses eliminate most common letters and you are left with unusual ones, the phrase is probably a proper noun or a less common expression. Phrazle does include some proper nouns (movie titles, band names), so do not rule them out.
            </p>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">Phrazle vs Similar Word Games</h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-2">
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Phrazle vs Wordle</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Wordle tests five-letter words; Phrazle tests multi-word phrases. The feedback mechanism is the same, but Phrazle adds the complexity of word boundaries and spaces. Wordle is about vocabulary; Phrazle is about phrase familiarity and structural reasoning. A strong Wordle player will not necessarily be a strong Phrazle player — the skills overlap less than you might think.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Phrazle vs Quordle</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Quordle makes you solve four words simultaneously. Phrazle makes you solve one phrase. Quordle tests parallel processing; Phrazle tests phrase-level thinking. Both are harder than Wordle, but in different ways. Quordle is about managing four independent deduction threads; Phrazle is about managing one deduction thread with extra structural complexity.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Phrazle vs Contexto</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Contexto uses word associations and proximity scores. Phrazle uses letter-by-letter deduction. Contexto is about semantics; Phrazle is about spelling. They are both daily puzzle games but exercise completely different cognitive skills. Contexto rewards broad knowledge; Phrazle rewards precise knowledge of common English phrases.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Why Phrazle is harder than most daily games</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              The space problem alone makes Phrazle significantly harder than Wordle. In Wordle, every letter is in a known position within a five-character string. In Phrazle, guessing the wrong number of words means every subsequent guess produces misleading feedback. This cascading uncertainty is what makes Phrazle feel punishing even to experienced word-game players.
            </p>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">Types of Phrazle Answers You Will Encounter</h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-2">
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Common Idioms</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Phrazle loves idioms — expressions that native English speakers use without thinking about their literal meaning. Examples include PIECE OF CAKE, HIT THE ROAD, UNDER THE WEATHER, and BACK TO SQUARE ONE. If you are a native speaker, you already know hundreds of these. If English is your second language, idioms are worth studying specifically because they appear so often in Phrazle.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Movie and TV References</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Famous movie lines and TV catchphrases show up regularly. MAY THE FORCE, I WILL BE BACK, and HERE IS LOOKING are all the right length for Phrazle grids. If you watch a lot of movies or TV, you will recognize these instantly. The game tends to favor well-known lines over obscure ones, so mainstream pop culture knowledge carries you a long way.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Song Lyrics</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Famous song snippets appear in the answer pool too. Bohemian Rhapsody alone probably contributed a dozen Phrazle answers. If you listen to popular music across decades — 60s rock, 80s pop, modern hip-hop — you will have a significant advantage. Music fans often solve these puzzles faster than non-music fans.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Everyday Expressions</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Not every Phrazle answer is dramatic. Simple conversational phrases like GOOD MORNING, THANK YOU, NICE DAY, and SEE YOU SOON appear regularly. These are the easiest answers if you recognize them, but they can be frustrating if you are overthinking and looking for something more complex. Sometimes the simplest guess is the right one.
            </p>
          </div>
        </div>
      </section>
    </article>
  </main>

  <FAQSection faqs={data.faqs} />
</div>
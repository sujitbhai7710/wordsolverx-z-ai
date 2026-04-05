<script lang="ts">
  import { onMount } from 'svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import {
    WORDSOLVERX_WORD_LENGTHS,
    getWordLadderIndexClient,
    getWordsOfLengthClient,
    type WordLadderIndex,
  } from '$lib/word-ladder-client';
  import { solveWordLadderWithIndex } from '$lib/word-ladder-logic';

  const MIN_LENGTH = WORDSOLVERX_WORD_LENGTHS[0]; // 3
  const MAX_LENGTH = WORDSOLVERX_WORD_LENGTHS[WORDSOLVERX_WORD_LENGTHS.length - 1]; // 12
  const MAX_PATHS_TO_SHOW = 5;

  type WordLengthOption = (typeof WORDSOLVERX_WORD_LENGTHS)[number];

  let startWord = $state('');
  let endWord = $state('');
  let wordSet = $state<Set<string>>(new Set());
  let ladderIndex = $state<WordLadderIndex | null>(null);
  let loadedLength = $state<number | null>(null);
  let resultPaths = $state<string[][]>([]);
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let mounted = $state(false);

  let startInputRef = $state<HTMLInputElement | null>(null);
  let endInputRef = $state<HTMLInputElement | null>(null);

  // Derived: detect word length from the longer of the two inputs
  let detectedLength = $derived.by(() => {
    const sLen = startWord.length;
    const eLen = endWord.length;
    // Use the length when both words are the same length, or the longer one if only one is filled
    if (sLen > 0 && eLen > 0 && sLen === eLen) return sLen;
    if (sLen >= MIN_LENGTH && eLen === 0) return sLen;
    if (eLen >= MIN_LENGTH && sLen === 0) return eLen;
    if (sLen > 0 && eLen > 0 && sLen !== eLen) return Math.max(sLen, eLen);
    return null;
  });

  let validLength = $derived(
    detectedLength !== null &&
    detectedLength >= MIN_LENGTH &&
    detectedLength <= MAX_LENGTH &&
    WORDSOLVERX_WORD_LENGTHS.includes(detectedLength as WordLengthOption)
  );

  async function loadWordData(length: number) {
    if (loadedLength === length && ladderIndex) return;
    isLoading = true;
    error = null;

    try {
      const [loadedWords, loadedIndex] = await Promise.all([
        getWordsOfLengthClient(length as WordLengthOption, 'wordsolverx', 'lower'),
        getWordLadderIndexClient(length as WordLengthOption, 'wordsolverx', 'lower'),
      ]);

      wordSet = loadedWords;
      ladderIndex = loadedIndex;
      loadedLength = length;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error fetching words';
      wordSet = new Set();
      ladderIndex = null;
      loadedLength = null;
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    mounted = true;
  });

  function sanitize(val: string): string {
    return val.toLowerCase().replace(/[^a-z]/g, '');
  }

  async function handleInput() {
    resultPaths = [];

    const s = startWord;
    const e = endWord;

    if (s.length === 0 && e.length === 0) return;

    // Both must be same length and within range to solve
    if (s.length !== e.length || s.length < MIN_LENGTH || s.length > MAX_LENGTH) return;
    if (!WORDSOLVERX_WORD_LENGTHS.includes(s.length as WordLengthOption)) return;

    // Load data if needed
    if (loadedLength !== s.length || !ladderIndex) {
      await loadWordData(s.length);
    }

    // After loading, check validity and solve
    if (!ladderIndex || !wordSet) return;
    if (!wordSet.has(s) || !wordSet.has(e)) return;

    resultPaths = solveWordLadderWithIndex(ladderIndex, s, e, {
      maxSolutions: MAX_PATHS_TO_SHOW,
      mode: 'short',
    }).solutions;
  }

  function onStartInput(e: Event) {
    startWord = sanitize((e.target as HTMLInputElement).value);
    void handleInput();
  }

  function onEndInput(e: Event) {
    endWord = sanitize((e.target as HTMLInputElement).value);
    void handleInput();
  }

  let startWordValid = $derived(startWord.length >= MIN_LENGTH && wordSet.has(startWord));
  let endWordValid = $derived(endWord.length >= MIN_LENGTH && wordSet.has(endWord));
  let bothSameLength = $derived(startWord.length > 0 && endWord.length > 0 && startWord.length === endWord.length);
  let startWordInvalid = $derived(startWord.length >= MIN_LENGTH && loadedLength === startWord.length && !isLoading && !wordSet.has(startWord));
  let endWordInvalid = $derived(endWord.length >= MIN_LENGTH && loadedLength === endWord.length && !isLoading && !wordSet.has(endWord));

  function getSizeClasses(length: number): string {
    if (length >= 10) return 'w-8 h-8 text-sm sm:w-10 sm:h-10 sm:text-lg';
    if (length >= 8) return 'w-9 h-9 text-base sm:w-11 sm:h-11 sm:text-xl';
    if (length >= 6) return 'w-10 h-10 text-lg sm:w-12 sm:h-12 sm:text-2xl';
    return 'w-12 h-12 text-2xl sm:w-16 sm:h-16 sm:text-3xl';
  }

  function getBlockClasses(
    letter: string,
    targetWord: string,
    charIndex: number,
    currentLength: number
  ): string {
    let classes = `${getSizeClasses(currentLength)} border-2 flex items-center justify-center font-bold uppercase transition-all duration-150 ease-in-out rounded-xl shadow-sm`;

    if (letter === targetWord[charIndex]) {
      classes += ' bg-green-500 text-white border-green-600';
    } else {
      classes += ' bg-gray-200 text-gray-800 border-gray-300';
    }

    return classes;
  }

  const jsonLdSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        name: 'Weaver Solver',
        description: 'Professional solver for the Weaver word ladder game supporting 3-12 letter words.',
        url: 'https://wordsolver.tech/weaver-solver',
        areaServed: 'Worldwide',
        serviceType: 'Puzzle Solving Service',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Weaver?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Weaver is a daily word game where you transform a start word into an end word by changing one letter at a time, with each step being a valid word.'
            },
          },
          {
            '@type': 'Question',
            name: 'How does the Weaver Solver work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It finds the true shortest path between two words using one shared word ladder algorithm, ensuring you get a valid optimal solution.'
            },
          },
        ],
      },
    ],
  });
</script>

<svelte:head>
  <title>Weaver Solver - Word Ladder Helper</title>
  <meta name="description" content="Solve any Weaver word ladder puzzle with our free solver. Find the shortest path between two words by changing one letter at a time." />
  <meta name="keywords" content="Weaver Solver, Word Ladder, Weaver Game, Weaver Answer, Word Puzzle Solver" />
  <link rel="canonical" href="https://wordsolver.tech/weaver-solver" />
  <meta property="og:title" content="Weaver Solver - Word Ladder Helper" />
  <meta property="og:description" content="Find the shortest word ladder path between any two words." />
  <meta property="og:url" content="https://wordsolver.tech/weaver-solver" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Weaver Solver" />
  <meta name="twitter:description" content="Solve Weaver word ladder puzzles instantly." />
  {@html `<script type="application/ld+json">${jsonLdSchema}</script>`}
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col items-center p-4 sm:p-6">
  <header class="mb-6 text-center pt-6">
    <Breadcrumbs />
    <h1 class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Weaver Solver</h1>
    <p class="text-lg text-gray-600 mt-2">Type your start and end words. The solver auto-detects word length and finds the shortest path.</p>
  </header>

  {#if error}
    <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 max-w-md w-full text-center">
      <p class="text-red-600 font-medium">{error}</p>
      <p class="mt-2 text-gray-500 text-sm">Please try refreshing the page.</p>
    </div>
  {/if}

  <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg lg:max-w-3xl xl:max-w-5xl border border-gray-200 transition-all duration-300">
    <!-- Starting Word Section -->
    <div class="mb-6">
      <div class="flex items-center justify-center mb-3">
        <div class="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent w-1/4 mr-4"></div>
        <h2 class="text-center text-lg font-medium text-indigo-700 px-4 py-1 rounded-full bg-indigo-50 border border-indigo-100">
          Starting Word
        </h2>
        <div class="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent w-1/4 ml-4"></div>
      </div>
      <div class="flex justify-center">
        <input
          bind:this={startInputRef}
          type="text"
          value={startWord}
          oninput={onStartInput}
          placeholder="e.g. cold"
          class="w-full max-w-sm text-center text-2xl sm:text-3xl font-bold uppercase tracking-[0.3em] py-4 px-6 border-2 rounded-xl shadow-inner outline-none transition-all duration-200
            {startWordInvalid ? 'border-red-400 bg-red-50/50 text-red-600 focus:ring-2 focus:ring-red-300' :
             startWordValid ? 'border-green-400 bg-green-50/50 text-green-700 focus:ring-2 focus:ring-green-300' :
             'border-indigo-300 bg-indigo-50/50 text-indigo-600 focus:ring-2 focus:ring-indigo-400'}"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>
      {#if startWordInvalid}
        <p class="text-center text-red-500 text-sm mt-2">
          <span class="font-semibold">"{startWord}"</span> is not in the dictionary.
        </p>
      {/if}
    </div>

    <!-- Loading indicator -->
    {#if isLoading}
      <div class="flex justify-center my-4">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <span class="ml-3 text-gray-500">Loading {detectedLength}-letter words...</span>
      </div>
    {/if}

    <!-- Result Paths -->
    {#if resultPaths.length > 0}
      <div class="my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {#each resultPaths as path, pathIdx}
          <div class="p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
            <h3 class="text-center font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
              Path {pathIdx + 1} <span class="text-gray-500 text-sm">({path.length - 1} step{path.length - 1 === 1 ? '' : 's'})</span>
            </h3>
            <div class="space-y-2 flex-grow flex flex-col justify-center">
              {#each path.slice(1) as word, stepIndex}
                <div class="overflow-x-auto">
                  <div
                    class="flex min-w-max justify-center gap-1 sm:gap-2 animate-fadeIn"
                    style="animation-delay: {stepIndex * 100}ms"
                  >
                    {#each word.split('') as char, charIndex}
                      <div class={getBlockClasses(char, endWord, charIndex, word.length)}>
                        {char}
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
            <div class="mt-2 pt-2 border-t border-gray-200 text-center text-xs text-gray-500">
              {path[0]} -&gt; {path[path.length - 1]}
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- No path found -->
    {#if bothSameLength && startWordValid && endWordValid && resultPaths.length === 0 && !isLoading}
      <div class="my-4 text-center">
        <p class="text-yellow-600 font-medium px-4 py-2 bg-yellow-50 rounded-lg inline-block">
          No path found between <span class="font-semibold">"{startWord}"</span> and <span class="font-semibold">"{endWord}"</span>.
        </p>
      </div>
    {/if}

    <!-- Length mismatch warning -->
    {#if startWord.length >= MIN_LENGTH && endWord.length >= MIN_LENGTH && startWord.length !== endWord.length}
      <div class="my-4 text-center">
        <p class="text-amber-600 text-sm px-4 py-2 bg-amber-50 rounded-lg inline-block">
          Start word ({startWord.length} letters) and end word ({endWord.length} letters) must be the same length.
        </p>
      </div>
    {/if}

    <!-- Destination Word Section -->
    <div class="mt-6">
      <div class="flex items-center justify-center mb-3">
        <div class="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent w-1/4 mr-4"></div>
        <h2 class="text-center text-lg font-medium text-green-700 px-4 py-1 rounded-full bg-green-50 border border-green-100">
          Destination Word
        </h2>
        <div class="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent w-1/4 ml-4"></div>
      </div>
      <div class="flex justify-center">
        <input
          bind:this={endInputRef}
          type="text"
          value={endWord}
          oninput={onEndInput}
          placeholder="e.g. warm"
          class="w-full max-w-sm text-center text-2xl sm:text-3xl font-bold uppercase tracking-[0.3em] py-4 px-6 border-2 rounded-xl shadow-inner outline-none transition-all duration-200
            {endWordInvalid ? 'border-red-400 bg-red-50/50 text-red-600 focus:ring-2 focus:ring-red-300' :
             endWordValid ? 'border-green-400 bg-green-50/50 text-green-700 focus:ring-2 focus:ring-green-300' :
             'border-green-300 bg-green-50/50 text-green-700 focus:ring-2 focus:ring-green-400'}"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>
      {#if endWordInvalid}
        <p class="text-center text-red-500 text-sm mt-2">
          <span class="font-semibold">"{endWord}"</span> is not in the dictionary.
        </p>
      {/if}
    </div>
  </div>

  <footer class="mt-10 text-center text-gray-500 text-sm max-w-md w-full">
    <div class="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-200 mb-8">
      <h3 class="font-semibold text-gray-700 mb-2">How To Use</h3>
      <p class="mb-3">Type your starting word and destination word. The solver auto-detects the word length and instantly finds the shortest path.</p>
      <p class="mb-3">Both words must be the same length (3-12 letters) and valid English words.</p>
      <p class="text-xs text-gray-500 mt-2">Inspired by the game Weaver.</p>
    </div>

    <!-- Content & FAQ Section -->
    <section class="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 text-left mb-8">
      <h2 class="text-2xl font-bold text-indigo-700 mb-4 text-center">Mastering the Word Ladder</h2>
      <div class="prose prose-sm max-w-none text-gray-700">
        <p class="mb-4">
          Weaver is a captivating word game where your goal is to "weave" your way from a starting word to an ending word, changing only one letter at a time. Each intermediate step must be a valid word. It's a classic word ladder puzzle brought to the daily web game era.
        </p>
        <p class="mb-4">
          Our <strong>Weaver Solver</strong> supports words from <em>3 to 12 letters</em>, using a breadth-first search algorithm to find the <em>shortest possible path</em> between any two words. This helps you solve even the trickiest daily puzzles in seconds.
        </p>
      </div>

      <div class="mt-8 border-t border-gray-200 pt-6">
        <h3 class="text-xl font-bold text-indigo-600 mb-4">Common Questions</h3>
        <div class="space-y-4">
          <div>
            <h4 class="font-semibold text-gray-900">How do I use the solver?</h4>
            <p class="text-sm text-gray-600 mt-1">
              Type your start word and end word into the text fields. The solver automatically detects the word length and calculates the shortest path between them.
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900">Why are some paths longer?</h4>
            <p class="text-sm text-gray-600 mt-1">
              Sometimes, direct connections are impossible because intermediate words don't exist. The solver must take a "detour" through other words to reach the destination, resulting in a longer ladder.
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900">What word lengths are supported?</h4>
            <p class="text-sm text-gray-600 mt-1">
              The solver supports 3 to 12 letter words. Just type your words and the correct word list is loaded automatically.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SEO Content Section -->
    <section class="space-y-8 mt-8">
      <div class="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Why Use a Weaver Solver?</h2>
        <div class="prose prose-lg max-w-none text-gray-600">
          <p class="mb-6 leading-relaxed">
            Weaver puzzles can be deceptively difficult. While the concept is simple — change one letter at a time to transform one word into another — finding the optimal path requires exploring many possibilities. Some word pairs have obvious connections, while others require circuitous routes through unexpected intermediate words.
          </p>
          <p class="mb-6 leading-relaxed">
            A Weaver solver eliminates the frustration of dead ends. Instead of manually trying different letter changes and hoping each result is a real word, the solver maps out all possible paths and shows you the shortest one. This is especially valuable for the daily puzzle, where you might encounter unfamiliar word pairs.
          </p>
          <p class="leading-relaxed">
            Beyond just finding answers, the solver helps you understand word relationships. By seeing which words connect to which, you develop intuition about letter patterns and word families. This knowledge improves your performance in all word games, not just Weaver.
          </p>
        </div>
      </div>

      <div class="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">How the Word Ladder Algorithm Works</h2>
        <div class="prose prose-lg max-w-none text-gray-600">
          <p class="mb-6 leading-relaxed">
            The solver uses a bidirectional breadth-first search (BFS) algorithm. This means it explores from both the start word and end word simultaneously, meeting in the middle. This approach is significantly faster than searching from one direction only.
          </p>
          <p class="mb-6 leading-relaxed">
            Here's how it works: First, the solver builds a graph where each word is a node, and edges connect words that differ by exactly one letter. When you enter a start and end word, the algorithm explores this graph to find the shortest path between them.
          </p>
          <p class="leading-relaxed">
            The algorithm guarantees finding the shortest path because BFS explores all paths of length N before any paths of length N+1. When the two search fronts meet, we know we've found the optimal solution. The solver displays up to 5 different paths, all of the same minimum length, giving you options for how to approach the puzzle.
          </p>
        </div>
      </div>

      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Tips for Getting Better at Weaver</h2>
        <div class="space-y-6 text-lg text-gray-600">
          <p class="leading-relaxed">
            Weaver rewards vocabulary and pattern recognition. Here are strategies to improve your game:
          </p>
          <ul class="space-y-4 ml-4">
            <li class="leading-relaxed">
              <strong class="text-gray-900">Look for common letter patterns</strong> — Words often connect through common patterns. If you need to change 'A' to 'E', look for words where that position commonly has either letter.
            </li>
            <li class="leading-relaxed">
              <strong class="text-gray-900">Work from both ends</strong> — Just like our algorithm, you can think about what words might connect to both the start and end. Meeting in the middle often reveals the path.
            </li>
            <li class="leading-relaxed">
              <strong class="text-gray-900">Know your word families</strong> — Words that rhyme or share common endings often connect. CAT → BAT → BAG → TAG is a simple example of following a word family.
            </li>
            <li class="leading-relaxed">
              <strong class="text-gray-900">Avoid dead ends</strong> — Some words have few connections. If you find yourself stuck, backtrack and try a different intermediate word with more connections.
            </li>
            <li class="leading-relaxed">
              <strong class="text-gray-900">Use the solver to learn</strong> — After solving (or when stuck), use the solver to see the optimal path. Analyze why certain words were chosen and apply that knowledge to future puzzles.
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Understanding Word Ladder History</h2>
        <div class="prose prose-lg max-w-none text-gray-600">
          <p class="mb-6 leading-relaxed">
            Word ladders have a rich history dating back to 1879, when Lewis Carroll (author of Alice in Wonderland) invented them. He called them "Doublets" and published them in Vanity Fair magazine. The concept was simple: transform one word into another by changing one letter at a time, with each intermediate step being a valid word.
          </p>
          <p class="mb-6 leading-relaxed">
            Carroll's original example was transforming "HEAD" into "TAIL": HEAD → HEAL → TEAL → TELL → TALL → TAIL. This six-step transformation demonstrates the elegant simplicity of the puzzle — each step changes exactly one letter, and every intermediate word is meaningful.
          </p>
          <p class="leading-relaxed">
            Modern Weaver games follow the same principle but add daily puzzle elements. Each day brings a new word pair to connect, and players compete to find the shortest path. Our solver helps you discover these optimal paths, whether you're stuck on today's puzzle or exploring the fascinating world of word transformations.
          </p>
        </div>
      </div>
    </section>
  </footer>
</div>

<style>
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out forwards;
    opacity: 0;
  }
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion) {
    .animate-fadeIn {
      animation: none;
      opacity: 1;
    }
  }

  input[type='text'] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
</style>

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

  const WORD_LENGTH_OPTIONS = WORDSOLVERX_WORD_LENGTHS;
  type WordLengthOption = (typeof WORD_LENGTH_OPTIONS)[number];
  const DEFAULT_WORD_LENGTH: WordLengthOption = 5;
  const MAX_PATHS_TO_SHOW = 5;

  let wordLength = $state<WordLengthOption>(DEFAULT_WORD_LENGTH);
  let wordSet = $state<Set<string>>(new Set());
  let ladderIndex = $state<WordLadderIndex | null>(null);
  let inputs = $state<string[][]>([
    Array(DEFAULT_WORD_LENGTH).fill(''),
    Array(DEFAULT_WORD_LENGTH).fill(''),
  ]);
  let resultPaths = $state<string[][]>([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let inputRefs = $state<(HTMLInputElement | null)[][]>([[], []]);

  async function loadWordData(length: WordLengthOption) {
    isLoading = true;
    error = null;

    try {
      const [loadedWords, loadedIndex] = await Promise.all([
        getWordsOfLengthClient(length, 'wordsolverx', 'lower'),
        getWordLadderIndexClient(length, 'wordsolverx', 'lower'),
      ]);

      wordSet = loadedWords;
      ladderIndex = loadedIndex;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error fetching words';
      wordSet = new Set();
      ladderIndex = null;
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    void loadWordData(wordLength);
  });

  function solveCurrentInputs() {
    const firstWord = inputs[0].join('');
    const secondWord = inputs[1].join('');

    if (!ladderIndex) {
      resultPaths = [];
      return;
    }

    if (
      firstWord.length === wordLength &&
      secondWord.length === wordLength &&
      wordSet.has(firstWord) &&
      wordSet.has(secondWord)
    ) {
      resultPaths = solveWordLadderWithIndex(ladderIndex, firstWord, secondWord, {
        maxSolutions: MAX_PATHS_TO_SHOW,
        mode: 'short',
      }).solutions;
    } else {
      resultPaths = [];
    }
  }

  function setWordLength(length: WordLengthOption) {
    wordLength = length;
    inputs = [Array(length).fill(''), Array(length).fill('')];
    resultPaths = [];
    inputRefs = [[], []];
    void loadWordData(length);
  }

  function handleInputChange(wordIdx: 0 | 1, letterIdx: number, value: string) {
    if (isLoading || !ladderIndex) return;

    const letter = value.slice(-1).toLowerCase();
    if (letter && !/^[a-z]$/.test(letter)) return;

    inputs[wordIdx][letterIdx] = letter;
    inputs = [...inputs];

    if (letter && letterIdx < wordLength - 1) {
      inputRefs[wordIdx][letterIdx + 1]?.focus();
    } else if (letter && letterIdx === wordLength - 1 && wordIdx === 0) {
      inputRefs[1][0]?.focus();
    }

    solveCurrentInputs();
  }

  function handleInputKeyDown(wordIdx: 0 | 1, letterIdx: number, e: KeyboardEvent) {
    if (e.key === 'Backspace' && !inputs[wordIdx][letterIdx]) {
      e.preventDefault();
      if (letterIdx > 0) {
        inputRefs[wordIdx][letterIdx - 1]?.focus();
      } else if (letterIdx === 0 && wordIdx === 1) {
        inputRefs[0][wordLength - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && letterIdx > 0) {
      e.preventDefault();
      inputRefs[wordIdx][letterIdx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && letterIdx < wordLength - 1) {
      e.preventDefault();
      inputRefs[wordIdx][letterIdx + 1]?.focus();
    } else if (e.key === 'ArrowDown' && wordIdx === 0) {
      e.preventDefault();
      inputRefs[1][letterIdx]?.focus();
    } else if (e.key === 'ArrowUp' && wordIdx === 1) {
      e.preventDefault();
      inputRefs[0][letterIdx]?.focus();
    }
  }

  function getSizeClasses(length: number): string {
    if (length >= 10) {
      return 'w-8 h-8 text-sm sm:w-10 sm:h-10 sm:text-lg';
    }

    if (length >= 8) {
      return 'w-9 h-9 text-base sm:w-11 sm:h-11 sm:text-xl';
    }

    if (length >= 6) {
      return 'w-10 h-10 text-lg sm:w-12 sm:h-12 sm:text-2xl';
    }

    return 'w-12 h-12 text-2xl sm:w-16 sm:h-16 sm:text-3xl';
  }

  function getBlockClasses(
    letter: string,
    isResult: boolean = false,
    targetWordForMatching?: string,
    charIndex?: number,
    currentLength: number = wordLength
  ): string {
    let classes = `${getSizeClasses(currentLength)} border-2 flex items-center justify-center font-bold uppercase transition-all duration-150 ease-in-out rounded-xl shadow-sm`;

    if (!isResult) {
      if (letter) {
        classes += ' border-indigo-500 bg-white text-indigo-600';
      } else {
        classes += ' border-gray-300 bg-white/70 text-gray-400';
      }
    } else if (
      targetWordForMatching &&
      charIndex !== undefined &&
      letter === targetWordForMatching[charIndex]
    ) {
      classes += ' bg-green-500 text-white border-green-600';
    } else {
      classes += ' bg-gray-200 text-gray-800 border-gray-300';
    }

    return classes;
  }

  let firstWordFull = $derived(inputs[0].join('').length === wordLength);
  let secondWordFull = $derived(inputs[1].join('').length === wordLength);
  let firstWordValid = $derived(firstWordFull && wordSet.has(inputs[0].join('')));
  let secondWordValid = $derived(secondWordFull && wordSet.has(inputs[1].join('')));

  const jsonLdSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        name: 'Weaver Solver',
        description: 'Professional solver for the Weaver word ladder game supporting 3-12 letter words.',
        url: 'https://wordsolverx.com/weaver-solver',
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
  <link rel="canonical" href="https://wordsolverx.com/weaver-solver" />
  <meta property="og:title" content="Weaver Solver - Word Ladder Helper" />
  <meta property="og:description" content="Find the shortest word ladder path between any two words." />
  <meta property="og:url" content="https://wordsolverx.com/weaver-solver" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Weaver Solver" />
  <meta name="twitter:description" content="Solve Weaver word ladder puzzles instantly." />
  {@html `<script type="application/ld+json">${jsonLdSchema}</script>`}
</svelte:head>

{#if error}
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <h1 class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">Weaver Solver</h1>
    <h2 class="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
    <p class="text-xl text-gray-700 dark:text-gray-300">{error}</p>
    <p class="mt-4 text-gray-500 dark:text-gray-400">Please try refreshing the page or check if the word files are available.</p>
  </div>
{:else if isLoading && !ladderIndex}
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <h1 class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">Weaver Solver</h1>
    <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
    <p class="text-2xl text-gray-700 dark:text-gray-300">Loading Weaver Solver...</p>
  </div>
{:else if !isLoading && wordSet.size === 0 && !error}
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <h1 class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">Weaver Solver</h1>
    <h2 class="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">No Words Loaded</h2>
    <p class="text-xl text-gray-700 dark:text-gray-300">The word list could not be processed correctly.</p>
    <p class="mt-2 text-gray-500 dark:text-gray-400">Please ensure the file is correctly placed and contains valid data.</p>
  </div>
{:else}
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 flex flex-col items-center justify-center p-4 sm:p-6">
    <header class="mb-6 text-center">
      <Breadcrumbs />
      <h1 class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-300">Weaver Solver</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 mt-2">Find the shortest path between two words (3-12 letters).</p>
    </header>

    <!-- Word Length Selector -->
    <div class="mb-6 flex flex-wrap justify-center gap-2 sm:gap-3">
      {#each WORD_LENGTH_OPTIONS as length}
        <button
          onclick={() => setWordLength(length)}
          class="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 {wordLength === length
            ? 'bg-indigo-600 text-white shadow-lg scale-105 ring-2 ring-indigo-400'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'}"
        >
          {length} Letters
        </button>
      {/each}
    </div>

    <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg lg:max-w-3xl xl:max-w-5xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <!-- Starting Word Section -->
      <div class="mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="h-px bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-600 to-transparent w-1/4 mr-4"></div>
          <h2 class="text-center text-lg font-medium text-indigo-700 dark:text-indigo-300 px-4 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800">
            Starting Word
          </h2>
          <div class="h-px bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-600 to-transparent w-1/4 ml-4"></div>
        </div>
        <div class="overflow-x-auto">
          <div class="flex min-w-max justify-center gap-1 sm:gap-2 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30 shadow-inner">
          {#each inputs[0] as letter, i}
            <input
              bind:this={inputRefs[0][i]}
              type="text"
              inputmode="text"
              maxlength={1}
              value={letter}
              oninput={(e) => handleInputChange(0, i, (e.target as HTMLInputElement).value)}
              onkeydown={(e) => handleInputKeyDown(0, i, e)}
              class="text-center outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:scale-105 {getBlockClasses(letter, false, undefined, undefined, wordLength)}"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          {/each}
        </div>
        </div>
      </div>

      <!-- Result Paths -->
      {#if resultPaths.length > 0}
        <div class="my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative">
          {#each resultPaths as path, pathIdx}
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
              <h3 class="text-center font-semibold text-blue-600 dark:text-blue-400 mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
                Path {pathIdx + 1} <span class="text-gray-500 dark:text-gray-400 text-sm">({path.length - 1} step{path.length - 1 === 1 ? '' : 's'})</span>
              </h3>
              <div class="space-y-2 flex-grow flex flex-col justify-center">
                {#each path.slice(1) as word, stepIndex}
                  <div class="overflow-x-auto">
                    <div
                      class="flex min-w-max justify-center gap-1 sm:gap-2 animate-fadeIn"
                      style="animation-delay: {stepIndex * 100}ms"
                    >
                    {#each word.split('') as char, charIndex}
                      <div class={getBlockClasses(char, true, inputs[1].join(''), charIndex, word.length)}>
                        {char}
                      </div>
                    {/each}
                    </div>
                  </div>
                {/each}
              </div>
              <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-center text-xs text-gray-500 dark:text-gray-400">
                {path[0]} -&gt; {path[path.length - 1]}
              </div>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Destination Word Section -->
      <div class="mt-8">
        <div class="flex items-center justify-center mb-4">
          <div class="h-px bg-gradient-to-r from-transparent via-green-300 dark:via-green-600 to-transparent w-1/4 mr-4"></div>
          <h2 class="text-center text-lg font-medium text-green-700 dark:text-green-300 px-4 py-1 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800">
            Destination Word
          </h2>
          <div class="h-px bg-gradient-to-r from-transparent via-green-300 dark:via-green-600 to-transparent w-1/4 ml-4"></div>
        </div>
        <div class="overflow-x-auto">
          <div class="flex min-w-max justify-center gap-1 sm:gap-2 p-6 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/30 shadow-inner">
          {#each inputs[1] as letter, i}
            <input
              bind:this={inputRefs[1][i]}
              type="text"
              inputmode="text"
              maxlength={1}
              value={letter}
              oninput={(e) => handleInputChange(1, i, (e.target as HTMLInputElement).value)}
              onkeydown={(e) => handleInputKeyDown(1, i, e)}
              class="text-center outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:scale-105 {getBlockClasses(letter, false, undefined, undefined, wordLength)}"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          {/each}
        </div>
        </div>
      </div>

      <!-- Error/Status Messages -->
      <div class="mt-6 min-h-[60px] flex flex-col items-center justify-center gap-2">
        {#if firstWordFull && !firstWordValid}
          <p class="text-center text-red-500 dark:text-red-400 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <span class="font-semibold">"{inputs[0].join('')}"</span> is not in the dictionary.
          </p>
        {/if}
        {#if secondWordFull && !secondWordValid}
          <p class="text-center text-red-500 dark:text-red-400 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <span class="font-semibold">"{inputs[1].join('')}"</span> is not in the dictionary.
          </p>
        {/if}
        {#if firstWordFull && secondWordFull && firstWordValid && secondWordValid && resultPaths.length === 0 && !isLoading}
          <p class="text-center text-yellow-600 dark:text-yellow-400 font-medium px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            No path found between <span class="font-semibold">"{inputs[0].join('')}"</span> and <span class="font-semibold">"{inputs[1].join('')}"</span>.
          </p>
        {/if}
      </div>
    </div>

    <footer class="mt-10 text-center text-gray-500 dark:text-gray-400 text-sm max-w-md w-full">
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">How To Play</h3>
        <p class="mb-3">Tap on any input box to start typing. Select your preferred word length (3-12 letters) using the buttons above.</p>
        <p class="mb-3">The solver will automatically find the shortest path between your two words as you type.</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Inspired by the game Weaver.</p>
      </div>

      <!-- Content & FAQ Section -->
      <section class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-left mb-8">
        <h2 class="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 text-center">Mastering the Word Ladder</h2>
        <div class="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p class="mb-4">
            Weaver is a captivating word game where your goal is to "weave" your way from a starting word to an ending word, changing only one letter at a time. Each intermediate step must be a valid word. It's a classic word ladder puzzle brought to the daily web game era.
          </p>
          <p class="mb-4">
            Our <strong>Weaver Solver</strong> supports words from <em>3 to 12 letters</em>, using a breadth-first search algorithm to find the <em>shortest possible path</em> between any two words. This helps you solve even the trickiest daily puzzles in seconds.
          </p>
        </div>

        <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Common Questions</h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-gray-100">How do I use the solver?</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Select your desired word length, then type the start and end words into the input boxes. The solver will instantly calculate and display the sequence of words to bridge the gap.
              </p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-gray-100">Why are some paths longer?</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Sometimes, direct connections are impossible because intermediate words don't exist. The solver must take a "detour" through other words to reach the destination, resulting in a longer ladder.
              </p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-gray-100">What word lengths are supported?</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                The solver supports 3 to 12 letter words. Simply click the button for your desired word length before entering your words.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- SEO Content Section -->
      <section class="space-y-8 mt-8">
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why Use a Weaver Solver?</h2>
          <div class="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
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

        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">How the Word Ladder Algorithm Works</h2>
          <div class="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
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

        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 p-8 rounded-xl border border-blue-100 dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tips for Getting Better at Weaver</h2>
          <div class="space-y-6 text-lg text-gray-600 dark:text-gray-300">
            <p class="leading-relaxed">
              Weaver rewards vocabulary and pattern recognition. Here are strategies to improve your game:
            </p>
            <ul class="space-y-4 ml-4">
              <li class="leading-relaxed">
                <strong class="text-gray-900 dark:text-white">Look for common letter patterns</strong> — Words often connect through common patterns. If you need to change 'A' to 'E', look for words where that position commonly has either letter.
              </li>
              <li class="leading-relaxed">
                <strong class="text-gray-900 dark:text-white">Work from both ends</strong> — Just like our algorithm, you can think about what words might connect to both the start and end. Meeting in the middle often reveals the path.
              </li>
              <li class="leading-relaxed">
                <strong class="text-gray-900 dark:text-white">Know your word families</strong> — Words that rhyme or share common endings often connect. CAT → BAT → BAG → TAG is a simple example of following a word family.
              </li>
              <li class="leading-relaxed">
                <strong class="text-gray-900 dark:text-white">Avoid dead ends</strong> — Some words have few connections. If you find yourself stuck, backtrack and try a different intermediate word with more connections.
              </li>
              <li class="leading-relaxed">
                <strong class="text-gray-900 dark:text-white">Use the solver to learn</strong> — After solving (or when stuck), use the solver to see the optimal path. Analyze why certain words were chosen and apply that knowledge to future puzzles.
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Understanding Word Ladder History</h2>
          <div class="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
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
{/if}

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

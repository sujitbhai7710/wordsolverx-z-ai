<script lang="ts">
  import { onMount } from 'svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  // Graph classes for BFS word ladder
  class WeaverNode {
    word: string;
    connected: WeaverNode[] = [];
    path?: WeaverNode[];
    visitedFrom?: boolean;
    visitedTo?: boolean;

    constructor(word: string) {
      this.word = word;
    }

    addConnected(node: WeaverNode): WeaverNode {
      if (!this.connected.includes(node)) {
        this.connected.push(node);
      }
      return this;
    }
  }

  class WeaverGraph {
    nodes: Map<string, WeaverNode> = new Map();

    add(word1: string, word2: string): void {
      const node1 = this.nodes.get(word1) || new WeaverNode(word1);
      const node2 = this.nodes.get(word2) || new WeaverNode(word2);
      this.nodes.set(word1, node1.addConnected(node2));
      this.nodes.set(word2, node2.addConnected(node1));
    }

    get(word: string): WeaverNode | undefined {
      return this.nodes.get(word);
    }

    clearVisitedAndPaths(): void {
      for (const node of this.nodes.values()) {
        delete node.path;
        delete node.visitedFrom;
        delete node.visitedTo;
      }
    }
  }

  interface WordsData {
    words: string[];
  }

  const WORD_LENGTH_OPTIONS = [3, 4, 5] as const;
  type WordLengthOption = (typeof WORD_LENGTH_OPTIONS)[number];

  const WORD_FILES: Record<WordLengthOption, string> = {
    3: '/3letterwords.json',
    4: '/4letterwords.json',
    5: '/words.json',
  };

  // State
  let wordLength = $state<WordLengthOption>(5);
  let wordSet = $state<Set<string>>(new Set());
  let graphInstance = $state<WeaverGraph | null>(null);
  let inputs = $state<string[][]>([Array(5).fill(''), Array(5).fill('')]);
  let resultPaths = $state<string[][]>([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  // Input refs
  let inputRefs = $state<(HTMLInputElement | null)[][]>([[], []]);

  function buildGraph(words: Set<string>, length: number): WeaverGraph {
    const g = new WeaverGraph();
    for (const word of words) {
      for (let i = 0; i < length; i++) {
        for (let charCode = 97; charCode < 123; charCode++) {
          const char = String.fromCharCode(charCode);
          if (word[i] === char) continue;
          const current = word.substring(0, i) + char + word.substring(i + 1);
          if (words.has(current)) {
            g.add(word, current);
          }
        }
      }
    }
    return g;
  }

  function getConnectionLogic(from: string, to: string, graph: WeaverGraph | null): string[][] {
    if (!graph) return [];
    graph.clearVisitedAndPaths();

    const fromNode = graph.get(from);
    const toNode = graph.get(to);
    if (!fromNode || !toNode) return [];

    fromNode.path = [fromNode];
    toNode.path = [toNode];
    fromNode.visitedFrom = true;
    toNode.visitedTo = true;

    const fromQueue: WeaverNode[] = [fromNode];
    const toQueue: WeaverNode[] = [toNode];

    let collectedPathsNodes: WeaverNode[][] = [];
    let minPathLength = Infinity;
    const MAX_PATHS_TO_SHOW = 5;

    while ((fromQueue.length > 0 || toQueue.length > 0) && (collectedPathsNodes.length < MAX_PATHS_TO_SHOW || minPathLength === Infinity)) {
      let fromQueueProcessCount = fromQueue.length;
      if (minPathLength !== Infinity && collectedPathsNodes.length >= MAX_PATHS_TO_SHOW) fromQueueProcessCount = 0;

      for (let i = 0; i < fromQueueProcessCount; i++) {
        const current = fromQueue.shift();
        if (!current || !current.path) continue;
        if (current.path.length >= minPathLength && minPathLength !== Infinity) continue;

        for (const neighbor of current.connected) {
          if (neighbor.visitedTo && neighbor.path) {
            const path = current.path.concat(neighbor.path.slice().reverse().slice(1));
            if (path.length < minPathLength) {
              minPathLength = path.length;
              collectedPathsNodes = [path];
            } else if (path.length === minPathLength && collectedPathsNodes.length < MAX_PATHS_TO_SHOW) {
              collectedPathsNodes.push(path);
            }
          }
          if (!neighbor.visitedFrom) {
            if (current.path.length + 1 < minPathLength || minPathLength === Infinity) {
              neighbor.visitedFrom = true;
              neighbor.path = current.path.concat(neighbor);
              fromQueue.push(neighbor);
            }
          }
        }
      }

      if (collectedPathsNodes.length >= MAX_PATHS_TO_SHOW && minPathLength !== Infinity) break;

      let toQueueProcessCount = toQueue.length;
      if (minPathLength !== Infinity && collectedPathsNodes.length >= MAX_PATHS_TO_SHOW) toQueueProcessCount = 0;

      for (let i = 0; i < toQueueProcessCount; i++) {
        const current = toQueue.shift();
        if (!current || !current.path) continue;
        if (current.path.length >= minPathLength && minPathLength !== Infinity) continue;

        for (const neighbor of current.connected) {
          if (neighbor.visitedFrom && neighbor.path) {
            const path = neighbor.path.concat(current.path.slice().reverse().slice(1));
            if (path.length < minPathLength) {
              minPathLength = path.length;
              collectedPathsNodes = [path];
            } else if (path.length === minPathLength && collectedPathsNodes.length < MAX_PATHS_TO_SHOW) {
              collectedPathsNodes.push(path);
            }
          }
          if (!neighbor.visitedTo) {
            if (current.path.length + 1 < minPathLength || minPathLength === Infinity) {
              neighbor.visitedTo = true;
              neighbor.path = current.path.concat(neighbor);
              toQueue.push(neighbor);
            }
          }
        }
      }
      if (collectedPathsNodes.length >= MAX_PATHS_TO_SHOW && minPathLength !== Infinity) break;

      if (
        minPathLength !== Infinity &&
        fromQueue.every((n) => (n.path?.length || 0) >= minPathLength) &&
        toQueue.every((n) => (n.path?.length || 0) >= minPathLength) &&
        collectedPathsNodes.length > 0
      ) {
        break;
      }
    }

    const uniqueStringPaths = new Set(collectedPathsNodes.map((p) => p.map((n) => n.word).join(',')));
    return Array.from(uniqueStringPaths)
      .map((s) => s.split(','))
      .sort((a, b) => a.length - b.length)
      .slice(0, MAX_PATHS_TO_SHOW);
  }

  async function fetchAndBuildGraph(length: WordLengthOption) {
    isLoading = true;
    error = null;
    try {
      const response = await fetch(WORD_FILES[length]);
      if (!response.ok) throw new Error(`Failed to fetch words: ${response.status}`);
      const data = (await response.json()) as WordsData;

      if (!data.words || !Array.isArray(data.words)) throw new Error('Invalid word data format');

      const filteredWords = data.words.filter((word) => word && word.length === length);
      const fetchedWordSet = new Set(filteredWords.map((w) => w.toLowerCase()));
      wordSet = fetchedWordSet;

      const newGraph = buildGraph(fetchedWordSet, length);
      graphInstance = newGraph;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error fetching words';
      wordSet = new Set();
      graphInstance = null;
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchAndBuildGraph(wordLength);
  });

  function setWordLength(length: WordLengthOption) {
    wordLength = length;
    inputs = [Array(length).fill(''), Array(length).fill('')];
    resultPaths = [];
    inputRefs = [[], []];
    fetchAndBuildGraph(length);
  }

  function handleInputChange(wordIdx: 0 | 1, letterIdx: number, value: string) {
    if (isLoading || !graphInstance) return;

    const letter = value.slice(-1).toLowerCase();
    if (letter && !/^[a-z]$/.test(letter)) return;

    inputs[wordIdx][letterIdx] = letter;
    inputs = [...inputs]; // trigger reactivity

    // Auto-focus next input
    if (letter && letterIdx < wordLength - 1) {
      inputRefs[wordIdx][letterIdx + 1]?.focus();
    } else if (letter && letterIdx === wordLength - 1 && wordIdx === 0) {
      inputRefs[1][0]?.focus();
    }

    // Check if we can solve
    const firstWord = inputs[0].join('');
    const secondWord = inputs[1].join('');

    if (firstWord.length === wordLength && secondWord.length === wordLength && wordSet.has(firstWord) && wordSet.has(secondWord)) {
      resultPaths = getConnectionLogic(firstWord, secondWord, graphInstance);
    } else {
      resultPaths = [];
    }
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

  function getBlockClasses(letter: string, isResult: boolean = false, targetWordForMatching?: string, charIndex?: number): string {
    let classes = 'w-12 h-12 sm:w-16 sm:h-16 border-2 flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase transition-all duration-150 ease-in-out rounded-xl shadow-sm';

    if (!isResult) {
      if (letter) {
        classes += ' border-indigo-500 dark:border-indigo-400 bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300';
      } else {
        classes += ' border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-700/70 text-gray-400 dark:text-gray-500';
      }
    } else {
      classes += ' border-2';
      if (targetWordForMatching && charIndex !== undefined && letter === targetWordForMatching[charIndex]) {
        classes += ' bg-green-500 text-white border-green-600 dark:bg-green-500 dark:text-white dark:border-green-600';
      } else {
        classes += ' bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500';
      }
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
        description: 'Professional solver for the Weaver word ladder game supporting 3-5 letter words.',
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
            acceptedAnswer: { '@type': 'Answer', text: 'Weaver is a daily word game where you transform a start word into an end word by changing one letter at a time, with each step being a valid word.' },
          },
          {
            '@type': 'Question',
            name: 'How does the Weaver Solver work?',
            acceptedAnswer: { '@type': 'Answer', text: 'It finds the shortest path between two words using a graph algorithm, ensuring you get the optimal solution for the puzzle.' },
          },
        ],
      },
    ],
  });
</script>

<svelte:head>
  <title>Weaver Solver - Word Ladder Puzzle Helper | WordSolverX</title>
  <meta name="description" content="Solve any Weaver word ladder puzzle with our free solver. Find the shortest path between two words by changing one letter at a time." />
  <meta name="keywords" content="Weaver Solver, Word Ladder, Weaver Game, Weaver Answer, Word Puzzle Solver" />
  <link rel="canonical" href="https://wordsolverx.com/weaver-solver" />
  <meta property="og:title" content="Weaver Solver - Word Ladder Puzzle Helper" />
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
    <h2 class="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
    <p class="text-xl text-gray-700 dark:text-gray-300">{error}</p>
    <p class="mt-4 text-gray-500 dark:text-gray-400">Please try refreshing the page or check if the word files are available.</p>
  </div>
{:else if isLoading && !graphInstance}
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
    <p class="text-2xl text-gray-700 dark:text-gray-300">Loading Weaver Solver...</p>
  </div>
{:else if !isLoading && wordSet.size === 0 && !error}
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <h2 class="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">No Words Loaded</h2>
    <p class="text-xl text-gray-700 dark:text-gray-300">The word list could not be processed correctly.</p>
    <p class="mt-2 text-gray-500 dark:text-gray-400">Please ensure the file is correctly placed and contains valid data.</p>
  </div>
{:else}
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 flex flex-col items-center justify-center p-4 sm:p-6">
    <header class="mb-6 text-center">
      <Breadcrumbs />
      <h1 class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-300">Weaver Solver</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 mt-2">Find the path between two words (3-5 letters).</p>
    </header>

    <!-- Word Length Selector -->
    <div class="mb-6 flex gap-2 sm:gap-3">
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
        <div class="flex justify-center space-x-1 sm:space-x-2 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30 shadow-inner">
          {#each inputs[0] as letter, i}
            <input
              bind:this={inputRefs[0][i]}
              type="text"
              inputmode="text"
              maxlength={1}
              value={letter}
              oninput={(e) => handleInputChange(0, i, (e.target as HTMLInputElement).value)}
              onkeydown={(e) => handleInputKeyDown(0, i, e)}
              class="text-center outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:scale-105 {getBlockClasses(letter)}"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          {/each}
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
                  <div
                    class="flex justify-center space-x-1 sm:space-x-2 animate-fadeIn"
                    style="animation-delay: {stepIndex * 100}ms"
                  >
                    {#each word.split('') as char, charIndex}
                      <div class={getBlockClasses(char, true, inputs[1].join(''), charIndex)}>
                        {char}
                      </div>
                    {/each}
                  </div>
                {/each}
              </div>
              <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-center text-xs text-gray-500 dark:text-gray-400">
                {path[0]} → {path[path.length - 1]}
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
        <div class="flex justify-center space-x-1 sm:space-x-2 p-6 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/30 shadow-inner">
          {#each inputs[1] as letter, i}
            <input
              bind:this={inputRefs[1][i]}
              type="text"
              inputmode="text"
              maxlength={1}
              value={letter}
              oninput={(e) => handleInputChange(1, i, (e.target as HTMLInputElement).value)}
              onkeydown={(e) => handleInputKeyDown(1, i, e)}
              class="text-center outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:scale-105 {getBlockClasses(letter)}"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          {/each}
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
        <p class="mb-3">Tap on any input box to start typing. Select your preferred word length (3-5 letters) using the buttons above.</p>
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
            Our <strong>Weaver Solver</strong> supports words of <em>3, 4, and 5 letters</em>, using a breadth-first search algorithm to find the <em>shortest possible path</em> between any two words. This helps you solve even the trickiest daily puzzles in seconds.
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
                The solver supports 3, 4, and 5 letter words. Simply click the button for your desired word length before entering your words.
              </p>
            </div>
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

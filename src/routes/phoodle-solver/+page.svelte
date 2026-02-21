<script lang="ts">
  import { onMount } from 'svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  interface WordsData {
    words: string[];
  }

  // State
  let phoodleWords = $state<string[]>([]);
  let backupWords = $state<string[]>([]);
  let loading = $state(true);
  let filteredWords = $state<string[]>([]);
  let searching = $state(false);
  let isDropdownOpen = $state(false);

  // Letter inputs
  let correctLetters = $state(['', '', '', '', '']);
  let misplacedLetters = $state(['', '', '', '', '']);
  let excludedLetters = $state('');

  // Element refs
  let correctRefs: (HTMLInputElement | null)[] = $state([null, null, null, null, null]);
  let misplacedRefs: (HTMLInputElement | null)[] = $state([null, null, null, null, null]);
  let dropdownRef: HTMLDivElement | undefined = $state();

  // Click outside to close dropdown
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      isDropdownOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);
    fetchAllWords();
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  async function fetchAllWords() {
    loading = true;

    // Load Phoodle Words (Primary)
    try {
      const response = await fetch('/phoodle_words.json');
      if (response.ok) {
        const data = (await response.json()) as WordsData;
        if (data?.words?.length > 0) {
          phoodleWords = data.words;
        }
      }
    } catch (error) {
      console.error('Error loading phoodle_words.json:', error);
    }

    // Load Backup Words (words.json)
    try {
      const response = await fetch('/words.json');
      if (response.ok) {
        const data = (await response.json()) as WordsData;
        if (data?.words?.length > 0) {
          backupWords = data.words;
        }
      }
    } catch (error) {
      console.error('Error loading words.json:', error);
    }

    loading = false;
  }

  function handleCorrectChange(index: number, value: string) {
    correctLetters[index] = value.toLowerCase();
    if (value && index < 4) correctRefs[index + 1]?.focus();
  }

  function handleMisplacedChange(index: number, value: string) {
    misplacedLetters[index] = value.toLowerCase();
    if (value && index < 4) misplacedRefs[index + 1]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent, type: 'correct' | 'misplaced', index: number) {
    const target = e.currentTarget as HTMLInputElement;
    if (e.key === 'Backspace' && !target.value && index > 0) {
      if (type === 'correct') correctRefs[index - 1]?.focus();
      else misplacedRefs[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      if (type === 'correct') correctRefs[index - 1]?.focus();
      else misplacedRefs[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 4) {
      if (type === 'correct') correctRefs[index + 1]?.focus();
      else misplacedRefs[index + 1]?.focus();
    }
  }

  function applyFilterLogic(
    wordToFilter: string,
    currentCorrect: string[],
    currentMisplaced: string[],
    currentExcludedArray: string[]
  ): boolean {
    const word = wordToFilter.toLowerCase();
    if (currentExcludedArray.some((letter) => letter && word.includes(letter))) return false;
    for (let i = 0; i < 5; i++) {
      if (currentCorrect[i] && word[i] !== currentCorrect[i]) return false;
    }
    for (let i = 0; i < 5; i++) {
      const misplacedLetter = currentMisplaced[i];
      if (misplacedLetter) {
        if (!word.includes(misplacedLetter)) return false;
        if (word[i] === misplacedLetter) return false;
      }
    }
    return true;
  }

  function searchWords() {
    if (loading) return;
    if (phoodleWords.length === 0 && backupWords.length === 0) {
      filteredWords = [];
      return;
    }

    searching = true;
    const excludedArray = excludedLetters.split('');

    let phoodleResults: string[] = [];
    if (phoodleWords.length > 0) {
      phoodleResults = phoodleWords.filter((word) =>
        applyFilterLogic(word, correctLetters, misplacedLetters, excludedArray)
      );
    }

    let finalResults: string[] = [];

    if (phoodleResults.length >= 4) {
      finalResults = phoodleResults;
    } else {
      finalResults = [...phoodleResults];

      if (backupWords.length > 0) {
        const backupOnlyResults = backupWords.filter((word) =>
          applyFilterLogic(word, correctLetters, misplacedLetters, excludedArray)
        );
        const phoodleResultsLower = phoodleResults.map((w) => w.toLowerCase());
        backupOnlyResults.forEach((backupWord) => {
          if (!phoodleResultsLower.includes(backupWord.toLowerCase())) {
            finalResults.push(backupWord);
          }
        });
      }
    }

    filteredWords = finalResults;
    searching = false;
  }

  function handleLetterInput(e: Event, handler: (index: number, value: string) => void, index: number) {
    const target = e.target as HTMLInputElement;
    if (target.value.length <= 1) handler(index, target.value);
  }

  function resetInputs() {
    correctLetters = ['', '', '', '', ''];
    misplacedLetters = ['', '', '', '', ''];
    excludedLetters = '';
    filteredWords = [];
    correctRefs[0]?.focus();
  }

  let hasInput = $derived(
    correctLetters.join('') !== '' || misplacedLetters.join('') !== '' || excludedLetters !== ''
  );

  const faqs = [
    {
      question: 'How do I use the Phoodle Solver?',
      answer:
        "Enter the letters you know are correct in the green boxes, misplaced letters in the yellow boxes, and gray/excluded letters in the gray box. Then click 'Find Words' to see a list of possible answers.",
    },
    {
      question: 'Is Phoodle just Wordle with food words?',
      answer:
        'Yes! Phoodle follows the same rules as Wordle (5 letters, 6 guesses), but the dictionary is strictly limited to food-related terms, ingredients, and culinary concepts.',
    },
    {
      question: "What if the word isn't in the solver list?",
      answer:
        "We use a comprehensive list of food terms, but occasionally a very obscure word might be missing. If the main Phoodle list doesn't have it, our solver automatically checks a larger backup dictionary to ensure you get a result.",
    },
    {
      question: 'Does the solver guarantee the answer?',
      answer:
        'The solver provides all mathematically possible words based on your clues. As you enter more specific clues from your guesses, the list narrows down to the single correct answer.',
    },
  ];

  const solverLinks = [
    { href: '/wordle-solver', label: 'Wordle Solver (5-Letter)' },
    { href: '/phoodle-solver', label: 'Phoodle Solver (5-Letter)', active: true },
    { href: '/lewdle-solver', label: 'Lewdle Solver' },
    { href: '/quordle-solver', label: 'Quordle Solver' },
    { href: '/colordle-solver', label: 'Colordle Solver' },
    { href: '/waffle-solver', label: 'Waffle Solver' },
    { href: '/weaver-solver', label: 'Weaver Solver' },
  ];

  const jsonLdSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Phoodle Solver',
        operatingSystem: 'Web',
        applicationCategory: 'GameApplication',
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', ratingCount: '1348', bestRating: '5', worstRating: '1' },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'ProfessionalService',
        name: 'Phoodle Solver',
        description: 'Professional 5-letter Phoodle solver tool for food-related word puzzles.',
        url: 'https://wordsolverx.com/phoodle-solver',
        areaServed: 'Worldwide',
        serviceType: 'Puzzle Solving Service',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ],
  });
</script>

<svelte:head>
  <title>Phoodle Solver Today - Phoodle Answer & Hints | WordSolverX</title>
  <meta name="description" content="Stuck on today's Phoodle? Use our free Phoodle Solver to find the answer. Get hints and solve food-related 5-letter word puzzles instantly." />
  <meta name="keywords" content="Phoodle Solver Today, Phoodle Solver, Phoodle Answer, Phoodle Hints, Food Wordle Solver, Phoodle Help" />
  <link rel="canonical" href="https://wordsolverx.com/phoodle-solver" />
  <meta property="og:title" content="Phoodle Solver Today - Instant Answers" />
  <meta property="og:description" content="Solve today's Phoodle puzzle instantly. Enter your clues and get the best food-word suggestions." />
  <meta property="og:url" content="https://wordsolverx.com/phoodle-solver" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/phoodle solver.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Phoodle Solver Today" />
  <meta name="twitter:description" content="Get instant help with Phoodle puzzles." />
  {@html `<script type="application/ld+json">${jsonLdSchema}</script>`}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <Breadcrumbs />

  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
    <div class="text-center mb-8">
      <div class="flex justify-center mb-6">
        <img
          src="/phoodle solver.webp"
          alt="Phoodle Solver Featured"
          width="600"
          height="300"
          class="rounded-xl shadow-lg"
        />
      </div>
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">
        Phoodle Solver (5-Letter)
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-300">
        Enter your Phoodle clues to find possible 5-letter word solutions
      </p>

      <!-- Solver Type Dropdown -->
      <div class="mt-4 flex justify-center" bind:this={dropdownRef}>
        <div class="relative">
          <button
            onclick={() => (isDropdownOpen = !isDropdownOpen)}
            class="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
            aria-label="Select solver type"
          >
            <span class="mr-2 font-medium">Select Solver Type</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={isDropdownOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
            </svg>
          </button>

          {#if isDropdownOpen}
            <div class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
              <div class="p-2">
                <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 px-4 py-1">Select Solver</h3>
                <div class="border-t border-gray-200 dark:border-gray-700"></div>
                {#each solverLinks as link}
                  <a
                    href={link.href}
                    class="block px-4 py-2 text-sm rounded {link.active
                      ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                  >
                    {link.label}
                  </a>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-8">
        <!-- Correct Letters (Green) -->
        <div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Correct Letters (Green)</h2>
          <div class="flex space-x-2">
            {#each correctLetters as letter, index}
              <input
                bind:this={correctRefs[index]}
                type="text"
                value={letter}
                oninput={(e) => handleLetterInput(e, handleCorrectChange, index)}
                onkeydown={(e) => handleKeyDown(e, 'correct', index)}
                maxlength={1}
                class="w-14 h-14 text-center text-2xl font-bold bg-green-500 text-white rounded-lg border-2 border-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none uppercase tabular-nums"
                aria-label="Correct letter position {index + 1}"
              />
            {/each}
          </div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter letters that are in the correct position.
          </p>
        </div>

        <!-- Misplaced Letters (Yellow) -->
        <div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Misplaced Letters (Yellow)</h2>
          <div class="flex space-x-2">
            {#each misplacedLetters as letter, index}
              <input
                bind:this={misplacedRefs[index]}
                type="text"
                value={letter}
                oninput={(e) => handleLetterInput(e, handleMisplacedChange, index)}
                onkeydown={(e) => handleKeyDown(e, 'misplaced', index)}
                maxlength={1}
                class="w-14 h-14 text-center text-2xl font-bold bg-yellow-400 text-gray-800 rounded-lg border-2 border-yellow-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none uppercase tabular-nums"
                aria-label="Misplaced letter position {index + 1}"
              />
            {/each}
          </div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter letters that are in the word but in the wrong position.
          </p>
        </div>

        <!-- Excluded Letters (Gray) -->
        <div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Excluded Letters (Gray)</h2>
          <input
            type="text"
            value={excludedLetters}
            oninput={(e) => { excludedLetters = (e.target as HTMLInputElement).value.toLowerCase(); }}
            class="w-full p-3 text-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase tabular-nums"
            placeholder="Enter all gray letters"
            aria-label="Excluded letters"
          />
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter all letters that are grayed out in Phoodle. These letters are not in the word at all.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-4 mt-8">
          <button
            onclick={searchWords}
            disabled={loading || searching}
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searching ? 'Searching...' : 'Find Words'}
          </button>
          <button
            onclick={resetInputs}
            class="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Possible Words ({filteredWords.length})
        </h2>
        {#if loading}
          <div class="text-center py-10">
            <div class="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p class="text-lg text-gray-600 dark:text-gray-300">Loading word list...</p>
          </div>
        {:else if filteredWords.length > 0}
          <div class="max-h-[600px] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow">
            <ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {#each filteredWords as word, index}
                <li class="bg-white dark:bg-gray-800 p-3 rounded-md shadow text-center font-mono text-lg text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors tabular-nums">
                  {word.toUpperCase()}
                </li>
              {/each}
            </ul>
          </div>
        {:else}
          <div class="text-center py-10 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600 shadow">
            <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
            </svg>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              {hasInput && !searching
                ? 'No words match your criteria. Try adjusting your inputs.'
                : 'Enter letters above to start finding words.'}
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- What is Phoodle Section -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">What is Phoodle?</h2>
    <p class="text-gray-700 dark:text-gray-300 mb-4">
      Phoodle is a daily word puzzle game similar to Wordle, but with a delicious twist: every answer is related to food! From ingredients and dishes to cooking terms and culinary techniques, Phoodle challenges your knowledge of the culinary world.
    </p>
    <p class="text-gray-700 dark:text-gray-300">
      Just like the classic game, you have six attempts to guess the five-letter word. The tiles change color to indicate how close you are to the correct answer. It's the perfect daily brain teaser for foodies and word game enthusiasts alike.
    </p>
  </div>

  <!-- How to Use Section -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mt-8">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">How to Use the Phoodle Solver</h2>
    <div class="flex justify-center mb-6">
      <img
        src="/phoodle-solver7.webp"
        alt="How to use Phoodle Solver"
        width="600"
        height="400"
        class="rounded-lg shadow-md"
      />
    </div>
    <div class="space-y-4 text-gray-700 dark:text-gray-300">
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0 h-6 w-6 rounded-md bg-green-500 text-white flex items-center justify-center font-bold">1</div>
        <p><strong class="font-semibold">Correct Letters (Green):</strong> Enter letters that are in the correct spot in the Phoodle puzzle. For example, if the first letter is 'A' and it's green, put 'A' in the first box of this section.</p>
      </div>
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0 h-6 w-6 rounded-md bg-yellow-400 text-gray-800 flex items-center justify-center font-bold">2</div>
        <p><strong class="font-semibold">Misplaced Letters (Yellow):</strong> Enter letters that are in the word but in the wrong spot. For each yellow letter in Phoodle, enter it into one of the boxes in this section.</p>
      </div>
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0 h-6 w-6 rounded-md bg-gray-500 text-white flex items-center justify-center font-bold">3</div>
        <p><strong class="font-semibold">Excluded Letters (Gray):</strong> Enter all letters that are grayed out in Phoodle. These letters are not in the word at all.</p>
      </div>
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0 h-6 w-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">4</div>
        <p><strong class="font-semibold">Find Words:</strong> Click this button to see a list of possible words based on your input.</p>
      </div>
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0 h-6 w-6 rounded-md bg-gray-300 text-gray-800 flex items-center justify-center font-bold">5</div>
        <p><strong class="font-semibold">Reset:</strong> Clears all your inputs so you can start over.</p>
      </div>
    </div>
    <p class="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
      This solver helps you find possible words for Phoodle. Good luck!
    </p>
  </div>

  <div class="mt-8">
    <FAQSection title="Phoodle Solver - Frequently Asked Questions" {faqs} />
  </div>
</div>

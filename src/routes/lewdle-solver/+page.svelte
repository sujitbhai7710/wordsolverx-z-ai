<script lang="ts">
  import { onMount } from 'svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';

  // State
  let wordLength = $state(5);
  let allWords = $state<string[]>([]);
  let filteredWords = $state<string[]>([]);
  let correctLetters = $state<string[]>(Array(5).fill(''));
  let misplacedLetters = $state<string[]>(Array(5).fill(''));
  let excludedLetters = $state('');
  let mustIncludeLetters = $state('');
  let isLoadingWords = $state(true);
  let manualErrorMessage = $state('');
  let showAdvancedOptions = $state(false);
  let sortByFrequency = $state(true);
  let positionalExclusions = $state<string[][]>(Array(5).fill(null).map(() => []));
  let wordFrequencyMap = $state(new Map<string, number>());

  let possibleWordsRef: HTMLDivElement | undefined = $state();

  function handleWordLengthChange(length: number) {
    wordLength = length;
    correctLetters = Array(length).fill('');
    misplacedLetters = Array(length).fill('');
    positionalExclusions = Array(length).fill(null).map(() => []);
    excludedLetters = '';
    mustIncludeLetters = '';
    filteredWords = [];
    manualErrorMessage = '';
    showAdvancedOptions = false;
  }

  async function loadWordsAndFrequency() {
    isLoadingWords = true;
    manualErrorMessage = '';
    try {
      const response = await fetch(`/data/wordle/lewdle${wordLength}.txt`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      const words = text.split(/\s+/).filter((w) => w && w.length === wordLength).map((w) => w.toLowerCase());
      allWords = words;

      const frequencyMap = new Map<string, number>();
      const letterOverallFrequency: Record<string, number> = {};

      words.forEach((word) => {
        word.split('').forEach((letter) => {
          letterOverallFrequency[letter] = (letterOverallFrequency[letter] || 0) + 1;
        });
      });

      words.forEach((word) => {
        const uniqueLetters = [...new Set(word.split(''))];
        const score = uniqueLetters.reduce((sum, letter) => sum + (letterOverallFrequency[letter] || 0), 0);
        frequencyMap.set(word, score);
      });
      wordFrequencyMap = frequencyMap;
    } catch (error) {
      console.error('Error loading word list:', error);
      manualErrorMessage = 'Failed to load word list. Please try refreshing the page.';
      allWords = [];
      wordFrequencyMap = new Map();
    }
    isLoadingWords = false;
  }

  // Reload when word length changes
  $effect(() => {
    const _len = wordLength; // track dependency
    correctLetters = Array(_len).fill('');
    misplacedLetters = Array(_len).fill('');
    positionalExclusions = Array(_len).fill(null).map(() => []);
    filteredWords = [];
    loadWordsAndFrequency();
  });

  function handleCorrectLetterChange(index: number, value: string) {
    correctLetters[index] = value.toLowerCase().slice(0, 1);
  }

  function handleMisplacedLetterChange(index: number, value: string) {
    const oldLetter = misplacedLetters[index];
    const newLetter = value.toLowerCase().slice(0, 1);

    misplacedLetters[index] = newLetter;

    const currentExclusionsForPos = positionalExclusions[index] ? [...positionalExclusions[index]] : [];
    const oldIndexInExclusions = currentExclusionsForPos.indexOf(oldLetter);
    if (oldLetter && oldIndexInExclusions > -1) {
      currentExclusionsForPos.splice(oldIndexInExclusions, 1);
    }
    if (newLetter && !currentExclusionsForPos.includes(newLetter)) {
      currentExclusionsForPos.push(newLetter);
    }
    positionalExclusions[index] = currentExclusionsForPos;

    let currentMustIncludes = mustIncludeLetters.split('');
    if (
      oldLetter &&
      !correctLetters.includes(oldLetter) &&
      !misplacedLetters.filter((l, i) => i !== index).includes(oldLetter) &&
      !newLetter
    ) {
      currentMustIncludes = currentMustIncludes.filter((l) => l !== oldLetter);
    }
    if (newLetter && !currentMustIncludes.includes(newLetter)) {
      currentMustIncludes.push(newLetter);
    }
    mustIncludeLetters = currentMustIncludes.join('');
  }

  function handleExcludedLettersChange(value: string) {
    excludedLetters = value.toLowerCase().replace(/[^a-z]/g, '');
  }

  function handleMustIncludeLettersChange(value: string) {
    mustIncludeLetters = value.toLowerCase().replace(/[^a-z]/g, '');
  }

  function handleManualReset() {
    correctLetters = Array(wordLength).fill('');
    misplacedLetters = Array(wordLength).fill('');
    excludedLetters = '';
    mustIncludeLetters = '';
    filteredWords = [];
    manualErrorMessage = '';
    positionalExclusions = Array(wordLength).fill(null).map(() => []);
    showAdvancedOptions = false;
  }

  function handleFilterWords() {
    manualErrorMessage = '';
    isLoadingWords = true;

    try {
      let tempFilteredWords = [...allWords];

      // 1. Correct letters (Green)
      for (let i = 0; i < wordLength; i++) {
        if (correctLetters[i]) {
          tempFilteredWords = tempFilteredWords.filter((word) => word[i] === correctLetters[i]);
        }
      }

      // 2. Positional Exclusions (Yellow letter NOT in this specific spot)
      for (let i = 0; i < wordLength; i++) {
        if (positionalExclusions[i]?.length > 0) {
          positionalExclusions[i].forEach((excludedChar) => {
            tempFilteredWords = tempFilteredWords.filter((word) => word[i] !== excludedChar);
          });
        }
      }

      // 3. Misplaced letters (Yellow - must be present)
      const allMisplacedCharsFromInput = misplacedLetters.filter((l) => l !== '');
      allMisplacedCharsFromInput.forEach((misplacedChar) => {
        tempFilteredWords = tempFilteredWords.filter((word) => word.includes(misplacedChar));
      });

      // 4. Must Include letters
      if (mustIncludeLetters.length > 0) {
        const mustIncludeArray = [...new Set(mustIncludeLetters.toLowerCase().split(''))];
        tempFilteredWords = tempFilteredWords.filter((word) =>
          mustIncludeArray.every((letter) => word.includes(letter))
        );
      }

      // 5. Excluded letters (Grey)
      if (excludedLetters.length > 0) {
        const uniqueExcluded = [...new Set(excludedLetters.toLowerCase().split(''))];
        const filteredExcluded = uniqueExcluded.filter((letter) => {
          return (
            !correctLetters.includes(letter) &&
            !allMisplacedCharsFromInput.includes(letter) &&
            !mustIncludeLetters.includes(letter)
          );
        });
        filteredExcluded.forEach((exChar) => {
          tempFilteredWords = tempFilteredWords.filter((word) => !word.includes(exChar));
        });
      }

      // Sorting
      if (sortByFrequency && wordFrequencyMap.size > 0 && tempFilteredWords.length > 1) {
        tempFilteredWords.sort((a, b) => {
          return (wordFrequencyMap.get(b) || 0) - (wordFrequencyMap.get(a) || 0);
        });
      } else {
        tempFilteredWords.sort((a, b) => a.localeCompare(b));
      }

      filteredWords = tempFilteredWords;
    } catch (error) {
      console.error('Error filtering words:', error);
      manualErrorMessage = 'Error filtering words. Please try again.';
    }

    isLoadingWords = false;
  }

  const jsonLdSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        name: 'Lewdle Solver',
        description: 'Professional solver for the Lewdle word game.',
        url: 'https://wordsolverx.com/lewdle-solver',
        areaServed: 'Worldwide',
        serviceType: 'Puzzle Solving Service',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Lewdle?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Lewdle is a playful, adult-themed parody of Wordle. The gameplay is identical to Wordle, but the dictionary consists exclusively of lewd, rude, and crude words.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I use the Lewdle Solver?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Enter the letters you know from your current game. Put green letters in the 'Correct Letters' boxes, yellow letters in the 'Misplaced' boxes, and gray letters in the 'Excluded' field. Click Search to see possible answers.",
            },
          },
          {
            '@type': 'Question',
            name: 'Is this solver free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, our Lewdle Solver is completely free to use and offers unlimited searches.',
            },
          },
        ],
      },
    ],
  });
</script>

<svelte:head>
  <title>Lewdle Solver Today - Answers & Hints</title>
  <meta name="description" content="Stuck on today's Lewdle? Use our free Lewdle Solver to find the answer. Supports 5 and 6-letter lewd word puzzles." />
  <meta name="keywords" content="Lewdle Solver, Lewdle Answer, Lewdle Hints, Lewdle Help, Adult Word Game Solver" />
  <link rel="canonical" href="https://wordsolverx.com/lewdle-solver" />
  <meta property="og:title" content="Lewdle Solver Today - Instant Answers" />
  <meta property="og:description" content="Solve today's Lewdle puzzle instantly. Enter your clues and get suggestions." />
  <meta property="og:url" content="https://wordsolverx.com/lewdle-solver" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Lewdle Solver Today" />
  <meta name="twitter:description" content="Get instant help with Lewdle puzzles." />
  {@html `<script type="application/ld+json">${jsonLdSchema}</script>`}
</svelte:head>

{#if isLoadingWords && allWords.length === 0}
  <div class="min-h-screen bg-gray-50 text-gray-900 flex justify-center items-center">
    <div class="text-center p-6">
      <h1 class="text-4xl font-extrabold text-pink-600 mb-3">Lewdle Solver</h1>
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-600 mx-auto mb-4"></div>
      <p class="text-xl font-medium">Loading resources...</p>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-gradient-to-b from-pink-50 to-white text-slate-800 flex flex-col items-center p-4 pb-16 selection:bg-pink-200">
    <div class="w-full max-w-xl">
      <Breadcrumbs />

      <header class="mb-8 text-center">
        <h1 class="text-4xl font-extrabold text-pink-600 mb-2 drop-shadow-sm">Lewdle Solver</h1>
        <p class="text-slate-600 font-medium">Daily Adult Word Game Helper</p>
      </header>

      <div class="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
        <!-- Word Length Toggles -->
        <div class="flex border-b border-pink-100">
          <button
            onclick={() => handleWordLengthChange(5)}
            class="flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors {wordLength === 5
              ? 'bg-pink-500 text-white'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}"
          >
            5 Letters
          </button>
          <button
            onclick={() => handleWordLengthChange(6)}
            class="flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors {wordLength === 6
              ? 'bg-pink-500 text-white'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}"
          >
            6 Letters
          </button>
        </div>

        <div class="p-6 space-y-8">
          <!-- Correct Letters (Green) -->
          <div>
            <legend class="block text-sm font-bold text-slate-700 mb-3 flex items-center">
              <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Correct Letters (Green)
            </legend>
            <div class="flex justify-center gap-2">
              {#each correctLetters as letter, index}
                <input
                  type="text"
                  aria-label="Correct letter {index + 1}"
                  maxlength={1}
                  value={letter}
                  oninput={(e) => handleCorrectLetterChange(index, (e.target as HTMLInputElement).value)}
                  class="w-12 h-14 sm:w-14 sm:h-16 border-2 border-green-200 rounded-lg text-center text-2xl font-bold bg-green-50 text-green-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all uppercase"
                />
              {/each}
            </div>
          </div>

          <!-- Misplaced Letters (Yellow) -->
          <div>
            <legend class="block text-sm font-bold text-slate-700 mb-3 flex items-center">
              <span class="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
              Misplaced Letters (Yellow)
            </legend>
            <div class="flex justify-center gap-2 mb-2">
              {#each misplacedLetters as letter, index}
                <input
                  type="text"
                  aria-label="Misplaced letter {index + 1}"
                  maxlength={1}
                  value={letter}
                  oninput={(e) => handleMisplacedLetterChange(index, (e.target as HTMLInputElement).value)}
                  class="w-12 h-14 sm:w-14 sm:h-16 border-2 border-yellow-200 rounded-lg text-center text-2xl font-bold bg-yellow-50 text-yellow-700 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all uppercase"
                  placeholder="{(index + 1).toString()}"
                />
              {/each}
            </div>
            <p class="text-xs text-slate-500 text-center">Enter letters in the position they were marked yellow.</p>
          </div>

          <!-- Excluded Letters (Gray) -->
          <div>
            <label for="excluded-letters" class="block text-sm font-bold text-slate-700 mb-2 flex items-center">
              <span class="w-3 h-3 bg-slate-400 rounded-full mr-2"></span>
              Excluded Letters (Gray)
            </label>
            <input
              id="excluded-letters"
              type="text"
              value={excludedLetters}
              oninput={(e) => handleExcludedLettersChange((e.target as HTMLInputElement).value)}
              class="w-full p-4 border-2 border-slate-200 rounded-xl text-lg tracking-widest uppercase placeholder-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
              placeholder="ABC..."
            />
          </div>

          <!-- Advanced Options Toggle -->
          <div class="pt-2">
            <button
              onclick={() => (showAdvancedOptions = !showAdvancedOptions)}
              class="text-xs font-bold text-pink-500 hover:text-pink-700 uppercase tracking-wider flex items-center"
            >
              {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
              <span class="ml-1 text-[10px]">{showAdvancedOptions ? '▲' : '▼'}</span>
            </button>

            {#if showAdvancedOptions}
              <div class="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1" for="mustInclude">Must Include (Any Match)</label>
                  <input
                    id="mustInclude"
                    type="text"
                    value={mustIncludeLetters}
                    oninput={(e) => handleMustIncludeLettersChange((e.target as HTMLInputElement).value)}
                    class="w-full p-2 border border-slate-300 rounded text-sm uppercase"
                    placeholder="Letters that must be in the word"
                  />
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="sortFreq"
                    checked={sortByFrequency}
                    onchange={(e) => (sortByFrequency = (e.target as HTMLInputElement).checked)}
                    class="mr-2 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label for="sortFreq" class="text-xs text-slate-600 font-medium">Sort results by common usage</label>
                </div>
              </div>
            {/if}
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button
              onclick={handleFilterWords}
              disabled={isLoadingWords}
              class="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingWords ? 'Loading...' : 'Find Words'}
            </button>
            <button
              onclick={handleManualReset}
              class="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
              title="Reset all fields"
            >
              Reset
            </button>
          </div>
        </div>

        <!-- Error Message -->
        {#if manualErrorMessage}
          <div class="px-6 pb-6 text-center">
            <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
              {manualErrorMessage}
            </div>
          </div>
        {/if}
      </div>

      <!-- Results -->
      <div bind:this={possibleWordsRef} class="mt-8">
        <h3 class="text-xl font-bold text-slate-800 mb-4 flex items-center justify-between">
          <span>Possible Words</span>
          <span class="bg-pink-100 text-pink-800 text-xs py-1 px-3 rounded-full">{filteredWords.length} found</span>
        </h3>

        {#if filteredWords.length > 0}
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {#each filteredWords.slice(0, 100) as word}
              <div class="bg-white border border-slate-200 rounded-lg py-3 text-center font-mono font-bold text-slate-700 shadow-sm hover:border-pink-300 hover:text-pink-600 hover:shadow-md transition-all cursor-default select-all uppercase">
                {word}
              </div>
            {/each}
            {#if filteredWords.length > 100}
              <div class="col-span-full text-center py-4 text-slate-500 text-sm italic">
                ...and {filteredWords.length - 100} more words. Narrow down your search!
              </div>
            {/if}
          </div>
        {:else}
          <div class="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p class="text-slate-400 font-medium">Enter your clues above to see results</p>
          </div>
        {/if}
      </div>
    </div>

    <section class="w-full max-w-xl mt-12 bg-white p-6 rounded-xl shadow-md border border-pink-100">
      <h2 class="text-2xl font-bold text-pink-800 mb-4 text-center">Mastering Lewdle</h2>
      <div class="prose prose-pink text-slate-700">
        <p class="mb-4">
          Lewdle is the cheeky cousin of the famous word game, challenging players to guess a daily "lewd" word.
          Because the vocabulary is restricted to specific adult slang and terms, it can sometimes be trickier than regular Wordle
          if you aren't familiar with certain slang words.
        </p>
        <p class="mb-4">
          Our <strong>Lewdle Solver</strong> helps bridge that gap. By filtering through a comprehensive list of game-specific words,
          we can turn your partial guesses into a win. Whether you play on 5-letter or 6-letter modes, our tool adapts to give you the best suggestions.
        </p>
      </div>

      <div class="mt-8 border-t border-gray-100 pt-6">
        <h3 class="text-xl font-bold text-pink-700 mb-4">Common Questions</h3>
        <div class="space-y-4">
          <div>
            <h4 class="font-semibold text-gray-900">Is Lewdle harder than Wordle?</h4>
            <p class="text-sm text-gray-600 mt-1">It relies on a specialized vocabulary. If your knowledge of slang is vast, you might find it easier; otherwise, it can be quite a challenge!</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900">Does this solver work for 6-letter mode?</h4>
            <p class="text-sm text-gray-600 mt-1">Yes! Use the toggle at the top of the solver to switch between 5-letter and 6-letter word lists.</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="mt-12 text-center text-slate-500 text-xs max-w-xl">
      <p>© {new Date().getFullYear()} WordSolverX. Not affiliated with Lewdle.</p>
    </footer>
  </div>
{/if}

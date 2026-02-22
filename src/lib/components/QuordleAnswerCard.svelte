<script lang="ts">
  import { getQuordleDataForDate } from '$lib/quordle';
  import { format } from 'date-fns';

  let { date }: { date: Date } = $props();

  let data = $state<{
    d: string[], c: string[], e: string[], s: string[], r: string[], w: string[],
    dN: number, cN: number, eN: number, sN: number, rN: number, wN: number
  } | null>(null);
  let viewAnswers = $state<Record<string, boolean>>({});
  let mounted = $state(false);

  $effect(() => {
    mounted = true;
    data = getQuordleDataForDate(date);
  });

  function countVowels(word: string) { return (word.match(/[AEIOU]/gi) || []).length; }
  function hasDoubleLetters(word: string) {
    for (let i = 0; i < word.length - 1; i++) {
      if (word[i] === word[i + 1]) return true;
    }
    return false;
  }

  const colorMap: Record<string, string> = {
    classic: 'bg-emerald-500', sequence: 'bg-violet-500', chill: 'bg-blue-500',
    extreme: 'bg-red-500', rescue: 'bg-amber-500', weekly: 'bg-pink-500'
  };
</script>

{#if !data}
  <div class="text-center p-8">Loading...</div>
{:else}
  <div class="space-y-12">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-4">Today&apos;s Quordle Puzzle Hints & Solutions</h2>
      <div class="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
      <p class="mt-4 text-gray-500 font-medium uppercase tracking-[0.2em] text-xs">Scroll down for all game modes</p>
    </div>

    {#each [
      { title: 'Daily Classic', words: data.d, type: 'classic', num: data.dN },
      { title: 'Daily Chill', words: data.c, type: 'chill', num: data.cN },
      { title: 'Daily Extreme', words: data.e, type: 'extreme', num: data.eN },
      { title: 'Sequence', words: data.s, type: 'sequence', num: data.dN },
      { title: 'Rescue', words: data.r, type: 'rescue', num: data.rN },
      { title: 'Weekly', words: data.w, type: 'weekly', num: data.wN }
    ] as mode}
      {#if mode.words && mode.words.length > 0}
        {@const accentColor = colorMap[mode.type] || 'bg-gray-500'}
        {@const textColor = accentColor.replace('bg-', 'text-')}
        {@const vowelCountTotal = mode.words.reduce((acc: number, w: string) => acc + countVowels(w), 0)}
        {@const doubleLetterCount = mode.words.filter(hasDoubleLetters).length}
        {@const startingLetters = mode.words.map((w: string) => w[0]).join(', ')}

        <div class="mb-16 scroll-mt-20" id="mode-{mode.type}">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
            <span class="w-2 h-8 rounded-full {accentColor}"></span>
            {mode.title} Hints for {mode.num}
          </h2>
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <p class="text-gray-600 dark:text-gray-400 mb-8 italic">
              Are you struggling to solve today&apos;s {mode.title.toLowerCase()}? Here are some useful hints.
            </p>
            <div class="space-y-8">
              <div>
                <div class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span class="{accentColor} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">Q1</span>
                  How many vowels are in today&apos;s {mode.title.toLowerCase()} words?
                </div>
                <p class="text-gray-600 dark:text-gray-400 pl-10">
                  There are a total of <span class="font-bold {textColor}">{vowelCountTotal} vowels</span> across the four words.
                </p>
              </div>
              <div>
                <div class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span class="{accentColor} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">Q2</span>
                  How many double letters are there?
                </div>
                <p class="text-gray-600 dark:text-gray-400 pl-10">
                  {doubleLetterCount === 0 ? "None of today's words contain double letters." : `There are ${doubleLetterCount} words with double letters.`}
                </p>
              </div>
              <div>
                <div class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span class="{accentColor} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">Q3</span>
                  Starting letters?
                </div>
                <p class="text-gray-600 dark:text-gray-400 pl-10">
                  The starting letters are: <span class="font-bold tracking-widest {textColor}">{startingLetters}</span>.
                </p>
              </div>
            </div>
          </div>

          <div class="mt-8 text-center">
            <button
              onclick={() => (viewAnswers = { ...viewAnswers, [mode.type]: !viewAnswers[mode.type] })}
              class="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              {viewAnswers[mode.type] ? 'Hide Answers' : `Show ${mode.title} Answers`}
            </button>
          </div>

          {#if viewAnswers[mode.type]}
            <div class="mt-12">
              <div class="text-center mb-8">
                <div class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{mode.title} Answers for {mode.num}</div>
                <p class="text-gray-500 dark:text-gray-400">
                  {#if mounted}for {format(date, 'EEEE, MMMM d, yyyy')}{/if}
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {#each mode.words as word, i}
                  <div class="{accentColor} text-white p-6 rounded-2xl text-center text-2xl font-black tracking-[0.2em] shadow-xl border-b-4 border-black/20 transform hover:-translate-y-1 transition-transform">
                    {word}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
{/if}

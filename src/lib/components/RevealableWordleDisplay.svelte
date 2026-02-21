<script lang="ts">
  import GameTile from './wordle/GameTile.svelte';

  let {
    word,
    number,
    date,
    days_since_launch,
    onReveal,
  }: {
    word: string;
    number: number;
    date: string;
    days_since_launch?: number;
    onReveal?: () => void;
  } = $props();

  let revealedIndices = $state<Set<number>>(new Set());

  function revealLetter(index: number) {
    if (revealedIndices.has(index)) return;
    revealedIndices = new Set([...revealedIndices, index]);
  }

  function revealAll(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    revealedIndices = new Set([...Array(word.length).keys()]);
    if (onReveal) onReveal();
  }

  let isAllRevealed = $derived(revealedIndices.size === word.length);
</script>

<div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700 transform transition-all hover:shadow-xl">
  <div class="text-center mb-6">
    <div class="relative inline-block">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        Wordle answer for {date}
      </h2>
      <div class="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-blue-500 rounded-full"></div>
    </div>
    {#if days_since_launch}
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        Day {days_since_launch} since launch
      </p>
    {/if}
  </div>

  <div class="flex justify-center flex-wrap gap-2 sm:gap-3 mb-8">
    {#each word.split('') as letter, index}
      <button
        onclick={() => revealLetter(index)}
        class="focus:outline-none transition-transform hover:scale-105 active:scale-95"
        aria-label="Reveal Tile {index + 1}"
      >
        <GameTile 
          letter={revealedIndices.has(index) ? letter.toUpperCase() : ''} 
          state={revealedIndices.has(index) ? 'correct' : 'filled'} 
          size="large" 
        />
      </button>
    {/each}
  </div>

  <div class="text-center relative">
    {#if !isAllRevealed}
      <button
        onclick={revealAll}
        class="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black rounded-full transition-all font-bold shadow-md hover:shadow-lg transform hover:-translate-y-1"
      >
        <div class="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          <span>Show Answer</span>
        </div>
      </button>
      <div class="mt-4 text-sm text-gray-500 dark:text-gray-400 opacity-80">
        Click individual tiles to reveal one letter at a time
      </div>
    {:else}
      <div class="inline-flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-bold">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        <span>Answer Revealed</span>
      </div>
    {/if}
  </div>
</div>

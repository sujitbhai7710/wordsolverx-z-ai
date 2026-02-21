<script lang="ts">
  import type { GameMode } from '$lib/wordle/types';

  let {
    gameMode,
    currentGameNumber,
  }: {
    gameMode: GameMode;
    currentGameNumber: number | null;
  } = $props();

  let timeRemaining = $state({ hours: 0, minutes: 0, seconds: 0 });
  let shouldShowCountdown = $derived(gameMode === 'daily');

  function calculateTimeRemaining() {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);
    const diffMs = nextMidnight.getTime() - now.getTime();
    return {
      hours: Math.floor(diffMs / (1000 * 60 * 60)),
      minutes: Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diffMs % (1000 * 60)) / 1000),
    };
  }

  $effect(() => {
    if (!shouldShowCountdown) return;
    timeRemaining = calculateTimeRemaining();
    const timer = setInterval(() => {
      timeRemaining = calculateTimeRemaining();
    }, 1000);
    return () => clearInterval(timer);
  });
</script>

{#if shouldShowCountdown}
  <div class="text-center py-2 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-900 mt-2">
    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
      Next Wordle {currentGameNumber ? `#${currentGameNumber + 1}` : ''} in
    </p>
    <div class="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono font-bold">
      <span>{timeRemaining.hours.toString().padStart(2, '0')}</span>
      <span>:</span>
      <span>{timeRemaining.minutes.toString().padStart(2, '0')}</span>
      <span>:</span>
      <span>{timeRemaining.seconds.toString().padStart(2, '0')}</span>
    </div>
  </div>
{/if}

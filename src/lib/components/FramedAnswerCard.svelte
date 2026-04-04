<script lang="ts">
  import type { FramedGameConfig } from '$lib/framed';

  let {
    game,
    answer,
    puzzleNumber
  }: {
    game: FramedGameConfig;
    answer: string;
    puzzleNumber: number;
  } = $props();
</script>

<article class="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-lg shadow-black/20 transition-transform hover:-translate-y-1">
  <div class={`h-1.5 bg-gradient-to-r ${game.gradient}`}></div>
  <div class="p-5">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">{game.label}</p>
        <h3 class="mt-3 text-xl font-black text-white">{answer}</h3>
        <p class="mt-2 text-sm text-zinc-400">{game.description}</p>
      </div>
      <span class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-xl">
        {game.emoji}
      </span>
    </div>

    <div class="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4 text-sm">
      <span class="text-zinc-500">Puzzle</span>
      <span class="font-mono font-semibold text-zinc-200">#{puzzleNumber}</span>
    </div>
  </div>
</article>

<script lang="ts">
  import { format } from 'date-fns';

  let {
    puzzle,
    solution,
    date,
    loading = false,
  }: {
    puzzle?: string;
    solution: string;
    date: Date;
    loading?: boolean;
  } = $props();

  let colors = $derived.by(() => {
    if (!puzzle || !solution) return Array(21).fill('green');

    const res = Array(21).fill('grey');
    const across = [[0, 1, 2, 3, 4], [8, 9, 10, 11, 12], [16, 17, 18, 19, 20]];
    const down = [[0, 5, 8, 13, 16], [2, 6, 10, 14, 18], [4, 7, 12, 15, 20]];

    [...across, ...down].forEach(indices => {
      const target = indices.map(i => solution[i]);
      const current = indices.map(i => puzzle![i]);
      const wordColors = Array(5).fill('grey');
      const available = [...target];

      current.forEach((char, i) => {
        if (char === target[i]) { wordColors[i] = 'green'; available[i] = ''; }
      });
      current.forEach((char, i) => {
        if (wordColors[i] === 'grey') {
          const idx = available.indexOf(char);
          if (idx !== -1) { wordColors[i] = 'yellow'; available[idx] = ''; }
        }
      });
      indices.forEach((idx, i) => {
        if (wordColors[i] === 'green') res[idx] = 'green';
        else if (wordColors[i] === 'yellow' && res[idx] !== 'green') res[idx] = 'yellow';
      });
    });
    return res;
  });

  function getGlobalIdx(r: number, c: number) {
    if (r === 0) return c;
    if (r === 1) return 5 + (c / 2);
    if (r === 2) return 8 + c;
    if (r === 3) return 13 + (c / 2);
    if (r === 4) return 16 + c;
    return 0;
  }

  function buildGrid(board: string) {
    const grid: string[][] = Array(5).fill(null).map(() => Array(5).fill(''));
    let charIdx = 0;
    for (let c = 0; c < 5; c++) grid[0][c] = board[charIdx++];
    grid[1][0] = board[charIdx++]; grid[1][2] = board[charIdx++]; grid[1][4] = board[charIdx++];
    for (let c = 0; c < 5; c++) grid[2][c] = board[charIdx++];
    grid[3][0] = board[charIdx++]; grid[3][2] = board[charIdx++]; grid[3][4] = board[charIdx++];
    for (let c = 0; c < 5; c++) grid[4][c] = board[charIdx++];
    return grid;
  }

  function getColorClass(color: string) {
    if (color === 'green') return 'bg-teal-500 dark:bg-teal-600 text-white';
    if (color === 'yellow') return 'bg-amber-500 dark:bg-amber-600 text-white';
    return 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100';
  }

  let solutionGrid = $derived(solution ? buildGrid(solution) : []);
</script>

{#if loading}
  <div class="animate-pulse h-96 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
{:else if !solution || solution.length !== 21}
  <div class="text-red-500">Invalid Waffle Data</div>
{:else}
  <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
    <div class="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-100 dark:border-amber-900/30 text-center">
      <h2 class="text-2xl font-bold text-amber-900 dark:text-amber-400">Waffle Puzzle Solution</h2>
      <p class="text-amber-700 dark:text-amber-300 opacity-80 text-sm">{format(date, 'MMMM d, yyyy')}</p>
    </div>

    <div class="p-8 space-y-12">
      {#if puzzle}
        {@const puzzleGrid = buildGrid(puzzle)}
        <div class="flex flex-col items-center">
          <h3 class="text-lg font-bold mb-4 text-amber-800 dark:text-amber-400">Starting Puzzle Grid</h3>
          <div class="grid grid-cols-5 gap-2 sm:gap-3 p-4 bg-amber-100 dark:bg-slate-900 rounded-xl border-4 border-amber-200 dark:border-amber-900/50">
            {#each puzzleGrid as row, rIdx}
              {#each row as cell, cIdx}
                {@const globalIdx = getGlobalIdx(rIdx, cIdx)}
                {@const color = colors[globalIdx]}
                {#if cell !== ''}
                  <div class="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-2xl rounded-lg shadow-sm {getColorClass(color)} font-bold transition-all duration-300 hover:scale-105 cursor-default">
                    {cell.toUpperCase()}
                  </div>
                {:else}
                  <div class="w-10 h-10 sm:w-14 sm:h-14 invisible"></div>
                {/if}
              {/each}
            {/each}
          </div>
        </div>
      {/if}

      <div class="flex flex-col items-center">
        <h3 class="text-lg font-bold mb-4 text-amber-800 dark:text-amber-400">Solved Grid (The Answer)</h3>
        <div class="grid grid-cols-5 gap-2 sm:gap-3 p-4 bg-amber-100 dark:bg-slate-900 rounded-xl border-4 border-amber-200 dark:border-amber-900/50">
          {#each solutionGrid as row, rIdx}
            {#each row as cell, cIdx}
              {#if cell !== ''}
                <div class="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-2xl rounded-lg shadow-sm bg-teal-500 dark:bg-teal-600 text-white font-bold transition-all duration-300 hover:scale-105 cursor-default">
                  {cell.toUpperCase()}
                </div>
              {:else}
                <div class="w-10 h-10 sm:w-14 sm:h-14 invisible"></div>
              {/if}
            {/each}
          {/each}
        </div>
      </div>
    </div>

    <div class="bg-slate-50 dark:bg-slate-900/50 p-4 text-center border-t border-slate-100 dark:border-slate-700">
      <p class="text-sm text-slate-500 dark:text-slate-400">All words are arranged correctly in the solved grid!</p>
    </div>
  </div>
{/if}


<script lang="ts">
  import { onMount } from 'svelte';

  import {
    cloneBoard,
    countFlaggedMinesInBoard,
    createInitialBoard,
    solveMinesweeperJS,
  } from '$lib/minesweeper/solver';
  import { NUMBER_COLORS, type Cell, type SelectedTool, type SolverResult } from '$lib/minesweeper/types';

  const DEFAULT_WIDTH = 16;
  const DEFAULT_HEIGHT = 16;
  const DEFAULT_MINES = 40;
  const NUMBER_TOOLS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const NUMBER_TOOL_OPTIONS = NUMBER_TOOLS.map((value) => ({
    label: value,
    tool: String(value) as SelectedTool,
  }));

  let width = $state(DEFAULT_WIDTH);
  let height = $state(DEFAULT_HEIGHT);
  let mines = $state(DEFAULT_MINES);
  let board = $state<Cell[][]>(createInitialBoard(DEFAULT_WIDTH, DEFAULT_HEIGHT));
  let selectedTool = $state<SelectedTool>('1');
  let hoveredCell = $state<{ x: number; y: number } | null>(null);
  let message = $state('Fill the board with numbers and flags, then click Solve to find safe moves!');
  let minesLeft = $state(DEFAULT_MINES);
  let isSolving = $state(false);
  let cellSize = $state(32);

  onMount(() => {
    const onResize = () => updateCellSize();
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key >= '0' && key <= '8') {
        selectedTool = key as SelectedTool;
      } else if (key === 'f' || key === 'F') {
        selectedTool = 'flag';
      } else if (key === 'g' || key === 'G') {
        selectedTool = 'greenFlag';
      } else if (key === 'c' || key === 'C' || key === 'Delete' || key === 'Backspace') {
        selectedTool = 'clear';
      } else if (key === 'r' || key === 'R') {
        initBoard();
      }
    };

    updateCellSize();
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  $effect(() => {
    const maxMines = Math.max(1, width * height - 1);
    if (mines > maxMines) {
      mines = maxMines;
      minesLeft = Math.max(0, maxMines - countFlaggedMinesInBoard(board));
    }
  });

  function clampDimension(value: number): number {
    return Math.min(30, Math.max(5, value || 5));
  }

  function clampMines(value: number): number {
    return Math.min(width * height - 1, Math.max(1, value || 1));
  }

  function updateCellSize(): void {
    const maxWidth = window.innerWidth - 40;
    const maxHeight = window.innerHeight - 420;
    const maxCellWidth = Math.floor(maxWidth / width);
    const maxCellHeight = Math.floor(maxHeight / height);
    cellSize = Math.min(40, Math.max(24, Math.min(maxCellWidth, maxCellHeight)));
  }

  function initBoard(): void {
    board = createInitialBoard(width, height);
    minesLeft = mines;
    message = 'Fill the board with numbers and flags, then click Solve to find safe moves!';
    hoveredCell = null;
    updateCellSize();
  }

  function setWidthValue(value: string): void {
    width = clampDimension(parseInt(value, 10));
  }

  function setHeightValue(value: string): void {
    height = clampDimension(parseInt(value, 10));
  }

  function setMineValue(value: string): void {
    mines = clampMines(parseInt(value, 10));
    minesLeft = Math.max(0, mines - countFlaggedMinesInBoard(board));
  }

  function handleWidthInput(event: Event): void {
    setWidthValue((event.currentTarget as HTMLInputElement).value);
  }

  function handleHeightInput(event: Event): void {
    setHeightValue((event.currentTarget as HTMLInputElement).value);
  }

  function handleMineInput(event: Event): void {
    setMineValue((event.currentTarget as HTMLInputElement).value);
  }

  function applyBoardChange(nextBoard: Cell[][]): void {
    board = nextBoard;
    minesLeft = Math.max(0, mines - countFlaggedMinesInBoard(nextBoard));
  }

  function handleCellClick(x: number, y: number): void {
    const nextBoard = cloneBoard(board);
    const cell = nextBoard[y][x];

    if (cell.state === 'greenFlag' || cell.state === 'safe') return;

    if (selectedTool === 'clear') {
      cell.state = 'hidden';
      cell.value = -2;
      cell.probability = undefined;
    } else if (selectedTool === 'flag') {
      cell.state = 'flagged';
      cell.value = -1;
      cell.probability = undefined;
    } else if (selectedTool === 'greenFlag') {
      cell.state = 'greenFlag';
      cell.value = -2;
      cell.probability = 1;
    } else {
      cell.state = 'revealed';
      cell.value = parseInt(selectedTool, 10);
      cell.probability = undefined;
    }

    applyBoardChange(nextBoard);
  }

  function handleCellRightClick(event: MouseEvent, x: number, y: number): void {
    event.preventDefault();
    const nextBoard = cloneBoard(board);
    const cell = nextBoard[y][x];

    if (cell.state === 'greenFlag' || cell.state === 'safe') return;

    if (cell.state === 'flagged') {
      cell.state = 'hidden';
      cell.value = -2;
      cell.probability = undefined;
    } else {
      cell.state = 'flagged';
      cell.value = -1;
      cell.probability = undefined;
    }

    applyBoardChange(nextBoard);
  }

  function applySolverResult(sourceBoard: Cell[][], result: SolverResult): Cell[][] {
    const nextBoard = cloneBoard(sourceBoard);

    for (const [x, y] of result.safeCells) {
      nextBoard[y][x].state = 'greenFlag';
      nextBoard[y][x].probability = 1;
    }

    for (const [x, y] of result.mineCells) {
      nextBoard[y][x].state = 'flagged';
      nextBoard[y][x].value = -1;
      nextBoard[y][x].probability = undefined;
    }

    for (const [x, y, probability] of result.probabilityCells) {
      nextBoard[y][x].state = 'safe';
      nextBoard[y][x].probability = probability;
    }

    return nextBoard;
  }

  function updateMessageFromResult(result: SolverResult, allMoves = false): void {
    if (result.safeCells.length > 0 || result.mineCells.length > 0) {
      const parts: string[] = [];
      if (result.safeCells.length > 0) {
        parts.push(`${result.safeCells.length} safe square${result.safeCells.length > 1 ? 's' : ''} found${allMoves ? '' : ' (green flags)'}`);
      }
      if (result.mineCells.length > 0) {
        parts.push(`${result.mineCells.length} mine${result.mineCells.length > 1 ? 's' : ''} found${allMoves ? '' : ' (red flags)'}`);
      }
      message = `${allMoves ? 'All moves found! ' : ''}${parts.join(' | ')}. Replace green flags with actual numbers and solve again!`;
      return;
    }

    if (!allMoves && result.probabilityCells.length > 0) {
      message = `No definite solution found. ${result.probabilityCells.length} cell${result.probabilityCells.length > 1 ? 's' : ''} with highest safety probability marked with "?"`;
      return;
    }

    message = allMoves ? 'No definite moves found. Add more numbers to the board.' : 'No solution found. Please add more numbers to the board.';
  }

  async function handleSolve(): Promise<void> {
    isSolving = true;
    message = 'Analyzing board...';
    await new Promise((resolve) => window.setTimeout(resolve, 10));

    const result = solveMinesweeperJS(board, mines);
    const nextBoard = applySolverResult(board, result);
    applyBoardChange(nextBoard);
    updateMessageFromResult(result);
    isSolving = false;
  }

  async function handleSolveAll(): Promise<void> {
    isSolving = true;
    message = 'Finding all possible moves...';

    let currentBoard = cloneBoard(board);
    let totalSafe = 0;
    let totalMineHits = 0;

    for (let iteration = 0; iteration < 50; iteration += 1) {
      const result = solveMinesweeperJS(currentBoard, mines);
      if (result.safeCells.length === 0 && result.mineCells.length === 0) break;

      totalSafe += result.safeCells.length;
      totalMineHits += result.mineCells.length;
      currentBoard = applySolverResult(currentBoard, result);
      await new Promise((resolve) => window.setTimeout(resolve, 5));
    }

    applyBoardChange(currentBoard);
    updateMessageFromResult(
      {
        safeCells: Array.from({ length: totalSafe }, () => [0, 0] as [number, number]),
        mineCells: Array.from({ length: totalMineHits }, () => [0, 0] as [number, number]),
        probabilityCells: [],
      },
      true
    );
    isSolving = false;
  }

  function handleClearResults(): void {
    const nextBoard = board.map((row) =>
      row.map((cell) => {
        if (cell.state === 'greenFlag' || cell.state === 'safe') {
          return { ...cell, state: 'hidden' as const, probability: undefined };
        }
        return { ...cell };
      })
    );

    applyBoardChange(nextBoard);
    message = 'Solver results cleared. Fill in the actual numbers from your game.';
  }

  function isToolSelected(tool: SelectedTool): boolean {
    return selectedTool === tool;
  }

  function toolTitle(tool: SelectedTool, label: string): string {
    const shortcut = tool === 'clear' ? 'C' : tool === 'flag' ? 'F' : tool === 'greenFlag' ? 'G' : tool;
    return `${label} (${shortcut})`;
  }

  function getCellStateClasses(cell: Cell, x: number, y: number): string {
    const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;

    if (cell.state === 'hidden') {
      return isHovered
        ? 'border-blue-700 bg-gradient-to-br from-blue-300 to-blue-500'
        : 'border-blue-700 bg-gradient-to-br from-blue-400 to-blue-600';
    }

    if (cell.state === 'revealed' || cell.state === 'flagged') {
      return 'border-slate-400 bg-gradient-to-br from-slate-100 to-slate-200';
    }

    if (cell.state === 'greenFlag') {
      return 'border-teal-500 bg-gradient-to-br from-teal-100 to-teal-200';
    }

    if (cell.state === 'safe') {
      return 'border-amber-500 bg-gradient-to-br from-amber-100 to-amber-200';
    }

    return 'border-amber-600 bg-gradient-to-br from-amber-300 to-amber-500';
  }

  function getCellContent(cell: Cell): string {
    if (cell.state === 'flagged') return '&#128681;';
    if (cell.state === 'greenFlag') return '&#128994;';
    if (cell.state === 'safe' || cell.state === 'question') return '?';
    if (cell.state === 'revealed' && cell.value > 0) return String(cell.value);
    return '';
  }

  function getCellTextColor(cell: Cell): string | undefined {
    if (cell.state === 'revealed' && cell.value >= 1 && cell.value <= 8) {
      return NUMBER_COLORS[cell.value];
    }
    if (cell.state === 'safe') return '#059669';
    if (cell.state === 'question') return '#FFFFFF';
    return undefined;
  }
</script>

<section class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="rounded-[2rem] border border-white/10 bg-black/20 shadow-2xl backdrop-blur-sm">
      <div class="border-b border-white/10 px-4 py-5 sm:px-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-2xl shadow-lg">
              {@html '&#128163;'}
            </div>
            <div>
              <h2 class="text-xl font-bold text-white sm:text-2xl">Minesweeper Solver</h2>
              <p class="text-xs text-slate-300">Advanced constraint-based solver</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 sm:gap-4">
            <label class="flex items-center gap-2">
              <span class="text-xs text-slate-300">Width:</span>
              <input
                type="number"
                min="5"
                max="30"
                value={width}
                oninput={handleWidthInput}
                class="w-14 rounded border border-white/20 bg-white/10 px-2 py-1 text-sm text-white outline-none ring-0 focus:border-indigo-400"
              />
            </label>
            <label class="flex items-center gap-2">
              <span class="text-xs text-slate-300">Height:</span>
              <input
                type="number"
                min="5"
                max="30"
                value={height}
                oninput={handleHeightInput}
                class="w-14 rounded border border-white/20 bg-white/10 px-2 py-1 text-sm text-white outline-none ring-0 focus:border-indigo-400"
              />
            </label>
            <label class="flex items-center gap-2">
              <span class="text-xs text-slate-300">Mines:</span>
              <input
                type="number"
                min="1"
                max={Math.max(1, width * height - 1)}
                value={mines}
                oninput={handleMineInput}
                class="w-16 rounded border border-white/20 bg-white/10 px-2 py-1 text-sm text-white outline-none ring-0 focus:border-indigo-400"
              />
            </label>
            <button
              class="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-red-600 hover:to-pink-600"
              onclick={initBoard}
              type="button"
            >
              Reset Board
            </button>
          </div>
        </div>
      </div>

      <div class="px-4 py-6 sm:px-6">
        <div class="mb-4 rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-4 backdrop-blur-sm">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <p class="text-sm text-white sm:text-base">{message}</p>
            <div class="flex items-center gap-2 rounded-lg bg-black/30 px-3 py-2">
              <span class="text-red-400">{@html '&#128681;'}</span>
              <span class="font-bold text-white">{minesLeft}</span>
            </div>
          </div>
        </div>

        <div class="mb-6 flex flex-wrap justify-center gap-3">
          <button
            class={`rounded-xl px-6 py-3 font-bold text-white shadow-xl transition-all duration-300 ${
              isSolving
                ? 'cursor-not-allowed bg-slate-500'
                : 'bg-gradient-to-r from-teal-500 to-teal-500 hover:scale-105 hover:from-teal-600 hover:to-teal-600'
            }`}
            disabled={isSolving}
            onclick={handleSolve}
            type="button"
          >
            {#if isSolving}
              <span class="inline-flex items-center gap-2">
                <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Solving...
              </span>
            {:else}
              {@html '&#128269;'} Find Next Move
            {/if}
          </button>

          <button
            class={`rounded-xl px-6 py-3 font-bold text-white shadow-xl transition-all duration-300 ${
              isSolving
                ? 'cursor-not-allowed bg-slate-500'
                : 'bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-105 hover:from-violet-600 hover:to-purple-600'
            }`}
            disabled={isSolving}
            onclick={handleSolveAll}
            type="button"
          >
            {@html '&#128640;'} Find All Moves
          </button>

          <button
            class="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-orange-600"
            onclick={handleClearResults}
            type="button"
          >
            {@html '&#10024;'} Clear Results
          </button>
        </div>

        <div class="mb-6 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
          <span class="mb-2 block text-center text-xs text-slate-400">Tools (or use keys 0-8, F, G, C):</span>
          <div class="flex flex-wrap justify-center gap-2">
            {#each NUMBER_TOOL_OPTIONS as item}
              <button
                class={`flex items-center justify-center rounded-lg transition-all duration-200 ${
                  isToolSelected(item.tool)
                    ? 'scale-110 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg ring-2 ring-indigo-300'
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 shadow hover:from-slate-200 hover:to-slate-300'
                }`}
                style={`width:${cellSize + 8}px;height:${cellSize + 8}px;font-size:${cellSize * 0.5}px;${item.label > 0 ? `color:${NUMBER_COLORS[item.label]};` : ''}`}
                onclick={() => (selectedTool = item.tool)}
                title={toolTitle(item.tool, `Number ${item.label}`)}
                type="button"
              >
                {item.label}
              </button>
            {/each}

            <button
              class={`flex items-center justify-center rounded-lg transition-all duration-200 ${
                isToolSelected('flag')
                  ? 'scale-110 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg ring-2 ring-indigo-300'
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 shadow hover:from-slate-200 hover:to-slate-300'
              }`}
              style={`width:${cellSize + 8}px;height:${cellSize + 8}px;font-size:${cellSize * 0.5}px;`}
              onclick={() => (selectedTool = 'flag')}
              title={toolTitle('flag', 'Flag')}
              type="button"
            >
              {@html '&#128681;'}
            </button>

            <button
              class={`flex items-center justify-center rounded-lg transition-all duration-200 ${
                isToolSelected('greenFlag')
                  ? 'scale-110 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg ring-2 ring-indigo-300'
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 shadow hover:from-slate-200 hover:to-slate-300'
              }`}
              style={`width:${cellSize + 8}px;height:${cellSize + 8}px;font-size:${cellSize * 0.45}px;`}
              onclick={() => (selectedTool = 'greenFlag')}
              title={toolTitle('greenFlag', 'Safe')}
              type="button"
            >
              {@html '&#128994;'}
            </button>

            <button
              class={`flex items-center justify-center rounded-lg transition-all duration-200 ${
                isToolSelected('clear')
                  ? 'scale-110 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg ring-2 ring-indigo-300'
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 shadow hover:from-slate-200 hover:to-slate-300'
              }`}
              style={`width:${cellSize + 8}px;height:${cellSize + 8}px;font-size:${cellSize * 0.45}px;`}
              onclick={() => (selectedTool = 'clear')}
              title={toolTitle('clear', 'Clear')}
              type="button"
            >
              {@html '&#10060;'}
            </button>
          </div>
        </div>

        <div class="flex justify-center overflow-x-auto pb-4">
          <div class="inline-block rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 shadow-2xl backdrop-blur-sm">
            <div
              class="grid gap-0.5"
              style={`grid-template-columns:repeat(${board[0]?.length ?? 0}, ${cellSize}px);grid-template-rows:repeat(${board.length}, ${cellSize}px);`}
            >
              {#each board as row, y}
                {#each row as cell, x}
                  <button
                    class={`flex items-center justify-center border-2 font-bold transition-all duration-150 ease-in-out ${getCellStateClasses(cell, x, y)}`}
                    style={`width:${cellSize}px;height:${cellSize}px;font-size:${cellSize * 0.55}px;${getCellTextColor(cell) ? `color:${getCellTextColor(cell)};` : ''}`}
                    onclick={() => handleCellClick(x, y)}
                    oncontextmenu={(event) => handleCellRightClick(event, x, y)}
                    onmouseenter={() => (hoveredCell = { x, y })}
                    onmouseleave={() => (hoveredCell = null)}
                    title={`Cell ${x + 1}, ${y + 1}`}
                    type="button"
                  >
                    {@html getCellContent(cell)}
                  </button>
                {/each}
              {/each}
            </div>
          </div>
        </div>

        <div class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-white">
            <span class="text-2xl">{@html '&#128214;'}</span> How to use the Minesweeper Solver
          </h3>
          <div class="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <div class="space-y-2">
              <p class="flex items-start gap-2">
                <span class="text-teal-400">1.</span>
                Set the board size and number of mines to match your game.
              </p>
              <p class="flex items-start gap-2">
                <span class="text-teal-400">2.</span>
                Click a tool, then click board cells to enter numbers or mark flags.
              </p>
              <p class="flex items-start gap-2">
                <span class="text-teal-400">3.</span>
                Right-click any cell to quickly toggle a mine flag.
              </p>
            </div>
            <div class="space-y-2">
              <p class="flex items-start gap-2">
                <span class="text-teal-400">4.</span>
                Use Find Next Move to reveal definite safe squares and mines.
              </p>
              <p class="flex items-start gap-2">
                <span class="text-teal-400">5.</span>
                Green markers are safe squares. Red markers are mines.
              </p>
              <p class="flex items-start gap-2">
                <span class="text-teal-400">6.</span>
                A <span class="font-bold text-amber-400">?</span> marks the cells with the highest safety probability when no forced move exists.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
          <h4 class="mb-2 text-sm font-semibold text-slate-300">
            <span class="mr-2 align-middle">{@html '&#9000;'}</span> Keyboard Shortcuts
          </h4>
          <div class="flex flex-wrap gap-3 text-xs text-slate-400">
            <span><kbd class="rounded bg-white/10 px-1.5 py-0.5">0-8</kbd> Select number</span>
            <span><kbd class="rounded bg-white/10 px-1.5 py-0.5">F</kbd> Flag tool</span>
            <span><kbd class="rounded bg-white/10 px-1.5 py-0.5">G</kbd> Safe tool</span>
            <span><kbd class="rounded bg-white/10 px-1.5 py-0.5">C</kbd> Clear tool</span>
            <span><kbd class="rounded bg-white/10 px-1.5 py-0.5">R</kbd> Reset board</span>
          </div>
        </div>

        <div class="mt-6 border-t border-white/10 pt-4 text-center text-sm text-slate-400">
          Minesweeper Solver | Advanced Constraint Satisfaction Algorithm
        </div>
      </div>
    </div>
  </div>
</section>

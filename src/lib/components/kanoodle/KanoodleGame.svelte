<script lang="ts">
  import { onMount } from 'svelte';

  import {
    BOARD_COLS,
    BOARD_ROWS,
    PIECES,
    TIME_OPTIONS,
    type Board,
    type PieceInfo,
  } from '$lib/kanoodle/types';
  import { createEmptyBoard, generatePuzzleWithPieces, kanoodleSolve } from '$lib/kanoodle/solver';

  const PIECE_CELL = 22;
  const PUZZLE_OPTIONS = [1, 2, 3, 4, 5, 6];

  let board = $state<Board>(createEmptyBoard());
  let placedPieces = $state<Set<string>>(new Set());
  let message = $state('');
  let isSolving = $state(false);
  let challengeMode = $state(false);
  let timeRemaining = $state(120);
  let selectedTimeOption = $state(120);
  let selectedPiece = $state<string | null>(null);
  let pieces = $state<PieceInfo[]>(copyPieces());
  let solutions = $state<Board[]>([]);
  let currentSolutionIndex = $state(0);
  let gameWon = $state(false);
  let darkMode = $state(false);
  let isDragging = $state(false);
  let draggingPieceId = $state<string | null>(null);
  let hoverCell = $state<{ row: number; col: number } | null>(null);
  let dragPointer = $state<{ x: number; y: number } | null>(null);
  let puzzlePrefill = $state(3);

  let unplacedPieces = $derived.by(() => pieces.filter((piece) => !placedPieces.has(piece.id)));
  let activePiece = $derived.by(() => pieces.find((piece) => piece.id === draggingPieceId) ?? null);
  let coverage = $derived.by(() => {
    if (!activePiece || !hoverCell) return [] as Array<{ row: number; col: number }>;
    return getCoverage(activePiece, hoverCell.row, hoverCell.col);
  });
  let coverageSet = $derived.by(() => new Set(coverage.map((cell) => `${cell.row}-${cell.col}`)));
  let canDrop = $derived.by(() => {
    if (!activePiece || !hoverCell) return true;
    return canPlace(activePiece, hoverCell.row, hoverCell.col, board);
  });

  $effect(() => {
    if (!challengeMode || gameWon || timeRemaining <= 0) return;
    const timer = window.setInterval(() => {
      if (gameWon) return;
      if (timeRemaining > 1) {
        timeRemaining -= 1;
      } else {
        timeRemaining = 0;
        challengeMode = false;
        message = "Time's up! Game Over.";
      }
    }, 1000);
    return () => window.clearInterval(timer);
  });

  onMount(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!selectedPiece) return;
      const key = event.key.toLowerCase();
      if (key === 'r') rotateSelected();
      if (key === 'f') flipSelected();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging) return;
      updateDragPosition(event.clientX, event.clientY);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!isDragging || !draggingPieceId) return;
      updateDragPosition(event.clientX, event.clientY);
      const dropTarget = hoverCell;
      const pieceId = draggingPieceId;
      if (dropTarget && place(pieceId, dropTarget.row, dropTarget.col)) return;
      clearDragState();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  });

  function copyPieces(): PieceInfo[] {
    return PIECES.map((piece) => ({ ...piece, shape: piece.shape.map((row) => [...row]) }));
  }

  function copyBoard(source: Board): Board {
    return source.map((row) => [...row]);
  }

  function getPlaced(nextBoard: Board): Set<string> {
    const next = new Set<string>();
    for (const row of nextBoard) {
      for (const cell of row) if (cell) next.add(cell);
    }
    return next;
  }

  function rotate(shape: number[][]): number[][] {
    const rows = shape.length;
    const cols = shape[0]?.length ?? 0;
    const next: number[][] = [];
    for (let col = 0; col < cols; col += 1) {
      next[col] = [];
      for (let row = rows - 1; row >= 0; row -= 1) next[col].push(shape[row][col]);
    }
    return next;
  }

  function flip(shape: number[][]): number[][] {
    return shape.map((row) => [...row].reverse());
  }

  function getCoverage(piece: PieceInfo, startRow: number, startCol: number): Array<{ row: number; col: number }> {
    const cells: Array<{ row: number; col: number }> = [];
    piece.shape.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 1) cells.push({ row: startRow + rowIndex, col: startCol + colIndex });
      });
    });
    return cells;
  }

  function canPlace(piece: PieceInfo, startRow: number, startCol: number, currentBoard: Board): boolean {
    return getCoverage(piece, startRow, startCol).every((cell) => {
      if (cell.row < 0 || cell.row >= BOARD_ROWS || cell.col < 0 || cell.col >= BOARD_COLS) return false;
      return currentBoard[cell.row][cell.col] === null;
    });
  }

  function resetGame(): void {
    board = createEmptyBoard();
    placedPieces = new Set();
    message = '';
    isSolving = false;
    challengeMode = false;
    timeRemaining = selectedTimeOption;
    selectedPiece = null;
    pieces = copyPieces();
    solutions = [];
    currentSolutionIndex = 0;
    gameWon = false;
    clearDragState();
  }

  function selectPiece(pieceId: string | null): void {
    selectedPiece = pieceId;
  }

  function rotateSelected(): void {
    if (!selectedPiece) return;
    pieces = pieces.map((piece) => (piece.id === selectedPiece ? { ...piece, shape: rotate(piece.shape) } : piece));
  }

  function flipSelected(): void {
    if (!selectedPiece) return;
    pieces = pieces.map((piece) => (piece.id === selectedPiece ? { ...piece, shape: flip(piece.shape) } : piece));
  }

  function removePiece(pieceId: string): void {
    const nextBoard = copyBoard(board);
    for (let row = 0; row < BOARD_ROWS; row += 1) {
      for (let col = 0; col < BOARD_COLS; col += 1) {
        if (nextBoard[row][col] === pieceId) nextBoard[row][col] = null;
      }
    }
    board = nextBoard;
    placedPieces = getPlaced(nextBoard);
    gameWon = false;
    message = '';
  }

  function place(pieceId: string, row: number, col: number): boolean {
    const piece = pieces.find((entry) => entry.id === pieceId);
    if (!piece || !canPlace(piece, row, col, board)) return false;
    const nextBoard = copyBoard(board);
    for (const cell of getCoverage(piece, row, col)) nextBoard[cell.row][cell.col] = pieceId;
    board = nextBoard;
    placedPieces = getPlaced(nextBoard);
    selectedPiece = null;
    clearDragState();
    gameWon = nextBoard.every((boardRow) => boardRow.every((cell) => cell !== null));
    message = gameWon ? 'Congratulations! You solved it!' : '';
    return true;
  }

  function clickCell(row: number, col: number): void {
    const current = board[row][col];
    if (current) removePiece(current);
    else if (selectedPiece) place(selectedPiece, row, col);
  }

  async function runTask(label: string, task: () => void): Promise<void> {
    message = label;
    isSolving = true;
    await new Promise((resolve) => window.setTimeout(resolve, 10));
    task();
    isSolving = false;
  }

  async function checkBoard(): Promise<void> {
    await runTask('Checking...', () => {
      const result = kanoodleSolve(board, { findAll: false, maxSolutions: 1 });
      message = result.solved ? 'Solvable!' : 'Not Solvable';
    });
  }

  async function hint(): Promise<void> {
    await runTask('Finding hint...', () => {
      if (unplacedPieces.length === 0) {
        message = 'All pieces placed!';
        return;
      }
      const result = kanoodleSolve(board, { findAll: false, maxSolutions: 1 });
      if (!result.solved || !result.grid) {
        message = 'No hint available';
        return;
      }
      const nextBoard = copyBoard(board);
      for (const piece of unplacedPieces) {
        let found = false;
        for (let row = 0; row < BOARD_ROWS; row += 1) {
          for (let col = 0; col < BOARD_COLS; col += 1) {
            if (result.grid[row][col] === piece.id) {
              nextBoard[row][col] = piece.id;
              found = true;
            }
          }
        }
        if (found) {
          board = nextBoard;
          placedPieces = getPlaced(nextBoard);
          message = `Hint: Placed ${piece.name}`;
          return;
        }
      }
      message = 'No hint available';
    });
  }

  async function quickSolve(): Promise<void> {
    await runTask('Solving...', () => {
      const result = kanoodleSolve(board, { findAll: false, maxSolutions: 1 });
      if (!result.solved || !result.grid) {
        message = 'No solution found';
        return;
      }
      board = result.grid;
      placedPieces = getPlaced(result.grid);
      solutions = [result.grid];
      currentSolutionIndex = 0;
      gameWon = true;
      message = 'Solved!';
    });
  }

  async function findAllSolutions(): Promise<void> {
    await runTask('Counting solutions...', () => {
      const result = kanoodleSolve(board, { findAll: true, maxSolutions: 10000 });
      solutions = result.solutions;
      currentSolutionIndex = 0;
      if (result.grid) {
        board = result.grid;
        placedPieces = getPlaced(result.grid);
      }
      message = result.limitReached ? `${result.totalCount}+ solutions found` : `${result.totalCount} solution${result.totalCount === 1 ? '' : 's'} found`;
    });
  }

  function applySolution(index: number): void {
    if (solutions.length === 0) return;
    currentSolutionIndex = (index + solutions.length) % solutions.length;
    board = copyBoard(solutions[currentSolutionIndex]);
    placedPieces = getPlaced(board);
    gameWon = board.every((row) => row.every((cell) => cell !== null));
  }

  function randomPuzzle(prefill: number): void {
    const { board: nextBoard, solution } = generatePuzzleWithPieces(prefill);
    board = nextBoard;
    placedPieces = getPlaced(nextBoard);
    pieces = copyPieces();
    selectedPiece = null;
    clearDragState();
    challengeMode = false;
    timeRemaining = selectedTimeOption;
    gameWon = false;
    solutions = [solution];
    currentSolutionIndex = 0;
    message = 'Good luck! Place the remaining pieces.';
  }

  function startChallenge(): void {
    const prefill = 3 + Math.floor(Math.random() * 3);
    const { board: nextBoard, solution } = generatePuzzleWithPieces(prefill);
    board = nextBoard;
    placedPieces = getPlaced(nextBoard);
    pieces = copyPieces();
    selectedPiece = null;
    clearDragState();
    challengeMode = true;
    timeRemaining = selectedTimeOption;
    gameWon = false;
    solutions = [solution];
    currentSolutionIndex = 0;
    message = 'Go!';
  }

  function clearDragState(): void {
    isDragging = false;
    draggingPieceId = null;
    hoverCell = null;
    dragPointer = null;
  }

  function updateDragPosition(clientX: number, clientY: number): void {
    dragPointer = { x: clientX, y: clientY };
    const hovered = document
      .elementFromPoint(clientX, clientY)
      ?.closest<HTMLElement>('[data-board-cell="true"]');
    if (!hovered) {
      hoverCell = null;
      return;
    }
    const row = Number(hovered.dataset.row);
    const col = Number(hovered.dataset.col);
    hoverCell = Number.isInteger(row) && Number.isInteger(col) ? { row, col } : null;
  }

  function startPointerDrag(event: PointerEvent, pieceId: string): void {
    if (event.button !== 0 || placedPieces.has(pieceId)) return;
    event.preventDefault();
    draggingPieceId = pieceId;
    isDragging = true;
    selectedPiece = pieceId;
    updateDragPosition(event.clientX, event.clientY);
  }

  function timerLabel(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
  }
</script>

<div class:dark={darkMode} class="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
  <div class="px-4 pb-10 pt-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-5xl">
      <div class="fixed right-4 top-24 z-30">
        <div class="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-white/70 bg-white/90 px-3 py-3 shadow-2xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/90">
          {#if challengeMode}
            <div class={`inline-flex min-w-28 items-center justify-center rounded-2xl px-4 py-3 text-sm font-black shadow-lg ${timeRemaining < 30 ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white'}`}>
              Timer {timerLabel(timeRemaining)}
            </div>
          {/if}
          <label class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Time</span>
            <select bind:value={selectedTimeOption} class="bg-transparent font-bold outline-none" onchange={() => !challengeMode && (timeRemaining = selectedTimeOption)}>
              {#each TIME_OPTIONS as seconds}
                <option value={seconds}>{Math.floor(seconds / 60)} min</option>
              {/each}
            </select>
          </label>
          <button class="rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.02]" onclick={startChallenge} type="button">
            Challenge
          </button>
          <button class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[11px] font-black shadow-sm dark:border-slate-700 dark:bg-slate-950" onclick={() => (darkMode = !darkMode)} type="button">
            {#if darkMode}LIGHT{:else}DARK{/if}
          </button>
        </div>
      </div>

      <div class="space-y-6 pt-16">
        {#if isDragging && activePiece && dragPointer}
          <div
            class="pointer-events-none fixed z-50 rounded-2xl border border-white/60 bg-white/90 p-3 shadow-2xl backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/90"
            style={`left:${dragPointer.x + 26}px;top:${dragPointer.y}px;transform:translateY(-50%);`}
          >
            <div class="flex flex-col gap-[3px]">
              {#each activePiece.shape as shapeRow}
                <div class="flex gap-[3px]">
                  {#each shapeRow as value}
                    <div
                      class="rounded-full"
                      style={`width:${PIECE_CELL}px;height:${PIECE_CELL}px;background-color:${value === 1 ? activePiece.color : 'transparent'};opacity:${value === 1 ? '0.96' : '0'};box-shadow:${value === 1 ? `0 8px 16px ${activePiece.color}40, inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.45)` : 'none'};`}
                    ></div>
                  {/each}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <header class="mb-8 text-center">
          <h2 class="bg-gradient-to-r from-emerald-500 via-sky-500 to-fuchsia-500 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">Kanoodle Pro</h2>
          <p class="mt-3 text-base text-slate-500 dark:text-slate-400">Drag pieces to solve the puzzle</p>
        </header>

        <div class="flex justify-center">
          <div class={`rounded-[1.75rem] border p-6 shadow-2xl transition-all ${isDragging ? 'border-sky-300 bg-gradient-to-br from-white to-sky-50 dark:border-sky-700 dark:from-slate-900 dark:to-sky-950/20' : 'border-slate-200 bg-gradient-to-br from-white to-slate-50 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950'}`}>
            <div class="flex flex-col gap-2">
              {#each board as boardRow, rowIndex}
                <div class="flex gap-2">
                  {#each boardRow as cell, colIndex}
                    {@const key = `${rowIndex}-${colIndex}`}
                    {@const hoverHit = coverageSet.has(key) && isDragging && activePiece}
                    <button
                      class={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150 ${cell ? 'shadow-[inset_0_-4px_8px_rgba(0,0,0,0.18),inset_0_2px_4px_rgba(255,255,255,0.25),0_6px_14px_rgba(0,0,0,0.1)]' : `border-2 ${hoverHit ? (canDrop ? 'border-sky-400 shadow-[0_0_18px_rgba(14,165,233,0.35)] scale-110' : 'border-red-400 shadow-[0_0_16px_rgba(239,68,68,0.24)]') : 'border-dashed border-slate-300 dark:border-slate-700'}`}`}
                      data-board-cell="true"
                      data-row={rowIndex}
                      data-col={colIndex}
                      onclick={() => clickCell(rowIndex, colIndex)}
                      style={`background-color:${cell ? PIECES.find((piece) => piece.id === cell)?.color ?? '#ccc' : hoverHit && activePiece ? (canDrop ? activePiece.color : '#ef4444') : darkMode ? 'rgba(24,24,27,0.8)' : 'rgba(248,250,252,1)'}`}
                      title={cell ? cell : 'Empty slot'}
                      type="button"
                    >
                      {#if cell}
                        <span class="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent"></span>
                      {/if}
                    </button>
                  {/each}
                </div>
              {/each}
            </div>
          </div>
        </div>

        {#if isDragging}
          <p class={`text-center text-sm font-semibold ${hoverCell && canDrop ? 'text-sky-600 dark:text-sky-300' : 'text-rose-600 dark:text-rose-300'}`}>
            {#if hoverCell}
              {#if canDrop}Drop to place piece!{:else}Invalid position. Those cells are blocked.{/if}
            {:else}
              Move over the board...
            {/if}
          </p>
        {/if}

        {#if message}
          <div class={`rounded-2xl border px-4 py-4 text-center text-sm font-semibold shadow-lg ${gameWon ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
            {message}
          </div>
        {/if}

        {#if solutions.length > 1}
          <div class="flex items-center justify-center gap-4">
            <button class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900" onclick={() => applySolution(currentSolutionIndex - 1)} type="button">&lt;</button>
            <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Solution {currentSolutionIndex + 1} of {solutions.length}</span>
            <button class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900" onclick={() => applySolution(currentSolutionIndex + 1)} type="button">&gt;</button>
          </div>
        {/if}

        <div class="flex flex-wrap justify-center gap-3">
          <button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900" disabled={isSolving} onclick={checkBoard} type="button">Check</button>
          <button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900" disabled={isSolving || unplacedPieces.length === 0} onclick={hint} type="button">Hint</button>
          <button class="rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60" disabled={isSolving} onclick={quickSolve} type="button">Quick Solve</button>
          <button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900" disabled={isSolving} onclick={findAllSolutions} type="button">Find All Solutions</button>
          <label class="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <select bind:value={puzzlePrefill} class="bg-transparent outline-none">
              {#each PUZZLE_OPTIONS as count}
                <option value={count}>{count} placed</option>
              {/each}
            </select>
          </label>
          <button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm dark:border-slate-700 dark:bg-slate-900" onclick={() => randomPuzzle(puzzlePrefill)} type="button">Generate</button>
          <button class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm dark:border-slate-700 dark:bg-slate-900" onclick={resetGame} type="button">Reset</button>
        </div>

        <section class={`rounded-[1.75rem] border p-6 shadow-xl ${isDragging ? 'border-sky-300 bg-white ring-2 ring-sky-200 dark:border-sky-700 dark:bg-slate-900 dark:ring-sky-900/30' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
          <div class="mb-5 text-center">
            <h2 class="text-xl font-bold">Available Pieces</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{#if isDragging}Drop on the board!{:else}Drag pieces to the board{/if}</p>
          </div>
          <div class="flex flex-wrap justify-center gap-4">
            {#each unplacedPieces as piece}
              <div
                class={`group relative select-none rounded-2xl p-3 transition touch-none ${isDragging && draggingPieceId === piece.id ? 'cursor-grabbing scale-95 opacity-40' : 'cursor-grab'} ${selectedPiece === piece.id ? 'bg-sky-50 ring-2 ring-sky-400 ring-offset-2 ring-offset-white dark:bg-sky-950/20 dark:ring-sky-500 dark:ring-offset-slate-900' : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'}`}
                onclick={() => selectPiece(piece.id)}
                onpointerdown={(event) => startPointerDrag(event, piece.id)}
                role="button"
                tabindex="0"
              >
                <div class="flex flex-col items-center gap-2">
                  <div class="flex flex-col gap-[3px]">
                    {#each piece.shape as shapeRow}
                      <div class="flex gap-[3px]">
                        {#each shapeRow as value}
                          <div class="rounded-full" style={`width:${PIECE_CELL}px;height:${PIECE_CELL}px;background-color:${value === 1 ? piece.color : 'transparent'};box-shadow:${value === 1 ? `0 2px 8px ${piece.color}50, inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.4)` : 'none'};`}></div>
                        {/each}
                      </div>
                    {/each}
                  </div>
                  <div
                    class="grid w-full gap-2 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                    onclick={(event) => event.stopPropagation()}
                    onpointerdown={(event) => event.stopPropagation()}
                  >
                    <button
                      class="inline-flex min-w-28 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-sky-500/20 transition-transform hover:scale-[1.02]"
                      onclick={() => { selectPiece(piece.id); rotateSelected(); }}
                      type="button"
                    >
                      Rotate
                    </button>
                    <button
                      class="inline-flex min-w-28 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition-transform hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      onclick={() => { selectPiece(piece.id); flipSelected(); }}
                      type="button"
                    >
                      Flip
                    </button>
                  </div>
                </div>
              </div>
            {/each}
            {#if unplacedPieces.length === 0}
              <div class="py-8 text-center">
                <div class="text-2xl font-black">WIN</div>
                <p class="mt-2 text-sm font-semibold">All pieces placed!</p>
              </div>
            {/if}
          </div>
        </section>

        <section class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div class="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 class="bg-gradient-to-r from-emerald-500 via-sky-500 to-fuchsia-500 bg-clip-text text-2xl font-black text-transparent">
                Noodle Solver
              </h2>
              <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">The Ultimate Brain Puzzle</p>

              <h3 class="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">How to play</h3>
              <p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Fill the board with all 12 pieces. Drag pieces to place them, then use Rotate and Flip to adjust each shape.
              </p>
            </div>

            <div>
              <h3 class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Controls</h3>
              <div class="mt-4 grid gap-3">
                <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span class="inline-flex min-w-14 justify-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-mono font-semibold dark:bg-slate-800">Drag</span>
                  <span>Drop on board</span>
                </div>
                <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span class="inline-flex min-w-14 justify-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold dark:bg-slate-800">Rotate</span>
                  <span>Rotate piece</span>
                </div>
                <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span class="inline-flex min-w-14 justify-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold dark:bg-slate-800">Flip</span>
                  <span>Flip piece</span>
                </div>
                <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span class="inline-flex min-w-14 justify-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-mono font-semibold dark:bg-slate-800">Tap</span>
                  <span>Place or remove</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <p class="text-center text-sm text-slate-500 dark:text-slate-400">
          <span class="font-semibold text-slate-900 dark:text-slate-100">{12 - unplacedPieces.length}</span> of 12 pieces placed |
          <span class="font-semibold text-slate-900 dark:text-slate-100"> {unplacedPieces.length}</span> remaining
        </p>

        <section class="mx-auto mt-10 max-w-3xl space-y-6">
          <div class="text-center">
            <h2 class="text-3xl font-black">Master Spatial Puzzles</h2>
            <p class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
              Kanoodle Pro challenges you to fit 12 unique pieces onto a compact board. Use the copied solver, hints, timed mode, and random puzzle generation to practice and learn.
            </p>
          </div>
          <div class="grid gap-6 md:grid-cols-2">
            <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <h3 class="text-lg font-bold">All Skill Levels</h3>
              <p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Start easy with more pieces already placed, or challenge yourself with minimal setup for a near-empty board.</p>
            </div>
            <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <h3 class="text-lg font-bold">Smart Features</h3>
              <p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Check solvability, request a hint, quick solve the board, or count every valid solution without leaving the page.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</div>

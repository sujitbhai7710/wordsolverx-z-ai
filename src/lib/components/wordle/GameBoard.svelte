<script lang="ts">
	/**
	 * GameBoard Component
	 * Grid layout for game tiles with responsive sizing and animations
	 * 
	 * Requirements: 1.2, 1.5, 3.1, 9.6
	 */

	import GameTile from './GameTile.svelte';
	import type { GameBoardProps } from './GameBoard.types';

	let {
		wordLength,
		maxGuesses,
		guesses = [],
		currentGuess = '',
		evaluations = [],
		isRevealing = false,
		invalidGuess = false,
		gameWon = false,
		gameLost = false
	}: GameBoardProps = $props();

	// Build the grid rows
	const rows = $derived(() => {
		const result = [];
		
		// Add completed guesses
		for (let i = 0; i < guesses.length; i++) {
			const guess = guesses[i];
			const evaluation = evaluations[i] || [];
			const row = [];
			
			for (let j = 0; j < wordLength; j++) {
				row.push({
					letter: guess[j] || '',
					state: evaluation[j]?.state || 'filled',
					position: j,
					animationDelay: isRevealing && i === guesses.length - 1 ? j * 100 : 0
				});
			}
			result.push(row);
		}
		
		// Add current guess row
		if (guesses.length < maxGuesses) {
			const row = [];
			for (let j = 0; j < wordLength; j++) {
				row.push({
					letter: currentGuess[j] || '',
					state: currentGuess[j] ? 'filled' : 'empty',
					position: j,
					animationDelay: 0,
					isActiveRow: true,
					isActiveTile: j === currentGuess.length
				});
			}
			result.push(row);
		}
		
		// Add empty rows
		const emptyRowsNeeded = maxGuesses - result.length;
		for (let i = 0; i < emptyRowsNeeded; i++) {
			const row = [];
			for (let j = 0; j < wordLength; j++) {
				row.push({
					letter: '',
					state: 'empty',
					position: j,
					animationDelay: 0
				});
			}
			result.push(row);
		}
		
		return result;
	});

	// Determine current row index for shake animation
	const currentRowIndex = $derived(guesses.length);
</script>

<div
	role="grid"
	aria-label="Wordle game board"
	aria-live="polite"
	aria-atomic="false"
	class="flex flex-col gap-1.5 my-auto w-full max-w-sm md:max-w-md mx-auto {gameWon ? 'animate-celebrate' : ''}"
>
	{#each rows() as row, rowIndex}
		{@const isCurrentRow = rowIndex === currentRowIndex && !gameWon && !gameLost}
		<div
			role="row"
			aria-label="Row {rowIndex + 1}"
			class="flex justify-center gap-1.5 p-1 rounded-lg transition-all duration-200 {isCurrentRow ? 'bg-[#e0f7fa] dark:bg-cyan-900/30 ring-2 ring-[#00bcd4] shadow-md' : ''} {invalidGuess && rowIndex === currentRowIndex ? 'animate-shake' : ''}"
		>
			{#each row as tile}
				<GameTile
					letter={tile.letter}
					state={tile.state as any}
					position={tile.position}
					isActiveRow={tile.isActiveRow}
					isActiveTile={tile.isActiveTile}
				/>
			{/each}
		</div>
	{/each}
</div>

<style>
	/* Shake animation for invalid words */
	@keyframes shake {
		0%, 100% {
			transform: translateX(0);
		}
		10%, 30%, 50%, 70%, 90% {
			transform: translateX(-5px);
		}
		20%, 40%, 60%, 80% {
			transform: translateX(5px);
		}
	}

	:global(.animate-shake) {
		animation: shake 500ms ease-in-out;
	}

	/* Win celebration animation */
	@keyframes celebrate {
		0%, 100% {
			transform: scale(1) rotate(0deg);
		}
		25% {
			transform: scale(1.02) rotate(-1deg);
		}
		50% {
			transform: scale(1.05) rotate(1deg);
		}
		75% {
			transform: scale(1.02) rotate(-1deg);
		}
	}

	:global(.animate-celebrate) {
		animation: celebrate 600ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		:global(.animate-shake),
		:global(.animate-celebrate) {
			animation: none !important;
			transform: none !important;
		}
	}
</style>

<script lang="ts">
	/**
	 * Keyboard Component
	 * Virtual keyboard with state tracking and accessibility
	 * 
	 * Requirements: 1.7, 9.1, 9.2, 9.7
	 */

	import { onMount, onDestroy } from 'svelte';
	import { QWERTY_LAYOUT, ALPHABETIC_LAYOUT, type LetterState } from './Keyboard.types';

	interface Props {
		onKeyPress: (key: string) => void;
		letterStates: Map<string, LetterState>;
		layout?: 'qwerty' | 'alphabetic';
		disabled?: boolean;
	}

	let {
		onKeyPress,
		letterStates,
		layout = 'qwerty',
		disabled = false
	}: Props = $props();

	// Select keyboard layout
	const keyboardLayout = $derived(layout === 'qwerty' ? QWERTY_LAYOUT : ALPHABETIC_LAYOUT);

	// Track active key for visual feedback
	let activeKey = $state<string | null>(null);

	// Handle key press with visual feedback (<100ms - Requirement 1.7)
	const handleKeyClick = (key: string) => {
		if (disabled) return;

		// Provide immediate visual feedback
		activeKey = key;
		
		// Call the callback
		onKeyPress(key);

		// Remove active state after 100ms
		setTimeout(() => {
			activeKey = null;
		}, 100);
	};

	// Handle physical keyboard events (Requirement 9.1)
	const handlePhysicalKeyboard = (event: KeyboardEvent) => {
		if (disabled) return;

		const key = event.key.toUpperCase();

		// Handle letter keys
		if (/^[A-Z]$/.test(key)) {
			event.preventDefault();
			handleKeyClick(key);
			return;
		}

		// Handle Enter
		if (key === 'ENTER') {
			event.preventDefault();
			handleKeyClick('ENTER');
			return;
		}

		// Handle Backspace
		if (key === 'BACKSPACE') {
			event.preventDefault();
			handleKeyClick('BACKSPACE');
			return;
		}
	};

	// Get the state of a key for styling
	const getKeyState = (key: string): LetterState => {
		if (key === 'ENTER' || key === 'BACKSPACE') {
			return 'unused';
		}
		return letterStates.get(key) || 'unused';
	};

	// Get accessible label for each key (Requirement 9.7)
	const getAriaLabel = (key: string): string => {
		if (key === 'ENTER') {
			return 'Submit guess';
		}
		if (key === 'BACKSPACE') {
			return 'Delete letter';
		}

		const state = getKeyState(key);
		const stateText = state === 'unused' ? 'not yet used' : state;
		return `${key}, ${stateText}`;
	};

	// Get display text for special keys
	const getKeyDisplay = (key: string): string => {
		if (key === 'BACKSPACE') {
			return '⌫';
		}
		if (key === 'ENTER') {
			return '↵';
		}
		return key;
	};

	// Determine if key is a special key (wider)
	const isSpecialKey = (key: string): boolean => {
		return key === 'ENTER' || key === 'BACKSPACE';
	};

	// Mount and unmount keyboard event listeners
	onMount(() => {
		window.addEventListener('keydown', handlePhysicalKeyboard);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handlePhysicalKeyboard);
	});
</script>

<div 
	role="group" 
	aria-label="Virtual keyboard"
	class="w-full max-w-xl mx-auto"
>
	{#each keyboardLayout as row, rowIndex}
		<div class="flex justify-center gap-1.5 mb-1.5 {layout === 'qwerty' && rowIndex === 1 ? 'px-4' : ''}" role="row">
			{#each row as key}
                {@const isEnter = key === 'ENTER'}
                {@const isBackspace = key === 'BACKSPACE'}
                {@const isLarge = isEnter || isBackspace}
                {@const keyState = getKeyState(key)}
				<button
					type="button"
					aria-label={getAriaLabel(key)}
					class="{isLarge ? 'px-2 md:px-4' : 'w-8 sm:w-10'} h-12 flex items-center justify-center rounded-lg font-bold text-sm uppercase transition-all duration-100 active:translate-y-[3px]
                    {isEnter ? 'bg-[#00bcd4] text-white hover:bg-[#00a5bb] shadow-[0_3px_0_0_#0097a7] active:shadow-none' 
                    : isBackspace ? 'bg-slate-500 dark:bg-slate-600 text-white hover:bg-slate-600 dark:hover:bg-slate-700 shadow-[0_3px_0_0_#475569] dark:shadow-[0_3px_0_0_#334155] active:shadow-none' 
                    : keyState === 'correct' ? 'bg-[#6aaa64] text-white hover:bg-[#5a9a54] shadow-[0_3px_0_0_#4d8247] active:shadow-none'
                    : keyState === 'present' ? 'bg-[#c9b458] text-white hover:bg-[#b9a448] shadow-[0_3px_0_0_#9a893e] active:shadow-none'
                    : keyState === 'absent' ? 'bg-[#787c7e] text-white hover:bg-[#686c6e] shadow-[0_3px_0_0_#585e5f] active:shadow-none'
                    : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600 shadow-[0_2px_4px_rgba(0,0,0,0.05),_0_3px_0_0_rgba(203,213,225,1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.05),_0_3px_0_0_rgba(71,85,105,1)] hover:bg-slate-50 dark:hover:bg-slate-600 active:shadow-none active:border-transparent'}"
					disabled={disabled}
					onclick={() => handleKeyClick(key)}
				>
                    {#if isBackspace}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
                        </svg>
                    {:else if isEnter}
                        ENTER
                    {:else}
                        {key}
                    {/if}
				</button>
			{/each}
		</div>
	{/each}
</div>

<style>
	/* High contrast mode support */
	@media (prefers-contrast: high) {
		button {
			border: 2px solid #000;
		}
	}
</style>

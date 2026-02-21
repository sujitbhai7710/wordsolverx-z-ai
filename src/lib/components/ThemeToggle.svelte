<script lang="ts">
	import { themeStore } from '$lib/theme';

	const { resolvedTheme } = $derived(themeStore);
</script>

<button
	onclick={() => themeStore.toggle()}
	class="theme-toggle"
	aria-label={resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
	title={resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
>
	{#if resolvedTheme === 'light'}
		<!-- Moon icon for dark mode -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
		</svg>
	{:else}
		<!-- Sun icon for light mode -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="5"></circle>
			<line x1="12" y1="1" x2="12" y2="3"></line>
			<line x1="12" y1="21" x2="12" y2="23"></line>
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
			<line x1="1" y1="12" x2="3" y2="12"></line>
			<line x1="21" y1="12" x2="23" y2="12"></line>
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		padding: 0.75rem;
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-neutral-300);
		border-radius: 0.5rem;
		color: var(--color-text-primary);
		cursor: pointer;
		transition:
			background-color var(--duration-normal) var(--easing-out),
			border-color var(--duration-normal) var(--easing-out),
			transform var(--duration-fast) var(--easing-out);
		touch-action: manipulation;
	}

	.theme-toggle:hover {
		background-color: var(--color-bg-tertiary);
		border-color: var(--color-neutral-400);
	}

	.theme-toggle:active {
		transform: scale(0.95);
	}

	.theme-toggle:focus-visible {
		outline: 3px solid var(--color-primary-500);
		outline-offset: 2px;
	}

	.theme-toggle svg {
		transition: transform var(--duration-normal) var(--easing-out);
	}

	.theme-toggle:hover svg {
		transform: rotate(15deg);
	}

	/* Respect reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.theme-toggle,
		.theme-toggle svg {
			transition-duration: 0.01ms;
		}
	}
</style>

<script lang="ts">
	import type { AnalyzerColor } from '$lib/wordle-analyzer/types';

	let {
		word,
		colors = [],
		size = 'md',
		muted = false
	}: {
		word: string;
		colors?: AnalyzerColor[];
		size?: 'sm' | 'md';
		muted?: boolean;
	} = $props();

	const letters = $derived(word.toUpperCase().split(''));

	function getTileClasses(color?: AnalyzerColor) {
		if (color === 'c') {
			return 'border-green-600 bg-green-500 text-white';
		}

		if (color === 'p') {
			return 'border-amber-500 bg-amber-400 text-white';
		}

		if (color === 'a') {
			return 'border-slate-500 bg-slate-400 text-white';
		}

		return muted
			? 'border-slate-200 bg-slate-100 text-slate-500'
			: 'border-slate-300 bg-white text-slate-800';
	}
</script>

<div class="flex flex-wrap justify-center gap-1.5 sm:gap-2">
	{#each letters as letter, index}
		<div
			class={`flex items-center justify-center rounded-xl border-2 font-black uppercase shadow-sm ${size === 'sm' ? 'h-10 w-10 text-sm sm:h-11 sm:w-11' : 'h-12 w-12 text-lg sm:h-14 sm:w-14 sm:text-xl'} ${getTileClasses(colors[index])}`}
		>
			{letter}
		</div>
	{/each}
</div>

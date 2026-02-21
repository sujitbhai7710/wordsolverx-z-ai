<script lang="ts">
	let {
		word,
		wordLength,
		correctness,
		currentSelection,
		onTap,
		onDoubleTap
	}: {
		word: string;
		wordLength: number;
		correctness: number[];
		currentSelection: number;
		onTap: (index: number) => void;
		onDoubleTap: (index: number, state: number) => void;
	} = $props();

	function getCellClass(index: number) {
		const state = correctness[index];
		let colorClass = 'bg-gray-200 border-gray-300';

		if (state === 1) colorClass = 'bg-gray-400 border-gray-500 text-white';
		if (state === 2) colorClass = 'bg-yellow-400 border-yellow-500 text-white shadow-lg';
		if (state === 3) colorClass = 'bg-green-500 border-green-600 text-white shadow-xl';

		return colorClass;
	}

	function handleCellClick(index: number) {
		const currentState = correctness[index];
		let nextState = 3;

		if (currentState === 3) nextState = 2;
		else if (currentState === 2) nextState = 1;
		else nextState = 3;

		onDoubleTap(index, nextState);
	}
</script>

<div class="flex justify-center gap-1 sm:gap-2 mb-6">
	{#each Array(wordLength) as _, index}
		{@const letter = word[index] || ''}
		{@const isSelected = currentSelection === index}
		{@const cellSize = wordLength > 8
			? 'w-10 h-10 text-lg'
			: wordLength > 6
				? 'w-12 h-12 text-xl'
				: 'w-14 h-14 text-2xl'}
		<button
			onclick={() => handleCellClick(index)}
			class="
        {cellSize}
        {getCellClass(index)}
        flex items-center justify-center
        font-bold rounded-md border-2
        transition-all duration-200
        {isSelected ? 'ring-4 ring-blue-400 ring-opacity-50 scale-105' : ''}
        hover:scale-105 hover:shadow-lg
        active:scale-95
      "
		>
			{letter.toUpperCase()}
		</button>
	{/each}
</div>


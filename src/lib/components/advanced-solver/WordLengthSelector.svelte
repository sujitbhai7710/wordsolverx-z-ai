<script lang="ts">
	const DEFAULT_WORD_LENGTHS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	let {
		currentLength,
		onChange,
		availableLengths = DEFAULT_WORD_LENGTHS
	}: {
		currentLength: number;
		onChange: (length: number) => void;
		availableLengths?: number[];
	} = $props();
</script>

<div class="w-full mb-6">
	<div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-100">
		<h3 class="text-sm font-semibold text-gray-700 mb-3 text-center">Select Word Length</h3>
		<div class="flex flex-wrap gap-2 justify-center">
			{#each availableLengths as length}
				<button
					onclick={() => onChange(length)}
					class="
            px-4 py-2 rounded-lg font-semibold text-sm
            transition-all duration-200 shadow-sm
            {length === currentLength
						? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white scale-110 shadow-lg'
						: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'}
          "
				>
					{length}
				</button>
			{/each}
		</div>
	</div>
</div>

<script lang="ts">
	interface Suggestion {
		word: string;
		score: number;
		expected_guesses?: number;
	}

	let {
		suggestions,
		possibilities,
		onSelectWord
	}: {
		suggestions: Suggestion[];
		possibilities: number;
		onSelectWord: (word: string) => void;
	} = $props();

	let visibleCount = $state(10);

	$effect(() => {
		suggestions;
		visibleCount = 10;
	});

	function handleLoadMore() {
		visibleCount += 10;
	}
</script>

{#if !suggestions || suggestions.length === 0}
	<div
		class="w-full max-w-md mx-auto mt-6 p-6 text-center rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 shadow-lg border border-red-100"
	>
		<div class="text-4xl mb-3">&#x1F615;</div>
		<h2 class="text-xl font-bold text-red-800 mb-2">No Words Found</h2>
		<p class="text-gray-600">
			We could not find any words matching your guess history. Please check your colors or try undoing
			the last step.
		</p>
	</div>
{:else}
	<div class="w-full max-w-md mx-auto mt-6 p-4 rounded-lg bg-white shadow-lg border border-gray-100">
		<div class="text-center mb-4">
			<div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 italic">
				Please select a word from the list below. Words higher in the list have better scores. If your
				word is not in the list, please select another word.
			</div>
			<h2 class="text-2xl font-bold text-gray-800">{possibilities} possibilities</h2>
			<p class="text-sm text-gray-500">
				Top {Math.min(visibleCount, suggestions.length)} suggestions by {possibilities === 1
					? 'score'
					: 'entropy'}
			</p>
		</div>

		<div class="overflow-hidden rounded-lg border border-gray-200">
			<table class="w-full text-sm text-left text-gray-500">
				<thead class="text-xs text-gray-700 uppercase bg-gray-50">
					<tr>
						<th scope="col" class="px-6 py-3">Rank</th>
						<th scope="col" class="px-6 py-3">Word</th>
						<th scope="col" class="px-6 py-3 text-right">Guesses Left</th>
					</tr>
				</thead>
				<tbody>
					{#each suggestions.slice(0, visibleCount) as s, index}
						<tr
							class="bg-white border-b hover:bg-gray-50 cursor-pointer transition-colors"
							onclick={() => onSelectWord && onSelectWord(s.word)}
						>
							<td class="px-6 py-4 font-medium">{index + 1}.</td>
							<td class="px-6 py-4 font-bold text-gray-900">{s.word.toUpperCase()}</td>
							<td class="px-6 py-4 text-right text-green-600 font-medium">
								{s.expected_guesses ? `${s.expected_guesses.toFixed(3)}` : s.score.toFixed(2)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if visibleCount < suggestions.length}
			<div class="mt-4 text-center">
				<button
					onclick={handleLoadMore}
					class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full transition-colors text-sm"
				>
					Load More ({suggestions.length - visibleCount} remaining)
				</button>
			</div>
		{/if}
	</div>
{/if}

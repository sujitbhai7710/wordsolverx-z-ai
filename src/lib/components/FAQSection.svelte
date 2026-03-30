<script lang="ts">
	export interface FAQItem {
		question: string;
		answer: string;
	}

	let {
		title = 'Frequently Asked Questions',
		faqs,
		class: className = ''
	}: {
		title?: string;
		faqs: FAQItem[];
		class?: string;
	} = $props();
</script>

<section class={`w-full ${className}`}>
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<h2 class="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
			{title}
		</h2>
		<div class="space-y-4">
			{#each faqs as faq}
				<details class="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
					<summary class="list-none cursor-pointer px-6 py-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-green-500 [&::-webkit-details-marker]:hidden">
						<span class="text-lg font-semibold text-gray-900 dark:text-white">
							{faq.question}
						</span>
						<svg
							class="w-5 h-5 text-gray-500 transition-transform duration-200 group-open:rotate-180"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</summary>
					<div class="px-6 pb-4 text-gray-700 dark:text-gray-300">
						<p class="leading-relaxed">{faq.answer}</p>
					</div>
				</details>
			{/each}
		</div>
	</div>
</section>

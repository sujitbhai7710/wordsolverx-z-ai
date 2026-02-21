<script lang="ts">
  import type { Snippet } from 'svelte';

  export interface FAQItem {
    question: string;
    answer: string;
  }

  let {
    title = 'Frequently Asked Questions',
    faqs,
    class: className = '',
  }: {
    title?: string;
    faqs: FAQItem[];
    class?: string;
  } = $props();

  let openIndex = $state<number | null>(null);

  function toggleFAQ(index: number) {
    openIndex = openIndex === index ? null : index;
  }
</script>

<section class="w-full {className}">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
      {title}
    </h2>
    <div class="space-y-4">
      {#each faqs as faq, index}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
          <button
            onclick={() => toggleFAQ(index)}
            class="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-expanded={openIndex === index}
          >
            <span class="text-lg font-semibold text-gray-900 dark:text-white">
              {faq.question}
            </span>
            <svg
              class="w-5 h-5 text-gray-500 transition-transform duration-200 {openIndex === index ? 'transform rotate-180' : ''}"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {#if openIndex === index}
            <div class="px-6 pb-4 text-gray-700 dark:text-gray-300">
              <p class="leading-relaxed">{faq.answer}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

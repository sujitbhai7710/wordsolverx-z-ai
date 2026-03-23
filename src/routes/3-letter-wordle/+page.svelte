<script lang="ts">
    import WordleGame from '$lib/components/wordle/WordleGame.svelte';
    import GamePageSEO from '$lib/components/SEO/GamePageSEO.svelte';
    import BreadcrumbSchema from '$lib/components/SEO/BreadcrumbSchema.svelte';
    import GameSEOContent from '$lib/components/SEO/GameSEOContent.svelte';

    const wordLength = 3;
</script>

<GamePageSEO {wordLength} />
<BreadcrumbSchema 
    items={[
        { name: 'Home', url: 'https://wordsolver.tech' },
        { name: 'Wordle', url: 'https://wordsolver.tech/multidle' },
        { name: `${wordLength} Letter Wordle`, url: `https://wordsolver.tech/${wordLength}-letter-wordle` }
    ]} 
/>

<main class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
    <WordleGame {wordLength} maxGuesses={6} customTitle="3 Letter Wordle" />
    <GameSEOContent {wordLength} />
</main>

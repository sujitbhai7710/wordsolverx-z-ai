<script lang="ts">
    import WordleGame from '$lib/components/wordle/WordleGame.svelte';
    import GamePageSEO from '$lib/components/SEO/GamePageSEO.svelte';
    import BreadcrumbSchema from '$lib/components/SEO/BreadcrumbSchema.svelte';
    import GameSEOContent from '$lib/components/SEO/GameSEOContent.svelte';

    const wordLength = 8;
</script>

<GamePageSEO {wordLength} />
<BreadcrumbSchema 
    items={[
        { name: 'Home', url: 'https://wordsolverx.com' },
        { name: 'Wordle', url: 'https://wordsolverx.com/multidle' },
        { name: `${wordLength} Letter Wordle`, url: `https://wordsolverx.com/${wordLength}-letter-wordle` }
    ]} 
/>

<main class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
    <WordleGame {wordLength} maxGuesses={6} customTitle="8 Letter Wordle" />
    <GameSEOContent {wordLength} />
</main>

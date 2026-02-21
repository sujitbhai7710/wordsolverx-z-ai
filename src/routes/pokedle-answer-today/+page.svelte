<script lang="ts">
  import GameDleAnswerPage from '$lib/components/GameDleAnswerPage.svelte';

  const modeConfig = {
    classic: { name: 'Pokédle Classic Answer', icon: '👑', color: 'border-yellow-400', bg: 'bg-yellow-50' },
    silhouette: { name: 'Pokédle Silhouette Answer', icon: '👤', color: 'border-purple-400', bg: 'bg-purple-50' },
    flavor: { name: 'Pokédle Flavor Text Answer', icon: '📖', color: 'border-green-400', bg: 'bg-green-50' },
    card: { name: 'Pokédle Card Answer', icon: '🃏', color: 'border-blue-400', bg: 'bg-blue-50' },
  };
  const modes = ['classic', 'silhouette', 'flavor', 'card'];
  const regions = [
    { key: 'america', label: 'America', flag: '🇺🇸', accent: 'bg-yellow-500' },
    { key: 'europe', label: 'Europe', flag: '🇪🇺', accent: 'bg-red-500' },
  ];
  const crossLinks = [
    { href: '/narutodle-answer-today', icon: '🍥', label: 'Narutodle' },
    { href: '/loldle-answer-today', icon: '⚔️', label: 'LoLdle' },
    { href: '/smashdle-answer-today', icon: '🎮', label: 'Smashdle' },
    { href: '/dotadle-answer-today', icon: '🛡️', label: 'Dotadle' },
  ];
  const schemas = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is Pokedle?', acceptedAnswer: { '@type': 'Answer', text: 'Pokedle is a Pokémon-themed daily guessing game inspired by Wordle.' } },
      { '@type': 'Question', name: 'What are the Pokedle game modes?', acceptedAnswer: { '@type': 'Answer', text: 'Modes include Classic, Silhouette, Flavor Text, and Card.' } },
    ]},
    { '@type': 'NewsArticle', headline: 'Pokedle Answer Today', description: 'Get the confirmed Pokedle answer for today.', mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/pokedle-answer-today' }, author: { '@type': 'Organization', name: 'WordSolverX' }, publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolverx.com/logo.png' } } },
  ]};
</script>

<GameDleAnswerPage gameKey="pokedle" gameTitle="Pokedle" apiGame="pokedle" {modes} {modeConfig} {regions} {crossLinks} {schemas}>
  {#snippet seoContent()}
    <h2 class="text-3xl font-bold text-gray-900 mb-6">Catch Today's Pokedle Answers</h2>
    <div class="prose prose-yellow max-w-none text-gray-600">
      <p class="mb-4">Gotta guess 'em all! Find today's <strong>Pokedle</strong> solutions for all game modes.</p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Game Modes Overview</h3>
      <ul class="grid md:grid-cols-2 gap-4 list-none pl-0">
        <li class="bg-yellow-50 p-4 rounded-xl border border-yellow-100"><strong class="text-yellow-700 block mb-1">👑 Classic</strong>Guess by Type, Generation, Height, Weight, and Evolution Stage.</li>
        <li class="bg-purple-50 p-4 rounded-xl border border-purple-100"><strong class="text-purple-700 block mb-1">👤 Silhouette</strong>"Who's that Pokémon?" style shadow identification.</li>
        <li class="bg-green-50 p-4 rounded-xl border border-green-100"><strong class="text-green-700 block mb-1">📖 Flavor Text</strong>Guess from its Pokédex entry description.</li>
        <li class="bg-blue-50 p-4 rounded-xl border border-blue-100"><strong class="text-blue-700 block mb-1">🃏 Card</strong>Recognize from a cropped Trading Card Game art.</li>
      </ul>
      <div class="border-t border-gray-100 mt-8 pt-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Tips for Playing</h3>
        <p>Start with common Pokémon that have dual types to eliminate more possibilities in Classic mode. Pay attention to color-coded clues.</p>
      </div>
    </div>
  {/snippet}
</GameDleAnswerPage>

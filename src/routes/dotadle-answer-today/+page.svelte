<script lang="ts">
  import GameDleAnswerPage from '$lib/components/GameDleAnswerPage.svelte';

  const modeConfig = {
    classic: { name: 'Dotadle Classic Answer', icon: '👑', color: 'border-yellow-400', bg: 'bg-yellow-50' },
    ability: { name: 'Dotadle Ability Answer', icon: '⚡', color: 'border-blue-400', bg: 'bg-blue-50' },
    quote: { name: 'Dotadle Quote Answer', icon: '💬', color: 'border-green-400', bg: 'bg-green-50' },
    loadingscreen: { name: 'Dotadle Loading Screen Answer', icon: '🖼️', color: 'border-purple-400', bg: 'bg-purple-50' },
  };
  const modes = ['ability', 'quote', 'classic', 'loadingscreen'];
  const crossLinks = [
    { href: '/narutodle-answer-today', icon: '🍥', label: 'Narutodle' },
    { href: '/loldle-answer-today', icon: '⚔️', label: 'LoLdle' },
    { href: '/pokedle-answer-today', icon: '⚡', label: 'Pokedle' },
    { href: '/smashdle-answer-today', icon: '🎮', label: 'Smashdle' },
  ];
  const schemas = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'When does Dotadle reset?', acceptedAnswer: { '@type': 'Answer', text: 'Dotadle resets daily at midnight UTC, providing fresh puzzles for all game modes.' } },
      { '@type': 'Question', name: 'What is Dotadle?', acceptedAnswer: { '@type': 'Answer', text: 'Dotadle is a daily Dota 2 puzzle game where players guess heroes based on attributes, quotes, abilities, and loading screens.' } },
    ]},
    { '@type': 'NewsArticle', headline: 'Dotadle Answer Today', description: 'Get the confirmed Dotadle answer for today.', mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/dotadle-answer-today' }, author: { '@type': 'Organization', name: 'WordSolverX' }, publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolverx.com/logo.png' } } },
  ]};
</script>

<GameDleAnswerPage gameKey="dotadle" gameTitle="Dotadle" apiGame="dotadle" {modes} {modeConfig} {crossLinks} {schemas}>
  {#snippet seoContent()}
    <h2 class="text-3xl font-bold text-gray-900 mb-6">Daily Dotadle Solutions for Dota 2 Fans</h2>
    <div class="prose prose-emerald max-w-none text-gray-600">
      <p class="mb-4">Defense of the Ancients mastery starts here. Get the latest <strong>Dotadle answers today</strong> for every game mode.</p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Hero Guessing Modes</h3>
      <ul class="grid md:grid-cols-2 gap-4 list-none pl-0">
        <li class="bg-yellow-50 p-4 rounded-xl border border-yellow-100"><strong class="text-yellow-700 block mb-1">👑 Classic</strong>Guess the hero using Gender, Species, Role, Attribute, and Attack type.</li>
        <li class="bg-blue-50 p-4 rounded-xl border border-blue-100"><strong class="text-blue-700 block mb-1">⚡ Ability</strong>Identify the hero from one of their skill icons.</li>
        <li class="bg-green-50 p-4 rounded-xl border border-green-100"><strong class="text-green-700 block mb-1">💬 Quote</strong>Recognize the hero by their specific voice line or response.</li>
        <li class="bg-purple-50 p-4 rounded-xl border border-purple-100"><strong class="text-purple-700 block mb-1">🖼️ Loading Screen</strong>Guess the hero from a cropped section of a loading screen art.</li>
      </ul>
    </div>
  {/snippet}
</GameDleAnswerPage>

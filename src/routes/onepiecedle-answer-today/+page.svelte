<script lang="ts">
  import GameDleAnswerPage from '$lib/components/GameDleAnswerPage.svelte';

  const modeConfig = {
    classic: { name: 'OnePiecedle Classic Answer', icon: '👑', color: 'border-yellow-400', bg: 'bg-yellow-50' },
    devilFruit: { name: 'OnePiecedle Devil Fruit Answer', icon: '🍎', color: 'border-red-400', bg: 'bg-red-50' },
    laugh: { name: 'OnePiecedle Laugh Answer', icon: '😆', color: 'border-pink-400', bg: 'bg-pink-50' },
    wanted: { name: 'OnePiecedle Wanted Answer', icon: '📜', color: 'border-orange-400', bg: 'bg-orange-50' },
  };
  const modes = ['classic', 'devilFruit', 'laugh', 'wanted'];
  const regions = [
    { key: 'america', label: 'America', flag: '🇺🇸', accent: 'bg-red-500' },
    { key: 'europe', label: 'Europe', flag: '🇪🇺', accent: 'bg-orange-500' },
  ];
  const crossLinks = [
    { href: '/narutodle-answer-today', icon: '🍥', label: 'Narutodle' },
    { href: '/loldle-answer-today', icon: '⚔️', label: 'LoLdle' },
    { href: '/pokedle-answer-today', icon: '⚡', label: 'Pokedle' },
    { href: '/smashdle-answer-today', icon: '🎮', label: 'Smashdle' },
    { href: '/dotadle-answer-today', icon: '🛡️', label: 'Dotadle' },
  ];
  const schemas = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is OnePiecedle?', acceptedAnswer: { '@type': 'Answer', text: 'OnePiecedle is a daily trivia game for One Piece fans.' } },
      { '@type': 'Question', name: 'How to play OnePiecedle?', acceptedAnswer: { '@type': 'Answer', text: 'Classic, Devil Fruit, Laugh, and Wanted modes.' } },
    ]},
    { '@type': 'NewsArticle', headline: 'OnePiecedle Answer Today', description: 'Get the confirmed OnePiecedle answer for today.', mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/onepiecedle-answer-today' }, author: { '@type': 'Organization', name: 'WordSolverX' }, publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolverx.com/logo.png' } } },
  ]};
</script>

<GameDleAnswerPage gameKey="onepiecedle" gameTitle="OnePiecedle" apiGame="onepiecedle" {modes} {modeConfig} {regions} {crossLinks} {schemas}>
  {#snippet seoContent()}
    <h2 class="text-3xl font-bold text-gray-900 mb-6">OnePiecedle: The Grand Line of Trivia</h2>
    <div class="prose prose-red max-w-none text-gray-600">
      <p class="mb-4">Set sail with today's <strong>OnePiecedle answers</strong>!</p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Pirate Puzzle Modes</h3>
      <ul class="grid md:grid-cols-2 gap-4 list-none pl-0">
        <li class="bg-yellow-50 p-4 rounded-xl border border-yellow-100"><strong class="text-yellow-700 block mb-1">👑 Classic</strong>Guess by Gender, Position, Bounty, Haki type, and Affiliation.</li>
        <li class="bg-red-50 p-4 rounded-xl border border-red-100"><strong class="text-red-700 block mb-1">🍎 Devil Fruit</strong>Identify the Devil Fruit from its appearance or power.</li>
        <li class="bg-pink-50 p-4 rounded-xl border border-pink-100"><strong class="text-pink-700 block mb-1">😆 Laugh</strong>Guess the character by their iconic laugh!</li>
        <li class="bg-orange-50 p-4 rounded-xl border border-orange-100"><strong class="text-orange-700 block mb-1">📜 Wanted</strong>Recognize the pirate from their Wanted Poster art.</li>
      </ul>
    </div>
  {/snippet}
</GameDleAnswerPage>

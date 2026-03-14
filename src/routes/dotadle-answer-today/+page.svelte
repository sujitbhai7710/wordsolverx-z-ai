<script lang="ts">
  import GameDleAnswerPage from '$lib/components/GameDleAnswerPage.svelte';

  let { data }: { data: { answers: any[]; dateStr: string; error: string | null; } } = $props();

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
    { '@type': 'Article', headline: 'Dotadle Answer Today', description: 'Get the confirmed Dotadle answer for today.', mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/dotadle-answer-today' }, author: { '@type': 'Organization', name: 'WordSolverX' }, publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolverx.com/wordsolverx.webp' } } },
  ]};
</script>

<GameDleAnswerPage gameKey="dotadle" gameTitle="Dotadle" apiGame="dotadle" {modes} {modeConfig} {crossLinks} {schemas} {data}>
  {#snippet seoContent()}
    <article class="space-y-8">
      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">What is Dotadle?</h2>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          Dotadle is a daily guessing game for Dota 2 players. If you've played Wordle, you'll recognize the concept — but instead of guessing words, you're guessing heroes from Valve's legendary MOBA. Each day brings a new mystery hero, and you use clues to narrow down who it might be.
        </p>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          The game taps into your Dota knowledge in a way that feels rewarding. Every match you've played, every hero you've tried, every ability you've seen — all of that experience becomes useful. Whether you're a seasoned veteran with thousands of hours or a relatively new player learning the ropes, Dotadle gives you a daily reason to think about the game's diverse hero roster.
        </p>
        <p class="text-lg text-gray-600 leading-relaxed">
          What makes Dotadle particularly engaging is how it tests different kinds of knowledge. Some modes reward game mechanics knowledge, others test your familiarity with hero lore and voice lines, and some challenge your visual memory of loading screens and ability icons. It's a comprehensive test of your Dota expertise.
        </p>
      </section>

      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Dotadle Game Modes Explained</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
            <h3 class="text-xl font-bold text-yellow-700 mb-3 flex items-center gap-2">👑 Classic Mode</h3>
            <p class="text-gray-600">
              The traditional guessing experience. You get clues about the hero's gender, species (human, orc, demon, etc.), role (carry, support, etc.), primary attribute (strength, agility, intelligence), and attack type (melee or ranged). Use these to narrow down possibilities.
            </p>
          </div>
          <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 class="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">⚡ Ability Mode</h3>
            <p class="text-gray-600">
              You're shown an ability icon and need to identify which hero it belongs to. This rewards players who pay attention to ability visuals and have experience playing against many different heroes.
            </p>
          </div>
          <div class="bg-green-50 p-6 rounded-2xl border border-green-100">
            <h3 class="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">💬 Quote Mode</h3>
            <p class="text-gray-600">
              Read a voice line from a hero and guess who said it. This tests your familiarity with hero personalities and memorable quotes. Dota heroes have extensive voice acting, making this mode particularly fun.
            </p>
          </div>
          <div class="bg-purple-50 p-6 rounded-2xl border border-purple-100">
            <h3 class="text-xl font-bold text-purple-700 mb-3 flex items-center gap-2">🖼️ Loading Screen Mode</h3>
            <p class="text-gray-600">
              A cropped section of a hero's loading screen art is shown, and you need to identify which hero it belongs to. This tests your visual memory of the game's artwork and cosmetics.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Tips for Getting Better at Dotadle</h2>
        <div class="space-y-4 text-lg text-gray-600">
          <p class="leading-relaxed">
            Want to improve your Dotadle game? Here are strategies that actually help:
          </p>
          <ul class="list-disc list-inside space-y-3 ml-4">
            <li><strong class="text-gray-900">Know your attributes</strong> — Understanding which heroes are Strength, Agility, or Intelligence is fundamental. This clue alone can eliminate two-thirds of the roster.</li>
            <li><strong class="text-gray-900">Learn hero roles</strong> — Most heroes fit into carry, mid, offlane, or support roles. Knowing which heroes typically play where helps narrow down possibilities.</li>
            <li><strong class="text-gray-900">Remember attack types</strong> — Is the hero melee or ranged? This binary clue is surprisingly useful for eliminating options quickly.</li>
            <li><strong class="text-gray-900">Study ability icons</strong> — For Ability mode, pay attention to the art style and color palette. Each hero's abilities have distinctive visual elements.</li>
            <li><strong class="text-gray-900">Play different heroes</strong> — The more heroes you've played, the more familiar you'll be with their abilities, quotes, and loading screens. Variety in your gameplay helps in Dotadle.</li>
          </ul>
        </div>
      </section>

      <section class="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 border border-red-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Why Dota Players Love Dotadle</h2>
        <div class="space-y-4 text-lg text-gray-600">
          <p class="leading-relaxed">
            Dotadle connects with Dota players because it rewards the knowledge you've built through playing. Every match you've played, every hero you've faced, every ability you've dodged — it all contributes to your Dotadle skills.
          </p>
          <p class="leading-relaxed">
            The game also keeps players engaged with Dota even when they're not in a match. It's a quick daily activity that takes just a few minutes but keeps you thinking about the game. Many players make it part of their daily routine, checking Dotadle before or after their gaming sessions.
          </p>
          <p class="leading-relaxed">
            Plus, with over 120 heroes in the game, there's always more to learn. Even veteran players encounter heroes they're less familiar with, making every day's puzzle a genuine challenge. The game grows with the roster, staying fresh as new heroes are released.
          </p>
        </div>
      </section>
    </article>
  {/snippet}
</GameDleAnswerPage>

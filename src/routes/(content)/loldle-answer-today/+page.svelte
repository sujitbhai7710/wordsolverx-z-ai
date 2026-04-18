<script lang="ts">
  import GameDleAnswerPage from '$lib/components/GameDleAnswerPage.svelte';

  let { data }: { data: { answers: any[]; dateStr: string; error: string | null; } } = $props();

  const modeConfig = {
    classic: { name: 'LoLdle Classic Answer', icon: '👑', color: 'border-yellow-400', bg: 'bg-yellow-50' },
    splash: { name: 'LoLdle Splash Art Answer', icon: '🎨', color: 'border-pink-400', bg: 'bg-pink-50' },
    ability: { name: 'LoLdle Ability Answer', icon: '⚡', color: 'border-blue-400', bg: 'bg-blue-50' },
    quote: { name: 'LoLdle Quote Answer', icon: '💬', color: 'border-green-400', bg: 'bg-green-50' },
  };
  const modes = ['splash', 'ability', 'quote', 'classic'];
  const regions = [
    { key: 'america', label: 'America', flag: '🇺🇸', accent: 'bg-blue-500' },
    { key: 'europe', label: 'Europe', flag: '🇪🇺', accent: 'bg-purple-500' },
  ];
  const crossLinks = [
    { href: '/narutodle-answer-today', icon: '🍥', label: 'Narutodle' },
    { href: '/pokedle-answer-today', icon: '⚡', label: 'Pokedle' },
    { href: '/smashdle-answer-today', icon: '🎮', label: 'Smashdle' },
    { href: '/dotadle-answer-today', icon: '🛡️', label: 'Dotadle' },
  ];
  const schemas = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is LoLdle?', acceptedAnswer: { '@type': 'Answer', text: 'LoLdle is a daily guessing game based on League of Legends champions.' } },
      { '@type': 'Question', name: 'How often does LoLdle reset?', acceptedAnswer: { '@type': 'Answer', text: 'The game resets every 24 hours with a new champion to guess in each mode.' } },
      { '@type': 'Question', name: 'What are the LoLdle game modes?', acceptedAnswer: { '@type': 'Answer', text: 'Classic, Quote, Ability, and Splash.' } },
    ]},
    { '@type': 'Article', headline: 'LoLdle Answer Today', description: 'Get the confirmed LoLdle answer for today.', mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolver.tech/loldle-answer-today' }, author: { '@type': 'Person', name: 'Preston Hayes', image: 'https://wordsolver.tech/auther-wordsolverx.webp', url: 'https://wordsolver.tech/about#preston-hayes' }, publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolver.tech/wordsolverx.webp' } } },
  ]};
</script>

<GameDleAnswerPage gameKey="loldle" gameTitle="LoLdle" apiGame="loldle" {modes} {modeConfig} {regions} {crossLinks} {schemas} {data}>
  {#snippet seoContent()}
    <article class="space-y-8">
      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">What is LoLdle?</h2>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          LoLdle is a daily guessing game for League of Legends players. If you've played Wordle, you'll recognize the concept — but instead of guessing words, you're guessing champions from Riot Games' popular MOBA. Each day brings a new mystery champion, and you use clues to narrow down who it might be.
        </p>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          The game taps into your League knowledge in a way that feels rewarding. Every match you've played, every champion you've tried, every ability you've seen — all of that experience becomes useful. New and experienced players alike will find their League knowledge tested, LoLdle gives you a daily reason to think about the game's massive roster.
        </p>
        <p class="text-lg text-gray-600 leading-relaxed">
          LoLdle tests different kinds of knowledge across its modes. Some modes reward game mechanics knowledge, others test your familiarity with champion lore, and some challenge your visual memory of splash arts and ability icons. It covers your League knowledge from multiple angles.
        </p>
      </section>

      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">LoLdle Game Modes Explained</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
            <h3 class="text-xl font-bold text-yellow-700 mb-3 flex items-center gap-2">👑 Classic Mode</h3>
            <p class="text-gray-600">
              The traditional guessing experience. You get clues about the champion's gender, position (top, jungle, mid, bot, support), species (human, yordle, vastaya, etc.), resource (mana, energy, fury, etc.), range type, and release year. Use these to narrow down possibilities.
            </p>
          </div>
          <div class="bg-green-50 p-6 rounded-2xl border border-green-100">
            <h3 class="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">💬 Quote Mode</h3>
            <p class="text-gray-600">
              Read a voice line from a champion and guess who said it. This tests your familiarity with champion personalities and memorable quotes. Some are iconic lines everyone knows, others are obscure enough to challenge even dedicated players.
            </p>
          </div>
          <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 class="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">⚡ Ability Mode</h3>
            <p class="text-gray-600">
              You're shown an ability icon (Q, W, E, or R) and need to identify which champion it belongs to. This rewards players who pay attention to ability visuals and have experience playing against many different champions.
            </p>
          </div>
          <div class="bg-pink-50 p-6 rounded-2xl border border-pink-100">
            <h3 class="text-xl font-bold text-pink-700 mb-3 flex items-center gap-2">🎨 Splash Mode</h3>
            <p class="text-gray-600">
              A zoomed-in section of a champion's splash art is shown, and you need to identify which champion (and sometimes which skin) it belongs to. This tests your visual memory of the game's artwork.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Tips for Getting Better at LoLdle</h2>
        <div class="space-y-4 text-lg text-gray-600">
          <p class="leading-relaxed">
            Want to improve your LoLdle game? Here are strategies that actually help:
          </p>
          <ul class="list-disc list-inside space-y-3 ml-4">
            <li><strong class="text-gray-900">Know your positions</strong> — Understanding which champions typically play which roles is fundamental. Most marksmen are bot lane, most tanks are top or support, assassins tend to be mid or jungle.</li>
            <li><strong class="text-gray-900">Learn champion resources</strong> — Most champions use mana, but some use energy (Shen, Zed, Kennen), fury (Renekton, Tryndamere), or nothing at all (Riven, Katarina). This clue alone can eliminate many options.</li>
            <li><strong class="text-gray-900">Remember release years</strong> — Older champions (2009-2011) are the originals. Newer champions (2020+) have more modern designs. This helps narrow down by era.</li>
            <li><strong class="text-gray-900">Study splash arts</strong> — For Splash mode, pay attention to color palettes and art styles. Each champion has distinctive visual elements that show even in zoomed-in sections.</li>
            <li><strong class="text-gray-900">Play different champions</strong> — The more champions you've played, the more familiar you'll be with their abilities, quotes, and splash arts. Variety in your gameplay helps in LoLdle.</li>
          </ul>
        </div>
      </section>

      <section class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Why League Players Love LoLdle</h2>
        <div class="space-y-4 text-lg text-gray-600">
          <p class="leading-relaxed">
            LoLdle connects with League players because it rewards the knowledge you've built through playing. Every game you've played, every champion you've faced, every ability you've dodged — it all contributes to your LoLdle skills.
          </p>
          <p class="leading-relaxed">
            The game also keeps players engaged with League even when they're not in a match. It's a quick daily activity that takes just a few minutes but keeps you thinking about the game. Many players make it part of their daily routine, checking LoLdle before or after their gaming sessions.
          </p>
          <p class="leading-relaxed">
            Plus, with over 160 champions in the game, there's always more to learn. Even veteran players encounter champions they're less familiar with, making every day's puzzle a genuine challenge. The game grows with the roster, staying fresh as new champions are released.
          </p>
        </div>
      </section>
    </article>
  {/snippet}
</GameDleAnswerPage>

<script lang="ts">
  import GameDleAnswerPage from '$lib/components/GameDleAnswerPage.svelte';

  let { data }: { data: { answers: any[]; dateStr: string; error: string | null; } } = $props();

  const modeConfig = {
    classic: { name: 'Smashdle Classic Answer', icon: '👑', color: 'border-yellow-400', bg: 'bg-yellow-50' },
    emoji: { name: 'Smashdle Emoji Answer', icon: '😀', color: 'border-pink-400', bg: 'bg-pink-50' },
    silhouette: { name: 'Smashdle Silhouette Answer', icon: '👤', color: 'border-purple-400', bg: 'bg-purple-50' },
    finalSmash: { name: 'Smashdle Final Smash Answer', icon: '💥', color: 'border-red-400', bg: 'bg-red-50' },
    kirby: { name: 'Smashdle Kirby Copy Answer', icon: '🩷', color: 'border-pink-400', bg: 'bg-pink-50' },
  };
  const modes = ['classic', 'emoji', 'silhouette', 'finalSmash', 'kirby'];
  const gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  const regions = [
    { key: 'america', label: 'America', flag: '🇺🇸', accent: 'bg-red-500' },
    { key: 'europe', label: 'Europe', flag: '🇪🇺', accent: 'bg-pink-500' },
  ];
  const crossLinks = [
    { href: '/narutodle-answer-today', icon: '🍥', label: 'Narutodle' },
    { href: '/loldle-answer-today', icon: '⚔️', label: 'LoLdle' },
    { href: '/pokedle-answer-today', icon: '⚡', label: 'Pokedle' },
    { href: '/dotadle-answer-today', icon: '🛡️', label: 'Dotadle' },
  ];
  const schemas = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is Smashdle?', acceptedAnswer: { '@type': 'Answer', text: 'Smashdle is a daily trivia game based on Super Smash Bros Ultimate characters.' } },
      { '@type': 'Question', name: 'What are the Smashdle modes?', acceptedAnswer: { '@type': 'Answer', text: 'Classic, Emoji, Silhouette, Final Smash, and Kirby Copy.' } },
    ]},
    { '@type': 'Article', headline: 'Smashdle Answer Today', description: 'Get the confirmed Smashdle answer for today.', mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolver.tech/smashdle-answer-today' }, author: { '@type': 'Person', name: 'Preston Hayes', image: 'https://wordsolver.tech/auther-wordsolverx.webp', url: 'https://wordsolver.tech/about#preston-hayes' }, publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolver.tech/wordsolverx.webp' } } },
  ]};
</script>

<GameDleAnswerPage gameKey="smashdle" gameTitle="Smashdle" apiGame="smashdle" {modes} {modeConfig} {gridCols} {regions} {crossLinks} {schemas} {data}>
  {#snippet seoContent()}
    <article class="space-y-8">
      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">What is Smashdle?</h2>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          Smashdle is a daily guessing game for Super Smash Bros fans. If you've played Wordle, you'll recognize the concept — but instead of guessing words, you're guessing fighters from Nintendo's legendary crossover fighting game. Each day brings a new mystery character, and you use clues to narrow down who it might be.
        </p>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          The game taps into your Smash knowledge in a way that feels rewarding. Every match you've played, every fighter you've tried, every Final Smash you've seen — all of that experience becomes useful. Whether you're a competitive player who mains a specific character or a casual fan who enjoys the chaos, Smashdle gives you a daily reason to think about the massive roster.
        </p>
        <p class="text-lg text-gray-600 leading-relaxed">
          What makes Smashdle particularly engaging is how it tests different kinds of knowledge. Some modes reward game mechanics knowledge, others test your familiarity with character designs and abilities, and some challenge your visual memory. It's a comprehensive test of your Smash expertise.
        </p>
      </section>

      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Smashdle Game Modes Explained</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
            <h3 class="text-xl font-bold text-yellow-700 mb-3 flex items-center gap-2">👑 Classic Mode</h3>
            <p class="text-gray-600">
              The traditional guessing experience. You get clues about the fighter's game series, release date, weight class, and speed. Use these to narrow down possibilities from the 80+ fighter roster.
            </p>
          </div>
          <div class="bg-pink-50 p-6 rounded-2xl border border-pink-100">
            <h3 class="text-xl font-bold text-pink-700 mb-3 flex items-center gap-2">😀 Emoji Mode</h3>
            <p class="text-gray-600">
              A set of emojis represents the fighter. Maybe a crown for Princess Peach, a mushroom for Mario, or a sword for Link. Decipher the emoji puzzle to identify the character.
            </p>
          </div>
          <div class="bg-purple-50 p-6 rounded-2xl border border-purple-100">
            <h3 class="text-xl font-bold text-purple-700 mb-3 flex items-center gap-2">👤 Silhouette Mode</h3>
            <p class="text-gray-600">
              A black silhouette of the fighter is shown. Some characters have instantly recognizable shapes, while others are surprisingly tricky. Test your visual memory of the roster.
            </p>
          </div>
          <div class="bg-red-50 p-6 rounded-2xl border border-red-100">
            <h3 class="text-xl font-bold text-red-700 mb-3 flex items-center gap-2">💥 Final Smash Mode</h3>
            <p class="text-gray-600">
              You're shown a Final Smash attack and need to identify which fighter it belongs to. This rewards players who have seen (or been defeated by) many different Final Smashes.
            </p>
          </div>
          <div class="bg-pink-50 p-6 rounded-2xl border border-pink-100">
            <h3 class="text-xl font-bold text-pink-700 mb-3 flex items-center gap-2">🩷 Kirby Copy Mode</h3>
            <p class="text-gray-600">
              Kirby has inhaled a fighter and copied their ability. Look at the copy ability hat and guess which fighter Kirby absorbed. A fun twist for Kirby fans.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Tips for Getting Better at Smashdle</h2>
        <div class="space-y-4 text-lg text-gray-600">
          <p class="leading-relaxed">
            Want to improve your Smashdle game? Here are strategies that actually help:
          </p>
          <ul class="list-disc list-inside space-y-3 ml-4">
            <li><strong class="text-gray-900">Know your series</strong> — Understanding which franchise each fighter comes from is fundamental. Mario, Zelda, Pokémon, Fire Emblem — knowing the series helps eliminate options quickly.</li>
            <li><strong class="text-gray-900">Learn weight classes</strong> — Light fighters like Pichu and Jigglypuff get knocked far. Heavy fighters like Bowser and Ganondorf are harder to launch. This clue narrows down significantly.</li>
            <li><strong class="text-gray-900">Remember release order</strong> — The original 12 from Smash 64, the Melee newcomers, Brawl additions, and Ultimate's massive roster. Knowing when fighters joined helps with the release date clue.</li>
            <li><strong class="text-gray-900">Study Final Smashes</strong> — For Final Smash mode, pay attention to the visual style and effects. Each character's ultimate move has distinctive elements.</li>
            <li><strong class="text-gray-900">Play different fighters</strong> — The more fighters you've played, the more familiar you'll be with their abilities, designs, and Kirby hats. Variety in your gameplay helps in Smashdle.</li>
          </ul>
        </div>
      </section>

      <section class="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 border border-red-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Why Smash Fans Love Smashdle</h2>
        <div class="space-y-4 text-lg text-gray-600">
          <p class="leading-relaxed">
            Smashdle connects with Smash players because it rewards the knowledge you've built through playing. Every match you've played, every fighter you've tried, every Final Smash you've witnessed — it all contributes to your Smashdle skills.
          </p>
          <p class="leading-relaxed">
            The game also keeps players engaged with Smash even when they're not in a match. It's a quick daily activity that takes just a few minutes but keeps you thinking about the roster. Many players make it part of their daily routine, checking Smashdle before or after their gaming sessions.
          </p>
          <p class="leading-relaxed">
            Plus, with over 80 fighters spanning decades of gaming history, there's always more to learn. Even veteran players encounter fighters they're less familiar with, making every day's puzzle a genuine challenge. The game celebrates the incredible diversity of the Smash roster.
          </p>
        </div>
      </section>
    </article>
  {/snippet}
</GameDleAnswerPage>

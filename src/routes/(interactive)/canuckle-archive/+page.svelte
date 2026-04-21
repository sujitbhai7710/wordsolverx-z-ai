<script lang="ts">
  import WordlebotPage from '$lib/components/wordlebot/WordlebotPage.svelte';

  let { data }: { data: { config: import('$lib/wordlebot-wasm/types').WordlebotPageConfig } } = $props();
</script>

<WordlebotPage config={data.config} />

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
  <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Canuckle Archive Matters</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p>
        Canuckle is a beloved Canadian-themed variant of the original Wordle game, and its answer archive provides a unique window into how geography, culture, and wordplay intersect in daily puzzle design. Unlike standard Wordle, where answers are drawn from a broad English vocabulary, Canuckle restricts its solution pool to words with Canadian connections. This includes references to Canadian places, people, history, wildlife, slang, and cultural touchstones that resonate with players who have an interest in the Great White North.
      </p>
      <p>
        For Canadian players, the archive is an invaluable study tool. Understanding the types of words Canuckle selects helps players develop targeted opening strategies that account for the more restricted answer pool. Many Canuckle solutions reference specific Canadian terms that would never appear in the original Wordle, such as words drawn from Indigenous languages, French-Canadian vocabulary, regional slang, and iconic Canadian brands or landmarks. By reviewing the archive, players can build a mental database of likely answer patterns and dramatically improve their solve rates.
      </p>
      <p>
        The archive also serves an educational purpose. Each answer in the Canuckle archive represents a piece of Canadian culture or knowledge, and browsing through past solutions is like taking a guided tour of Canadian identity through the lens of word games. Teachers can use the archive to create cross-curricular activities that combine language arts with Canadian studies, making learning both interactive and enjoyable for students of all ages.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Canuckle Answers Work</h3>
      <p>
        Canuckle follows the familiar Wordle format but with a distinctly Canadian twist. Each day, players are challenged to guess a five-letter word within six attempts, with the standard green, yellow, and gray color feedback system indicating correct letters, misplaced letters, and absent letters respectively. The key difference lies in the answer selection: every Canuckle solution has some connection to Canada, whether through direct reference to a Canadian concept or through a word that holds special significance in Canadian English.
      </p>
      <p>
        The answer list is curated by the Canuckle development team, who draw from a carefully maintained pool of Canadian-themed words. This list includes geographic terms like names of provinces and cities, natural features drawn from Canada's vast and diverse landscape, wildlife species native to Canadian ecosystems, historical figures and events, cultural phenomena from hockey to music, and bilingual elements that reflect Canada's English-French heritage. The curated nature of the list means that studying the archive provides genuine strategic advantages.
      </p>
      <p>
        Like the original Wordle, Canuckle operates on a daily cycle with one new puzzle per day. The answers are predetermined and served in sequence, making the archive a reliable and complete record of every solution since the game's launch. Players in all time zones receive the same word on the same date, preserving the shared community experience.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Canuckle Answers</h3>
      <p>
        The Canuckle archive contains many answers that sparked particular excitement among Canadian players. Solutions referencing iconic Canadian symbols like the maple leaf, the beaver, and hockey terminology consistently generate enthusiastic social media sharing. Words drawn from Canadian place names, including those with Indigenous origins, often introduce players to new geographic knowledge while still functioning as valid Wordle-style puzzles.
      </p>
      <p>
        Bilingual answers are among the most interesting entries in the archive. Words that bridge English and French Canadian vocabulary showcase the country's linguistic duality and sometimes surprise players who approach the puzzle from a purely English-language perspective. These entries are especially popular with bilingual players who appreciate the cultural nuance built into the game's answer selection.
      </p>
      <p>
        Seasonal patterns are also visible in the archive. Answers tend to cluster around themes relevant to the Canadian calendar, including winter sports terminology during the colder months, nature-related words during spring and summer, and holiday-themed solutions during the festive season. Recognizing these temporal patterns can give attentive players an edge when approaching their daily solve.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Canuckle Archive</h3>
      <p>
        The Canuckle archive on WordSolverX provides a complete, searchable history of every past solution. Use the calendar interface above to navigate to any date and view the answer that appeared on that day. The interactive solver component allows you to practice strategies against the known answer, experimenting with different opening words and guess sequences to find what works best for the Canadian-themed word pool.
      </p>
      <p>
        To get the most out of the archive, try maintaining a personal log of which answers gave you the most trouble and analyzing why. Were there unfamiliar letter patterns? Was the Canadian connection not immediately obvious? Did the word contain letters that appear less frequently in the Canuckle pool? This kind of targeted analysis, combined with regular archive review, is the fastest path to becoming a consistent Canuckle solver.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How is Canuckle different from regular Wordle?</h4>
      <p>
        While the gameplay mechanics are identical, Canuckle restricts its answers to words with Canadian connections. This creates a more focused and culturally themed puzzle experience that rewards knowledge of Canadian geography, history, slang, and bilingual vocabulary alongside standard word-guessing skills.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the Canuckle archive include bilingual answers?</h4>
      <p>
        Yes. The archive includes answers drawn from both English and French Canadian vocabulary, reflecting the country's bilingual heritage. Some solutions may be French words commonly used in Canadian English, while others are purely French terms that Canadian players would recognize.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I use the archive to improve my Canuckle streak?</h4>
      <p>
        Absolutely. Studying past answers helps you recognize patterns specific to the Canadian-themed word pool, develop better opening strategies, and build familiarity with the types of words the game tends to select. The solver tool on this page also lets you practice against any archived answer.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Are Canuckle answers the same for all players on a given day?</h4>
      <p>
        Yes. Like the original Wordle, Canuckle serves the same answer to all players on the same date. The archive reflects the universally shared solution for each day since the game launched.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How often is the Canuckle archive updated?</h4>
      <p>
        The archive is updated daily as new Canuckle puzzles are released. Each new answer is added automatically, ensuring the archive remains complete and current for all players.
      </p>
    </div>
  </div>
</article>

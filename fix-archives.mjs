import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ARCHIVE_REWRITES = {
  'canuckle-archive': {
    heading: 'Why the Canuckle Archive Matters',
    intro: `<p>Every Canuckle answer since the game launched. Browse by date, check your guesses, or just see how many Canadian words you actually know.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Canuckle Works</h3>
      <p>Same format as Wordle — six tries, five letters, color feedback. The difference is every answer ties back to Canada somehow. That could be a province name, a hockey term, a French-Canadian word, or slang you'd hear in Halifax but not in Houston. The answer pool is smaller than standard Wordle, roughly 2,300 words, so vowel-heavy openers tend to do well.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I use the archive to get better?</h4>
      <p>Yes — browsing past answers is the fastest way to learn what kinds of Canadian words show up. You'll start noticing which letters and themes repeat.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Do all players get the same word?</h4>
      <p>Yes, one word per day, same for everyone. The archive reflects that shared answer for each date.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Are French words included?</h4>
      <p>Sometimes. Canuckle pulls from both English and French Canadian vocabulary, so don't be surprised if a word comes from the French side of the bilingual pool.</p>`
  },

  'nerdle-archive': {
    heading: 'Why the Nerdle Archive Matters',
    intro: `<p>Every Nerdle equation across all modes, from Classic to Instant, since January 2022.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Nerdle Works</h3>
      <p>Each day, you guess a mathematical equation — digits, operators, and an equals sign. Green means right position, yellow means right element wrong spot, gray means it's not in the equation at all. Classic Nerdle has 8 cells. Mini has 6. The other modes change the grid shape or count.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the archive cover all modes?</h4>
      <p>Yes — Classic, Micro, Mini, Midi, Maxi, Mini Bi, Quad, Speed, and Instant. Each mode has its own column in the archive table.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I search by equation?</h4>
      <p>You can browse by date. If you remember roughly when a puzzle ran, scroll to that date and you'll find it.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Are equations reused across modes?</h4>
      <p>Each mode gets its own equation every day. They rarely repeat, but the underlying math patterns can feel similar over time.</p>`
  },

  'worldle-archive': {
    heading: 'Why the Worldle Archive Matters',
    intro: `<p>Every Worldle country since launch. Good for spotting which regions come up most often.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Worldle Works</h3>
      <p>You see a country silhouette and guess which country it is. After each guess, you get the distance away, the direction, and a percentage score. Six guesses to get it right. If you've been playing since launch, you've probably noticed that some continents show up way more than others.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How far back does the archive go?</h4>
      <p>Since Worldle launched in early 2022. Every country is stored with its date and puzzle number.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I practice old puzzles?</h4>
      <p>Use the archive to look up past answers. The solver on this page lets you test your geography skills against any country.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Which regions appear most often?</h4>
      <p>Browse the archive and you'll see patterns — Africa and Southeast Asia come up regularly, while tiny island nations are rarer.</p>`
  },

  'contexto-archive': {
    heading: 'Why the Contexto Archive Matters',
    intro: `<p>Every Contexto answer, searchable by date. Contexto ranks words by meaning rather than spelling, so past answers help you learn how the game thinks.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Contexto Works</h3>
      <p>You type any word and Contexto tells you how close it is to the secret word based on meaning, not spelling. A word ranked 1 is the answer. Anything in the top 50 is getting close. The game uses word embeddings — the same kind of math behind search engines — to figure out what's semantically related to what.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the archive show the ranking for each past answer?</h4>
      <p>The archive shows the answer and date. If you want to understand the similarity space, try entering old answers into today's puzzle to see how the model groups them.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Why do some answers feel random?</h4>
      <p>Contexto picks words based on how the model clusters meanings. Sometimes a word is semantically close to a big group of common words, even if it's not a word you'd guess. That's part of the challenge.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can studying old answers help?</h4>
      <p>Yes — you'll start to see what kinds of words the model considers similar. Abstract nouns and everyday verbs tend to cluster differently than proper nouns or rare words.</p>`
  },

  'semantle-archive': {
    heading: 'Why the Semantle Archive Matters',
    intro: `<p>Every Semantle secret word since launch. Useful for learning how semantic similarity scoring works — past answers show you what the model considers "close".</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Semantle Works</h3>
      <p>You guess words and Semantle tells you how semantically close each guess is on a 0-100 scale. The 1000th-closest word usually scores around 10-15. If you hit 30+, you're in the neighborhood. The jump from 70 to the answer can take 50+ guesses — that's where the real thinking kicks in.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How does Semantle differ from Contexto?</h4>
      <p>Both use word embeddings, but Semantle gives you a numeric similarity score (0-100) while Contexto gives you a rank position. Semantle also tends to be harder — fewer guesses, wider scoring gaps.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Is the archive useful for strategy?</h4>
      <p>Very. Looking at past answers helps you build intuition about which word families the model tends to pick as targets.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What score means I'm close?</h4>
      <p>Below 10: cold. 10-30: warming up. 30-50: you're in the right area. 50+: you're close, keep iterating. 100: you got it.</p>`
  },

  'quordle-archive': {
    heading: 'Why the Quordle Archive Matters',
    intro: `<p>Every daily Quordle quartet since January 2022.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Quordle Works</h3>
      <p>Four Wordle boards, nine guesses, all sharing the same guesses. Every word you type goes to all four boards at once. That's what makes it tricky — a guess that's perfect for board one might be useless for boards two through four. The best Quordle players think about all four boards before submitting each guess.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the archive include all four words per day?</h4>
      <p>Yes — all four answers for each day are stored together.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Which Quordle modes are archived?</h4>
      <p>Classic, Chill, Extreme, Sequence, Rescue, and Weekly. Each mode is tracked separately.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I use old puzzles to practice?</h4>
      <p>The archive shows the answers. You can test your strategy by replaying the letter combinations mentally, or use the solver tool on this page.</p>`
  },

  'wordle-answer-archive': {
    heading: 'Why the Wordle Archive Matters',
    intro: `<p>Every Wordle answer since the game started. Search by date or browse chronologically.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Wordle Works</h3>
      <p>Six guesses to find a five-letter word. Green means right letter right spot, yellow means right letter wrong spot, gray means it's not in the word. One puzzle per day, same word for everyone. The answer list is finite — Wordle has about 2,300 possible answers in the original pool.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How many Wordle answers are there?</h4>
      <p>About 2,309 in the original answer list. The game cycles through them in order, so once you know the pattern, you can predict future answers too.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Are Wordle answers the same worldwide?</h4>
      <p>Yes — one word per day, globally. The archive reflects the universal answer for each date.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can the archive help me get better?</h4>
      <p>Browsing past answers helps you see which letter patterns and word types come up most. Over time, you'll start opening with words that cover the most common letters in the pool.</p>`
  },

  'colorfle-archive': {
    heading: 'Why the Colorfle Archive Matters',
    intro: `<p>Every Colorfle puzzle since launch, with the three source colors and the target hex for each day.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Colorfle Works</h3>
      <p>You see a target color and guess which three colors mix to create it. The key is understanding additive (light) color mixing — red, green, and blue combine differently than paint colors do. If you're thinking in terms of red+yellow+blue, switch to RGB and you'll improve fast.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the archive show the hex codes?</h4>
      <p>Yes — each archived puzzle shows the target hex code and the three source colors that create it.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Is there a pattern to the colors?</h4>
      <p>Not really — the puzzles cover the full RGB spectrum. But browsing the archive teaches you how specific color combinations map to specific hex outputs.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Why do my paint-mixing instincts fail?</h4>
      <p>Colorfle uses additive (light) mixing where red+green=yellow, not subtractive (paint) mixing where red+green=brown. That mental switch is the single biggest improvement most players can make.</p>`
  },

  'countryle-archive': {
    heading: 'Why the Countryle Archive Matters',
    intro: `<p>Every Countryle country since launch, with population, area, and temperature data for each.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Countryle Works</h3>
      <p>You guess a country and get feedback on continent, hemisphere, population, area, temperature, and approximate coordinates. The strongest first filter is continent — it eliminates roughly 85% of countries in one guess. After that, population and area narrow it fast.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How far back does the archive go?</h4>
      <p>Since Countryle launched. Every country is stored with its date and game number.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the archive show the clue data?</h4>
      <p>Each entry shows the country name, date, and basic stats. Use the solver on this page to practice with the full clue system.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Which continents show up most?</h4>
      <p>Browse the archive and you'll see — Africa and Asia have the most countries, so they appear frequently. Small island nations are rarer.</p>`
  },

  'framed-archive': {
    heading: 'Why the Framed Archive Matters',
    intro: `<p>Every Framed movie since launch, across Classic, One Frame, Titleshot, and Poster modes.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Framed Works</h3>
      <p>You see a movie still and guess which film it's from. Get it wrong and you get another still from the same movie, progressively more recognizable. Six guesses total. The first frame is usually obscure — a background detail or a minor scene. Genre recognition beats specific film knowledge early on.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the archive include all modes?</h4>
      <p>Classic, One Frame, Titleshot, and Poster are all tracked separately in the archive.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How many movies are in the pool?</h4>
      <p>The pool is large enough that repeats are rare. The game pulls from a wide range of genres and decades.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I use the archive to watch the movies?</h4>
      <p>That's not the intended use, but plenty of players have added movies to their watchlist after a Framed puzzle stumped them.</p>`
  },

  'spotle-archive': {
    heading: 'Why the Spotle Archive Matters',
    intro: `<p>Every Spotle artist since launch, with genre, debut year, and country of origin.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Spotle Works</h3>
      <p>You guess a music artist and get feedback on genre, debut year, group size, gender, and nationality. The trick is narrowing genre and decade first, then using the specific attributes to zero in. A first guess from a genre you know well saves you more guesses than a random pick.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How far back does the archive go?</h4>
      <p>Since Spotle launched. Every artist is stored with date, genre, debut year, and country.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Are the artists all well-known?</h4>
      <p>Mix of mainstream and niche. Some days you'll get a household name, other days you'll discover someone new.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does genre help narrow it down fast?</h4>
      <p>Genre is the strongest first filter — it cuts the pool by 80% or more. Start there, then use debut year to narrow further.</p>`
  },

  'searchle-archive': {
    heading: 'Why the Searchle Archive Matters',
    intro: `<p>Every Searchle prompt and answer since launch. See what people are searching for.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Searchle Works</h3>
      <p>You see a Google autocomplete prompt and guess what people actually search for. The answers reflect real search trends — pop culture, current events, and evergreen questions dominate. There's no letter-matching or color feedback like Wordle. You either know what people search for or you don't.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Are the prompts based on real Google data?</h4>
      <p>Yes — the prompts and answers come from actual Google autocomplete predictions.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I search the archive by prompt?</h4>
      <p>You can browse by date. If you remember the rough timeframe, you'll find the prompt and answer for that day.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Why are some answers surprising?</h4>
      <p>Because what people actually search for and what you think they search for are often different things. That's the whole fun of the game.</p>`
  },

  'phrazle-archive': {
    heading: 'Why the Phrazle Archive Matters',
    intro: `<p>Every Phrazle phrase since launch — morning and afternoon, two per day.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Phrazle Works</h3>
      <p>You guess an entire phrase, not a single word. Common idioms, proverbs, song lyrics, and pop culture quotes dominate the answer pool. The letter feedback works like Wordle — green, yellow, gray — but you're solving across multiple words at once. Phrase length and word positions matter a lot more than individual letters.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Two puzzles a day?</h4>
      <p>Yes — a morning phrase and an afternoon phrase. Both are in the archive.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What kinds of phrases show up?</h4>
      <p>Idioms, proverbs, song titles, movie quotes, and common sayings. If it's a phrase people use regularly, it could be a Phoodle answer.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Is the archive useful for strategy?</h4>
      <p>Browsing past answers helps you build intuition about phrase structure and common word patterns in the answer pool.</p>`
  },

  'phoodle-archive': {
    heading: 'Why the Phoodle Archive Matters',
    intro: `<p>Every Phoodle answer since launch. All food words, all in one place.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Phoodle Works</h3>
      <p>Same mechanics as Wordle — six guesses, color feedback — but every answer is food-related. Cooking terms, ingredients, cuisines, kitchen tools, and dishes. The answer pool is narrower than Wordle, so food vocabulary pays off here more than general word-guessing skills.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How narrow is the answer pool?</h4>
      <p>Narrower than Wordle by a lot. Food terms, cooking verbs, and ingredient names make up most of the answers.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Do answers ever repeat?</h4>
      <p>Not within the main answer sequence. Each day's word is unique in the rotation.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What's the best opening word?</h4>
      <p>Something with common food letters. "BREAD" covers B, R, E, A, D — all frequent in cooking vocabulary. "SAUCE" and "FLOUR" are solid too.</p>`
  },

  'worgle-archive': {
    heading: 'Why the Worgle Archive Matters',
    intro: `<p>Every Worgle answer since launch. All Welsh words, all in one place.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Worgle Works</h3>
      <p>It's Wordle in Welsh. Six guesses, five letters, same color feedback. But Welsh has a different alphabet and letter frequency — W, Y, and DD are very common. English letter patterns will mislead you here. If you don't speak Welsh, the archive is your best teacher for what kinds of words show up.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Do I need to speak Welsh?</h4>
      <p>It helps, but plenty of non-Welsh speakers enjoy it. The archive teaches you which letter combinations are valid Welsh words over time.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Which letters should I prioritize?</h4>
      <p>W, Y, DD, LL, CH, and RH are all common in Welsh. Start with words that include these to cover the most ground.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the archive go back to launch?</h4>
      <p>Yes — every Worgle answer since the game started is stored here.</p>`
  },

  'globle-archive': {
    heading: 'Why the Globle Archive Matters',
    intro: `<p>Every Globle country since launch. Practice your geography with past answers.</p>`,
    body: `<h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Globle Works</h3>
      <p>You guess a country and see how close it is on a heat map. Closer guesses turn warmer (red/orange), farther guesses stay cooler (blue/green). No word puzzles here — it's pure geography. Start with a central country on each continent to triangulate the region fast.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How far back does the archive go?</h4>
      <p>Since Globle launched. Every country is stored with its date.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does Globle use distance or direction?</h4>
      <p>Distance only, shown as a color gradient. Unlike Worldle, there's no directional arrow — you have to read the heat map.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Which countries come up most?</h4>
      <p>Browse the archive to see. Larger countries and well-known nations appear more often than tiny island states.</p>`
  }
};

const routesBase = join(process.cwd(), 'wordsolverx-z-ai', 'src', 'routes', '(interactive)');

for (const [dirName, content] of Object.entries(ARCHIVE_REWRITES)) {
  const filePath = join(routesBase, dirName, '+page.svelte');
  
  try {
    let fileContent = readFileSync(filePath, 'utf-8');
    
    // Find the article section and replace it
    const articleStart = fileContent.indexOf('<!-- SEO Article Section -->');
    if (articleStart === -1) {
      console.log(`SKIP: ${dirName} - no SEO article section found`);
      continue;
    }
    
    const beforeArticle = fileContent.substring(0, articleStart);
    
    const newArticle = `<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
  <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">${content.heading}</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      ${content.intro}
      ${content.body}
    </div>
  </div>
</article>`;
    
    const newFileContent = beforeArticle + newArticle;
    writeFileSync(filePath, newFileContent, 'utf-8');
    console.log(`FIXED: ${dirName}`);
  } catch (err) {
    console.log(`ERROR: ${dirName} - ${err.message}`);
  }
}

console.log('\nDone fixing archive pages.');
import type { SolverGameKey } from './types';

export const gameDisplayNames: Record<SolverGameKey, string> = {
  loldle: 'Loldle',
  dotadle: 'Dotadle',
  pokedle: 'Pokedle',
  smashdle: 'Smashdle',
  narutodle: 'Narutodle',
  onepiecedle: 'Onepiecedle',
};

export interface GameSEOContent {
  title: string;
  description: string;
  introduction: string[];
  howToPlay: { step: string; description: string }[];
  tips: string[];
  faqs: { question: string; answer: string }[];
  strategies: string[];
  relatedGames: string[];
}

export const gameSolverSeoContent: Record<SolverGameKey, GameSEOContent> = {
  loldle: {
    title: "Loldle Solver - Find Today's League of Legends Champion Answer",
    description: "Use our free Loldle solver to find today's League of Legends champion. Filter by gender, position, species, region, and more. Updated daily with all 170+ champions.",
    introduction: [
      "Loldle has taken the League of Legends community by storm, offering a daily puzzle that tests your knowledge of Runeterra's vast roster of champions. Whether you're a seasoned veteran who's been playing since Season 1 or a newer player just getting familiar with the roster, Loldle offers a fun daily challenge that keeps you coming back. The premise is simple yet addictive: guess the mystery champion of the day using clues about their attributes.",
      "What makes Loldle particularly engaging is how it mirrors the Wordle formula that captivated millions, but adds layers of complexity suited to League's deep lore and mechanics. Each guess reveals information about how close you are, with color-coded feedback showing matches, partial matches, and incorrect attributes. But with over 160 champions and multiple attributes to consider, finding the answer can sometimes feel overwhelming.",
      "That's where our Loldle solver comes in. This tool is designed to help streamline your guessing process without simply giving away the answer. Think of it as a strategic assistant that helps you eliminate impossibilities and zero in on the correct champion faster. Whether you're stuck after a few guesses or just want to optimize your solving strategy, this solver provides the edge you need."
    ],
    howToPlay: [
      { step: "Step 1: Make Your First Guess", description: "Start by typing any champion name into Loldle. Don't overthink this first guess - the goal is simply to gather information. Many players like starting with popular champions like Ahri, Yasuo, or Jinx since they cover common attributes that might match." },
      { step: "Step 2: Read the Feedback Carefully", description: "After each guess, Loldle shows you how each attribute compares to the mystery champion. Green means exact match, yellow (or orange) indicates partial match, and red means no match. For numerical values like release year, arrows indicate whether the answer is higher or lower." },
      { step: "Step 3: Enter Your Guess in the Solver", description: "Type your guessed champion name in our solver and select it. Then tap each attribute button to match the feedback colors from Loldle. This tells our solver what you learned from that guess." },
      { step: "Step 4: Watch Candidates Narrow Down", description: "As you add more guesses with accurate feedback, our solver automatically filters the champion pool to only show possibilities that match all your criteria. The list shrinks with each accurate guess!" },
      { step: "Step 5: Find the Answer", description: "When only a few candidates remain, pick one that seems likely and test it in Loldle. The suggested guess feature can help you choose strategically if you're unsure which remaining candidate to try." }
    ],
    tips: [
      "Start with champions that have unique attribute combinations - champions like Aurelion Sol (unique species) or Bard (unique region) can quickly narrow possibilities if they match.",
      "Pay attention to multi-value attributes like positions and regions - a yellow result here means the answer shares at least one value, which is valuable information.",
      "Use release year strategically - it's one of the few numerical clues. Even if you get a 'higher' or 'lower' arrow, you've eliminated a huge portion of the roster.",
      "For gender clues, remember that female champions are fewer than male champions in LoL, making this attribute particularly useful when you get a match.",
      "Don't ignore the species attribute - League has some truly unique species like Darkin, Void, and Celestial that immediately narrow down possibilities."
    ],
    faqs: [
      { question: "What time does Loldle reset?", answer: "Loldle resets at midnight UTC (00:00 UTC) every day. This means everyone worldwide gets the same champion to guess each day, and a new champion becomes available at the same time globally. Players in different time zones will experience the reset at different local times - for example, it's 7 PM EST or 4 PM PST when the new daily challenge appears." },
      { question: "How many champions are in Loldle?", answer: "Loldle currently includes all playable champions from League of Legends, which is over 170 champions as of 2024. This includes the newest champion releases, with the game typically being updated within days of a new champion going live on the live servers. Our solver database is updated to include the latest champions." },
      { question: "Can I play Loldle unlimited?", answer: "Yes! Loldle offers an unlimited mode where you can practice with random champions without the daily limit. This is perfect for improving your skills and learning the roster better. Our solver works equally well for both the daily challenge and unlimited mode." },
      { question: "What do the different colors mean in Loldle?", answer: "Green means the attribute matches exactly - for example, if Gender shows green, your guess has the same gender as the answer. Yellow (or amber) indicates a partial match, typically used for multi-value attributes where the answer shares at least one value with your guess. Red means no match at all. For numerical values, arrows show if the answer is higher or lower." },
      { question: "Is using a Loldle solver cheating?", answer: "Not at all! Think of our solver as a note-taking tool that helps you organize information. You still need to understand the game's feedback and make strategic guesses. Many players use similar elimination strategies mentally - our tool just makes it easier to track. It's especially helpful for learning the roster and understanding champion attributes." },
      { question: "Why is my guess not showing up?", answer: "Make sure you're typing the champion name correctly. Some champions have specific names - for example, 'Lee Sin' not just 'Lee', and 'Dr. Mundo' or 'Mundo' both work. Our solver's search function will suggest matches as you type, making it easy to find the right champion." }
    ],
    strategies: [
      "The Binary Search Strategy: For numerical attributes like release year, use champions from different eras to quickly narrow the range. If you guess a 2015 champion and get 'higher', then guess a 2020 champion, you've eliminated everything before 2015 and can triangulate from there.",
      "The Unique Attribute Strategy: Start with champions that have rare or unique attributes. For example, if you suspect the answer might be from a specific region, guess a champion unique to that region. Ionia has many champions, but Bandle City has very few.",
      "The Position Elimination Strategy: Since most champions have 1-2 positions, a single green position match dramatically reduces possibilities. Start with less common positions like Support to quickly narrow the pool.",
      "The Species/Lore Strategy: League's lore has created unique species categories. Guessing a champion with a rare species (like Rek'Sai for Void, or Kayle for Celestial) can give quick answers if matched."
    ],
    relatedGames: ["Dotadle", "Pokedle", "Smashdle", "Narutodle", "Onepiecedle"]
  },
  dotadle: {
    title: "Dotadle Solver - Find Today's Dota 2 Hero Answer",
    description: "Solve today's Dotadle puzzle with our free hero solver. Filter Dota 2 heroes by attribute, lane, complexity, and more. Includes all 126+ heroes with accurate data.",
    introduction: [
      "Dotadle brings the wildly popular Wordle-style guessing format to Dota 2, challenging players to identify the mystery hero of the day using attribute-based clues. With over 120 heroes spanning nearly two decades of Dota history, this daily puzzle tests both your game knowledge and deductive reasoning skills in equal measure.",
      "What sets Dotadle apart from similar games is the complexity of Dota's hero design. Each hero has unique combinations of primary attribute, lane positions, attack type, complexity rating, and species. The depth of Dota's lore means even veteran players can find themselves stumped when trying to recall whether a particular hero is Strength or Universal, or which exact lanes they can be played in.",
      "Our Dotadle solver is specifically designed to handle this complexity. Rather than trying to mentally track which heroes match all your clues - an increasingly difficult task as you gather more information - our tool automatically filters the hero pool based on your feedback, letting you focus on strategy rather than memory."
    ],
    howToPlay: [
      { step: "Step 1: Choose an Opening Hero", description: "Your first guess in Dotadle sets the foundation for everything else. Pick a hero you know well and whose attributes you're confident about. Popular choices include heroes with distinctive attributes like Pudge ( universally recognized) or heroes that cover common attribute values." },
      { step: "Step 2: Analyze the Color Feedback", description: "Dotadle uses the familiar color system: green for exact matches, partial colors for close-but-not-exact matches, and red for no match. For numerical values like release year, pay attention to arrows indicating higher or lower." },
      { step: "Step 3: Log Your Guess in the Solver", description: "Enter your guessed hero in our solver and set the feedback colors for each attribute. This only takes a few seconds and immediately helps narrow down possibilities." },
      { step: "Step 4: Continue Guessing Strategically", description: "Each subsequent guess should target information you don't yet have. If you know the primary attribute but not the lane, pick a hero with that attribute in various lanes to narrow down positions." },
      { step: "Step 5: Close In on the Answer", description: "When your candidate list shrinks to 5-10 heroes, you're in the endgame. Pick heroes that would definitively confirm or eliminate remaining possibilities, or use our suggested guess feature." }
    ],
    tips: [
      "Primary Attribute is your best friend - with only four possible values (Strength, Agility, Intelligence, Universal), getting a green match here eliminates 75% of heroes immediately.",
      "Lane assignments in Dota are more flexible than positions in other games - many heroes can play multiple lanes. A yellow lane result means the answer shares at least one lane with your guess.",
      "Complexity ratings (Easy, Medium, Hard) are often overlooked but can quickly filter the pool. If you get a complexity match, you've eliminated two-thirds of heroes.",
      "Release year clues are powerful but tricky - use heroes from different eras of Dota to triangulate the answer. A hero from 2006 and one from 2020 can help you bracket the timeline.",
      "Species attributes can include surprising categories - Dota's lore encompasses humans, undead, demons, elementals, and more. Even a 'no match' on species eliminates a chunk of possibilities."
    ],
    faqs: [
      { question: "What time does Dotadle reset daily?", answer: "Dotadle resets at midnight UTC (00:00 UTC) each day, providing a new mystery hero for all players worldwide. This synchronized timing means everyone competes against the same hero regardless of their location. For players in North America, this typically means the new puzzle appears in the late afternoon or evening." },
      { question: "How many Dota 2 heroes are in Dotadle?", answer: "Dotadle includes all playable heroes from Dota 2, which currently stands at over 120 unique heroes. The game is updated to include new heroes shortly after their official release in Dota 2. Our solver database is maintained to include the latest additions." },
      { question: "What's the difference between Dotadle Classic and other modes?", answer: "Dotadle Classic is the main daily guessing game where you identify a hero through attributes. Other modes may include guessing from ability icons, quotes, or visual clues. Our solver is optimized for Classic mode but the hero database applies to all modes." },
      { question: "Why do some heroes show multiple lanes?", answer: "Dota 2 heroes are flexible and many can be played in multiple positions. A hero like Spirit Breaker might be listed for Offlane, Support, and Roamer. When you see a partial match on lanes, it means the mystery hero shares at least one lane position with your guess." },
      { question: "How accurate is the complexity rating?", answer: "The complexity ratings (Easy, Medium, Hard) in Dotadle come from Valve's official hero classifications, designed to help new players understand which heroes are more straightforward to play. These are the same ratings shown in the Dota 2 client." },
      { question: "Can I use this solver for unlimited Dotadle?", answer: "Absolutely! The solver works for both the daily challenge and unlimited practice modes. In unlimited mode, you can use the solver repeatedly to learn the hero pool and improve your guessing strategy for the daily challenge." }
    ],
    strategies: [
      "The Attribute Anchor Strategy: Start with heroes of each primary attribute to quickly determine if the answer is Strength, Agility, Intelligence, or Universal. A single green match here is incredibly valuable.",
      "The Era Bracketing Strategy: Use heroes from different periods of Dota history. Guessing Phantom Assassin (early Dota) and then Primal Beast (recent) can quickly establish whether the answer is a classic or modern hero.",
      "The Lane Cover Strategy: Pick heroes known for specific lanes. If you've confirmed Offlane but need to narrow further, try heroes that ONLY play Offlane versus those that are flexible.",
      "The Species Deduction Strategy: Dota's diverse cast includes humans, demons, constructs, and more. Getting species information early can help, especially since some categories are very small (like Celestial or Fundamental)."
    ],
    relatedGames: ["Loldle", "Pokedle", "Smashdle", "Narutodle", "Onepiecedle"]
  },
  pokedle: {
    title: "Pokedle Solver - Find Today's Pokemon Answer Fast",
    description: "Free Pokedle solver to find today's mystery Pokemon. Filter by type, habitat, color, evolution stage, height, and weight. All 151 original Pokemon included.",
    introduction: [
      "Pokedle brings the beloved Wordle formula to the Pokemon universe, tasking players with identifying a mystery Pokemon each day. While the concept seems simple - guess a Pokemon, see what matches - the depth of Pokemon data makes this a genuinely challenging puzzle that rewards deep franchise knowledge.",
      "What makes Pokedle special is how it leverages decades of Pokemon data. From the original 151 to modern generations, each Pokemon has a unique combination of types, habitat preferences, color classification, physical dimensions, and evolution stage. For longtime fans, these attributes are second nature; for newer players, they offer an educational journey through Pokemon history.",
      "Our Pokedle solver transforms this challenge from a memory test into a strategic exercise. Rather than frantically trying to recall whether Squirtle's weight is more or less than the mystery Pokemon, you can systematically eliminate possibilities and focus your mental energy on making educated guesses."
    ],
    howToPlay: [
      { step: "Step 1: Pick a Starting Pokemon", description: "Choose a Pokemon you know well for your first guess. Many players start with starters (like Charizard or Blastoise) or favorites because they know these attributes by heart. The goal is gathering information, not getting lucky." },
      { step: "Step 2: Decode the Feedback", description: "Pokedle shows matches in colors: green for exact type match, partial colors for close attributes, and red for no match. For numbers like height and weight, arrows tell you if the answer is higher or lower than your guess." },
      { step: "Step 3: Input to the Solver", description: "Type your guessed Pokemon in our solver and set each attribute's feedback color. This captures what you learned and immediately starts filtering the possibilities." },
      { step: "Step 4: Make Informed Follow-up Guesses", description: "Each new guess should test specific information. If you know one type but not the other, pick a Pokemon with that type and various second types. Use the remaining candidate list to guide your choices." },
      { step: "Step 5: Solve the Puzzle", description: "When candidates drop below 10, you're close! Pick from the remaining possibilities or use our suggestion feature. With good strategy, most Pokedle puzzles can be solved in 4-6 guesses." }
    ],
    tips: [
      "Type combinations are your most powerful clue - there are only 18 types, and dual types create recognizable patterns. A green Type 1 match plus knowing Type 2 possibilities dramatically narrows options.",
      "Evolution Stage is underutilized - this single attribute divides Pokemon into three clear categories. A match here eliminates 2/3 of the pool instantly.",
      "Habitat information can be decisive - Pokemon habitats are fairly specific, and some habitats have very few Pokemon. A green habitat match might leave you with 10 or fewer candidates.",
      "Use weight and height strategically - these numerical clues often get ignored, but they're fantastic for triangulation. If you know the answer is heavier than Pikachu but lighter than Snorlax, you've bracketed a range.",
      "Color seems cosmetic but matters - Pokemon are officially classified by color, and this can help distinguish between similar species. Charizard is red/orange, Blastoise is blue, etc."
    ],
    faqs: [
      { question: "Which Pokemon generation does Pokedle use?", answer: "Pokedle focuses on the original 151 Pokemon from Generation 1 (Kanto region). This includes classics like Pikachu, Charizard, Mewtwo, and all the starters. This limitation actually makes the game more strategic since the smaller pool means every clue is more valuable." },
      { question: "When does Pokedle reset with a new Pokemon?", answer: "Pokedle typically resets at midnight UTC (00:00 UTC) daily. Every player worldwide gets the same mystery Pokemon to identify each day. The synchronized timing creates a shared experience - you can compare strategies and guess counts with friends who played the same day." },
      { question: "What does 'None' mean for Type 2?", answer: "Many Pokemon only have one type - they're not dual-typed. When you see 'None' for Type 2, it means the Pokemon doesn't have a second type at all. This is actually useful information, as it immediately rules out all dual-typed Pokemon." },
      { question: "How are Pokemon colors determined?", answer: "Pokemon colors come from official Pokedex classifications, not visual appearance. For example, Bulbasaur is classified as 'Green' despite appearing blue-ish. These official categories are consistent across all Pokemon media and games." },
      { question: "Can I play Pokedle more than once a day?", answer: "The daily challenge is limited to one mystery Pokemon per day, but many Pokedle sites offer unlimited practice modes. Our solver works for both daily and unlimited modes, making it a great practice tool." },
      { question: "Why isn't my Pokemon showing up in search?", answer: "Make sure you're spelling the Pokemon name correctly. Some Pokemon have names that are easy to misspell, like 'Pikachu' or 'Charizard.' Our solver suggests matches as you type, so you can click the correct name from the list." }
    ],
    strategies: [
      "The Type Coverage Strategy: Start with Pokemon that have unique or rare type combinations. A single green type match can immediately narrow to 20-30 Pokemon, and getting both types is even more powerful.",
      "The Evolution Ladder Strategy: Since evolution stages are only 1, 2, or 3, this attribute gives clean information. Start with a middle-stage Pokemon (Stage 2) to get arrows pointing toward basic or fully evolved.",
      "The Habitat Hunter Strategy: Some habitats are very specific - for example, 'Rare' habitat contains few Pokemon. If your guess shows a partial habitat match, target that habitat specifically next.",
      "The Dimension Bracketing Strategy: Use extreme Pokemon for height and weight. Guessing Onix (very tall/heavy) and then comparing with a small Pokemon like Pikachu can quickly establish the answer's size range."
    ],
    relatedGames: ["Loldle", "Dotadle", "Smashdle", "Narutodle", "Onepiecedle"]
  },
  smashdle: {
    title: "Smashdle Solver - Solve Super Smash Bros Character Puzzles",
    description: "Find today's Smashdle answer with our free character solver. Filter Super Smash Bros Ultimate fighters by universe, games, weight, jumps, species, and more.",
    introduction: [
      "Smashdle challenges Super Smash Bros fans to identify the mystery fighter each day, testing knowledge of Nintendo's massive crossover fighting game. With over 80 fighters spanning gaming history from Mario to Steve from Minecraft, the daily puzzle celebrates the incredible diversity of the Smash Bros roster.",
      "What makes Smashdle particularly fascinating is how it reflects Nintendo's eclectic approach to fighter selection. Each character brings not just their game universe but a wealth of metadata: which Smash games they appeared in, their weight class, how many jumps they have, their platform of origin, and even their species. This creates a puzzle that rewards both Smash expertise and general gaming knowledge.",
      "Our Smashdle solver handles all these attributes seamlessly. Whether you're trying to remember which fighters have 3 jumps or deducing a character from their universe, the solver filters possibilities automatically so you can focus on the fun part: solving the puzzle."
    ],
    howToPlay: [
      { step: "Step 1: Choose Your Opening Fighter", description: "Start with a fighter you know well - most people pick main characters like Mario, Link, or Pikachu. What matters is that you're confident about their attributes, since accurate feedback is crucial for the solver to work." },
      { step: "Step 2: Interpret Smashdle's Clues", description: "Green means exact attribute match. For some attributes like Games, you might see partial matches (the answer appeared in some but not all the same Smash games). Red means no match. Numbers like weight show arrows for higher/lower." },
      { step: "Step 3: Feed Information to the Solver", description: "Select your guessed character in our solver and tap each attribute to match Smashdle's feedback. The solver immediately filters the fighter pool based on your input." },
      { step: "Step 4: Target Unknown Information", description: "Use subsequent guesses strategically. If you know the universe but not the weight, try characters from that universe with different weights. Let the remaining candidate list guide your choices." },
      { step: "Step 5: Identify the Answer", description: "When the candidate pool shrinks to a handful of fighters, pick one that tests remaining unknowns or seems most likely based on your analysis. Our suggestion feature can help if you're unsure." }
    ],
    tips: [
      "Universe is your strongest attribute - there are many universes but only a few fighters per universe. A green universe match might leave you with 5-10 possibilities, sometimes even fewer for smaller franchises.",
      "Weight classes in Smash affect gameplay significantly, so players often know these well. Heavyweights (100+), middleweights, and lightweights each cover about a third of the roster.",
      "Jump count is underutilized - most fighters have 2 jumps, but several have 3, 4, or more. Getting a match here immediately points to characters like Kirby, Jigglypuff, or Pit.",
      "Games appeared in reveals Smash history - fighters added in later games won't show 'SSB 64' or 'Melee.' This can help distinguish veterans from newcomers.",
      "Species sounds odd but is surprisingly useful - humans, animals, robots, and fantasy creatures all have multiple fighters. A 'not human' result eliminates a large chunk of the roster."
    ],
    faqs: [
      { question: "How many characters are in Smashdle?", answer: "Smashdle includes all fighters from Super Smash Bros Ultimate, which totals over 80 unique fighters including DLC characters. This covers the entire roster from Mario to the latest additions, giving you the complete Smash Bros experience in puzzle form." },
      { question: "What time does Smashdle update?", answer: "Smashdle typically resets at midnight UTC (00:00 UTC) daily, giving everyone worldwide the same mystery fighter to identify. The global sync means you can compare scores and strategies with players anywhere in the world." },
      { question: "What do the game abbreviations mean?", answer: "SSB 64 is the original Nintendo 64 game, Melee is GameCube, Brawl is Wii, '3DS/Wii U' covers both versions, and Ultimate is Switch. Fighters added in Ultimate won't show earlier games in their history." },
      { question: "How is fighter weight determined?", answer: "Weight values in Smashdle come from Smash Ultimate's internal weight numbers, which affect how easily fighters are knocked back. Heavier fighters survive longer but are slower, while light fighters are agile but fragile. These range from about 60 (Pichu) to over 130 (Bowser)." },
      { question: "Why do some fighters show 'Downloadable' for availability?", answer: "Some fighters in Smash Ultimate were released as DLC (downloadable content) after the base game launch. Characters like Joker, Hero, Banjo & Kazooie, and Steve were added post-release and are marked as downloadable to distinguish them from base roster fighters." },
      { question: "Can I use this solver for Smashdle practice modes?", answer: "Yes! The solver works for both daily challenges and any practice or unlimited modes Smashdle offers. It's a great way to learn the roster and improve your guessing strategy for the main daily puzzle." }
    ],
    strategies: [
      "The Universe First Strategy: Since universes contain few fighters each, start with a character from a smaller franchise. Getting a universe match might immediately narrow to 3-4 possibilities.",
      "The Weight Bracket Strategy: Use fighters from different weight classes to bracket the answer. If a medium-weight character shows 'lighter,' you know to focus on light fighters.",
      "The Jump Count Strategy: Few fighters have unusual jump counts. Guessing a 3-jump character like Kirby can quickly tell you if you're dealing with a special mobility fighter.",
      "The Veteran Status Strategy: Use original 12 fighters (like Mario, Link, Pikachu) and newer additions (like Min Min, Sora) to bracket by Smash appearance history."
    ],
    relatedGames: ["Loldle", "Dotadle", "Pokedle", "Narutodle", "Onepiecedle"]
  },
  narutodle: {
    title: "Narutodle Solver - Find Today's Naruto Character Answer",
    description: "Solve today's Narutodle puzzle with our free character solver. Filter Naruto and Naruto Shippuden characters by village, rank, age, jutsu type, and more.",
    introduction: [
      "Narutodle brings the daily guessing format to the ninja world, challenging fans to identify characters from Naruto and Naruto Shippuden. With over 100 characters spanning the Hidden Villages, Akatsuki, and beyond, this puzzle tests your knowledge of one of anime's most beloved series.",
      "What makes Narutodle particularly engaging is how it leverages Naruto's rich lore. Characters are defined by their village affiliations, ninja ranks, chakra natures, kekkei genkai, and even their debut chapters in the manga. For dedicated fans, these attributes tell stories - they remember when characters first appeared, their signature jutsu, and their roles in the ninja world.",
      "Our Narutodle solver transforms the experience from a memory challenge into strategic deduction. Instead of mentally scrolling through every character trying to remember if they're from Konoha or Suna, you can systematically eliminate possibilities and focus on making informed guesses."
    ],
    howToPlay: [
      { step: "Step 1: Start with a Main Character", description: "Begin with a character you know thoroughly - Naruto himself, Sasuke, Kakashi, or another prominent figure. You want accurate attribute knowledge for your first guess to maximize information gained." },
      { step: "Step 2: Read the Ninja Clues", description: "Narutodle's feedback uses colors: green for exact matches, partial for shared attributes, red for no match. For numbers like age or debut chapter, arrows indicate higher or lower than your guess." },
      { step: "Step 3: Log in the Solver", description: "Enter your guessed character and set each attribute's feedback color. The solver tracks all your information and automatically filters remaining candidates." },
      { step: "Step 4: Target Unknowns", description: "Use follow-up guesses to fill information gaps. If you know the village but not the rank, try characters from that village with different ranks. Let the candidate list guide you." },
      { step: "Step 5: Identify the Ninja", description: "When possibilities drop to a manageable number, pick strategically to confirm or eliminate. The suggested guess feature can help when you're down to just a few candidates." }
    ],
    tips: [
      "Affiliation (Village) is crucial - the five great nations each have multiple characters, but smaller villages and groups have few. A green affiliation match to a smaller village might solve the puzzle almost immediately.",
      "Ninja Rank divides characters cleanly - Genin, Chunin, Jonin, Kage, and special ranks like Anbu or Missing-nin create clear categories. A rank match eliminates large portions of the roster.",
      "Age seems random but follows patterns - most characters are teenagers or young adults. Getting an age direction can help separate the young ninja from their senseis and elders.",
      "Debut chapter is powerful for manga readers - early chapters feature Konoha 11 and their families, while later chapters introduce Akatsuki, war characters, and new generations.",
      "Nature Types show chakra mastery - many characters have multiple chakra natures. A partial match means sharing at least one nature type, which narrows possibilities significantly."
    ],
    faqs: [
      { question: "Does Narutodle include Boruto characters?", answer: "Narutodle primarily focuses on characters from Naruto and Naruto Shippuden, the original series. While some characters who appear in both (like adult Naruto or Sasuke) are included, the main focus is on the original series' extensive cast of ninjas." },
      { question: "What time does Narutodle reset?", answer: "Narutodle resets at midnight UTC (00:00 UTC) daily, providing a new mystery ninja for all players worldwide. This synchronized timing creates a shared experience where everyone solves the same character each day." },
      { question: "How many characters are in Narutodle?", answer: "Narutodle features over 100 characters from the Naruto universe, including protagonists, antagonists, and supporting characters. This covers major figures like Team 7, the Akatsuki, Kage from various villages, and memorable supporting characters." },
      { question: "What do the ninja ranks mean?", answer: "Genin are entry-level ninja, Chunin are mid-level, Jonin are elite, Kage are village leaders. Special ranks include Anbu (elite black ops), Missing-nin (rogue ninja), and Sannin (legendary ninja). These ranks reflect both skill and role in the series." },
      { question: "How are debut chapters determined?", answer: "Debut chapter refers to the first manga chapter where a character appears. Early chapters (1-50) feature main cast introductions, while later chapters (300+) often introduce antagonists and new characters from the Shippuden era." },
      { question: "What is a kekkei genkai?", answer: "Kekkai genkai are inherited abilities unique to specific clans, like the Sharingan (Uchiha), Byakugan (Hyuga), or Ice Release (Haku's clan). In Narutodle, this attribute shows whether a character has a special bloodline trait." }
    ],
    strategies: [
      "The Village Filter Strategy: Start with Konoha characters since they're most common. If affiliation doesn't match, try Akatsuki or other villages. This progressive elimination works well for narrowing down.",
      "The Rank Hierarchy Strategy: Guess characters of different ranks to bracket the answer. A Kage character and a Genin can quickly tell you where on the power ladder the answer sits.",
      "The Timeline Strategy: Use early-series characters (Team 7) and late-series characters (War arc) to bracket by debut. This helps identify whether you're looking for a classic or later-introduced character.",
      "The Nature Type Strategy: Fire, Wind, Lightning, Earth, and Water types have multiple users each. Getting nature matches can help confirm if you're on the right track with village guesses."
    ],
    relatedGames: ["Loldle", "Dotadle", "Pokedle", "Smashdle", "Onepiecedle"]
  },
  onepiecedle: {
    title: "Onepiecedle Solver - Find Today's One Piece Character",
    description: "Free Onepiecedle solver to find today's mystery character. Filter One Piece characters by crew, bounty, devil fruit, haki, origin sea, and more.",
    introduction: [
      "Onepiecedle invites One Piece fans into a daily guessing challenge featuring characters from Eiichiro Oda's legendary manga. With a cast spanning over two decades of storytelling, from the East Blue to the New World, identifying the mystery character tests both casual viewers and hardcore fans alike.",
      "What makes Onepiecedle unique is the sheer depth of One Piece lore. Characters are defined by their crews and affiliations, their bounties (in the millions and billions of berries), their devil fruit powers, their mastery of haki, and even their heights and blood types. This is a puzzle that rewards encyclopedic knowledge of the Grand Line.",
      "Our Onepiecedle solver transforms this challenge into manageable deduction. Rather than trying to remember which characters have bounties between 300 million and 500 million berries, you can systematically eliminate possibilities and watch the candidate pool shrink with each accurate guess."
    ],
    howToPlay: [
      { step: "Step 1: Start with a Straw Hat", description: "Begin with a character you know intimately - Luffy, Zoro, Nami, or other Straw Hats are popular choices. Their bounties, abilities, and backstories are well-documented, making for reliable first guesses." },
      { step: "Step 2: Interpret Pirate Clues", description: "Onepiecedle uses color feedback: green for exact matches, partial for close attributes, red for no match. Bounties and heights show arrows indicating higher or lower values." },
      { step: "Step 3: Input to the Solver", description: "Select your guessed character and tap each attribute to match Onepiecedle's feedback. The solver immediately filters the character pool based on your information." },
      { step: "Step 4: Strategic Follow-ups", description: "Target unknowns with subsequent guesses. If you know the crew but not the devil fruit, try crew members with different powers. Let the candidate list guide your choices." },
      { step: "Step 5: Find the Pirate", description: "When candidates narrow to single digits, pick strategically to confirm your final answer. The suggestion feature can help when you're torn between remaining possibilities." }
    ],
    tips: [
      "Affiliation (Crew) is your strongest starting point - the Straw Hats have many members, but smaller crews have very few. A green crew match to a minor crew might solve the puzzle immediately.",
      "Bounty values are surprisingly useful - they correlate with character importance. If you get a 'higher' arrow after guessing a 100 million character, you're likely dealing with a major player.",
      "Devil Fruit types (Paramecia, Zoan, Logia) create clear categories. A 'None' result for fruit type eliminates all devil fruit users, which is valuable information.",
      "Haki mastery separates the elite - Conqueror's Haki users are rare, so this attribute quickly narrows possibilities if you get a match or non-match.",
      "Origin sea follows the story progression - East Blue characters came first, then Grand Line, then New World. Debut chapter clues work similarly for manga readers."
    ],
    faqs: [
      { question: "How many characters are in Onepiecedle?", answer: "Onepiecedle features over 120 characters from the One Piece universe, including Straw Hat crew members, major antagonists, Warlords, Emperors and their crews, and significant supporting characters. The roster spans the entire story from East Blue to the latest arcs." },
      { question: "When does Onepiecedle reset?", answer: "Onepiecedle resets at midnight UTC (00:00 UTC) daily, giving all players worldwide the same mystery character to identify. This global synchronization creates a shared daily puzzle experience." },
      { question: "What do the devil fruit types mean?", answer: "Paramecia fruits grant special abilities (like Luffy's rubber body), Zoan fruits allow transformation into animals or mythical creatures (like Chopper's human-beast forms), and Logia fruits give elemental powers (like Ace's fire). 'None' means the character doesn't have a devil fruit." },
      { question: "How are bounty values determined?", answer: "Bounties come directly from the One Piece story, representing the World Government's assessment of a character's threat level. These range from thousands (early villains) to billions (Emperors like Luffy and Kid)." },
      { question: "What haki types are tracked?", answer: "Onepiecedle tracks the three main haki types: Observation (sensing), Armament (offensive/defensive), and Conqueror's (rare, leadership-based). Many characters have multiple types, so partial matches are common." },
      { question: "Does Onepiecedle include anime-only characters?", answer: "Onepiecedle primarily focuses on manga canon characters, as these have the most consistent and documented attributes. Characters introduced in filler arcs or movies are generally not included." }
    ],
    strategies: [
      "The Crew Size Strategy: Start with major crews (Straw Hats, Marines, Emperors' crews) to test affiliation. A no-match eliminates many characters; a partial match guides your next guess.",
      "The Bounty Bracketing Strategy: Use characters with known bounties to triangulate. Luffy (3 billion) and a mid-tier character (100 million) can bracket the answer's threat level.",
      "The Devil Fruit Binary Strategy: First determine if the character has a fruit at all. Then use type (Paramecia/Zoan/Logia) to narrow further. Logia users are especially rare.",
      "The Haki Elite Strategy: Conqueror's Haki users are very few. Guessing one (like Luffy, Zoro, or Shanks) and getting a 'no match' eliminates the most powerful characters early."
    ],
    relatedGames: ["Loldle", "Dotadle", "Pokedle", "Smashdle", "Narutodle"]
  }
};



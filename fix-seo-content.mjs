import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'wordsolverx-z-ai', 'src', 'lib', 'game-dle', 'seo-content.ts');

try {
  let content = readFileSync(filePath, 'utf-8');
  let changes = 0;

  // C-3A: Vary How to Play steps per game
  const howToPlayReplacements = {
    'loldle': {
      old: `Pick a champion you know well`,
      new: `Pick a champion you know inside out`
    },
    'dotadle': {
      old: `Start with a hero you are familiar with`,
      new: `Start with a hero whose attributes you're sure about`
    },
    'pokedle': {
      old: `Start with a Pokemon you know well`,
      new: `Guess a Pokemon you know by heart — starters work great`
    },
    'narutodle': {
      old: `Start with a character you recognize`,
      new: `Open with a character from the main cast`
    },
    'smashdle': {
      old: `Pick a fighter you recognize`,
      new: `Pick your Smash main — you know their stats`
    },
    'onepiecedle': {
      old: `Start with a character you know`,
      new: `Start with a Straw Hat you know well`
    }
  };

  // C-3B: Rename strategies from "The [X] Strategy" to natural phrasing
  const strategyReplacements = [
    ['"The Binary Search Strategy"', '"Use release year like a thermometer"'],
    ['"The Unique Attribute Strategy"', '"Lead with rare attributes"'],
    ['"The Position Elimination Strategy"', '"Nail down positions early"'],
    ['"The Species/Lore Strategy"', '"Species is a sleeper filter"'],
    ['"The Attribute Anchor Strategy"', '"Anchor on primary attribute first"'],
    ['"The Era Bracketing Strategy"', '"Bracket by era"'],
    ['"The Lane Cover Strategy"', '"Cover your lanes"'],
    ['"The Species Deduction Strategy"', '"Deduce from species"'],
    ['"The Type Coverage Strategy"', '"Maximize type coverage"'],
    ['"The Evolution Ladder Strategy"', '"Climb the evolution ladder"'],
    ['"The Habitat Hunter Strategy"', '"Hunt by habitat"'],
    ['"The Dimension Bracketing Strategy"', '"Bracket by size"'],
    ['"The Universe First Strategy"', '"Start with universe"'],
    ['"The Weight Bracket Strategy"', '"Bracket by weight class"'],
    ['"The Jump Count Strategy"', '"Check jump count"'],
    ['"The Veteran Status Strategy"', '"Split veterans from newcomers"'],
    ['"The Village Filter Strategy"', '"Filter by village first"'],
    ['"The Rank Hierarchy Strategy"', '"Use rank as a ladder"'],
    ['"The Timeline Strategy"', '"Bracket by debut era"'],
    ['"The Nature Type Strategy"', '"Cross-reference nature types"'],
    ['"The Crew Size Strategy"', '"Start with major crews"'],
    ['"The Bounty Bracketing Strategy"', '"Bracket by bounty range"'],
    ['"The Devil Fruit Binary Strategy"', '"Fruit or no fruit first"'],
    ['"The Haki Elite Strategy"', '"Test for Conqueror\'s early"'],
  ];

  for (const [oldS, newS] of strategyReplacements) {
    if (content.includes(oldS)) {
      content = content.replaceAll(oldS, newS);
      changes++;
    }
  }

  // C-3C: Vary FAQ timezone answers
  const timezoneReplacements = [
    // LoLdle
    {
      old: `new Date().toLocaleString('en-US', { timeZone: 'UTC', hour: 'numeric', minute: '2-digit', hour12: true }) + ' UTC'`,
      new: `'Midnight UTC. If you\'re on EST, that\'s 7 PM the night before.'`
    },
  ];

  // C-3D: Rewrite Introduction Paragraph 3
  const intro3Replacements = [
    {
      game: 'loldle',
      old: `This solver takes the guesswork out of identifying champions`,
      new: `Type your guess into the solver, set the feedback colors, and watch the champion list shrink. No more keeping mental notes on which positions and regions you've ruled out.`
    },
    {
      game: 'dotadle',
      old: `This solver helps you narrow down the hero pool`,
      new: `Plug your guess and feedback into the solver. It filters the hero pool instantly — no spreadsheet required.`
    },
    {
      game: 'pokedle',
      old: `This solver takes the guesswork out of identifying Pokemon`,
      new: `Enter what you learned and the solver eliminates the Pokemon that don't fit. Two guesses in, you'll see the list drop from 151 to maybe 30.`
    },
    {
      game: 'narutodle',
      old: `This solver takes the guesswork out of identifying characters`,
      new: `Feed your clues to the solver and it removes every character that doesn't match. You still pick who to guess next — it just shows you who's still in the running.`
    },
    {
      game: 'smashdle',
      old: `This solver takes the guesswork out of identifying fighters`,
      new: `Tell the solver what you got and it filters the roster. When the candidate list hits single digits, you're almost there.`
    },
    {
      game: 'onepiecedle',
      old: `This solver takes the guesswork out of identifying characters`,
      new: `The solver tracks your clues and removes characters that break them. It's faster than a mental checklist and way less error-prone.`
    }
  ];

  // Apply strategy replacements
  for (const { game, old, new: newIntro } of intro3Replacements) {
    // Find the game's intro3 paragraph and replace the generic pattern
    const gameSectionRegex = new RegExp(
      `gameKey:\\s*'${game}'[\\s\\S]*?intro3:\\s*'([^']*)'`,
      'g'
    );
    const match = gameSectionRegex.exec(content);
    if (match) {
      content = content.replace(match[1], newIntro);
      changes++;
    }
  }

  writeFileSync(filePath, content, 'utf-8');
  console.log(`Applied ${changes} changes to seo-content.ts`);
} catch (err) {
  console.error(`Error: ${err.message}`);
}
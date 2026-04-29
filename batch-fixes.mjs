import { readFileSync, writeFileSync } from 'fs';

function fixFile(relPath, replacements) {
  try {
    let content = readFileSync(relPath, 'utf8');
    let changed = false;
    for (const [search, replace] of replacements) {
      if (content.includes(search)) {
        content = content.replace(search, replace);
        changed = true;
      } else {
        console.log(`  SKIP (not found): "${search.substring(0, 60)}..."`);
      }
    }
    if (changed) {
      writeFileSync(relPath, content);
      console.log(`  ✅ Updated: ${relPath}`);
    } else {
      console.log(`  ⚠️ No changes: ${relPath}`);
    }
  } catch (e) {
    console.log(`  ❌ Error: ${relPath}: ${e.message}`);
  }
}

const base = 'wordsolverx-z-ai/src/routes';

// FIX C-4: Developer-speak and AI disclosure
console.log('\n=== FIX C-4: Developer-speak ===');

// #7 colordle - fallback text (already partially done, verify)
fixFile(`${base}/(interactive)/colordle-answer-today/+page.svelte`, [
  ['The clue card above handles the logical side of the puzzle. Below that, we keep a real-world solve path',
   'The clue card above handles the logical side of the puzzle. Below is a solve path based on contrast, hue family, and the same scoring the page already uses.'],
]);

// #8 worgle
fixFile(`${base}/(interactive)/worgle-answer-today/+page.svelte`, [
  ['Worgle follows a deterministic answer list, so this page stays in sync with the current IST puzzle window and the local archive.',
   'This page stays in sync with the daily Worgle puzzle, which resets at midnight IST.'],
  ['The current Worgle answer for {data.formattedDate}, plus the running puzzle number and archive links.',
   "Today's Worgle answer for {data.formattedDate}."],
]);

// #9 phrazle
fixFile(`${base}/(interactive)/phrazle-answer-today/+page.svelte`, [
  ['Two puzzles every day, with archive browsing moved to the dedicated Phrazle archive page.',
   'Two phrases every day — morning and afternoon. Need an older one? Check the archive.'],
]);

// #10 searchle
fixFile(`${base}/(interactive)/searchle-answer-today/+page.svelte`, [
  ["Today's Searchle prompt and answer, with a dedicated archive page for older puzzles.",
   "Today's Searchle prompt and answer. Older puzzles are in the archive."],
  ['Older Searchle prompts and answers now live on the dedicated archive page instead of this today page.',
   "Looking for an older Searchle answer? Head to the archive."],
]);

// #12 betweenle
fixFile(`${base}/(interactive)/betweenle-answer-today/+page.svelte`, [
]);

// #13 contexto
fixFile(`${base}/(interactive)/contexto-answer-today/+page.svelte`, [
  ['A focused today page for the current Contexto answer, with archive lookups moved to the dedicated archive page.',
   "Today's Contexto answer and hints. Need an older one? The archive has every past puzzle."],
  ['Older Contexto dates and game-number lookups now live on the dedicated archive page.',
   "Looking for a past Contexto answer? Check the archive."],
]);

// FIX C-5: Hero/intro text
console.log('\n=== FIX C-5: Hero/Intro text ===');

// canuckle #1
fixFile(`${base}/(interactive)/canuckle-answer-today/+page.svelte`, [
  ["We could not load a verified Canuckle answer for {formattedDate} right now. You can still browse the archive or use the solver while the latest data refreshes.",
   "Today's Canuckle answer isn't available yet. Browse the archive or try the solver while you wait."],
]);

// nerdle #4
fixFile(`${base}/(interactive)/nerdle-answer-today/+page.svelte`, [
]);

// quordle #5
fixFile(`${base}/(interactive)/quordle-answer-today/+page.svelte`, [
]);

// globle #11
fixFile(`${base}/(interactive)/globle-answer-today/+page.svelte`, [
  ["Verified Globle hints and the solution for {data.formattedDate}",
   "Today's Globle country and hints for {data.formattedDate}"],
]);

// semantle #14
fixFile(`${base}/(interactive)/semantle-answer-today/+page.svelte`, [
  ["Today's Semantle puzzle number is #{data.puzzleNumber}. The secret word is {data.word}.",
   "Puzzle #{data.puzzleNumber}. Today's Semantle word: {data.word}."],
]);

console.log('\n=== Done with batch fixes ===');
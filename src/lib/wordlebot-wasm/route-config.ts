import {
	generateCollectionPageSchema,
	generateFAQSchema,
	generateHowToSchema,
	generateSoftwareApplicationSchema,
	generateWebPageSchema
} from '$lib/seo';
import { getMainDailyDate, getMainDailyDateKey, getMainDailyDateLabel } from '$lib/main-daily-date';
import {
	getBestLengthForWordlebotGame,
	getWordlebotGame,
	WORDLEBOT_GAMES
} from './game-config';
import {
	getCanucklePagePath,
	getGameForVariantRoute,
	getWordleLengthSolverPath,
	WORDLEBOT_WORDLE_SOLVER_LENGTHS,
	type WordlebotVariantRouteSlug
} from './routes';
import type { WordlebotGameConfig, WordlebotPageConfig } from './types';

function sentenceCaseGame(game: WordlebotGameConfig) {
	return game.slug === 'w-peaks' ? 'Wordle Peaks' : game.name;
}

function getBoardLabel(game: WordlebotGameConfig) {
	return `${game.boards} board${game.boards === 1 ? '' : 's'}`;
}

function getLengthLabel(game: WordlebotGameConfig, wordLength?: number) {
	if (game.slug === 'wordle' && wordLength) {
		return `${wordLength} letters`;
	}

	if (game.lengths.length === 1) {
		return `${game.lengths[0]} letters`;
	}

	return `${Math.min(...game.lengths)}-${Math.max(...game.lengths)} letters`;
}

function buildSolverFaqs(game: WordlebotGameConfig, wordLength?: number) {
  if (game.slug === 'canuckle') {
    return [
      {
        question: 'How does the Canuckle solver work?',
        answer:
          'Enter your guess, tap tiles to match the brown/yellow/green clue colors from the game, the solver eliminates impossible answers and ranks the best next guesses from the Canadian word list.'
      },
      {
        question: 'Does the Canuckle solver use the same word list as the game?',
        answer:
          'Yes. It draws from the same Canadian-words dataset that Canuckle uses, so any answer the solver suggests is a valid daily answer.'
      },
      {
        question: 'Can I switch between today\'s puzzle, the archive, and the solver?',
        answer:
          'Yes. The top navigation tabs on the Canuckle section let you jump between the daily answer page, the searchable archive, and the solver without leaving WordSolverX.'
      },
      {
        question: 'What do the brown, yellow, and green clue colors mean in Canuckle?',
        answer:
          'Brown means the letter is not in the answer at that position. Yellow means the letter is in the answer but in a different position. Green means the letter is correct in that exact spot — same as standard Wordle coloring.'
      },
      {
        question: 'Why does Canuckle include a daily Canadian fact?',
        answer:
          'Each Canuckle puzzle is tied to a real Canadian fact related to the answer word. The solver focuses on the word game itself, but the fact gives each puzzle an educational angle unique to Canadian culture, geography, and history.'
      },
      {
        question: 'How is the Canuckle puzzle number calculated?',
        answer:
          'The game started in February 2022, paused, then resumed under a new schedule. The puzzle number on today\'s page reflects the current daily sequence from the restarted launch date.'
      },
      {
        question: 'What word lengths does the Canuckle solver support?',
        answer:
          'Canuckle uses 5-letter words only, so the solver loads the full 5-letter Canadian word list and does not need a length switcher.'
      },
      {
        question: 'Can I use the Canuckle solver for archive puzzles?',
        answer:
          'The solver is designed for the current daily puzzle. Archive puzzles use the same game logic, so the solver works for any date, but you would need to know the answer to set accurate feedback.'
      },
      {
        question: 'Does the Canuckle solver work on mobile?',
        answer:
          'Yes. The solver interface is responsive and works on phones and tablets the same way it works on desktop.'
      }
    ];
  }

  if (game.slug === 'quordle') {
    return [
      {
        question: 'How does the Quordle solver work?',
        answer:
          'Enter a guess once and it applies to all four boards simultaneously. Tap each tile on each board to set gray, yellow, or green feedback matching what the game showed you. The solver filters every board at once and shows you words that work across all unsolved grids.'
      },
      {
        question: 'Does the solver handle all four Quordle boards at once?',
        answer:
          'Yes. Unlike playing four separate Wordle tabs, this solver treats all four boards as a single linked puzzle and only suggests words that respect the clues from every board.'
      },
      {
        question: 'How many boards does the Quordle solver support?',
        answer:
          'This solver page handles four boards for Quordle, two boards for Dordle, and eight boards for Octordle — all on one shared interface with the same unified guess entry.'
      },
      {
        question: 'Why does my guess apply to all boards at the same time?',
        answer:
          'Quordle\'s rule is that your guess must be a valid word that helps you on all four unsolved boards simultaneously. The solver enforces this by only showing candidates that are consistent with the feedback on every board.'
      },
      {
        question: 'What happens when I get stuck on multiple boards?',
        answer:
          'Focus on the board with the most green tiles first. A word that has three greens on one board and none on another might still be a strong pick if it gives you information on the other three boards.'
      },
      {
        question: 'Does the Quordle solver have a word length switcher?',
        answer:
          'No. Quordle uses only 5-letter words, so the solver loads the standard 5-letter answer pool and stays focused on that length.'
      },
      {
        question: 'How does the solver rank next guesses in Quordle?',
        answer:
          'It prioritizes words that are likely answers on at least one unsolved board while also maximizing information gathering on the others. The ranking changes as you fill in more boards.'
      },
      {
        question: 'What is the best strategy for Quordle?',
        answer:
          'Open with words that use common letters spread across different positions. Avoid narrowing yourself into a corner on one board before getting information on all four.'
      },
      {
        question: 'Can I reset and start over on the Quordle solver?',
        answer:
          'Yes. There is a reset button that clears all guesses and feedback across all boards so you can begin a fresh solving session.'
      }
    ];
  }

  if (game.slug === 'dordle') {
    return [
      {
        question: 'How does the Dordle solver work?',
        answer:
          'Enter a guess once and it applies to both boards simultaneously. Tap each tile on each board to set gray, yellow, or green feedback matching what the game showed you. The solver filters every board at once and shows you words that work across all unsolved grids.'
      },
      {
        question: 'Does the solver handle both Dordle boards at once?',
        answer:
          'Yes. Unlike playing two separate Wordle tabs, this solver treats both boards as a single linked puzzle and only suggests words that respect the clues from every board.'
      },
      {
        question: 'How many boards does the Dordle solver support?',
        answer:
          'This solver page handles two boards for Dordle, four boards for Quordle, and eight boards for Octordle — all on one shared interface with the same unified guess entry.'
      },
      {
        question: 'Why does my guess apply to both boards at the same time?',
        answer:
          'Dordle\'s rule is that your guess must be a valid word that helps you on both unsolved boards simultaneously. The solver enforces this by only showing candidates that are consistent with the feedback on every board.'
      },
      {
        question: 'What happens when I get stuck on both boards?',
        answer:
          'Focus on the board with the most green tiles first. A word that has three greens on one board and none on another might still be a strong pick if it gives you information on the other board.'
      },
      {
        question: 'Does the Dordle solver have a word length switcher?',
        answer:
          'No. Dordle uses only 5-letter words, so the solver loads the standard 5-letter answer pool and stays focused on that length.'
      },
      {
        question: 'How does the solver rank next guesses in Dordle?',
        answer:
          'It prioritizes words that are likely answers on at least one unsolved board while also maximizing information gathering on the others. The ranking changes as you fill in more boards.'
      },
      {
        question: 'What is the best strategy for Dordle?',
        answer:
          'Open with words that use common letters spread across different positions. Avoid narrowing yourself into a corner on one board before getting information on both.'
      },
      {
        question: 'Can I reset and start over on the Dordle solver?',
        answer:
          'Yes. There is a reset button that clears all guesses and feedback across both boards so you can begin a fresh solving session.'
      }
    ];
  }

  if (game.slug === 'octordle') {
    return [
      {
        question: 'How does the Octordle solver work?',
        answer:
          'Enter a guess once and it applies to all eight boards simultaneously. Tap each tile on each board to set gray, yellow, or green feedback matching what the game showed you. The solver filters every board at once and shows you words that work across all unsolved grids.'
      },
      {
        question: 'Does the solver handle all eight Octordle boards at once?',
        answer:
          'Yes. Unlike playing eight separate Wordle tabs, this solver treats all eight boards as a single linked puzzle and only suggests words that respect the clues from every board.'
      },
      {
        question: 'How many boards does the Octordle solver support?',
        answer:
          'This solver page handles eight boards for Octordle, four boards for Quordle, and two boards for Dordle — all on one shared interface with the same unified guess entry.'
      },
      {
        question: 'Why does my guess apply to all eight boards at the same time?',
        answer:
          'Octordle\'s rule is that your guess must be a valid word that helps you on all eight unsolved boards simultaneously. The solver enforces this by only showing candidates that are consistent with the feedback on every board.'
      },
      {
        question: 'What happens when I get stuck on multiple boards?',
        answer:
          'Focus on the board with the most green tiles first. A word that has three greens on one board and none on another might still be a strong pick if it gives you information on the other seven boards.'
      },
      {
        question: 'Does the Octordle solver have a word length switcher?',
        answer:
          'No. Octordle uses only 5-letter words, so the solver loads the standard 5-letter answer pool and stays focused on that length.'
      },
      {
        question: 'How does the solver rank next guesses in Octordle?',
        answer:
          'It prioritizes words that are likely answers on at least one unsolved board while also maximizing information gathering on the others. The ranking changes as you fill in more boards.'
      },
      {
        question: 'What is the best strategy for Octordle?',
        answer:
          'Open with words that use common letters spread across different positions. Eight boards is a serious challenge — avoid narrowing yourself into a corner on one board before getting information on all eight.'
      },
      {
        question: 'Can I reset and start over on the Octordle solver?',
        answer:
          'Yes. There is a reset button that clears all guesses and feedback across all eight boards so you can begin a fresh solving session.'
      }
    ];
  }

  if (game.slug === 'wordle' && wordLength) {
    return [
      {
        question: `How does the ${wordLength}-letter Wordle solver work?`,
        answer: `Type your guess, tap each tile to match the gray, yellow, or green result from your game, and the solver instantly filters the ${wordLength}-letter word list to show the best next guesses ranked by likelihood.`
      },
      {
        question: `Why does this page only show ${wordLength}-letter words?`,
        answer: `${wordLength}-letter Wordle boards have a completely different answer pool from other lengths. Loading only the relevant words keeps the solver fast and the suggestions focused.`
      },
      {
        question: `How does word length affect Wordle strategy?`,
        answer:
          'Shorter words (3-4 letters) give you faster feedback per guess but fewer possibilities to work with. Longer words (7-11 letters) have larger pools but also give more information per clue because each letter position is more constrained.'
      },
      {
        question: `Can I switch to a different word length on this page?`,
        answer: `This page is dedicated to ${wordLength}-letter Wordle. Use the main solvers page to find solvers for other word lengths — each length has its own optimized word list.`
      },
      {
        question: `What makes a good first guess in ${wordLength}-letter Wordle?`,
        answer: `Words with common vowels and frequent consonants work well at any length. For 3-letter words try SLT/RTE patterns. For longer words the same CRANE-style logic applies — maximize letter frequency overlap with the answer pool.`
      },
      {
        question: `Does hard mode work with the ${wordLength}-letter solver?`,
        answer:
          'The solver does not enforce hard mode rules itself. You can use it alongside a hard mode game by manually respecting the requirement that confirmed clues must be used in subsequent guesses.'
      },
      {
        question: `How many possible answers are in the ${wordLength}-letter Wordle list?`,
        answer: `The answer pool varies by length. 5-letter Wordle has roughly 2,300 accepted answers. Longer words have more combinations, which is why the filtering algorithm becomes more important as length increases.`
      },
      {
        question: `Can I use the ${wordLength}-letter solver for daily Wordle?`,
        answer:
          'Regular Wordle uses 5 letters, but custom-length Wordle games use the same game rules — just different answer pools. Enter your guess and feedback the same way.'
      },
      {
        question: `Does the solver work for the unlimited Play Again Wordle mode?`,
        answer: `Yes. The unlimited mode uses the same answer pool as daily Wordle, so the solver works for both as long as you set the correct word length.`
      }
    ];
  }

  const title = sentenceCaseGame(game);
  const lengthAnswer =
    game.slug === 'wordle' && wordLength
      ? `This page opens directly into the ${wordLength}-letter Wordle solver, so you can start filtering answers right away without changing settings first.`
      : game.lengths.length > 1
      ? `Yes. This solver keeps the built-in length switcher for ${Math.min(...game.lengths)} to ${Math.max(...game.lengths)} letter boards on the same page.`
      : `This solver only supports ${game.lengths[0]} letters because that is the only format this puzzle uses.`;

  const feedbackAnswer =
    game.feedback === 'woodle'
      ? 'Add your guess, then set how many letters are exact matches and how many are misplaced. The solver filters the answer list using those totals.'
      : game.feedback === 'warmle'
      ? 'Add your guess, then tap each tile to match Warmle feedback. Yellow means the answer letter is alphabetically close, and you can also change the Warmle distance setting.'
      : game.feedback === 'peaks'
      ? 'Add your guess, then tap tiles until they match the game. In Wordle Peaks, gray means the target letter comes earlier alphabetically and yellow means it comes later.'
      : game.feedback === 'xordle'
      ? 'Add your guess, then tap each merged clue tile so the board matches the Xordle feedback you saw in the game.'
      : game.slug === 'fibble'
      ? "Enter the guess you played, then tap each tile to match Fibble's clue pattern. The solver keeps the lie-aware filtering used in Fibble."
      : game.slug === 'hardle'
      ? "Enter the guess and tap the clue tiles until they match Hardle. This solver keeps Hardle's green and yellow clue behavior."
      : game.slug === 'spotle'
      ? 'Enter the guess and tap each tile through gray, green, yellow, and blank states until the feedback matches your game.'
      : 'Enter the guess you used, then tap each tile until the colors match the puzzle feedback. The solver instantly filters the remaining answers and ranks strong next plays.';

  return [
    {
      question: 'How does this solver work?',
      answer:
        'Enter your guess, set the feedback colors or counts to match what the game showed, and the solver eliminates every answer that contradicts your clues, ranking the remaining candidates by how likely they are to be the solution.'
    },
    {
      question: 'What feedback does this game use?',
      answer: feedbackAnswer
    },
    {
      question: 'Can I change the word length?',
      answer: lengthAnswer
    },
    {
      question: 'How many guesses do I get in this game?',
      answer:
        'Most games give you 6 guesses, similar to standard Wordle, but the exact number varies. The solver does not enforce the guess limit — it helps you find the answer in as few guesses as possible.'
    },
    {
      question: 'Does the solver work for today\'s puzzle?',
      answer:
        'Yes. The solver works for any puzzle using the same game rules, whether it is today\'s daily challenge or a practice game.'
    },
    {
      question: 'Can I use the solver on my phone?',
      answer: 'Yes. The solver interface is fully responsive and works on mobile browsers.'
    },
    {
      question: 'What happens if I enter wrong feedback?',
      answer:
        'The solver will show incorrect results because it is working from inaccurate information. Always double-check your clue colors before running the solver.'
    },
    {
      question: 'Does the solver know the daily answer?',
      answer:
        'No. The solver only uses the feedback you enter. It does not have access to the daily answer and cannot peek at it.'
    },
    {
      question: 'How does the solver rank its suggestions?',
      answer:
        'It prioritizes words that are both valid answers and good information gatherers — words that are likely to be the answer themselves but also likely to eliminate the most candidates in the next round.'
    }
];
}

function buildSolverSections(game: WordlebotGameConfig, wordLength?: number) {
  if (game.slug === 'canuckle') {
    return [
      {
        title: 'How the Canuckle solver helps you win',
        paragraphs: [
          'The solver works by narrowing the Canadian word list with each guess you enter. When you tap a tile to set the brown, yellow, or green clue color, the solver eliminates every word that cannot fit that pattern across all six of your guess slots.',
          'The suggestions are ranked by which words are most likely to be the actual answer, based on letter frequency in the Canadian word dataset. The solver keeps working as you narrow down the list, updating the best next guesses after every entry.',
          'Because Canuckle uses a distinct Canadian word list rather than the standard English one, the solver only loads words that could actually appear in the game. This means suggestions like "about" or "house" will never show up here if they are not in the Canadian dataset.'
        ]
      },
      {
        title: 'What makes Canuckle different from regular Wordle',
        paragraphs: [
          'Canuckle swaps out the standard Wordle word list for a Canadian-specific one. This means some answers that are common in American English do not appear in Canuckle, and vice versa. The Canadian words include slightly different spelling patterns that reflect Canadian English usage.',
          'Beyond the word list, Canuckle adds a daily Canadian fact tied to each puzzle. The fact gives context about the answer word — Canadian history, geography, culture, or notable figures. This turns each daily puzzle into a small learning moment alongside the word game.',
          'The interface also uses different clue colors. Where Wordle shows gray, yellow, and green, Canuckle shows brown, yellow, and green. The meaning is the same — absent, misplaced, and correct — but the color names are distinct.'
        ]
      },
      {
        title: 'How to read Canuckle\'s brown, yellow, and green clues',
        paragraphs: [
          'Brown means the letter does not appear in the answer at any position. When you see a brown tile, you can eliminate that letter entirely from consideration for that guess slot and all future slots.',
          'Yellow means the letter appears in the answer but not in the position you just tried. The solver treats this as a constraint — the letter must go somewhere else in the word.',
          'Green means the letter is correct in that exact spot. The solver treats green tiles as fixed positions. When you get a green, you lock in that letter and focus on filling the remaining slots.',
          'This is the same logic as standard Wordle, just with different color names. The solver accepts this feedback just like any Wordle variant.'
        ]
      },
      {
        title: 'Why the daily Canadian fact matters',
        paragraphs: [
          'Each Canuckle puzzle is tied to a real Canadian fact that relates to the answer word. This adds an educational layer that standard Wordle lacks. The fact is not a hint about the spelling — it is context that makes the puzzle more memorable.',
          'When you are stuck, the fact can help you narrow down the answer. If you know the puzzle is about a Canadian city, the solver suggestions should only include words from the Canadian word list.',
          'The fact also makes Canuckle a better daily habit for Canadian players. It turns the puzzle into a mini lesson in Canadian culture, geography, and history alongside the word game.'
        ]
      },
      {
        title: 'The Canuckle word list and why it matters',
        paragraphs: [
          'Canuckle uses a Canadian word list that differs from standard Wordle in small but meaningful ways. Some words reflect Canadian spellings, and some words are simply more common in Canadian English usage.',
          'The solver draws from this same Canadian word list. This means when you get a suggestion from the solver, it is guaranteed to be a valid daily answer in Canuckle. You are not getting generic English words — you are getting Canadian ones.',
          'This matters most for players who are used to standard Wordle. Words like "about" or "color" use Canadian spellings that do not appear in the American English word list. The solver keeps you inside the correct dataset for Canuckle.'
        ]
      },
      {
        title: 'Strategy tips for Canuckle',
        paragraphs: [
          'Start with words that use common Canadian letters. The solver suggests ranked candidates, but if you prefer to guess manually, pick words with frequent vowels and common consonants like R, S, T, L, and N.',
          'Treat the daily Canadian fact as a clue. Even though it does not directly tell you the answer spelling, it tells you what the answer is about. A fact about Toronto tells you the answer is related to that city.',
          'You only get six guesses in Canuckle, just like standard Wordle. The solver helps you use those six guesses efficiently by narrowing the word list quickly after each entry. Focus on feedback quality — double-check your brown, yellow, and green settings before running the solver.'
        ]
      },
      {
        title: 'The three Canuckle pages work together',
        paragraphs: [
          'The Canuckle section on WordSolverX has three distinct pages. The answer today page shows the current puzzle number, date, and answer with its Canadian fact. The archive page lets you search past puzzles by date, number, answer, or fact text. The solver page helps you find the answer through clue-based elimination.',
          'These pages are linked through the top navigation tabs in the Canuckle section. You can move from checking today\'s answer to the archive or solver without leaving WordSolverX.',
          'Use each page for its intended purpose. Check the answer today page when you want a direct reveal. Use the archive when you want to research older puzzles. Use the solver when you want to figure it out yourself but need help narrowing down candidates.'
        ]
      },
      {
        title: 'Why use a solver for Canuckle',
        paragraphs: [
          'The Canadian word list is smaller and more unfamiliar than the standard Wordle list, especially for players outside Canada. There are 5-letter Canadian words that might not immediately come to mind, and the solver helps you find them quickly.',
          'If you are on a streak, the solver keeps you going when you get stuck on an unfamiliar word. Instead of wasting a guess on a random Canadian word, the solver shows you the most likely candidates based on your feedback.',
          'The solver does not peek at the daily answer. It only works from the feedback you enter. This means you get the satisfaction of solving without the solver telling you the answer directly — it narrows the list, and you pick from the narrowed list.'
        ]
      }
    ];
  }

  if (game.slug === 'quordle') {
    return [
      {
        title: 'How the Quordle solver handles four boards at once',
        paragraphs: [
          'The solver treats all four Quordle boards as a single linked puzzle. When you enter a guess, it applies to all four boards simultaneously, and you set feedback on each board separately. The solver then filters candidates that are consistent with clues on every board at once.',
          'This cross-board elimination is the key difference from playing four separate Wordle games. In regular Wordle, a guess only has to work on one board. In Quordle, a valid guess must be a possible answer on every unsolved board simultaneously.',
          'The solver enforces this constraint automatically. It only shows words that have not been ruled out by feedback on any board. You do not have to manually check each board yourself.'
        ]
      },
      {
        title: 'Why Quordle is harder than four Wordles',
        paragraphs: [
          'Standard Wordle gives you six guesses to solve one board. Quordle gives you nine guesses to solve four boards simultaneously. The math sounds generous, but the constraint is brutal: every guess must be a word that could be the answer on all four unsolved boards.',
          'In four separate Wordle games, you could use a word that is perfect for board one but useless on boards two, three, and four. That does not work in Quordle. A word that is eliminated on even one board cannot be your next guess.',
          'This means Quordle requires different strategy from the start. Words that work well as opening Wordle guesses might not work here because they need to be plausible answers on all four boards at once. The solver helps you find those rare cross-board candidates.'
        ]
      },
      {
        title: 'The shared guess constraint changes your strategy',
        paragraphs: [
          'In regular Wordle, you optimize for one board. You pick a starting word that gives you good information about that single puzzle. In Quordle, you optimize for four boards simultaneously, which means sometimes you sacrifice perfect information on one board to get any information on the others.',
          'A guess that locks in three green tiles on board one but gives you no new information on boards two, three, and four might still be worth playing if board one is close to solved and you need to secure it before your guesses run out.',
          'The solver helps you find these cross-board compromises. It shows you words that are likely answers on at least one unsolved board while also being plausible on the others.'
        ]
      },
      {
        title: 'How the solver ranks words across four boards',
        paragraphs: [
          'The solver prioritizes candidates that are likely answers on at least one unsolved board. From those candidates, it ranks by how much new information each word would reveal on the other unsolved boards.',
          'Early in the game, the ranking favors words that are common and have diverse letter patterns. These maximize your chance of getting green or yellow feedback on multiple boards with a single guess.',
          'As you fill in more boards, the ranking becomes more focused. When three boards are solved and only one remains, the solver shifts to prioritizing words that are likely answers on that last unsolved board.'
        ]
      },
      {
        title: 'How to use the solver when some boards are further along',
        paragraphs: [
          'If one board has three or four greens and the others are still mostly blank, use the solver to find words that satisfy the near-solved board while also being plausible on the unsolved ones. The solver handles this cross-board constraint automatically.',
          'A word with three greens on board one but no matches on boards two through four might seem wasteful, but if board one is about to be solved, securing that board is worth more than getting clues on the others.',
          'The solver shows you the trade-off in the candidate ranking. Look for words that balance being a likely answer on the advanced board with good information potential on the remaining boards.'
        ]
      },
      {
        title: 'When to switch strategies mid-Quordle',
        paragraphs: [
          'Early Quordle strategy focuses on cross-board information. You want guesses that reveal clues on as many boards as possible. But if three boards solve and one is stuck, you need to pivot.',
          'When three boards are solved, you have eight or nine guesses spent and probably six or fewer left for the last board. At this point, stop trying to gather information on the solved boards and focus entirely on the unsolved one.',
          'The solver supports this pivot. It will show candidates that are valid answers on the stuck board even if they give no new information on the other boards, because those other boards are already solved anyway.'
        ]
      },
      {
        title: 'Quordle versus Dordle versus Octordle',
        paragraphs: [
          'The same core mechanic applies across all three games: one guess applies to multiple boards, and each guess must be a valid answer on all unsolved boards. The only difference is the number of boards.',
          'Dordle has two boards. Four boards is Quordle. Eight boards is Octordle. More boards means more constraints on every single guess, which makes the puzzle exponentially harder to solve manually.',
          'Octordle with eight boards is a serious time commitment. Even with nine guesses, finding a word that is a valid answer on all eight unsolved boards at once is a genuine challenge. The solver becomes more useful as the board count increases.'
        ]
      },
      {
        title: 'Why a solver is more useful for Quordle than regular Wordle',
        paragraphs: [
          'In regular Wordle, the answer list is small enough that a good starting word and some logic can often solve the puzzle without a solver. In Quordle, the combinatorial explosion of four boards makes manual solving much harder.',
          'With four boards and thousands of possible words per board, the cross-board filtering is too complex to do reliably in your head after the first couple of guesses. The solver narrows the candidate list across all four boards at once.',
          'The solver also helps you avoid one of the most common Quordle mistakes: using a guess that works great on one board but locks you out of progress on the others. It only shows words that respect feedback from every board simultaneously.'
        ]
      }
    ];
  }

  if (game.slug === 'dordle') {
    return [
      {
        title: 'How the Dordle solver handles two boards at once',
        paragraphs: [
          'The solver treats both Dordle boards as a single linked puzzle. When you enter a guess, it applies to both boards simultaneously, and you set feedback on each board separately. The solver then filters candidates that are consistent with clues on both boards at once.',
          'This cross-board elimination is the key difference from playing two separate Wordle games. In regular Wordle, a guess only has to work on one board. In Dordle, a valid guess must be a possible answer on both unsolved boards simultaneously.',
          'The solver enforces this constraint automatically. It only shows words that have not been ruled out by feedback on either board. You do not have to manually check each board yourself.'
        ]
      },
      {
        title: 'Why Dordle is harder than two Wordles',
        paragraphs: [
          'Standard Wordle gives you six guesses to solve one board. Dordle gives you seven guesses to solve two boards simultaneously. The constraint is the challenge: every guess must be a word that could be the answer on both unsolved boards.',
          'In two separate Wordle games, you could use a word that is perfect for board one but useless on board two. That does not work in Dordle. A word that is eliminated on even one board cannot be your next guess.',
          'This means Dordle requires different strategy from the start. Words that work well as opening Wordle guesses might not work here because they need to be plausible answers on both boards at once. The solver helps you find those cross-board candidates.'
        ]
      },
      {
        title: 'The shared guess constraint changes your strategy',
        paragraphs: [
          'In regular Wordle, you optimize for one board. You pick a starting word that gives you good information about that single puzzle. In Dordle, you optimize for both boards simultaneously, which means sometimes you sacrifice perfect information on one board to get any information on the other.',
          'A guess that locks in three green tiles on board one but gives you no new information on board two might still be worth playing if board one is close to solved and you need to secure it before your guesses run out.',
          'The solver helps you find these cross-board compromises. It shows you words that are likely answers on at least one unsolved board while also being plausible on the other.'
        ]
      },
      {
        title: 'How the solver ranks words across two boards',
        paragraphs: [
          'The solver prioritizes candidates that are likely answers on at least one unsolved board. From those candidates, it ranks by how much new information each word would reveal on the other unsolved board.',
          'Early in the game, the ranking favors words that are common and have diverse letter patterns. These maximize your chance of getting green or yellow feedback on both boards with a single guess.',
          'As you fill in more boards, the ranking becomes more focused. When one board is solved and the other remains, the solver shifts to prioritizing words that are likely answers on that last unsolved board.'
        ]
      },
      {
        title: 'How to use the solver when one board is further along',
        paragraphs: [
          'If one board has three or four greens and the other is still mostly blank, use the solver to find words that satisfy the near-solved board while also being plausible on the unsolved one. The solver handles this cross-board constraint automatically.',
          'A word with three greens on board one but no matches on board two might seem wasteful, but if board one is about to be solved, securing that board is worth more than getting clues on the other.',
          'The solver shows you the trade-off in the candidate ranking. Look for words that balance being a likely answer on the advanced board with good information potential on the remaining board.'
        ]
      },
      {
        title: 'When to switch strategies mid-Dordle',
        paragraphs: [
          'Early Dordle strategy focuses on cross-board information. You want guesses that reveal clues on both boards. But if one board solves and the other is stuck, you need to pivot.',
          'When one board is solved, you have several guesses left for the last board. At this point, stop trying to gather information on the solved board and focus entirely on the unsolved one.',
          'The solver supports this pivot. It will show candidates that are valid answers on the stuck board even if they give no new information on the solved board, because that board is already done.'
        ]
      },
      {
        title: 'Quordle versus Dordle versus Octordle',
        paragraphs: [
          'The same core mechanic applies across all three games: one guess applies to multiple boards, and each guess must be a valid answer on all unsolved boards. The only difference is the number of boards.',
          'Dordle has two boards. Four boards is Quordle. Eight boards is Octordle. More boards means more constraints on every single guess, which makes the puzzle harder to solve manually.',
          'Octordle with eight boards is a serious time commitment. Even with nine guesses, finding a word that is a valid answer on all eight unsolved boards at once is a genuine challenge. The solver becomes more useful as the board count increases.'
        ]
      },
      {
        title: 'Why a solver is more useful for Dordle than regular Wordle',
        paragraphs: [
          'In regular Wordle, the answer list is small enough that a good starting word and some logic can often solve the puzzle without a solver. In Dordle, the cross-board filtering is more complex than one board but less overwhelming than Quordle or Octordle.',
          'With two boards and thousands of possible words per board, the cross-board elimination is too complex to do reliably in your head after the first couple of guesses. The solver narrows the candidate list across both boards at once.',
          'The solver also helps you avoid one of the most common Dordle mistakes: using a guess that works great on one board but locks you out of progress on the other. It only shows words that respect feedback from both boards simultaneously.'
        ]
      }
    ];
  }

  if (game.slug === 'octordle') {
    return [
      {
        title: 'How the Octordle solver handles eight boards at once',
        paragraphs: [
          'The solver treats all eight Octordle boards as a single linked puzzle. When you enter a guess, it applies to all eight boards simultaneously, and you set feedback on each board separately. The solver then filters candidates that are consistent with clues on every board at once.',
          'This cross-board elimination is the key difference from playing eight separate Wordle games. In regular Wordle, a guess only has to work on one board. In Octordle, a valid guess must be a possible answer on all eight unsolved boards simultaneously.',
          'The solver enforces this constraint automatically. It only shows words that have not been ruled out by feedback on any board. Eight boards of feedback at once is far too complex to track manually.'
        ]
      },
      {
        title: 'Why Octordle is significantly harder than eight Wordles',
        paragraphs: [
          'Standard Wordle gives you six guesses to solve one board. Octordle gives you nine guesses to solve eight boards simultaneously. Nine guesses for eight boards sounds mathematically possible, but the shared guess constraint makes it brutally difficult.',
          'In eight separate Wordle games, you could use a word that is perfect for one board but useless on the others. That does not work in Octordle. A word that is eliminated on even one board cannot be your next guess.',
          'This means Octordle requires extreme optimization from the first guess. Words that work well as opening Wordle guesses are almost never valid Octordle guesses because they need to be plausible answers on all eight boards at once. The solver is nearly essential here.'
        ]
      },
      {
        title: 'The shared guess constraint changes your strategy',
        paragraphs: [
          'In regular Wordle, you optimize for one board. In Octordle, you optimize for eight boards simultaneously, which means you constantly sacrifice information on some boards to get any information on others.',
          'A guess that locks in three green tiles on board one but gives you no new information on boards two through eight might still be worth playing if board one is close to solved. The solver finds these cross-board compromises.',
          'The solver helps you find words that are likely answers on at least one unsolved board while also being plausible on all the others. Early game, this is very hard to do manually with eight boards.'
        ]
      },
      {
        title: 'How the solver ranks words across eight boards',
        paragraphs: [
          'The solver prioritizes candidates that are likely answers on at least one unsolved board. From those candidates, it ranks by how much new information each word would reveal on the other unsolved boards.',
          'Early in the game with eight boards, the ranking favors words that are common and have diverse letter patterns. These maximize your chance of getting green or yellow feedback on multiple boards with a single guess.',
          'As boards solve, the ranking shifts. When seven boards are solved and only one remains, the solver focuses on candidates that are likely answers on that last unsolved board.'
        ]
      },
      {
        title: 'How to use the solver when some boards are further along',
        paragraphs: [
          'If some boards have multiple greens and others are still blank, use the solver to find words that satisfy the advanced boards while also being plausible on the unsolved ones. The solver handles this eight-way constraint automatically.',
          'A word with greens on board one but no matches on boards two through eight might be worth playing if board one is close to solved. Securing a solved board before moving on is a valid Octordle strategy.',
          'The solver shows you the trade-off in the candidate ranking. Look for words that balance being likely answers on the advanced boards with good information potential on the remaining boards.'
        ]
      },
      {
        title: 'When to switch strategies mid-Octordle',
        paragraphs: [
          'Early Octordle strategy focuses purely on cross-board information. You want guesses that reveal clues on as many boards as possible. But when enough boards solve and a few remain stuck, you need to pivot.',
          'When seven boards are solved and only one is stuck, you have probably spent eight or nine guesses. You might only have one or two guesses left for the last board. Pivot hard to prioritizing that board.',
          'The solver supports this pivot. It will show candidates that are valid answers on the stuck board even if they give no new information on the already-solved boards.'
        ]
      },
      {
        title: 'Quordle versus Dordle versus Octordle',
        paragraphs: [
          'The same core mechanic applies across all three games: one guess applies to multiple boards, and each guess must be a valid answer on all unsolved boards. The only difference is the number of boards.',
          'Dordle has two boards. Four boards is Quordle. Eight boards is Octordle. More boards means more constraints on every single guess, which makes the puzzle exponentially harder to solve manually.',
          'Octordle with eight boards is a serious time commitment. Even with nine guesses, finding a word that is a valid answer on all eight unsolved boards at once is a genuine challenge. The solver is close to essential here.'
        ]
      },
      {
        title: 'Why a solver is nearly essential for Octordle',
        paragraphs: [
          'In regular Wordle, you can often solve without a solver because the answer list is small. In Octordle, the eight-board constraint creates a combinatorial explosion that makes manual solving nearly impossible after the first couple of guesses.',
          'With eight boards and thousands of possible words per board, the cross-board elimination is far too complex to track in your head. The solver is the only practical way to handle eight-way simultaneous feedback filtering.',
          'The solver helps you avoid wasting guesses on words that are ruled out on seven boards. It only shows words that respect feedback from all eight boards at once, which is genuinely difficult to do manually with eight boards.'
        ]
      }
    ];
  }

  if (game.slug === 'wordle' && wordLength) {
    return [
      {
        title: `Why a ${wordLength}-letter solver is worth having`,
        paragraphs: [
          `Word lists behave very differently across word lengths. A ${wordLength}-letter board has its own answer pool that shares almost no candidates with 5-letter or 3-letter Wordle. Loading only the relevant words keeps the solver fast and the suggestions focused.`,
          `The dedicated ${wordLength}-letter page opens directly into the right solver without requiring you to adjust settings first. This streamlines the workflow — you land on the correct word list immediately.`,
          `Longer and shorter words also have different letter frequency patterns, so a solver optimized for ${wordLength} letters ranks candidates using the right statistical model for that length.`
        ]
      },
      {
        title: `How ${wordLength}-letter Wordle is different from 5-letter Wordle`,
        paragraphs: [
          'The answer pool size varies significantly by word length. Shorter words have far fewer possible answers, which means you can narrow down the list faster but you also have fewer good starting words to choose from.',
          `Letter frequency patterns shift at different lengths. In 3-letter Wordle, the most common starting letters are S, R, T, L, and N. In ${wordLength}-letter Wordle, the same CRANE-style logic applies but with letter frequencies calculated specifically for ${wordLength}-letter words.`,
          'Some starting words that work well at one length do not transfer to others. A word with good letter spread at 5 letters might be a poor choice at 9 letters because the longer pool behaves differently.'
        ]
      },
      {
        title: `What makes a good first guess at ${wordLength} letters`,
        paragraphs: [
          'Letter frequency matters more at longer lengths because the answer pools are larger. Pick words with common vowels and frequent consonants to maximize your chance of getting feedback on multiple tiles.',
          'Avoid rare letters like X, Z, Q, and J early unless you have a specific reason to include them. These letters appear in fewer answers and are more likely to waste a guess.',
          `For 3-letter Wordle, try starting with words like SLT or RTE that use common letters in different positions. For ${wordLength} letters where ${wordLength} is 6 or more, prioritize words with diverse letter coverage across the word.`
        ]
      },
      {
        title: `How the solver handles unusual word lengths`,
        paragraphs: [
          'The solver applies standard Wordle rules to whatever answer pool matches your chosen length. Gray means absent, yellow means misplaced, and green means correct in that position. The filtering logic is identical across all lengths.',
          'The only difference is which word list gets loaded. A 9-letter solver loads the 9-letter answer pool, a 4-letter solver loads the 4-letter pool, and so on.',
          'The solver ranks suggestions based on letter frequency within that specific length pool. This means the top recommendations at 9 letters are different from the top recommendations at 5 letters.'
        ]
      },
      {
        title: 'Why word length affects solving difficulty',
        paragraphs: [
          'Shorter words (3-4 letters) have smaller answer pools, which means you can often solve them in fewer guesses. The trade-off is that you have fewer starting words to choose from and less room to maneuver when you get stuck.',
          'Longer words (7-8 letters) have larger answer pools, which means more ambiguity early in the game. However, each correct letter position in a longer word gives you more information because it constrains the answer more tightly.',
          'Very long words (9-11 letters) have massive pools and very specific letter position constraints. A single green tile in a 10-letter word tells you a lot about what the answer looks like, but finding that green tile requires good starting word choices.'
        ]
      },
      {
        title: 'The hard mode consideration for custom lengths',
        paragraphs: [
          'Hard mode requires that confirmed clues must be used in subsequent guesses. This means once you get a green or yellow on a letter, that letter must appear in the same position in all future guesses.',
          'Hard mode is more forgiving on short words (3-4 letters) because there are fewer positions to track. On longer words (7+ letters), hard mode becomes significantly harder because confirmed letters must stay locked in their positions.',
          'The solver does not enforce hard mode rules automatically. You can use it alongside a hard mode game by manually respecting the confirmed clues when you pick your next guess.'
        ]
      },
      {
        title: 'Strategy differences by word length',
        paragraphs: [
          'For 3-letter Wordle, focus on starting words with high-frequency S, R, T, and E placements. Avoid obscure 3-letter words that do not appear in the answer pool.',
          'For 4-letter Wordle, pay attention to vowel placement. Four-letter words often have two vowels that need to be identified quickly. Starting words like LATE or ROPE work well.',
          `For 5-letter Wordle, use the standard CRANE approach — common letters spread across different positions. For ${wordLength}-letter Wordle where ${wordLength} is 6 or more, maximize letter spread even more because longer words give you more tiles to cover.`
        ]
      },
      {
        title: `What the ${wordLength}-letter answer pool looks like`,
        paragraphs: [
          'The answer pool varies by length. 5-letter Wordle has roughly 2,300 accepted answers. Shorter lengths have fewer options, and longer lengths have significantly more.',
          `For ${wordLength} letters, the answer pool size affects how quickly you can narrow down candidates. Smaller pools require fewer guesses to eliminate impossible words. Larger pools benefit more from the solver\'s filtering algorithm.`,
          'The solver loads only the valid answers for your chosen length. It does not include obscure words that are not in the game\'s accepted answer list.'
        ]
      }
    ];
  }

  const title = sentenceCaseGame(game);
  const boardLine =
    game.boards > 1
      ? `${title} asks you to solve ${game.boards} linked boards with the same guesses, so strong suggestions need to gather information across every unsolved grid instead of helping only one board.`
      : `${title} still rewards efficient information gathering, but the solver handles the filtering work as soon as you match the clue pattern correctly.`;

  const lengthLine =
    game.slug === 'wordle' && wordLength
      ? `${wordLength}-letter Wordle boards have a very different answer pool from classic 5-letter Wordle, so this dedicated page loads straight into the right solver and keeps the clues focused on that exact length.`
      : `This page loads the matching solver bundle for the puzzle and word length you actually need, which keeps the page fast on mobile and desktop.`;

  return [
    {
      title: `How this ${title} solver helps`,
      paragraphs: [
        `This ${title} solver narrows the answer list by applying your guesses to the puzzle's rules, then ranking the next plays that should reveal the most useful information.`,
        boardLine
      ]
    },
    {
      title: `Why this page stays quick`,
      paragraphs: [
        lengthLine,
        'Only the matching game logic and interface load for each route, which keeps the experience cleaner and more responsive than a one-size-fits-all helper.'
      ]
    },
    {
      title: 'Why feedback-based solving works',
      paragraphs: [
        'Every guess in a Wordle-style game produces feedback that eliminates impossible answers. By tracking which letters are absent, misplaced, or correct, the solver narrows the answer list to only words that fit all your clues simultaneously.',
        'The power of feedback-based solving comes from the constraints stacking. One green tile does not narrow much, but five green tiles narrows to almost nothing else. The solver handles this cumulative filtering automatically.'
      ]
    },
    {
      title: 'How to use the solver efficiently',
      paragraphs: [
        'Double-check your clue colors before running the solver after each guess. A single incorrect color setting throws off the entire elimination and will give you wrong suggestions.',
        'Use words that maximize information early. Starting with words that have common letters and diverse positions gives you the best chance of getting green or yellow feedback on multiple tiles.',
        'The solver ranks its suggestions by likelihood. You do not have to pick the top recommendation — use the list to find a word you think is strong, enter it, and update the feedback.'
      ]
    },
    {
      title: `What makes ${title} unique`,
      paragraphs: [
          `This ${title} variant has its own particular rules and answer pool. The solver respects those rules and loads only the relevant word list for this game type.`,
          `Understanding the specific feedback mechanism and word constraints of ${title} helps you set accurate clues and get better suggestions from the solver.`
      ]
    },
    {
      title: 'Strategy tips for this variant',
      paragraphs: [
        'Start with words that use common letters and cover different positions. This gives you the broadest feedback across all clue types.',
        'Avoid reusing letters you know are absent early in the game. Each guess should advance you toward the answer or eliminate large groups of candidates.',
        'When stuck, use the solver to find words that fit your current clues. Do not guess randomly — let the elimination algorithm do the work.'
      ]
    },
    {
      title: 'Common mistakes to avoid',
      paragraphs: [
        'Setting wrong feedback colors is the most common mistake. Always verify your clue colors against the game before running the solver.',
        'Using a word that contradicts your own clues wastes a guess. If the solver shows a word with a letter you already marked as absent, you have a feedback error somewhere.',
        'Not resetting when starting a new puzzle. Clear all previous guesses and feedback before using the solver for a fresh game to avoid carry-over contamination.'
      ]
    }
];
}

function buildSolverKeywords(game: WordlebotGameConfig, wordLength?: number) {
	const base = sentenceCaseGame(game).toLowerCase();

	if (game.slug === 'wordle' && wordLength) {
		return [
			`${wordLength} letter wordle solver`,
			`${wordLength} letter wordle helper`,
			`${wordLength} letter wordle answer finder`,
			`${wordLength} letter word finder`,
			'wordsolverx wordle solver'
		];
	}

	if (game.slug === 'spotle') {
		return [
			'spotle wordle solver',
			'spotle word game solver',
			'blank clue wordle solver',
			'spotle answer helper',
			'wordsolverx spotle wordle'
		];
	}

	return [
		`${base} solver`,
		`${base} helper`,
		`${base} answer finder`,
		`${base} clue solver`,
		`wordsolverx ${base}`
	];
}

function buildSolverChips(game: WordlebotGameConfig, wordLength?: number) {
	if (game.slug === 'wordle' && wordLength) {
		return [`${wordLength} letters`, 'Hard mode', 'Fast clue filtering'];
	}

	return [getBoardLabel(game), getLengthLabel(game, wordLength), 'Ranked next guesses'];
}

export function getWordleLengthPageConfig(wordLength: number): WordlebotPageConfig {
	const game = getWordlebotGame('wordle');
	const pageUrl = `https://wordsolver.tech${getWordleLengthSolverPath(wordLength)}`;
	const title = `${wordLength}-Letter Wordle Solver`;
	const description = `Use the ${wordLength}-letter Wordle solver to filter clues, rank next guesses, and solve custom-length Wordle boards faster.`;

	return {
		appConfig: { pageType: 'solver', game: 'wordle', wordLength },
		title,
		eyebrow: 'Wordle solver by word length',
		description,
		pageUrl,
		keywords: buildSolverKeywords(game, wordLength),
		faqTitle: `${title} FAQs`,
		faqs: buildSolverFaqs(game, wordLength),
		howToTitle: `How to use the ${wordLength}-letter Wordle solver`,
		howToSteps: [
			{ name: 'Type your guess', text: `Enter the ${wordLength}-letter word you played in Wordle.` },
			{ name: 'Match the clue colors', text: 'Tap each tile until it matches the gray, yellow, or green result from your game.' },
			{ name: 'Review the ranked answers', text: 'Run the solver to see the best next guesses and the most likely remaining answers.' }
		],
		sections: buildSolverSections(game, wordLength),
		chips: buildSolverChips(game, wordLength),
		cta:
			wordLength === 5
				? {
						label: 'See Wordle answer today',
						href: '/wordle-answer-today'
					}
				: {
						label: 'Open 5-letter Wordle solver',
						href: getWordleLengthSolverPath(5)
					}
	};
}

export function getVariantSolverPageConfig(variant: WordlebotVariantRouteSlug): WordlebotPageConfig {
	const gameSlug = getGameForVariantRoute(variant);
	const game = getWordlebotGame(gameSlug);
	const routePath = `/${variant}-solver`;
	const pageUrl = `https://wordsolver.tech${routePath}`;
	const title = game.slug === 'spotle' ? 'Spotle Wordle Solver' : `${sentenceCaseGame(game)} Solver`;
	const description =
		game.slug === 'canuckle'
			? 'Use the Canuckle solver to filter the Canadian answer list, rank strong next guesses, and move quickly between the answer today, archive, and solver pages.'
			: game.slug === 'spotle'
				? 'Use the Spotle Wordle solver with blank-clue support, fast candidate filtering, and dedicated next-guess ranking.'
				: `Use the ${sentenceCaseGame(game)} solver with built-in clue matching, length switching where available, and fast next-guess suggestions.`;

	const cta =
		game.slug === 'canuckle'
			? { label: 'See Canuckle answer today', href: getCanucklePagePath('today') }
			: game.slug === 'quordle'
				? { label: 'View Quordle answer today', href: '/quordle-answer-today' }
				: undefined;

	return {
		appConfig: {
			pageType: 'solver',
			game: game.slug,
			wordLength: getBestLengthForWordlebotGame(game.slug, 5)
		},
		title,
		eyebrow: game.boards > 1 ? 'Multi-board puzzle solver' : 'Interactive puzzle solver',
		description,
		pageUrl,
		keywords: buildSolverKeywords(game),
		faqTitle: `${title} FAQs`,
		faqs: buildSolverFaqs(game),
		howToTitle: `How to use the ${title.toLowerCase()}`,
		howToSteps: [
			{ name: 'Add the guess you played', text: 'Enter the word you used before setting any clue feedback.' },
			{ name: 'Match every board or clue state', text: 'Tap each tile or count selector until the board matches the result you saw in the game.' },
			{ name: 'Calculate the next move', text: 'Run the solver to see the strongest next guesses and the remaining likely answers.' }
		],
		sections: buildSolverSections(game),
		chips: buildSolverChips(game),
		cta
	};
}

export function getCanuckleTodayPageConfig(): WordlebotPageConfig {
	const targetDate = getMainDailyDate();
	const visibleDateKey = getMainDailyDateKey(targetDate);
	const displayDate = getMainDailyDateLabel(targetDate);
	const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(targetDate);

	return {
		appConfig: { pageType: 'canuckle-daily', visibleDateKey },
		title: 'Canuckle Answer Today',
		displayTitle: `Canuckle Answer Today (${displayDate})`,
		metaTitle: `Canuckle Answer Today - ${currentMonth} - Updated`,
		eyebrow: 'Daily Canuckle answer, fact, and puzzle number',
		description:
			"See the Canuckle answer today, check the current puzzle number, and read the matching Canadian fact with quick links to the archive and solver.",
		pageUrl: `https://wordsolver.tech${getCanucklePagePath('today')}`,
		keywords: [
			'canuckle answer today',
			'canuckle today',
			'canuckle puzzle today',
			'canuckle hint today',
			'wordsolverx canuckle'
		],
		faqTitle: 'Canuckle Answer Today FAQs',
		faqs: [
			{
				question: 'How is the Canuckle answer today page calculated?',
				answer:
					'This page follows the same Canuckle date schedule as the live game, including the original 2022 launch window and the restarted daily sequence.'
			},
			{
				question: 'Can I move from Canuckle today to the solver?',
				answer:
					'Yes. The Canuckle solver is linked directly from this page so you can go from the answer today view to clue-based solving in one click.'
			},
			{
				question: 'Does the Canuckle answer today page also link to the archive?',
				answer:
					'Yes. You can switch from today’s answer to the Canuckle archive to review older puzzle numbers, dates, answers, and facts.'
			}
		],
		howToTitle: 'How to use the Canuckle answer today page',
		howToSteps: [
			{ name: 'Check the puzzle number', text: "Use the page to confirm today's Canuckle index and date." },
			{ name: 'Reveal the answer when needed', text: 'Open the answer panel only when you want to see the current solution.' },
			{ name: 'Jump to the archive or solver', text: 'Use the page tabs to move between the Canuckle archive and solver quickly.' }
		],
		sections: [
			{
				title: 'What you get on this Canuckle answer today page',
				paragraphs: [
					'This page is built for fast daily lookup. It highlights the live Canuckle puzzle number, the matching date, and the Canadian fact tied to that answer.',
					'Because the answer today route is separated from the solver and archive, it is easier for both users and search engines to understand what the page is for.'
				]
			},
			{
				title: 'Where to go after checking today’s answer',
				paragraphs: [
					'Open the Canuckle solver if you want clue-based help instead of a direct reveal. That page lets you enter guesses, mark feedback, and narrow the answer list quickly.',
					'If you are researching earlier puzzles, the Canuckle archive gives you a searchable history of dates, answers, and facts without leaving WordSolverX.'
				]
			}
		],
		chips: ['Answer today', 'Daily fact', 'Puzzle number'],
		cta: {
			label: 'Browse Canuckle archive',
			href: getCanucklePagePath('archive')
		}
	};
}

export function getCanuckleArchivePageConfig(): WordlebotPageConfig {
	const visibleDateKey = getMainDailyDateKey();

	return {
		appConfig: { pageType: 'canuckle-archive', visibleDateKey },
		title: 'Canuckle Archive',
		eyebrow: 'Search past Canuckle answers by date or puzzle number',
		description:
			'Browse the Canuckle archive with puzzle numbers, dates, answers, and Canadian facts in one searchable page built for quick lookups.',
		pageUrl: 'https://wordsolver.tech/canuckle-archive',
		keywords: [
			'canuckle archive',
			'canuckle answers',
			'past canuckle puzzles',
			'canuckle answer history',
			'wordsolverx canuckle archive'
		],
		faqTitle: 'Canuckle Archive FAQs',
		faqs: [
			{
				question: 'Can I search old Canuckle answers here?',
				answer:
					'Yes. The Canuckle archive lets you search by puzzle number, date, answer, or fact text so you can find earlier entries quickly.'
			},
			{
				question: 'Does this page include the full Canuckle answer history?',
				answer:
					'The archive covers the visible Canuckle puzzle range available from the current dataset, including dates, answers, and facts for each indexed puzzle.'
			},
			{
				question: 'Can I jump from the archive to the Canuckle solver?',
				answer:
					'Yes. The archive keeps the Canuckle solver and answer today page close by so you can move between research and solving without opening a separate tool.'
			}
		],
		howToTitle: 'How to use the Canuckle archive',
		howToSteps: [
			{ name: 'Search by date or answer', text: 'Use the archive search box to filter by puzzle number, date, answer, or fact text.' },
			{ name: 'Open any archive entry', text: 'Expand a puzzle card to read the full Canuckle fact, answer, and available distribution details.' },
			{ name: 'Switch to today or the solver', text: 'Use the top tabs to move between the live answer page and the Canuckle solver when needed.' }
		],
		sections: [
			{
				title: 'Why the Canuckle archive matters',
				paragraphs: [
					'Past Canuckle answers help you avoid repeats, confirm puzzle dates, and revisit older Canadian facts without digging through daily posts one by one.',
					'Keeping the archive on a permanent route also gives Google a clearer archive destination than a long list of thin date pages.'
				]
			},
			{
				title: 'What makes this archive easy to use',
				paragraphs: [
					'The page loads into a searchable list so you can scan large sections of Canuckle history quickly on desktop or mobile.',
					'Because the archive lives alongside the dedicated answer today and solver routes, the full Canuckle section now has a cleaner internal-linking structure for both users and crawlers.'
				]
			}
		],
		chips: ['Archive page', 'Searchable answers', 'Date lookup'],
		cta: {
			label: 'See Canuckle answer today',
			href: getCanucklePagePath('today')
		}
	};
}

export function getWordlebotStructuredData(config: WordlebotPageConfig) {
	if (config.appConfig.pageType === 'solver') {
		return JSON.stringify([
			generateFAQSchema(config.faqs),
			generateHowToSchema(config.howToTitle, config.howToSteps),
			generateSoftwareApplicationSchema(config.title, 'GameApplication'),
			generateWebPageSchema(config.title, config.description, config.pageUrl)
		]);
	}

	if (config.appConfig.pageType === 'canuckle-archive') {
		return JSON.stringify([
			generateCollectionPageSchema(config.title, config.description, config.pageUrl, [
				{
					name: 'Canuckle Answer Today',
					url: `https://wordsolver.tech${getCanucklePagePath('today')}`
				},
				{
					name: 'Canuckle Archive',
					url: `https://wordsolver.tech${getCanucklePagePath('archive')}`
				},
				{
					name: 'Canuckle Solver',
					url: `https://wordsolver.tech${getCanucklePagePath('solver')}`
				}
			]),
			generateFAQSchema(config.faqs),
			generateWebPageSchema(config.title, config.description, config.pageUrl)
		]);
	}

	return JSON.stringify([
		generateFAQSchema(config.faqs),
		generateWebPageSchema(config.title, config.description, config.pageUrl)
	]);
}

export function getWordlebotGameIndexLinks() {
	return WORDLEBOT_GAMES.map((game) => {
		if (game.slug === 'wordle') {
			return WORDLEBOT_WORDLE_SOLVER_LENGTHS.map((length) => ({
				name: `${length}-Letter Wordle Solver`,
				href: getWordleLengthSolverPath(length)
			}));
		}

		if (game.slug === 'spotle') {
			return [{ name: 'Spotle Wordle Solver', href: '/spotle-wordle-solver' }];
		}

		if (game.slug === 'canuckle') {
			return [
				{ name: 'Canuckle Answer Today', href: getCanucklePagePath('today') },
				{ name: 'Canuckle Archive', href: getCanucklePagePath('archive') },
				{ name: 'Canuckle Solver', href: getCanucklePagePath('solver') }
			];
		}

		return [
			{
				name: `${sentenceCaseGame(game)} Solver`,
				href: `/${game.slug}-solver`
			}
		];
	}).flat();
}

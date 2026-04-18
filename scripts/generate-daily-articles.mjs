import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(projectRoot, '..');

const outputPath = path.join(projectRoot, 'src', 'lib', 'generated', 'daily-articles.json');
const skillPath = path.join(workspaceRoot, '.opencode', 'human-wiriting', 'SKILL.md');
const colordleDataPath = path.join(projectRoot, 'static', 'colordle_data.json');

const WORDLE_API_BASE_URL =
  process.env.WORDLE_API_BASE_URL ?? 'https://api.wordsolverx.workers.dev';
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const AGENT_ROUTER_BASE_URL = 'https://agentrouter.org/v1';
const DEFAULT_TIMEOUT_MS = 180000;

const TODAY_ARTICLE_REGISTRY = [
  {
    key: 'wordle-answer-today',
    gameName: 'Wordle',
    mode: 'wordle'
  },
  {
    key: 'colordle-answer-today',
    gameName: 'Colordle',
    mode: 'colordle'
  },
  {
    key: 'betweenle-answer-today',
    gameName: 'Betweenle',
    mode: 'generic',
    notes:
      'Daily geography-style puzzle page with answer, clue cards, solver links, and archive navigation.'
  },
  {
    key: 'canuckle-answer-today',
    gameName: 'Canuckle',
    mode: 'generic',
    notes:
      'Canadian Wordle-style answer page with reveal card, puzzle number, fact section, solver link, and archive link.'
  },
  {
    key: 'colorfle-answer-today',
    gameName: 'Colorfle',
    mode: 'generic',
    notes: 'Daily color-mixing answer page with clue sections and supporting solver/archive links.'
  },
  {
    key: 'contexto-answer-today',
    gameName: 'Contexto',
    mode: 'generic',
    notes: 'Daily semantic guessing page with hints, answer reveal, and archive support.'
  },
  {
    key: 'countryle-answer-today',
    gameName: 'Countryle',
    mode: 'generic',
    notes: 'Daily country answer page with directional and comparison hints.'
  },
  {
    key: 'dotadle-answer-today',
    gameName: 'Dotadle',
    mode: 'generic',
    notes: 'Daily Dota answer page with multiple game modes and fan-focused trivia context.'
  },
  {
    key: 'framed-answer-today',
    gameName: 'Framed',
    mode: 'generic',
    notes: 'Daily movie answer page with archive and reveal-heavy browsing behavior.'
  },
  {
    key: 'globle-answer-today',
    gameName: 'Globle',
    mode: 'generic',
    notes: 'Daily mystery country page with geography hints and archive links.'
  },
  {
    key: 'loldle-answer-today',
    gameName: 'LoLdle',
    mode: 'generic',
    notes: 'Daily League of Legends answer page with multiple modes and character-focused hints.'
  },
  {
    key: 'narutodle-answer-today',
    gameName: 'Narutodle',
    mode: 'generic',
    notes: 'Daily Naruto answer page with multiple trivia modes and answer sections.'
  },
  {
    key: 'nerdle-answer-today',
    gameName: 'Nerdle',
    mode: 'generic',
    notes: 'Daily math puzzle answer page with equation-first solving guidance.'
  },
  {
    key: 'onepiecedle-answer-today',
    gameName: 'OnePiecedle',
    mode: 'generic',
    notes: 'Daily One Piece answer page with fan-oriented quiz modes.'
  },
  {
    key: 'phoodle-answer-today',
    gameName: 'Phoodle',
    mode: 'generic',
    notes: 'Daily food-word answer page with hints, answer reveal, and recent history.'
  },
  {
    key: 'phrazle-answer-today',
    gameName: 'Phrazle',
    mode: 'generic',
    notes: 'Daily phrase page with morning and afternoon answers.'
  },
  {
    key: 'pokedle-answer-today',
    gameName: 'Pokedle',
    mode: 'generic',
    notes: 'Daily Pokemon answer page with multiple themed modes and fan-readable explanations.'
  },
  {
    key: 'quordle-answer-today',
    gameName: 'Quordle',
    mode: 'generic',
    notes: 'Daily multi-board word page with several modes like classic, chill, extreme, sequence, rescue, and weekly.'
  },
  {
    key: 'searchle-answer-today',
    gameName: 'Searchle',
    mode: 'generic',
    notes: 'Daily search-query answer page with prompt-style hints and archive links.'
  },
  {
    key: 'semantle-answer-today',
    gameName: 'Semantle',
    mode: 'generic',
    notes: 'Daily semantic-word page with clue widgets and answer explanation.'
  },
  {
    key: 'smashdle-answer-today',
    gameName: 'Smashdle',
    mode: 'generic',
    notes: 'Daily Smash Bros answer page with multiple modes and trivia sections.'
  },
  {
    key: 'spotle-answer-today',
    gameName: 'Spotle',
    mode: 'generic',
    notes: 'Daily music artist answer page with archive support and music-game context.'
  },
  {
    key: 'sportle-answer-today',
    gameName: 'Sportle',
    mode: 'generic',
    notes: 'Daily sports-themed answer page.'
  },
  {
    key: 'waffle-answer-today',
    gameName: 'Waffle',
    mode: 'generic',
    notes: 'Daily grid-word answer page with solved layout and supporting explanation.'
  },
  {
    key: 'worldle-answer-today',
    gameName: 'Worldle',
    mode: 'generic',
    notes: 'Daily country silhouette page with geography clues and archive lookup.'
  }
];

function parseKeyList(...values) {
  const keys = values
    .filter(Boolean)
    .flatMap((value) => String(value).split(/[\r\n,]+/))
    .map((value) => value.trim())
    .filter(Boolean);

  return [...new Set(keys)];
}

function getTargetDate(now = new Date()) {
  if (process.env.TARGET_DATE) {
    return process.env.TARGET_DATE;
  }

  const boundary = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    16,
    30,
    0,
    0
  );
  const visibleOffset = now.getTime() >= boundary ? 1 : 0;
  const targetDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + visibleOffset)
  );

  return targetDate.toISOString().slice(0, 10);
}

function formatLongDate(dateKey) {
  return new Date(`${dateKey}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

function stripHtml(html) {
  return String(html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(html) {
  const text = stripHtml(html);
  if (!text) {
    return 0;
  }

  return text.split(' ').length;
}

function sanitizeModelJson(raw) {
  const text = String(raw ?? '').trim();
  if (!text) {
    throw new Error('Model returned an empty response.');
  }

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : text;
  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('Model response did not contain a JSON object.');
  }

  return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
}

async function readSkillText() {
  try {
    const raw = await readFile(skillPath, 'utf8');
    if (!raw.trim()) {
      throw new Error(`Human writing skill file is empty: ${skillPath}`);
    }
    return raw.trim();
  } catch (error) {
    console.warn(
      `Unable to read the human writing skill at ${skillPath}. Article generation will be skipped for this run.`,
      error
    );
    return null;
  }
}

async function fetchJson(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      'User-Agent': 'WordSolverX Daily Article Builder',
      ...(init.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`);
  }

  return response.json();
}

async function getWordleContext(targetDate) {
  let payload = null;

  try {
    payload = await fetchJson(`${WORDLE_API_BASE_URL}/api/date/${targetDate}?simple=true`);
  } catch (error) {
    console.warn(`Unable to fetch Wordle worker payload for ${targetDate}: ${error}`);
  }

  if (!payload?.solution) {
    const nytPayload = await fetchJson(`https://www.nytimes.com/svc/wordle/v2/${targetDate}.json`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 WordSolverX Daily Article Builder'
      }
    });

    payload = {
      id: nytPayload.days_since_launch ?? null,
      date: targetDate,
      solution: nytPayload.solution,
      editor: nytPayload.editor ?? null,
      days_since_launch: nytPayload.days_since_launch ?? null
    };
  }

  let recentAnswers = [];

  try {
    const latestPayload = await fetchJson(`${WORDLE_API_BASE_URL}/api/today?simple=true`);
    recentAnswers = Array.isArray(latestPayload?.recent_answers)
      ? latestPayload.recent_answers.slice(0, 5)
      : [];
  } catch (error) {
    console.warn(`Unable to fetch recent Wordle answers: ${error}`);
  }

  const solution = String(payload.solution ?? '').toLowerCase();
  if (!solution) {
    throw new Error(`Missing Wordle solution for ${targetDate}.`);
  }

  const letters = solution.split('');
  const vowelCount = letters.filter((letter) => 'aeiou'.includes(letter)).length;
  const hasRepeatedLetter = new Set(letters).size !== letters.length;

  return {
    date: targetDate,
    formattedDate: formatLongDate(targetDate),
    solution,
    solutionUpper: solution.toUpperCase(),
    wordleNumber: payload.id ?? payload.days_since_launch ?? null,
    editor: payload.editor ?? null,
    vowelCount,
    hasRepeatedLetter,
    firstLetter: solution[0]?.toUpperCase() ?? '',
    lastLetter: solution.at(-1)?.toUpperCase() ?? '',
    recentAnswers: recentAnswers
      .filter((entry) => entry?.solution && entry?.date)
      .map((entry) => ({
        date: entry.date,
        solution: String(entry.solution).toUpperCase()
      }))
  };
}

function getHueFamilyFromHex(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) {
    return 'neutral';
  }

  const r = parseInt(match[1], 16) / 255;
  const g = parseInt(match[2], 16) / 255;
  const b = parseInt(match[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta < 0.1) {
    return max < 0.3 ? 'dark-neutral' : max > 0.7 ? 'light-neutral' : 'neutral';
  }

  let hue = 0;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;

  hue = ((hue * 60) + 360) % 360;

  if (hue < 30 || hue >= 330) return 'red';
  if (hue < 70) return 'orange';
  if (hue < 90) return 'yellow';
  if (hue < 160) return 'green';
  if (hue < 200) return 'cyan';
  if (hue < 260) return 'blue';
  if (hue < 300) return 'purple';
  return 'pink';
}

async function getColordleContext(targetDate) {
  const raw = await readFile(colordleDataPath, 'utf8');
  const dataset = JSON.parse(raw);
  const entry = Array.isArray(dataset.entries)
    ? dataset.entries.find((candidate) => candidate.date === targetDate)
    : null;

  if (!entry?.color?.name || !entry?.color?.hex) {
    throw new Error(`Missing Colordle entry for ${targetDate}.`);
  }

  return {
    date: targetDate,
    formattedDate: formatLongDate(targetDate),
    dayNum: entry.dayNum ?? null,
    colorName: String(entry.color.name),
    colorHex: String(entry.color.hex).toUpperCase(),
    hueFamily: getHueFamilyFromHex(String(entry.color.hex)),
    recentColors: Array.isArray(dataset.entries)
      ? dataset.entries
          .filter((candidate) => candidate.date <= targetDate)
          .slice(-5)
          .reverse()
          .map((candidate) => ({
            date: candidate.date,
            colorName: String(candidate.color.name),
            colorHex: String(candidate.color.hex).toUpperCase()
          }))
      : []
  };
}

function buildWordlePrompt(skillText, context) {
  return [
    'You are writing a daily Wordle answer page for a real site. Return JSON only.',
    '',
    'Human writing rules to follow:',
    skillText,
    '',
    'Output shape:',
    '{',
    '  "title": "string",',
    '  "summary": "40-70 words",',
    '  "bonusHints": ["string", "string", "string", "string"],',
    '  "contentGuideHtml": "valid HTML fragment" ',
    '}',
    '',
    'Critical rules:',
    '- `contentGuideHtml` must be at least 1100 words after HTML tags are stripped.',
    '- Do not use markdown fences.',
    '- Do not sound like generic AI or SEO filler.',
    '- Do not invent personal stories, test results, or private knowledge.',
    '- Use concrete observations from the word itself and the recent answers provided.',
    '- Keep the first 5 hints spoiler-safe. Do not reveal the answer before the reveal section.',
    '- Use straightforward American English.',
    '- Keep links internal to wordsolver.tech only when you actually need a link.',
    '- Avoid fake etymology or dictionary trivia unless you are highly confident from general knowledge.',
    '',
    'Required exact section order inside `contentGuideHtml`:',
    '1. `<h2>5 Hints for Today\'s Wordle</h2>` followed by `<ul class="hints-list">...</ul>`',
    '2. `<h2>Today\'s Wordle Answer Revealed</h2>` followed by one reveal paragraph',
    '3. `<h2>Why This Word Fits Today\'s Puzzle</h2>`',
    '4. `<h2>Meaning and Everyday Use</h2>`',
    '5. `<h2>How to Work Toward the Answer</h2>`',
    '6. `<h2>Best Starter Ideas for This Puzzle</h2>`',
    '7. `<h2>Recent Wordle Pattern Notes</h2>`',
    '8. `<h2>Extra Tips for Keeping a Streak Alive</h2>`',
    '9. `<h2>Frequently Asked Questions</h2>` with at least 4 `<h3>` question headings',
    '',
    'Wordle facts for this page:',
    `- Date: ${context.formattedDate} (${context.date})`,
    `- Answer: ${context.solutionUpper}`,
    `- Puzzle number: ${context.wordleNumber ?? 'unknown'}`,
    `- Editor: ${context.editor ?? 'unknown'}`,
    `- Vowel count: ${context.vowelCount}`,
    `- Has repeated letters: ${context.hasRepeatedLetter ? 'yes' : 'no'}`,
    `- Starts with: ${context.firstLetter}`,
    `- Ends with: ${context.lastLetter}`,
    `- Recent answers: ${context.recentAnswers.map((entry) => `${entry.solution} (${entry.date})`).join(', ') || 'none supplied'}`,
    '',
    'Make the summary and bonus hints useful but concise. Bonus hints should feel like fresh extra clues, not copies of the main five hints.'
  ].join('\n');
}

function buildColordlePrompt(skillText, context) {
  return [
    'You are writing a daily Colordle answer page for a real site. Return JSON only.',
    '',
    'Human writing rules to follow:',
    skillText,
    '',
    'Output shape:',
    '{',
    '  "title": "string",',
    '  "summary": "40-70 words",',
    '  "bonusHints": ["string", "string", "string", "string"],',
    '  "articleHtml": "valid HTML fragment"',
    '}',
    '',
    'Critical rules:',
    '- `articleHtml` must be at least 1100 words after HTML tags are stripped.',
    '- Do not use markdown fences.',
    '- Do not invent first-hand gameplay or made-up scoring data.',
    '- The site already has logic-based color clues and a logic-based guess path. Your job is to write the surrounding human article text only.',
    '- Keep the writing grounded in the supplied color name, hex code, hue family, and recent history.',
    '- Use valid HTML with clear headings and normal paragraphs.',
    '',
    'Required section order inside `articleHtml`:',
    '1. `<h2>Today\'s Colordle answer at a glance</h2>`',
    '2. `<h2>What kind of color this is</h2>`',
    '3. `<h2>How to narrow your guesses toward it</h2>`',
    '4. `<h2>Where players usually go wrong</h2>`',
    '5. `<h2>How the score logic actually helps</h2>`',
    '6. `<h2>Questions players keep asking</h2>` with at least 4 `<h3>` question headings',
    '',
    'Colordle facts for this page:',
    `- Date: ${context.formattedDate} (${context.date})`,
    `- Day number: ${context.dayNum ?? 'unknown'}`,
    `- Color name: ${context.colorName}`,
    `- Hex code: ${context.colorHex}`,
    `- Hue family: ${context.hueFamily}`,
    `- Recent colors: ${context.recentColors.map((entry) => `${entry.colorName} ${entry.colorHex} (${entry.date})`).join(', ') || 'none supplied'}`,
    '',
    'Make the bonus hints feel like extra nudges a human editor would add after checking the answer page.'
  ].join('\n');
}

function buildGenericPrompt(skillText, entry, targetDate) {
  const formattedDate = formatLongDate(targetDate);

  return [
    'You are writing a daily answer-page article for a real puzzle website. Return JSON only.',
    '',
    'Human writing rules to follow:',
    skillText,
    '',
    'Output shape:',
    '{',
    '  "title": "string",',
    '  "summary": "40-70 words",',
    '  "articleHtml": "valid HTML fragment"',
    '}',
    '',
    'Critical rules:',
    '- `articleHtml` must be at least 1000 words after HTML tags are stripped.',
    '- Do not use markdown fences.',
    '- Do not mention AI, prompts, models, or automation.',
    '- Do not make up private stats, fake test runs, or first-hand experiences.',
    '- Keep a short evergreen explanation of what the game is, but do not let the whole article become static filler.',
    '- Make the article feel like a real daily update tied to the current date and the page purpose.',
    '- Keep the tone natural, specific, and non-corporate.',
    '',
    'Required section order inside `articleHtml`:',
    `1. <h2>Today\\'s ${entry.gameName} page at a glance</h2>`,
    `2. <h2>What to pay attention to in today\\'s ${entry.gameName} puzzle</h2>`,
    `3. <h2>How to use this page without spoiling more than you want</h2>`,
    `4. <h2>Common mistakes players make on ${entry.gameName}</h2>`,
    `5. <h2>Questions players keep asking about ${entry.gameName}</h2> with at least 4 <h3> question headings`,
    '',
    'Page facts:',
    `- Game: ${entry.gameName}`,
    `- Route key: ${entry.key}`,
    `- Date: ${formattedDate} (${targetDate})`,
    `- Page notes: ${entry.notes}`,
    '',
    'Keep the copy useful for someone landing on an "answer today" page. Mention hints, reveal behavior, archive links, or solver links when that makes sense for the page type.'
  ].join('\n');
}

async function callChatCompletion({ baseUrl, apiKey, model, prompt }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'WordSolverX Daily Article Builder'
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 4096,
        messages: [
          {
            role: 'system',
            content:
              'You write high-signal website copy and must return strictly valid JSON that matches the requested shape.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
      signal: controller.signal
    });

    const raw = await response.text();
    if (!response.ok) {
      throw new Error(`${response.status} ${raw}`);
    }

    const payload = JSON.parse(raw);
    const choice = payload?.choices?.[0]?.message?.content;

    if (typeof choice === 'string') {
      return choice;
    }

    if (Array.isArray(choice)) {
      return choice.map((item) => item?.text ?? item?.content ?? '').join('').trim();
    }

    throw new Error('Model response did not include a usable message content field.');
  } finally {
    clearTimeout(timeout);
  }
}

function validateArticlePayload(game, payload, targetDate) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Model payload was not an object.');
  }

  if (game === 'wordle') {
    if (!Array.isArray(payload.bonusHints) || payload.bonusHints.length < 3) {
      throw new Error('Wordle payload must include at least 3 bonus hints.');
    }

    const html = String(payload.contentGuideHtml ?? '');
    if (!html.includes("<h2>5 Hints for Today's Wordle</h2>")) {
      throw new Error('Wordle HTML is missing the required hints heading.');
    }
    if (!html.includes("<h2>Today's Wordle Answer Revealed</h2>")) {
      throw new Error('Wordle HTML is missing the required reveal heading.');
    }
    if (!html.includes(targetDate)) {
      throw new Error('Wordle HTML does not include the target date.');
    }
    if (countWords(html) < 1000) {
      throw new Error('Wordle HTML did not reach the minimum word count.');
    }
    return {
      title: String(payload.title ?? ''),
      summary: String(payload.summary ?? ''),
      bonusHints: payload.bonusHints.map((hint) => String(hint)),
      contentGuideHtml: html
    };
  }

  const html = String(payload.articleHtml ?? '');

  if (game === 'generic') {
    if (countWords(html) < 1000) {
      throw new Error('Generic article HTML did not reach the minimum word count.');
    }
    return {
      title: String(payload.title ?? ''),
      summary: String(payload.summary ?? ''),
      bonusHints: [],
      articleHtml: html
    };
  }

  if (!Array.isArray(payload.bonusHints) || payload.bonusHints.length < 3) {
    throw new Error('Colordle payload must include at least 3 bonus hints.');
  }

  if (!html.includes("<h2>Today's Colordle answer at a glance</h2>")) {
    throw new Error('Colordle HTML is missing the required opening section.');
  }
  if (!html.includes(targetDate) && !html.includes(formatLongDate(targetDate))) {
    throw new Error('Colordle HTML does not include the target date.');
  }
  if (countWords(html) < 1000) {
    throw new Error('Colordle HTML did not reach the minimum word count.');
  }
  return {
    title: String(payload.title ?? ''),
    summary: String(payload.summary ?? ''),
    bonusHints: payload.bonusHints.map((hint) => String(hint)),
    articleHtml: html
  };
}

async function generateWithProviders({ game, prompt, targetDate }) {
  const providers = [
    {
      provider: 'nvidia',
      baseUrl: NVIDIA_BASE_URL,
      models: ['minimaxai/minimax-m2.7', 'z-ai/glm4.7'],
      apiKeys: parseKeyList(process.env.NVIDIA_API_KEYS, process.env.NVIDIA_API_KEY)
    },
    {
      provider: 'agentrouter',
      baseUrl: AGENT_ROUTER_BASE_URL,
      models: ['glm-4.6'],
      apiKeys: parseKeyList(process.env.AGENT_ROUTER_TOKENS, process.env.AGENT_ROUTER_TOKEN)
    }
  ].filter((provider) => provider.apiKeys.length > 0);

  if (providers.length === 0) {
    return null;
  }

  const failures = [];

  for (const provider of providers) {
    for (const model of provider.models) {
      for (const [index, apiKey] of provider.apiKeys.entries()) {
        const keyLabel = `${provider.provider}:${model}:key${index + 1}`;
        try {
          console.log(`Generating ${game} article with ${keyLabel}`);
          const raw = await callChatCompletion({
            baseUrl: provider.baseUrl,
            apiKey,
            model,
            prompt
          });
          const parsed = sanitizeModelJson(raw);
          const validated = validateArticlePayload(game, parsed, targetDate);

          return {
            ...validated,
            meta: {
              provider: provider.provider,
              model,
              fallbackUsed: provider.provider !== 'nvidia',
              generatedAt: new Date().toISOString(),
              wordCount: countWords(validated.contentGuideHtml ?? validated.articleHtml ?? '')
            }
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          failures.push(`${keyLabel} -> ${message}`);
          console.warn(`Failed with ${keyLabel}: ${message}`);
        }
      }
    }
  }

  throw new Error(`All configured providers failed for ${game} article generation.\n${failures.join('\n')}`);
}

async function readExistingBundle() {
  try {
    const raw = await readFile(outputPath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      generatedAt: parsed.generatedAt ?? null,
      articles: parsed.articles ?? {}
    };
  } catch {
    return {
      generatedAt: null,
      articles: {}
    };
  }
}

function stripArticlesForDate(articles, targetDate) {
  return Object.fromEntries(
    Object.entries(articles).filter(([, article]) => article?.date !== targetDate)
  );
}

async function main() {
  const targetDate = getTargetDate();
  const skillText = await readSkillText();
  const existingBundle = await readExistingBundle();
  const hasProviders =
    parseKeyList(process.env.NVIDIA_API_KEYS, process.env.NVIDIA_API_KEY).length > 0 ||
    parseKeyList(process.env.AGENT_ROUTER_TOKENS, process.env.AGENT_ROUTER_TOKEN).length > 0;

  if (!hasProviders) {
    console.warn('No NVIDIA or AgentRouter keys were provided. Keeping the existing daily article bundle.');
    if (!existingBundle.generatedAt) {
      console.warn('No existing article bundle was found yet. The frontend will fall back to built-in content.');
    }
    return;
  }

  if (!skillText) {
    console.warn('Human writing skill is unavailable. Keeping the existing daily article bundle.');
    return;
  }

  let wordleContext = null;
  let colordleContext = null;

  try {
    wordleContext = await getWordleContext(targetDate);
  } catch (error) {
    console.warn(`Unable to prepare Wordle article context for ${targetDate}:`, error);
  }

  try {
    colordleContext = await getColordleContext(targetDate);
  } catch (error) {
    console.warn(`Unable to prepare Colordle article context for ${targetDate}:`, error);
  }

  const generatedEntries = [];
  const failedEntries = [];

  for (const entry of TODAY_ARTICLE_REGISTRY) {
    try {
      let generatedEntry;

      if (entry.mode === 'wordle') {
        if (!wordleContext) {
          throw new Error('Wordle context was not available.');
        }

        const article = await generateWithProviders({
          game: 'wordle',
          prompt: buildWordlePrompt(skillText, wordleContext),
          targetDate
        });

        generatedEntry = [
          entry.key,
          {
            articleKey: entry.key,
            game: 'wordle',
            date: targetDate,
            articleHtml: article.contentGuideHtml,
            ...article
          }
        ];
      } else if (entry.mode === 'colordle') {
        if (!colordleContext) {
          throw new Error('Colordle context was not available.');
        }

        const article = await generateWithProviders({
          game: 'colordle',
          prompt: buildColordlePrompt(skillText, colordleContext),
          targetDate
        });

        generatedEntry = [
          entry.key,
          {
            articleKey: entry.key,
            game: 'colordle',
            date: targetDate,
            ...article
          }
        ];
      } else {
        const article = await generateWithProviders({
          game: 'generic',
          prompt: buildGenericPrompt(skillText, entry, targetDate),
          targetDate
        });

        generatedEntry = [
          entry.key,
          {
            articleKey: entry.key,
            date: targetDate,
            title: article.title,
            summary: article.summary,
            articleHtml: article.articleHtml,
            meta: article.meta
          }
        ];
      }

      generatedEntries.push(generatedEntry);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failedEntries.push(`${entry.key}: ${message}`);
      console.warn(`Skipping article generation for ${entry.key}: ${message}`);
    }
  }

  const mergedArticles = {
    ...stripArticlesForDate(existingBundle.articles, targetDate),
    ...Object.fromEntries(generatedEntries)
  };

  const nextBundle = {
    generatedAt: new Date().toISOString(),
    articles: mergedArticles
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(nextBundle, null, 2)}\n`, 'utf8');

  if (failedEntries.length > 0) {
    console.warn(
      `Daily article generation finished with ${failedEntries.length} skipped route(s). The site will still deploy and those pages will simply hide the article block for ${targetDate}.`
    );
  }

  console.log(
    `Daily articles ready for ${targetDate} across ${generatedEntries.length} today pages.`
  );
}

main().catch((error) => {
  console.error(
    'Daily article generation failed unexpectedly. Keeping deployment non-blocking so the site can still publish answers without the article sections.',
    error
  );
});

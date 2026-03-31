import seedrandom from 'seedrandom';

export const COLORS: string[] = [
  "#FFFFFF", "#FFFAC8", "#FABEBE", "#AAFFC3", "#E6BEFF",
  "#46F0F0", "#FFE119", "#BCF60C", "#F58231", "#3CB44B",
  "#F032E6", "#808000", "#008080", "#9A6324", "#E6194B",
  "#4363D8", "#911EB4", "#800000", "#000075", "#000000"
];

export const COLOR_NAMES: string[] = [
  "White", "Light Yellow", "Pink", "Light Green", "Lavender",
  "Cyan", "Yellow", "Lime", "Orange", "Green",
  "Magenta", "Olive", "Teal", "Brown", "Red",
  "Blue", "Purple", "Maroon", "Navy", "Black"
];

export const NUM_ANSWER_BLOCKS = [3, 4];

export const WEIGHTS: number[][] = [
  [0.5, 0.34, 0.16],
  [0.4, 0.3, 0.2, 0.1]
];

const LAUNCH_DATE = new Date("4/25/2022 17:00:00");

export interface RGB { r: number; g: number; b: number; }
export interface YCC { r: number; y: number; b: number; }
export interface PuzzleAnswer {
  puzzleNumber: number;
  mode: number;
  colors: number[];
  targetColor: RGB;
  targetHex: string;
  colorNames: string[];
  colorHexes: string[];
}
export interface DayInfo {
  puzzleNumber: number;
  date: string;
  nextResetTime: number;
}

export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

export function rgbToHex(rgb: RGB): string {
  const r = Math.max(0, Math.min(255, Math.round(rgb.r))).toString(16).padStart(2, '0');
  const g = Math.max(0, Math.min(255, Math.round(rgb.g))).toString(16).padStart(2, '0');
  const b = Math.max(0, Math.min(255, Math.round(rgb.b))).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export function rgbToYcc(e: RGB): YCC {
  const t = Math.min(e.r, e.g, e.b);
  const o = Math.min(255 - e.r, 255 - e.g, 255 - e.b);
  const a = e.r - t;
  const l = e.g - t;
  const r = e.b - t;
  const s = Math.min(a, l);
  const n = a - s;
  const d = (l + s) / 2;
  const c = (r + l - s) / 2;
  const i = Math.max(n, d, c, 1) / Math.max(a, l, r, 1);
  return { r: n / i + o, y: d / i + o, b: c / i + o };
}

export function yccToRgb(e: YCC): RGB {
  const t = Math.min(e.r, e.y, e.b);
  const o = Math.min(255 - e.r, 255 - e.y, 255 - e.b);
  const a = e.r - t;
  const l = e.y - t;
  const r = e.b - t;
  const s = Math.min(l, r);
  const n = a + l - s;
  const d = l + 2 * s;
  const c = 2 * (r - s);
  const i = Math.max(n, d, c, 1) / Math.max(a, l, r, 1);
  return { r: n / i + o, g: d / i + o, b: c / i + o };
}

export function mixColors(colorIndices: number[], mode: number = 0): RGB {
  const weights = WEIGHTS[mode];
  const yccMix: YCC = { r: 0, y: 0, b: 0 };
  for (let i = 0; i < colorIndices.length; i++) {
    const c = rgbToYcc(hexToRgb(COLORS[colorIndices[i]]));
    yccMix.r += c.r * weights[i];
    yccMix.y += c.y * weights[i];
    yccMix.b += c.b * weights[i];
  }
  yccMix.r = Math.min(255, Math.round(yccMix.r));
  yccMix.y = Math.min(255, Math.round(yccMix.y));
  yccMix.b = Math.min(255, Math.round(yccMix.b));
  const yccResult = yccToRgb(yccMix);

  const rgbMix: RGB = { r: 0, g: 0, b: 0 };
  for (let i = 0; i < colorIndices.length; i++) {
    const c = hexToRgb(COLORS[colorIndices[i]]);
    rgbMix.r += c.r * weights[i];
    rgbMix.g += c.g * weights[i];
    rgbMix.b += c.b * weights[i];
  }
  rgbMix.r = Math.min(255, Math.round(rgbMix.r));
  rgbMix.g = Math.min(255, Math.round(rgbMix.g));
  rgbMix.b = Math.min(255, Math.round(rgbMix.b));

  return {
    r: Math.round((yccResult.r + rgbMix.r) / 2),
    g: Math.round((yccResult.g + rgbMix.g) / 2),
    b: Math.round((yccResult.b + rgbMix.b) / 2)
  };
}

export function getPuzzleNumber(date: Date = new Date()): number {
  const G = date;
  const q = LAUNCH_DATE;
  const z = 60 * (G.getTimezoneOffset() - q.getTimezoneOffset()) * 1000;
  const R = G.getTime() - q.getTime() - z;
  return Math.floor(R / 864e5);
}

function getSeedString(date: Date, mode: number = 0): string {
  const x = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17);
  if (x < date) {
    x.setDate(x.getDate() + 1);
  }
  const dateStr = x.getDate() + " " + x.getMonth() + " " + x.getFullYear();
  return mode + " " + dateStr;
}

export function getPuzzleAnswer(date: Date = new Date(), mode: number = 0): PuzzleAnswer {
  const puzzleNumber = getPuzzleNumber(date);
  const seedStr = getSeedString(date, mode);
  const rng = seedrandom(seedStr);
  const numBlocks = NUM_ANSWER_BLOCKS[mode];
  const T: number[] = [];
  const O = Array.from({ length: 20 }, (_, i) => i);

  for (let e = 0; e < numBlocks; e++) {
    const X = Math.floor(rng() * O.length);
    T[e] = O[X];
    O.splice(X, 1);
  }

  const targetColor = mixColors(T, mode);
  const targetHex = rgbToHex(targetColor);

  return {
    puzzleNumber, mode, colors: T, targetColor, targetHex,
    colorNames: T.map(i => COLOR_NAMES[i]),
    colorHexes: T.map(i => COLORS[i])
  };
}

export function getPuzzleAnswerByNumber(puzzleNumber: number, mode: number = 0): PuzzleAnswer {
  const date = new Date(LAUNCH_DATE.getTime() + puzzleNumber * 864e5);
  return getPuzzleAnswer(date, mode);
}

export function colorSimilarityYCC(color1: RGB, color2: RGB): number {
  const ycc1 = rgbToYcc(color1);
  const ycc2 = rgbToYcc(color2);
  const dist = Math.sqrt(
    Math.pow(ycc1.r - ycc2.r, 2) + Math.pow(ycc1.y - ycc2.y, 2) + Math.pow(ycc1.b - ycc2.b, 2)
  );
  const maxDist = Math.sqrt(3 * Math.pow(255, 2));
  return Math.round(((1 - dist / maxDist) * 1000)) / 10;
}

export function colorSimilarity(color1: RGB, color2: RGB): number {
  const dr = color1.r - color2.r;
  const dg = color1.g - color2.g;
  const db = color1.b - color2.b;
  const maxDistance = Math.sqrt(255 * 255 * 3);
  const distance = Math.sqrt(dr * dr + dg * dg + db * db);
  return Math.round((1 - distance / maxDistance) * 100);
}

export function getColorName(index: number): string { return COLOR_NAMES[index] || "Unknown"; }
export function getColorHex(index: number): string { return COLORS[index] || "#000000"; }

export function getNextResetTime(date: Date = new Date()): number {
  const x = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17);
  if (x <= date) { x.setDate(x.getDate() + 1); }
  return x.getTime();
}

export function getDayInfo(date: Date = new Date()): DayInfo {
  return {
    puzzleNumber: getPuzzleNumber(date),
    date: date.toISOString().split('T')[0],
    nextResetTime: getNextResetTime(date)
  };
}

export function generateAllCombinations(mode: number = 0): number[][] {
  const n = 20;
  const k = NUM_ANSWER_BLOCKS[mode];
  const results: number[][] = [];

  function combine(start: number, current: number[]) {
    if (current.length === k) {
      const perms = permutations(current);
      results.push(...perms);
      return;
    }
    for (let i = start; i < n; i++) {
      current.push(i);
      combine(i + 1, current);
      current.pop();
    }
  }

  combine(0, []);
  return results;
}

function permutations(arr: number[]): number[][] {
  if (arr.length <= 1) return [arr];
  const result: number[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

const cachedCombinationsMap: Record<number, number[][] | null> = { 0: null, 1: null };

export function getAllCombinations(mode: number = 0): number[][] {
  if (!cachedCombinationsMap[mode]) {
    cachedCombinationsMap[mode] = generateAllCombinations(mode);
  }
  return cachedCombinationsMap[mode]!;
}

export function checkGuess(guess: number[], answer: number[], feedback: string[]): boolean {
  const answerCopy = [...answer];
  const guessCopy = [...guess];
  const resultFeedback: string[] = new Array(guess.length).fill('gray');

  for (let i = 0; i < guess.length; i++) {
    if (guessCopy[i] === answerCopy[i]) {
      resultFeedback[i] = 'green';
      answerCopy[i] = -1;
      guessCopy[i] = -2;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (guessCopy[i] === -2) continue;
    const idx = answerCopy.indexOf(guessCopy[i]);
    if (idx !== -1) {
      resultFeedback[i] = 'yellow';
      answerCopy[idx] = -1;
    }
  }

  return resultFeedback.every((f, i) => f === feedback[i]);
}

export function filterPossibilities(guess: number[], feedback: string[], mode: number = 0): number[][] {
  const allCombos = getAllCombinations(mode);
  return allCombos.filter(answer => checkGuess(guess, answer, feedback));
}

export function getCombinationTargetColor(combo: number[], mode: number = 0): { hex: string; rgb: RGB } {
  const rgb = mixColors(combo, mode);
  return { hex: rgbToHex(rgb), rgb };
}

export interface SolveResult {
  colors: number[];
  colorNames: string[];
  colorHexes: string[];
  targetColor: RGB;
  targetHex: string;
  similarity: number;
}

let solveTable: SolveResult[] | null = null;

function getSolveTable(): SolveResult[] {
  if (solveTable) return solveTable;
  solveTable = [];
  const allPerms = generateAllCombinations(0);
  for (const perm of allPerms) {
    const target = mixColors(perm, 0);
    solveTable.push({
      colors: perm,
      colorNames: perm.map(i => COLOR_NAMES[i]),
      colorHexes: perm.map(i => COLORS[i]),
      targetColor: target,
      targetHex: rgbToHex(target),
      similarity: 0,
    });
  }
  return solveTable;
}

export function solveFromHex(hex: string): SolveResult {
  const inputRgb = hexToRgb(hex);
  const table = getSolveTable();
  let bestResult = table[0]!;
  let bestScore = -1;

  for (const entry of table) {
    const score = colorSimilarityYCC(inputRgb, entry.targetColor);
    entry.similarity = score;
    if (score > bestScore) {
      bestScore = score;
      bestResult = entry;
    }
  }

  return bestResult;
}

export function solveFromHexTopN(hex: string, n: number = 5): SolveResult[] {
  const inputRgb = hexToRgb(hex);
  const table = getSolveTable();

  const scored = table.map(entry => ({
    ...entry,
    similarity: colorSimilarityYCC(inputRgb, entry.targetColor),
  }));

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, n);
}

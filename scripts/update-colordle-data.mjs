import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { colornames } from 'color-name-list';
import { colordleColorOverrides } from '../src/lib/data/colordle-color-overrides.js';
import { markUpdateFailure, markUpdateSuccess } from './lib/update-status.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const COLORDLE_SOURCE_URL =
	process.env.COLORDLE_SOURCE_URL ?? 'https://colordle.ryantanen.com/colors.json';
const START_DATE = '2023-08-07';
const DAY_OFFSET = 500;

const targetPath = path.join(projectRoot, 'src', 'lib', 'data', 'colordle-targets.json');
const staticDataPath = path.join(projectRoot, 'static', 'colordle_data.json');

function normalizeName(name) {
	return name.toLowerCase().replace(/\s+/g, '');
}

function buildColorLookup() {
	const lookup = new Map();

	for (const color of colornames) {
		const key = normalizeName(color.name);
		if (!lookup.has(key)) {
			lookup.set(key, color);
		}
	}

	return lookup;
}

const colorLookup = buildColorLookup();

function resolveColor(name) {
	const normalizedName = normalizeName(name);
	const match = colorLookup.get(normalizedName);

	if (match) {
		return {
			name: match.name,
			hex: match.hex
		};
	}

	const override = colordleColorOverrides[normalizedName];
	if (override) {
		return override;
	}

	console.warn(`Colordle color name missing from color-name-list: ${name}`);
	return {
		name,
		hex: '#000000'
	};
}

function buildDateKey(index) {
	const date = new Date(`${START_DATE}T12:00:00Z`);
	date.setUTCDate(date.getUTCDate() + index);
	return date.toISOString().slice(0, 10);
}

function buildDataset(colors) {
	const availableDateStrings = colors.map((_, index) => buildDateKey(index));
	const entries = colors.map((name, index) => ({
		date: availableDateStrings[index],
		dayNum: DAY_OFFSET + index,
		color: resolveColor(name)
	}));

	return {
		generatedAt: new Date().toISOString(),
		sourceUrl: COLORDLE_SOURCE_URL,
		startDate: START_DATE,
		dayOffset: DAY_OFFSET,
		entryCount: entries.length,
		latestDate: availableDateStrings.at(-1) ?? null,
		colors,
		availableDateStrings,
		entries
	};
}

async function fetchColors() {
	const response = await fetch(COLORDLE_SOURCE_URL, {
		headers: {
			accept: 'application/json',
			'user-agent': 'WordSolverX Colordle Dataset Builder'
		}
	});

	if (!response.ok) {
		throw new Error(`Colordle source responded with ${response.status}`);
	}

	const payload = await response.json();

	if (!payload || !Array.isArray(payload.colors) || payload.colors.length === 0) {
		throw new Error('Colordle source returned an empty colors list');
	}

	return payload.colors.map((value) => String(value));
}

async function readJsonIfPresent(filePath) {
	try {
		const raw = await readFile(filePath, 'utf8');
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

async function loadFallbackColors() {
	const targetPayload = await readJsonIfPresent(targetPath);
	if (targetPayload && Array.isArray(targetPayload.colors) && targetPayload.colors.length > 0) {
		return targetPayload.colors.map((value) => String(value));
	}

	const staticPayload = await readJsonIfPresent(staticDataPath);
	if (staticPayload && Array.isArray(staticPayload.colors) && staticPayload.colors.length > 0) {
		return staticPayload.colors.map((value) => String(value));
	}

	throw new Error('No existing Colordle dataset is available for fallback.');
}

async function writeDataset(colors) {
	const dataset = buildDataset(colors);

	await mkdir(path.dirname(targetPath), { recursive: true });
	await mkdir(path.dirname(staticDataPath), { recursive: true });

	await writeFile(targetPath, `${JSON.stringify({ colors }, null, 2)}\n`, 'utf8');
	await writeFile(staticDataPath, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8');

	return dataset;
}

async function main() {
	let colors;
	let usedFallback = false;
	let failureMessage = '';

	try {
		colors = await fetchColors();
	} catch (error) {
		usedFallback = true;
		failureMessage = error instanceof Error ? error.message : String(error);
		console.warn(
			`Failed to refresh Colordle data from ${COLORDLE_SOURCE_URL}. Reusing existing local dataset.`,
			error
		);
		colors = await loadFallbackColors();
	}

	const dataset = await writeDataset(colors);
	const outputMode = usedFallback ? 'cached fallback data' : 'fresh source data';

	if (usedFallback) {
		await markUpdateFailure(
			projectRoot,
			'colordle',
			failureMessage || 'Colordle refresh fell back to the cached dataset.',
			{
				latestDate: dataset.latestDate,
				sourceUrl: COLORDLE_SOURCE_URL
			}
		);
	} else {
		await markUpdateSuccess(projectRoot, 'colordle', {
			latestDate: dataset.latestDate,
			sourceUrl: COLORDLE_SOURCE_URL
		});
	}

	console.log(
		`Colordle dataset ready with ${dataset.entryCount} entries through ${dataset.latestDate} using ${outputMode}.`
	);
}

main().catch((error) => {
	console.error('Unable to prepare Colordle dataset:', error);
	process.exit(1);
});

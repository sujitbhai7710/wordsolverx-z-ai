import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import CryptoJS from 'crypto-js';
import { markUpdateFailure, markUpdateSuccess } from './lib/update-status.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(projectRoot, '..');

const AES_KEY = '4%w!KpB+?FC<P9W*';
const COUNTRYLE_SOURCE_URL = 'https://www.countryle.com/hidden-api/get-daily-country-valid.php';
const COUNTRYLE_START_DATE = new Date(Date.UTC(2022, 10, 15));

const countriesPath = path.join(projectRoot, 'src', 'lib', 'data', 'countryle', 'countries.json');
const archivePath = path.join(projectRoot, 'static', 'countryle_archive.json');
const todayPath = path.join(projectRoot, 'static', 'countryle_today.json');

const fallbackCountriesPath = path.join(repoRoot, 'updated-adding', 'countryle-helper', 'countries.json');
const fallbackArchivePath = path.join(repoRoot, 'updated-adding', 'countryle-helper', 'public', 'archive.json');
const fallbackTodayPath = path.join(repoRoot, 'updated-adding', 'countryle-helper', 'public', 'todays-answer.json');

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function parseDateKey(dateKey) {
  return new Date(`${dateKey}T12:00:00Z`);
}

function formatApiDate(date) {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function getCurrentJstDate() {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return new Date(Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate()));
}

function getGameNumber(date) {
  const diffMs = parseDateKey(toDateKey(date)).getTime() - COUNTRYLE_START_DATE.getTime();
  return Math.floor(diffMs / 86400000) + 1;
}

function decryptCountryId(encryptedId) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedId, AES_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return Number.parseInt(decrypted, 10);
  } catch {
    return -1;
  }
}

async function readJsonIfPresent(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function ensureParent(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function loadCountriesPayload() {
  const existing = await readJsonIfPresent(countriesPath);
  if (existing?.countries?.length) {
    return existing;
  }

  const fallback = await readJsonIfPresent(fallbackCountriesPath);
  if (fallback?.countries?.length) {
    return fallback;
  }

  throw new Error('No Countryle countries dataset is available.');
}

async function loadArchivePayload() {
  const existing = await readJsonIfPresent(archivePath);
  if (existing && typeof existing === 'object') {
    return existing;
  }

  const fallback = await readJsonIfPresent(fallbackArchivePath);
  if (fallback && typeof fallback === 'object') {
    return fallback;
  }

  return {};
}

async function loadFallbackTodayPayload() {
  return readJsonIfPresent(todayPath) ?? readJsonIfPresent(fallbackTodayPath);
}

async function fetchCountryleCountryId(dateKey) {
  const apiDate = formatApiDate(parseDateKey(dateKey));
  const url = `${COUNTRYLE_SOURCE_URL}?date=${apiDate}`;
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'WordSolverX Countryle Dataset Builder'
    },
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    throw new Error(`Countryle source responded with ${response.status}`);
  }

  const payload = await response.json();
  const rawId = payload?.country ?? payload?.id ?? payload;

  if (typeof rawId === 'string') {
    return decryptCountryId(rawId);
  }

  return Number.parseInt(String(rawId), 10);
}

function buildSortedArchive(archive) {
  return Object.fromEntries(
    Object.entries(archive).sort(([left], [right]) => right.localeCompare(left))
  );
}

async function main() {
  const countriesPayload = await loadCountriesPayload();
  const archiveSeed = await loadArchivePayload();
  const fallbackToday = await loadFallbackTodayPayload();
  const countries = Array.isArray(countriesPayload.countries) ? countriesPayload.countries : [];
  const countryById = new Map(countries.map((country) => [country.id, country]));
  const archive = { ...archiveSeed };
  const failedDates = [];

  const todayDate = getCurrentJstDate();

  for (let offset = 7; offset >= 0; offset -= 1) {
    const date = new Date(todayDate);
    date.setUTCDate(date.getUTCDate() - offset);
    const dateKey = toDateKey(date);

    try {
      const countryId = await fetchCountryleCountryId(dateKey);
      const country = countryById.get(countryId);

      if (!country) {
        continue;
      }

      archive[dateKey] = {
        gameNumber: getGameNumber(date),
        date: dateKey,
        apiDate: formatApiDate(date),
        country: {
          id: country.id,
          country: country.country,
          continent: country.continent,
          hemisphere: country.hemisphere,
          population: country.population,
          avgTemperature: country.avgTemperature,
          surface: country.surface,
          coordinates: country.coordinates,
          density: country.density,
          PIB: country.PIB,
          percentOfRenewableE: country.percentOfRenewableE,
          co2Total: country.co2Total,
          coastlineLength: country.coastlineLength,
          maxAltitude: country.maxAltitude,
          rankingFifa: country.rankingFifa,
          footballMatches: country.footballMatches,
          mapsUrl: country.mapsUrl
        },
        scrapedAt: new Date().toISOString()
      };
    } catch (error) {
      failedDates.push(dateKey);
      console.warn(`Failed to refresh Countryle entry for ${dateKey}:`, error instanceof Error ? error.message : String(error));
    }
  }

  const sortedArchive = buildSortedArchive(archive);
  const todayKey = toDateKey(todayDate);
  const todayEntry = sortedArchive[todayKey] ?? sortedArchive[Object.keys(sortedArchive)[0]] ?? null;
  const todayPayload = todayEntry
    ? {
        date: todayEntry.date,
        gameNumber: todayEntry.gameNumber,
        updated: new Date().toISOString(),
        country: todayEntry.country
      }
    : fallbackToday;

  await ensureParent(countriesPath);
  await ensureParent(archivePath);
  await ensureParent(todayPath);

  await writeFile(countriesPath, `${JSON.stringify(countriesPayload, null, 2)}\n`, 'utf8');
  await writeFile(archivePath, `${JSON.stringify(sortedArchive, null, 2)}\n`, 'utf8');

  if (todayPayload) {
    await writeFile(todayPath, `${JSON.stringify(todayPayload, null, 2)}\n`, 'utf8');
  }

  if (failedDates.length > 0) {
    await markUpdateFailure(
      projectRoot,
      'countryle',
      `Failed to refresh ${failedDates.length} Countryle date${failedDates.length === 1 ? '' : 's'}.`,
      {
        failedDates,
        latestDate: todayPayload?.date ?? todayKey
      }
    );
  } else {
    await markUpdateSuccess(projectRoot, 'countryle', {
      failedDates: [],
      latestDate: todayPayload?.date ?? todayKey
    });
  }

  console.log(
    `Countryle dataset ready with ${Object.keys(sortedArchive).length} archive entries through ${todayPayload?.date ?? 'unknown'}.`
  );
}

main().catch((error) => {
  console.error('Unable to prepare Countryle dataset:', error);
  process.exit(1);
});

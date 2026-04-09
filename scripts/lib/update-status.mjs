import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const STATUS_DIRECTORY = '.cache';
const STATUS_FILENAME = 'update-status.json';

function getStatusFilePath(projectRoot) {
  return path.join(projectRoot, STATUS_DIRECTORY, STATUS_FILENAME);
}

async function readJsonIfPresent(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function createEmptyStatus() {
  return {
    updatedAt: null,
    games: {}
  };
}

export async function readUpdateStatus(projectRoot) {
  const filePath = getStatusFilePath(projectRoot);
  const existing = await readJsonIfPresent(filePath);

  if (!existing || typeof existing !== 'object') {
    return createEmptyStatus();
  }

  return {
    updatedAt: existing.updatedAt ?? null,
    games: existing.games && typeof existing.games === 'object' ? existing.games : {}
  };
}

export async function writeUpdateStatus(projectRoot, status) {
  const filePath = getStatusFilePath(projectRoot);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(
    filePath,
    `${JSON.stringify(
      {
        ...status,
        updatedAt: new Date().toISOString()
      },
      null,
      2
    )}\n`,
    'utf8'
  );
}

async function updateGameStatus(projectRoot, gameKey, updater) {
  const status = await readUpdateStatus(projectRoot);
  const currentGameStatus =
    status.games[gameKey] && typeof status.games[gameKey] === 'object' ? status.games[gameKey] : {};

  status.games[gameKey] = {
    ...currentGameStatus,
    ...updater(currentGameStatus)
  };

  await writeUpdateStatus(projectRoot, status);
  return status.games[gameKey];
}

export async function markUpdateSuccess(projectRoot, gameKey, metadata = {}) {
  const now = new Date().toISOString();
  return updateGameStatus(projectRoot, gameKey, () => ({
    needsRetry: false,
    lastRunAt: now,
    lastSuccessAt: now,
    lastFailureAt: null,
    lastFailureMessage: null,
    ...metadata
  }));
}

export async function markUpdateFailure(projectRoot, gameKey, failureMessage, metadata = {}) {
  const now = new Date().toISOString();
  return updateGameStatus(projectRoot, gameKey, (currentGameStatus) => ({
    ...currentGameStatus,
    needsRetry: true,
    lastRunAt: now,
    lastFailureAt: now,
    lastFailureMessage: failureMessage,
    ...metadata
  }));
}

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, renameSync, rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const buildRoot = path.join(projectRoot, 'build');
const workerBuildDir = path.join(buildRoot, 'cloudflare-worker');
const viteEntrypoint = path.resolve(projectRoot, 'node_modules/vite/bin/vite.js');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function removePath(target) {
	if (!existsSync(target)) {
		return true;
	}

	try {
		rmSync(target, {
			recursive: true,
			force: true,
			maxRetries: 5,
			retryDelay: 250
		});
		return !existsSync(target);
	} catch {
		return false;
	}
}

function moveAside(target) {
	if (!existsSync(target)) {
		return true;
	}

	const movedTarget = `${target}-stale-${Date.now()}`;

	try {
		renameSync(target, movedTarget);
		console.warn(
			`[build] Moved a locked Cloudflare worker folder aside to ${path.basename(movedTarget)}.`
		);
		return true;
	} catch {
		return false;
	}
}

function cleanupStaleBuilds() {
	if (!existsSync(buildRoot)) {
		return;
	}

	for (const entry of readdirSync(buildRoot, { withFileTypes: true })) {
		if (!entry.isDirectory() || !entry.name.startsWith('cloudflare-worker-stale-')) {
			continue;
		}

		removePath(path.join(buildRoot, entry.name));
	}
}

function stopRepoLocalBuildProcesses() {
	if (process.platform !== 'win32') {
		return [];
	}

	const escapedRoot = projectRoot.replace(/'/g, "''").toLowerCase();
	const currentPid = process.pid;
	const command = `
$root = '${escapedRoot}'
$currentPid = ${currentPid}
$targets = Get-CimInstance Win32_Process |
  Where-Object {
    $_.Name -eq 'node.exe' -and
    $_.ProcessId -ne $currentPid -and
    $_.CommandLine -and
    $_.CommandLine.ToLower().Contains($root) -and
    (
      $_.CommandLine.ToLower().Contains('vite') -or
      $_.CommandLine.ToLower().Contains('wrangler') -or
      $_.CommandLine.ToLower().Contains('preview')
    )
  } |
  Select-Object -ExpandProperty ProcessId

if ($targets) {
  foreach ($pid in $targets) {
    taskkill /PID $pid /T /F | Out-Null
  }
  ($targets -join ',')
}
`.trim();

	const result = spawnSync('powershell', ['-NoProfile', '-Command', command], {
		cwd: projectRoot,
		encoding: 'utf8'
	});

	if (result.status !== 0) {
		return [];
	}

	const output = result.stdout.trim();
	return output ? output.split(',').map((value) => value.trim()).filter(Boolean) : [];
}

async function ensureWorkerBuildDirIsClear() {
	cleanupStaleBuilds();

	for (let attempt = 0; attempt < 3; attempt += 1) {
		if (removePath(workerBuildDir)) {
			return;
		}

		await sleep(300 * (attempt + 1));
	}

	const stoppedPids = stopRepoLocalBuildProcesses();
	if (stoppedPids.length > 0) {
		console.warn(
			`[build] Stopped repo-local Vite/Wrangler processes that were locking the worker output: ${stoppedPids.join(', ')}`
		);
		await sleep(1000);

		for (let attempt = 0; attempt < 3; attempt += 1) {
			if (removePath(workerBuildDir)) {
				return;
			}

			await sleep(400 * (attempt + 1));
		}
	}

	if (moveAside(workerBuildDir)) {
		return;
	}

	throw new Error(
		`Could not clear ${path.relative(projectRoot, workerBuildDir)}. Close any Explorer window, local preview, or Wrangler/Vite process using that folder and try again.`
	);
}

await ensureWorkerBuildDirIsClear();

const result = spawnSync(process.execPath, [viteEntrypoint, 'build'], {
	stdio: 'inherit',
	cwd: projectRoot,
	env: process.env
});

if (typeof result.status === 'number') {
	process.exit(result.status);
}

process.exit(1);

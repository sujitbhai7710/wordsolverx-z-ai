import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const viteEntrypoint = path.resolve(scriptDir, '../node_modules/vite/bin/vite.js');

const result = spawnSync(process.execPath, [viteEntrypoint, 'build'], {
	stdio: 'inherit',
	env: {
		...process.env,
		BUILD_TARGET: 'pages',
		CF_PAGES: '1'
	}
});

if (typeof result.status === 'number') {
	process.exit(result.status);
}

process.exit(1);

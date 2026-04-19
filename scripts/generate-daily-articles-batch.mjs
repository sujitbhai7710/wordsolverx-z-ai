import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const generatorPath = path.join(__dirname, 'generate-daily-articles.mjs');

const GROUPS = ['site', 'gamedle', 'waffle'];

function runGroup(groupName) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [generatorPath], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
      env: {
        ...process.env,
        ENABLE_DAILY_ARTICLE_GENERATION: 'true',
        GROUP_NAME: groupName,
        TARGET_DATE: ''
      }
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Article generation failed for group ${groupName} with exit code ${code ?? 'unknown'}.`));
    });
  });
}

async function main() {
  for (const groupName of GROUPS) {
    console.log(`\n=== Generating daily articles for ${groupName} ===`);
    await runGroup(groupName);
  }

  console.log('\nDaily article batch generation completed for site, gamedle, and waffle.');
}

main().catch((error) => {
  console.error('Daily article batch generation failed.', error);
  process.exitCode = 1;
});

import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const generatorPath = path.join(__dirname, 'generate-daily-articles.mjs');
const BATCH_GROUP_NAME = 'all-current-windows';

function runBatch() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [generatorPath], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
      env: {
        ...process.env,
        ENABLE_DAILY_ARTICLE_GENERATION: 'true',
        GROUP_NAME: BATCH_GROUP_NAME,
        TARGET_DATE: process.env.TARGET_DATE ?? ''
      }
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `Article generation failed for ${BATCH_GROUP_NAME} with exit code ${code ?? 'unknown'}.`
        )
      );
    });
  });
}

async function main() {
  const startedAt = Date.now();

  console.log('\n=== Generating daily articles for all current windows ===');
  console.log('This uses one shared worker pool across site, gamedle, and waffle routes.');

  await runBatch();

  const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`\nDaily article batch generation completed in ${elapsedSeconds}s.`);
}

main().catch((error) => {
  console.error('Daily article batch generation failed.', error);
  process.exitCode = 1;
});

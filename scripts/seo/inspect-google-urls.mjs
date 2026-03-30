import fs from 'node:fs';
import path from 'node:path';

const accessToken = process.env.GOOGLE_ACCESS_TOKEN || '';
const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || '';
const targetsPath = process.env.INDEXING_TARGETS_PATH || '';
const delaySeconds = Number.parseInt(process.env.GOOGLE_INSPECTION_DELAY_SECONDS || '120', 10);
const artifactDir = path.resolve(process.cwd(), process.env.INDEXING_ARTIFACT_DIR || 'artifacts/indexing');
const reportPath = path.join(artifactDir, 'google-inspection-report.json');

fs.mkdirSync(artifactDir, { recursive: true });

if (!accessToken || !siteUrl || !targetsPath || !fs.existsSync(targetsPath)) {
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        status: 'skipped',
        reason: 'missing-google-config-or-targets'
      },
      null,
      2
    )
  );
  process.exit(0);
}

const targets = JSON.parse(fs.readFileSync(targetsPath, 'utf8'));
const urls = Array.isArray(targets.inspectionUrls) ? targets.inspectionUrls : [];

if (!urls.length) {
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ status: 'skipped', reason: 'no-inspection-urls' }, null, 2)
  );
  process.exit(0);
}

const delayMs = Number.isFinite(delaySeconds) && delaySeconds > 0 ? delaySeconds * 1000 : 120000;
const results = [];

for (let index = 0; index < urls.length; index += 1) {
  const inspectionUrl = urls[index];

  try {
    const response = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inspectionUrl,
        siteUrl,
        languageCode: 'en-US'
      })
    });

    const payload = await response.json().catch(() => ({}));
    const indexStatus = payload?.inspectionResult?.indexStatusResult ?? {};

    results.push({
      inspectionUrl,
      status: response.ok ? 'inspected' : 'failed',
      httpStatus: response.status,
      coverageState: indexStatus.coverageState ?? null,
      verdict: indexStatus.verdict ?? null,
      indexingState: indexStatus.indexingState ?? null,
      lastCrawlTime: indexStatus.lastCrawlTime ?? null,
      pageFetchState: indexStatus.pageFetchState ?? null,
      robotsTxtState: indexStatus.robotsTxtState ?? null,
      googleCanonical: indexStatus.googleCanonical ?? null,
      raw: payload
    });
  } catch (error) {
    results.push({
      inspectionUrl,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error)
    });
  }

  if (index < urls.length - 1) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      status: 'completed',
      checkedCount: results.length,
      delaySeconds: delayMs / 1000,
      results
    },
    null,
    2
  )
);

console.log(`Completed Google inspection checks for ${results.length} URL(s).`);

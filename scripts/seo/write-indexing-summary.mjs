import fs from 'node:fs';
import path from 'node:path';

const artifactDir = path.resolve(process.cwd(), process.env.INDEXING_ARTIFACT_DIR || 'artifacts/indexing');
const summaryPath = process.env.GITHUB_STEP_SUMMARY;

const readJson = (fileName) => {
  const filePath = path.join(artifactDir, fileName);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const targets = readJson('updated-urls.json');
const indexNow = readJson('indexnow-report.json');
const googleSitemap = readJson('google-sitemap-report.json');
const googleInspection = readJson('google-inspection-report.json');

const combined = {
  generatedAt: new Date().toISOString(),
  targets,
  indexNow,
  googleSitemap,
  googleInspection
};

fs.mkdirSync(artifactDir, { recursive: true });
fs.writeFileSync(path.join(artifactDir, 'indexing-report.json'), JSON.stringify(combined, null, 2));

if (!summaryPath) {
  process.exit(0);
}

const inspectionRows = Array.isArray(googleInspection?.results)
  ? googleInspection.results
      .map((result) => {
        const status = result.status ?? 'unknown';
        const verdict = result.verdict ?? result.indexingState ?? '-';
        return `| ${result.inspectionUrl} | ${status} | ${verdict} | ${result.httpStatus ?? '-'} |`;
      })
      .join('\n')
  : '| - | - | - | - |';

const markdown = [
  '## Indexing Report',
  '',
  `- Group: \`${targets?.groupName ?? 'unknown'}\``,
  `- Source: \`${targets?.sourceName ?? 'unknown'}\``,
  `- Target date: \`${targets?.targetDate || 'n/a'}\``,
  `- IndexNow URLs: \`${targets?.indexNowUrls?.length ?? 0}\``,
  `- Google inspection URLs: \`${targets?.inspectionUrls?.length ?? 0}\``,
  `- IndexNow status: \`${indexNow?.status ?? 'not-run'}\``,
  `- Google sitemap status: \`${googleSitemap?.status ?? 'not-run'}\``,
  `- Google inspection status: \`${googleInspection?.status ?? 'not-run'}\``,
  '',
  '### Google Inspection Results',
  '',
  '| URL | Status | Verdict | HTTP |',
  '| --- | --- | --- | --- |',
  inspectionRows
].join('\n');

fs.appendFileSync(summaryPath, `${markdown}\n`);

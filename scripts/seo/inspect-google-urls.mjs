import fs from "node:fs";
import path from "node:path";

const accessToken = process.env.GOOGLE_ACCESS_TOKEN || "";
const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "";
const targetsPath = process.env.INDEXING_TARGETS_PATH || "";
const staggerMs = Number.parseInt(
  process.env.GOOGLE_INSPECTION_STAGGER_MS ||
    `${Number.parseInt(process.env.GOOGLE_INSPECTION_DELAY_SECONDS || "0", 10) * 1000}`,
  10,
);
const concurrency = Number.parseInt(
  process.env.GOOGLE_INSPECTION_CONCURRENCY || "6",
  10,
);
const requestTimeoutMs = Number.parseInt(
  process.env.GOOGLE_INSPECTION_REQUEST_TIMEOUT_MS || "10000",
  10,
);
const artifactDir = path.resolve(
  process.cwd(),
  process.env.INDEXING_ARTIFACT_DIR || "artifacts/indexing",
);
const reportPath = path.join(artifactDir, "google-inspection-report.json");

fs.mkdirSync(artifactDir, { recursive: true });

if (!accessToken || !siteUrl || !targetsPath || !fs.existsSync(targetsPath)) {
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        status: "skipped",
        reason: "missing-google-config-or-targets",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const targets = JSON.parse(fs.readFileSync(targetsPath, "utf8"));
const urls = Array.isArray(targets.inspectionUrls)
  ? targets.inspectionUrls
  : [];

if (!urls.length) {
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      { status: "skipped", reason: "no-inspection-urls" },
      null,
      2,
    ),
  );
  process.exit(0);
}

const effectiveStaggerMs =
  Number.isFinite(staggerMs) && staggerMs > 0 ? staggerMs : 0;
const effectiveConcurrency =
  Number.isFinite(concurrency) && concurrency > 0 ? concurrency : 6;
const effectiveRequestTimeoutMs =
  Number.isFinite(requestTimeoutMs) && requestTimeoutMs > 0
    ? requestTimeoutMs
    : 10000;
const results = new Array(urls.length);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function inspectUrl(inspectionUrl) {
  const startedAt = new Date().toISOString();
  const startMs = Date.now();

  try {
    const response = await fetch(
      "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(effectiveRequestTimeoutMs),
        body: JSON.stringify({
          inspectionUrl,
          siteUrl,
          languageCode: "en-US",
        }),
      },
    );

    const payload = await response.json().catch(() => ({}));
    const indexStatus = payload?.inspectionResult?.indexStatusResult ?? {};

    return {
      inspectionUrl,
      status: response.ok ? "inspected" : "failed",
      httpStatus: response.status,
      coverageState: indexStatus.coverageState ?? null,
      verdict: indexStatus.verdict ?? null,
      indexingState: indexStatus.indexingState ?? null,
      lastCrawlTime: indexStatus.lastCrawlTime ?? null,
      pageFetchState: indexStatus.pageFetchState ?? null,
      robotsTxtState: indexStatus.robotsTxtState ?? null,
      googleCanonical: indexStatus.googleCanonical ?? null,
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - startMs,
      raw: payload,
    };
  } catch (error) {
    return {
      inspectionUrl,
      status: "failed",
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - startMs,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

let nextIndex = 0;
const workerCount = Math.min(effectiveConcurrency, urls.length);

await Promise.all(
  Array.from({ length: workerCount }, async (_, workerIndex) => {
    if (effectiveStaggerMs > 0 && workerIndex > 0) {
      await sleep(workerIndex * effectiveStaggerMs);
    }

    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      if (currentIndex >= urls.length) {
        return;
      }

      results[currentIndex] = await inspectUrl(urls[currentIndex]);
    }
  }),
);

fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      status: "completed",
      checkedCount: results.length,
      concurrency: workerCount,
      staggerMs: effectiveStaggerMs,
      requestTimeoutMs: effectiveRequestTimeoutMs,
      results,
    },
    null,
    2,
  ),
);

console.log(`Completed Google inspection checks for ${results.length} URL(s).`);

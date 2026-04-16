import fs from "node:fs";
import path from "node:path";

const accessToken = process.env.GOOGLE_ACCESS_TOKEN || "";
const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "";
const sitemapUrl = process.env.SITEMAP_URL || "";
const artifactDir = path.resolve(
  process.cwd(),
  process.env.INDEXING_ARTIFACT_DIR || "artifacts/indexing",
);
const reportPath = path.join(artifactDir, "google-sitemap-report.json");
const requestTimeoutMs = Number.parseInt(
  process.env.INDEXING_REQUEST_TIMEOUT_MS || "15000",
  10,
);
const effectiveRequestTimeoutMs =
  Number.isFinite(requestTimeoutMs) && requestTimeoutMs > 0
    ? requestTimeoutMs
    : 15000;

fs.mkdirSync(artifactDir, { recursive: true });

if (!accessToken || !siteUrl || !sitemapUrl) {
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        status: "skipped",
        reason: "missing-google-config",
        siteUrl,
        sitemapUrl,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

try {
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    signal: AbortSignal.timeout(effectiveRequestTimeoutMs),
  });

  const body = await response.text();
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        status: response.ok ? "submitted" : "failed",
        httpStatus: response.status,
        siteUrl,
        sitemapUrl,
        requestTimeoutMs: effectiveRequestTimeoutMs,
        body,
      },
      null,
      2,
    ),
  );

  console.log(
    `Google sitemap submit ${response.ok ? "succeeded" : "failed"} with status ${response.status}.`,
  );
} catch (error) {
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        status: "failed",
        siteUrl,
        sitemapUrl,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  console.warn(
    `Google sitemap submit failed: ${error instanceof Error ? error.message : String(error)}`,
  );
}

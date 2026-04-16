import { spawn } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();

const tasks = [
  {
    name: "IndexNow",
    scriptPath: path.join(repoRoot, "scripts/seo/submit-indexnow.mjs"),
  },
  {
    name: "Google sitemap",
    scriptPath: path.join(repoRoot, "scripts/seo/submit-google-sitemap.mjs"),
  },
  {
    name: "Google inspection",
    scriptPath: path.join(repoRoot, "scripts/seo/inspect-google-urls.mjs"),
  },
];

function runTask({ name, scriptPath }) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [scriptPath], {
      cwd: repoRoot,
      env: process.env,
      stdio: "inherit",
    });

    child.on("error", (error) => {
      resolve({
        name,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    });

    child.on("exit", (code, signal) => {
      resolve({
        name,
        status: code === 0 ? "completed" : "failed",
        code: code ?? 1,
        signal: signal ?? null,
      });
    });
  });
}

const startedAt = Date.now();
const results = await Promise.all(tasks.map(runTask));
const failedTasks = results.filter((result) => result.status !== "completed");

for (const result of results) {
  const detail =
    result.status === "completed"
      ? `exit code ${result.code ?? 0}`
      : result.error || `exit code ${result.code ?? 1}`;
  console.log(`[seo] ${result.name}: ${detail}`);
}

console.log(
  `[seo] Finished post-deploy SEO requests in ${Date.now() - startedAt}ms.`,
);

if (failedTasks.length > 0) {
  process.exit(1);
}

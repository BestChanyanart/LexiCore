import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(scriptDir, "..");
const repoRoot = resolve(webRoot, "../..");
const publicDir = resolve(webRoot, "public");

execFileSync(process.execPath, [resolve(repoRoot, "scripts/build-writing-question-table-data.mjs")], {
  cwd: repoRoot,
  stdio: "inherit"
});

mkdirSync(publicDir, { recursive: true });
copyFileSync(resolve(repoRoot, "docs/trial-practice.html"), resolve(publicDir, "trial-practice.html"));
copyFileSync(
  resolve(repoRoot, "docs/trial-writing-question-table.js"),
  resolve(publicDir, "trial-writing-question-table.js")
);

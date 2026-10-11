// Compact session status: open feature_list.json entries + the latest claude-progress.md entry.
// Reading those files in full costs tokens every session and keeps growing.
// Open one entry in full with: node scripts/status.mjs --feature <id>
import { readFileSync } from "node:fs";

const root = new URL("..", import.meta.url);
const { features } = JSON.parse(
  readFileSync(new URL("feature_list.json", root), "utf8"),
);
const [flag, id] = process.argv.slice(2);

if (flag === "--feature") {
  console.log(
    JSON.stringify(
      features.find((f) => f.id === id),
      null,
      2,
    ),
  );
} else {
  const counts = {};
  for (const f of features) counts[f.status] = (counts[f.status] ?? 0) + 1;
  console.log(
    "features: " +
      Object.entries(counts)
        .map(([s, n]) => `${n} ${s}`)
        .join(", "),
  );
  for (const f of [...features].sort((a, b) => a.priority - b.priority)) {
    if (f.status !== "passing")
      console.log(`  [${f.status}] ${f.priority} ${f.id}: ${f.title}`);
  }
  const log = readFileSync(new URL("claude-progress.md", root), "utf8");
  console.log(
    "\nlatest progress entry:\n" +
      log.slice(log.lastIndexOf("\n### Session:")).trim(),
  );
}

#!/usr/bin/env bash
# Session start + verification path. Run at the start of every session and
# before marking any feature_list.json entry as "passing".
set -euo pipefail
cd "$(dirname "$0")"

# The exFAT project drive leaves ._* files in .git, which corrupt git's pack index.
find .git -name '._*' -delete 2>/dev/null || true

if [[ ! -d node_modules || package-lock.json -nt node_modules ]]; then
  echo "==> npm ci"
  npm ci --no-audit --no-fund
fi

echo "==> npm run check"
npm run check

echo "==> status"
node scripts/status.mjs

echo "==> init.sh passed."
echo "Run the selected feature's own verification steps (including browser checks) before marking it passing."

#!/usr/bin/env bash
# Claude Code Stop hook: when the working tree has changes, run the project check.
# On failure, exit 2 so Claude sees the output and fixes it before finishing.
# Usage: check-on-stop.sh <check command...>
input=$(cat)
# Already continuing because of this hook: don't loop.
[[ $(jq -r '.stop_hook_active // false' <<<"$input") == "true" ]] && exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
# The exFAT project drive leaves macOS ._* files in .git, which corrupt git's pack index.
find .git -name '._*' -delete 2>/dev/null
[[ -z $(git status --porcelain) ]] && exit 0

if ! output=$("$@" 2>&1); then
  echo "\`$*\` failed. Fix it before finishing:" >&2
  tail -n 60 <<<"$output" >&2
  exit 2
fi

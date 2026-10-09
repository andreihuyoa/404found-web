# claude-progress.md

Session-by-session log. Read this first at the start of every session.
Append a new entry at the end of every session. Never delete or rewrite past entries.

---

## Template

### Session: YYYY-MM-DD

**Feature worked on:** `<feature_list.json id>`

**Goal:** One or two sentences.

**Changes made:** Files touched and what changed, brief.

**Verification run:**

- Command or browser step: `<exact command / steps>`
- Result: `<pass/fail + relevant output>`

**Status:** `not_started | in_progress | blocked | passing`

**Known risks / follow-ups:** Anything unresolved, assumptions needing Andrei's
confirmation, anything deliberately not built.

**Next step:** What the next session should pick up, and why.

---

## Log

### Session: 2026-10-09 (review, harness)

**Feature worked on:** `check-harness`, `agent-harness-files`

**Goal:** Review the site and set up a harness; no UI changes (the redesign comes later).

**Changes made:**

- Review findings F1–F11 (invented stats, dead links, contradictory copy, low-contrast
  badges, map scroll trap, misleading loading state) are now in the notes of
  `landing-rework` and `search-results-ux`.
- Harness: `npm run check` (ESLint, tsc, Prettier, build), Stop hook, CI workflow,
  ignore rules for macOS `._*` files, one Prettier pass (formatting only).
- Agent harness: `AGENTS.md`, `CLAUDE.md` (imports AGENTS.md), `feature_list.json`,
  this file, `init.sh`. Replaced `TODO.md`.

**Verification run:**

- Command: `./init.sh`
- Result: pass (lint, tsc, Prettier clean; build succeeded)

**Status:** passing (both features)

**Known risks / follow-ups:**

- Design entries are blocked until Andrei picks a design system and shares inspiration.
- Nothing pushed yet. Branch `chore/harness`.

**Next step:** Wait for the design inputs. Unblocked meanwhile: `services-from-api`,
`code-cleanup`, `naming-and-readme` (but Andrei wants frontend work in a separate
conversation, after the backend).

# AGENTS.md

Hilom web: the frontend of a Computer Science thesis project (portfolio name: Hilom).
Next.js 16 + React 19 + Tailwind 4 + Mapbox. Users pick medical services, share their
location, and see ranked healthcare facilities in Ermita, Manila. The API lives in
`../404found-model` (deployed at https://four04found-model.onrender.com).

The goal of each session is not maximum output. It is to leave the repo so the next
session can continue without guessing, with real evidence behind every "done".

## Session start (in order, every session)

1. `pwd`
2. Read `claude-progress.md` (latest state and next step).
3. Read `feature_list.json`; pick the **single** highest-priority entry with status
   `not_started` or `in_progress`. Skip `blocked` unless Andrei resolved the blocker
   in this session.
4. `git log --oneline -10`
5. `./init.sh`. Do not start new work on a red check.

## Scope rules

- One feature at a time. Don't touch files unrelated to it.
- Nothing unlisted gets built. Propose it as a new entry in `claude-progress.md` and ask.
- No silent decisions: new dependencies, visual direction, copy that makes claims,
  or API changes are raised as questions first.
- Edit `feature_list.json` only to update `status`, `evidence`, and `notes`, or to add
  entries Andrei approved. Never delete or weaken an entry or a verification step.
- Copy must be true: no invented numbers, testimonials, or features the model lacks.

## Definition of done

An entry may be marked `passing` only when:

- the behavior in `user_visible_behavior` is implemented;
- every command and manual browser step in its `verification` list was done **this
  session** and passed (check UI in the browser as a user would, not only by reading code);
- `evidence` holds the real results;
- `./init.sh` still passes.

If verification fails: status `blocked`, record the failure in `evidence`, explain in
`claude-progress.md`.

## Wrap-up (every session)

1. Append an entry to `claude-progress.md` (template at its top). Never rewrite past entries.
2. Update the touched entries in `feature_list.json`.
3. Commit only with `./init.sh` green.

## Commands

| Command                               | What it does                                                |
| ------------------------------------- | ----------------------------------------------------------- |
| `./init.sh`                           | Session start: install deps if needed, then `npm run check` |
| `npm run check`                       | ESLint, `tsc --noEmit`, Prettier check, `next build`        |
| `npm run dev`                         | Dev server at http://localhost:3000                         |
| `npm run format` / `npm run lint:fix` | Autofix formatting / lint                                   |

A Claude Code Stop hook runs `npm run check` whenever the working tree has changes and
blocks the stop if it fails.

Env vars (`.env.local`): `NEXT_PUBLIC_MODEL_BASE_API_URL` (defaults to the Render API),
`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` (map won't render without it).

## Conventions

- Commits: `type(scope): description`. Subject line only, no body, no co-author trailer.
  Split work into focused commits.
- Prettier config in `.prettierrc` (with the Tailwind plugin). Path alias `@/` resolves
  from `app/` (tsconfig `baseUrl`).

## Decisions (made by Andrei)

- Name: **Hilom**.
- Full design overhaul is planned; Andrei picks the design system and provides
  visual inspiration before any design work starts.
- Frontend work happens in its own conversation, after the backend refactor.

## Environment gotchas

- The project drive is **exFAT**: macOS writes `._*` files everywhere. ESLint and
  Prettier ignore them; `init.sh` and the Stop hook delete them inside `.git`.
  Moving the repo to an APFS volume removes this.

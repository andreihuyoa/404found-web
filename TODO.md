# 404found-web: Frontend To-Do

Status: `[ ]` open · `[~]` in progress · `[x]` done · `[?]` needs your decision/input

Last updated: 2026-10-09

---

## 1. Complete design overhaul

Blocked until you choose a design system and share visual inspiration.

### 1.1 Inputs from you

- [?] Design system choice
- [?] Visual inspiration / references
- [?] Final product name (UI says "Hilom", tab title says "404 Found", package says `csrp-web`)

### 1.2 Overhaul tasks

- [ ] Set up design tokens (color, type, spacing, radius) from the chosen system, with light/dark support
- [ ] Choose fonts with real weights (current headings fake-bold Instrument Serif, which only ships at 400)
- [ ] New information architecture: lead with the map demo, not marketing sections
- [ ] Replace the 6 feature cards + 3 step cards with one accurate "How it ranks" section (filter → distance → learned score, real weights)
- [ ] Redesign the service picker
- [ ] Redesign result cards: rank and distance prominent, requested-service matches/gaps, insurance collapsed
- [ ] Redesign the map markers, popups, and Ermita boundary styling to match the system
- [ ] Replace the SaaS footer with a thesis footer (authors, institution, year, paper, repos, data source)
- [ ] Proper loading, empty, error, and cold-start states (no `alert()`)
- [ ] Responsive pass (phone, tablet, desktop)
- [ ] Accessibility pass (contrast, focus states, keyboard, labels, reduced motion)
- [ ] Review GSAP use after the redesign; keep only animations that serve the new design

### 1.3 Issues from the review the overhaul must resolve

| ID  | Issue                                                                                                                                                      | Where                                        |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| F1  | Invented stats: "10+ Happy Patients", "20+ Verified Providers", "Join thousands of patients"                                                               | `app/page.tsx:302-316`, `:433`               |
| F2  | Dead CTAs: "Get Started for Free" → `#`, "Watch Demo" always disabled, all footer links → `#`                                                              | `app/page.tsx`                               |
| F3  | "HIPAA Compliance" link (US law; PH uses the Data Privacy Act), plus Pricing/Careers                                                                       | `app/page.tsx:524`                           |
| F4  | Copy contradicts the UI: "Hold Ctrl/Cmd" (UI uses checkboxes), "highlighted in blue" (they're pink), "ranked by professional expertise" (not in the model) | `app/page.tsx:236`, `:359`, `:413`           |
| F5  | Icons don't match card meanings (Brain, Shield, Clock, Users)                                                                                              | `app/page.tsx:356-385`                       |
| F6  | Low-contrast badges: yellow-on-yellow "Public"/"PhilHealth", peach-on-peach "HMO"                                                                          | `components/SearchExperience.tsx:359-372`    |
| F7  | Hero heading gets smaller at `sm` (`text-5xl sm:text-4xl`)                                                                                                 | `app/page.tsx:228`                           |
| F8  | Map traps page scroll (needs `cooperativeGestures`)                                                                                                        | `components/MapboxSection.tsx`               |
| F9  | Button shows "Searching…" on first load before any search                                                                                                  | `components/SearchExperience.tsx:31`, `:267` |
| F10 | A distance of exactly 0 m shows "N/A" (`!distance`)                                                                                                        | `components/SearchExperience.tsx:157`        |
| F11 | Fake macOS window dots around the demo                                                                                                                     | `app/page.tsx:323`                           |

## 2. Code fixes (independent of the design)

- [ ] Render services from `/csrp/services` instead of the hardcoded `HEALTH_SERVICES` (fetched result is currently discarded)
- [ ] Remove the unused `use_ml` request field
- [ ] Delete or use `app/api/recommend/route.ts` (client calls Render directly)
- [ ] Update the page `<title>` and metadata
- [ ] Update for any API changes from the backend list (`/csrp` prefix, response shape, error format)

## 3. Names and README

- [?] Project name/description matching your portfolio, resume, and website
- [ ] Replace the create-next-app boilerplate README: what it is, live link, screenshots, stack, env vars (`NEXT_PUBLIC_MODEL_BASE_API_URL`, `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`), link to the API repo and thesis
- [ ] Rename package (`csrp-web`) to match

## 4. Agent docs and harness

- [ ] Add `CLAUDE.md`: overview, commands, structure, conventions, env vars, design-system rules once chosen
- [ ] Add `AGENTS.md` with the same core content (or have one reference the other)
- [x] Harness: `npm run check` = ESLint + `tsc --noEmit` + Prettier check + `next build`
- [x] Claude Code Stop hook (`.claude/hooks/check-on-stop.sh`) runs `npm run check` when files changed and blocks on failure
- [x] CI workflow runs `npm run check`
- [x] One-time Prettier pass on 7 source files (formatting only)
- [x] Ignore macOS `._*` files in ESLint and Prettier (exFAT drive)
- [ ] Add tests (Vitest / Playwright smoke test with mocked API) after the redesign, so they aren't written against the old UI

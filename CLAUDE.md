# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A two-file widget (plus an Express backend) that lets someone pick any football club — across 9 domestic leagues in 8 countries — and displays its matches, standings, position history, and form, meant to be embedded in a Notion page via an Embed block. There is no build step, bundler, or framework — the frontend is a single static HTML file with inline CSS/JS.

## Commands

```bash
npm install     # install dependencies
npm start       # run the backend (node server.js) on http://localhost:3000
npm run dev     # run with nodemon (auto-reload on changes to server.js)
```

There is no test suite, linter, or build command in this repo.

To exercise the whole thing locally: start the backend (`npm start`), then open `widget.html` directly in a browser (or visit `http://localhost:3000/widget`, which the server also serves). Pick a country then a club from the dropdowns to load data.

**football-data.org's free tier is rate-limited (10 requests/minute).** Each club-data load makes 4-6 upstream calls, so rapid manual testing (switching clubs repeatedly, or running test scripts back-to-back) will produce transient `500`/"Failed to fetch" errors — this is expected, not a bug; wait a few seconds and retry.

## Architecture

- **`server.js`** — Express server that proxies `football-data.org` v4 API calls. It exposes:
  - `GET /` — health check / JSON status
  - `GET /api/leagues` — static list of the 9 selectable domestic leagues, each with `code`, `country`, `name`, and `relegationZone` (see below)
  - `GET /api/clubs?competition=CODE` — proxies `/competitions/{code}/teams`, returns `{id, name, shortName, tla}` per club, sorted by name
  - `GET /api/club-data?teamId=ID&competition=CODE` — the main endpoint. Fetches (in parallel) the club's league matches, league standings, all league-wide finished matches (for position history), and the club's own team info (for `shortName`/`crest`/`runningCompetitions`); if `runningCompetitions` includes `CL`, also fetches Champions League matches/standings. Returns `{ team, league: {code, name, matches, standings, positionHistory, form, teamCount, relegationZone}, championsLeague }`. Both `competition` and `teamId` are validated against a whitelist/integer check before being interpolated into upstream URLs.
  - `GET /widget` — serves `widget.html` directly.
  - The API key is read only from `process.env.API_KEY` (via `dotenv`, loaded optionally) — there is no hardcoded fallback. `.env` is gitignored; `.env.example` documents the two variables (`PORT`, `API_KEY`).
  - `LEAGUE_DISPLAY_NAMES` and `RELEGATION_ZONES` are the single source of truth for friendly competition names (e.g. "Primera Division" → "La Liga", "UEFA Champions League" → "UCL") and each league's relegation-zone size, respectively — both are server-side constants, not derived from the API (football-data.org's standings response carries no zone/qualification metadata at all). `RELEGATION_ZONES` is a deliberate approximation: leagues with a relegation-playoff format (Bundesliga, Ligue 1, Eredivisie) fold that playoff spot into the count, since the UI only has one "at risk" color.
  - UCL bracket logic (`UCL_PHASES`, `computeUclForm`, `tieOutcome`, `buildPhaseRow`) is specific to the Champions League's format (8-match league stage → playoff → R16 → QF → SF → Final) and only ever runs for that one competition — it isn't generalized to Europa/Conference League.

- **`widget.html`** — self-contained frontend: inline `<style>` (theme-aware via CSS custom properties, redefined under `@media (prefers-color-scheme: dark)`) and inline `<script>` that:
  - Fetches from a **hardcoded `backendUrl`** constant (just the origin, e.g. `http://localhost:3000`) — must be edited to point at wherever the backend is deployed before embedding in Notion.
  - Populates a country `<select>` from `/api/leagues`, then a club `<select>` from `/api/clubs` for that country's league code(s) (a country can map to more than one league, e.g. England → Premier League + Championship — both are fetched and merged into one club list). The chosen `{competition, teamId}` is saved to `localStorage` and restored on reload.
  - `loadClubData()` is the single entry point that fetches `/api/club-data` and re-renders every section; it's also what the 5-minute auto-refresh calls, but only once a club has actually been selected.
  - Renders: last-2/next-2 matches (opponent + H/A square only, no "our" team name shown), the league table (a 5-row window centered on the selected club, clamped at the table's edges — see `displayStandings()`), a hand-rolled inline-SVG position-over-time chart (dot color = table zone: blue/title, green/top-4, yellow/mid-table, red/relegation — computed client-side from `teamCount`/`relegationZone`), and win/draw/loss/upcoming form squares for the league and (when applicable) the Champions League bracket by phase.

- **Deployment model**: the backend and frontend are deployed independently. The backend can run locally or be pushed to Replit/Vercel/Heroku (see README for the exact steps); after any backend redeploy, `backendUrl` in `widget.html` must be updated to match, and the updated HTML re-pasted into the Notion embed block.

## Notes for making changes

- `package.json`'s `name`/`description`/`keywords` (`atletico-madrid-widget`, "Live Atlético Madrid widget...") are stale from before the widget was generalized to any club/league — ignore them as a scoping signal; the widget is club-agnostic.
- Adding a league: add an entry to `DOMESTIC_LEAGUES` in `server.js` with its `code`/`country`, a friendly name in `LEAGUE_DISPLAY_NAMES`, and a relegation-zone size in `RELEGATION_ZONES`. Only round-robin domestic leagues fit this model — cup/group competitions (e.g. Copa Libertadores) don't have a compatible "table + position history" shape.
- Since `widget.html` is pasted verbatim into Notion, treat it as the deployable artifact: any change to it must remain a single self-contained file (no external script/asset references beyond what Notion's embed sandbox allows).
- There's no browser automation available for manually verifying UI changes in this environment; the established pattern for checking `widget.html` changes without a live browser is extracting its inline `<script>`, stubbing a minimal `document`, and running the render functions against the live (or a captured) `/api/club-data` response — see prior session transcripts for the stub shape if reconstructing this.

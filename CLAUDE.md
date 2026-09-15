# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A tiny two-file widget (plus an Express backend) that displays Atlético de Madrid fixtures, results, and La Liga standings, meant to be embedded in a Notion page via an Embed block. There is no build step, bundler, or framework — the frontend is a single static HTML file with inline CSS/JS.

## Commands

```bash
npm install     # install dependencies
npm start       # run the backend (node server.js) on http://localhost:3000
npm run dev     # run with nodemon (auto-reload on changes to server.js)
```

There is no test suite, linter, or build command in this repo.

To exercise the whole thing locally: start the backend (`npm start`), then open `widget.html` directly in a browser (or visit `http://localhost:3000/widget`, which the server also serves).

## Architecture

- **`server.js`** — Express server that proxies `football-data.org` v4 API calls. It exposes:
  - `GET /` — health check / JSON status
  - `GET /api/atletico-data` — fetches Atlético Madrid's matches (`/teams/78/matches`) and La Liga standings (`/competitions/PD/standings`) in parallel, then returns a combined `{ matches, standings }` payload. This is the only endpoint the widget calls.
  - `GET /widget` — serves `widget.html` directly.
  - The API key is read from `process.env.API_KEY` (via `dotenv`, loaded optionally) with a hardcoded fallback default in the source. `.env` is not committed; `.env.example` documents the two variables (`PORT`, `API_KEY`).

- **`widget.html`** — self-contained frontend: inline `<style>` for the card-based UI (upcoming matches, last matches, standings table) and inline `<script>` that:
  - Fetches from a **hardcoded `backendUrl`** constant (`http://localhost:3000/api/atletico-data` by default) — this must be manually edited to point at wherever the backend is actually deployed before embedding in Notion.
  - Filters/sorts the raw `matches` array client-side into "next 2 scheduled" and "last 2 finished" (Atlético's team id `78` is hardcoded here too, matching `server.js`).
  - Renders the standings table, always showing the top 5 plus Atlético's row if it falls outside the top 5.
  - Polls `fetchData()` on load and every 5 minutes via `setInterval`.

- **Deployment model**: the backend and frontend are deployed independently. The backend can run locally or be pushed to Replit/Vercel/Heroku (see README for the exact steps); after any backend redeploy, `backendUrl` in `widget.html` must be updated to match, and the updated HTML re-pasted into the Notion embed block.

## Notes for making changes

- Team/competition IDs (`ATLETICO_MADRID_ID = 78`, competition code `PD` for La Liga) are duplicated between `server.js` and `widget.html` — keep them in sync if either changes.
- Since `widget.html` is pasted verbatim into Notion, treat it as the deployable artifact: any change to it must remain a single self-contained file (no external script/asset references beyond what Notion's embed sandbox allows).

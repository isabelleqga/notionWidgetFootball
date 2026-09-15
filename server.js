// Atlético Madrid Widget Backend Server
// Simple Express server that proxies API calls to football-data.org

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

// Load environment variables if .env exists
try {
  require('dotenv').config();
} catch (e) {
  // dotenv is optional, continue without it
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configuration
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';
const ATLETICO_MADRID_ID = 78;

// Validation
if (!API_KEY) {
  console.warn('⚠️  WARNING: API_KEY not set. Copy .env.example to .env and add your football-data.org key.');
}

const AUTH_HEADERS = { 'X-Auth-Token': API_KEY };

// Fixed shape of the UEFA Champions League knockout bracket (post league-stage).
// Slot counts reflect the two-legged ties used at every stage except the Final.
const UCL_PHASES = [
  { stage: 'LEAGUE_STAGE', label: 'League', slots: 8, twoLegged: false },
  { stage: 'PLAYOFFS', label: 'Playoff', slots: 2, twoLegged: true },
  { stage: 'LAST_16', label: 'R16', slots: 2, twoLegged: true },
  { stage: 'QUARTER_FINALS', label: 'QF', slots: 2, twoLegged: true },
  { stage: 'SEMI_FINALS', label: 'SF', slots: 2, twoLegged: true },
  { stage: 'FINAL', label: 'Final', slots: 1, twoLegged: false },
];

async function fetchJsonOk(url) {
  try {
    const res = await fetch(url, { headers: AUTH_HEADERS });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

function matchResultForTeam(match, teamId) {
  if (match.status !== 'FINISHED') return null;
  const isHome = match.homeTeam.id === teamId;
  const gf = isHome ? match.score.fullTime.home : match.score.fullTime.away;
  const ga = isHome ? match.score.fullTime.away : match.score.fullTime.home;
  if (gf > ga) return 'win';
  if (gf < ga) return 'loss';
  return 'draw';
}

// Approximates official standings tiebreakers (points, goal difference, goals
// scored). Does not account for head-to-head records, which La Liga's actual
// rules use before goal difference in a tie among a subset of teams.
function computeStandingsHistory(finishedMatches, teamId) {
  const byMatchday = {};
  finishedMatches.forEach((m) => {
    (byMatchday[m.matchday] = byMatchday[m.matchday] || []).push(m);
  });
  const matchdays = Object.keys(byMatchday).map(Number).sort((a, b) => a - b);

  const stats = {};
  const history = [];
  for (const md of matchdays) {
    for (const m of byMatchday[md]) {
      const home = m.homeTeam.id;
      const away = m.awayTeam.id;
      stats[home] = stats[home] || { points: 0, gf: 0, ga: 0 };
      stats[away] = stats[away] || { points: 0, gf: 0, ga: 0 };
      const hg = m.score.fullTime.home;
      const ag = m.score.fullTime.away;
      stats[home].gf += hg; stats[home].ga += ag;
      stats[away].gf += ag; stats[away].ga += hg;
      if (hg > ag) stats[home].points += 3;
      else if (hg < ag) stats[away].points += 3;
      else { stats[home].points += 1; stats[away].points += 1; }
    }

    const ranked = Object.entries(stats)
      .map(([id, s]) => ({ id: Number(id), points: s.points, gd: s.gf - s.ga, gf: s.gf }))
      .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
    const position = ranked.findIndex((t) => t.id === teamId) + 1;
    if (position > 0) history.push({ matchday: md, position });
  }
  return history;
}

function buildPdForm(matches, teamId) {
  return matches
    .slice()
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
    .map((m) => ({
      state: matchResultForTeam(m, teamId) || 'upcoming',
      opponent: m.homeTeam.id === teamId ? m.awayTeam.name : m.homeTeam.name,
      home: m.homeTeam.id === teamId,
      date: m.utcDate,
      score: m.status === 'FINISHED' ? m.score.fullTime : null,
    }));
}

function buildPhaseRow(phase, actualMatches, teamId, alive) {
  const squares = [];
  for (let i = 0; i < phase.slots; i++) {
    const m = actualMatches[i];
    if (m) {
      squares.push({
        state: matchResultForTeam(m, teamId) || 'upcoming',
        opponent: m.homeTeam.id === teamId ? m.awayTeam.name : m.homeTeam.name,
        home: m.homeTeam.id === teamId,
        date: m.utcDate,
        score: m.status === 'FINISHED' ? m.score.fullTime : null,
      });
    } else {
      squares.push({ state: alive ? 'upcoming' : 'eliminated', opponent: null, home: null, date: null, score: null });
    }
  }
  return { stage: phase.stage, label: phase.label, squares };
}

// Two-legged tie result from teamId's perspective. Returns null when the tie
// isn't decided yet (legs missing, unfinished, or aggregate tied with no
// penalty shootout data to fall back on).
function tieOutcome(legs, teamId) {
  const finished = legs.filter((m) => m.status === 'FINISHED');
  if (legs.length === 0 || finished.length < legs.length) return null;

  let gf = 0, ga = 0;
  for (const m of finished) {
    const isHome = m.homeTeam.id === teamId;
    gf += isHome ? m.score.fullTime.home : m.score.fullTime.away;
    ga += isHome ? m.score.fullTime.away : m.score.fullTime.home;
  }
  if (gf > ga) return 'advanced';
  if (gf < ga) return 'eliminated';

  const lastLeg = finished[finished.length - 1];
  const pens = lastLeg.score.penalties;
  if (pens && pens.home != null && pens.away != null) {
    const isHome = lastLeg.homeTeam.id === teamId;
    const pf = isHome ? pens.home : pens.away;
    const pa = isHome ? pens.away : pens.home;
    if (pf > pa) return 'advanced';
    if (pf < pa) return 'eliminated';
  }
  return null;
}

function computeUclForm(matches, clStandingsTable, teamId) {
  const byStage = {};
  matches.forEach((m) => { (byStage[m.stage] = byStage[m.stage] || []).push(m); });
  Object.values(byStage).forEach((arr) => arr.sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate)));

  const leagueStage = byStage['LEAGUE_STAGE'] || [];
  const leagueStageDone = leagueStage.length > 0 && leagueStage.every((m) => m.status === 'FINISHED');

  let rank = null;
  if (leagueStageDone && clStandingsTable) {
    const row = clStandingsTable.find((t) => t.team.id === teamId);
    rank = row ? row.position : null;
  }

  const skipsPlayoff = leagueStageDone && rank != null && rank <= 8;
  let stillAlive = !(leagueStageDone && rank != null && rank > 24);

  const rows = [buildPhaseRow(UCL_PHASES[0], leagueStage, teamId, stillAlive)];

  for (let i = 1; i < UCL_PHASES.length; i++) {
    const phase = UCL_PHASES[i];
    if (phase.stage === 'PLAYOFFS' && skipsPlayoff) continue;

    if (!stillAlive) {
      rows.push(buildPhaseRow(phase, [], teamId, false));
      continue;
    }

    const phaseMatches = byStage[phase.stage] || [];
    rows.push(buildPhaseRow(phase, phaseMatches, teamId, true));

    if (phase.twoLegged && tieOutcome(phaseMatches, teamId) === 'eliminated') {
      stillAlive = false;
    }
  }

  return rows;
}

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: '✅ Atlético Madrid Widget Backend is running',
    version: '1.0.0',
    endpoints: {
      'GET /': 'Health check',
      'GET /api/atletico-data': 'Get matches and standings'
    }
  });
});

// Serve widget HTML
app.get('/widget', (req, res) => {
  res.sendFile(path.join(__dirname, 'widget.html'));
});

// Main endpoint: Get Atlético Madrid data
app.get('/api/atletico-data', async (req, res) => {
  try {
    console.log('📡 Fetching Atlético Madrid data...');

    const [pdMatches, pdStandings, pdAllFinished, clMatches, clStandings] = await Promise.all([
      fetchJsonOk(`${BASE_URL}/teams/${ATLETICO_MADRID_ID}/matches?competitions=PD`),
      fetchJsonOk(`${BASE_URL}/competitions/PD/standings`),
      fetchJsonOk(`${BASE_URL}/competitions/PD/matches?status=FINISHED`),
      fetchJsonOk(`${BASE_URL}/teams/${ATLETICO_MADRID_ID}/matches?competitions=CL`),
      fetchJsonOk(`${BASE_URL}/competitions/CL/standings`),
    ]);

    // La Liga data is the core of the widget; fail hard if it's unavailable.
    if (!pdMatches || !pdStandings) {
      console.error('❌ Failed to fetch core La Liga data');
      return res.status(500).json({ error: 'Failed to fetch La Liga data from football-data.org' });
    }

    const laLigaTable = (pdStandings.standings.find((s) => s.type === 'TOTAL') || pdStandings.standings[0]).table;
    const positionHistory = pdAllFinished ? computeStandingsHistory(pdAllFinished.matches, ATLETICO_MADRID_ID) : [];
    const laLigaForm = buildPdForm(pdMatches.matches, ATLETICO_MADRID_ID);

    // Champions League is best-effort: if any part of it fails, omit the
    // section entirely rather than failing the whole widget.
    let championsLeague = null;
    if (clMatches) {
      const clTable = clStandings ? (clStandings.standings.find((s) => s.stage === 'LEAGUE_STAGE') || clStandings.standings[0]).table : null;
      championsLeague = {
        matches: clMatches.matches,
        phases: computeUclForm(clMatches.matches, clTable, ATLETICO_MADRID_ID),
      };
    }

    console.log('✅ Data fetched successfully');
    console.log(`   - La Liga matches: ${pdMatches.matches.length}, standings: ${laLigaTable.length} teams`);
    console.log(`   - Champions League: ${championsLeague ? championsLeague.matches.length + ' matches' : 'unavailable'}`);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      laLiga: {
        matches: pdMatches.matches,
        standings: laLigaTable,
        positionHistory,
        form: laLigaForm,
      },
      championsLeague,
    });

  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({
      error: 'Server error: ' + error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /api/atletico-data',
      'GET /widget'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  ⚽ Atlético Madrid Widget Backend      ║
╚════════════════════════════════════════╝

🚀 Server running on: http://localhost:${PORT}

📊 Available endpoints:
   • GET http://localhost:${PORT}/
   • GET http://localhost:${PORT}/api/atletico-data
   • GET http://localhost:${PORT}/widget

🔑 API Key: ${API_KEY.substring(0, 8)}...

💡 Update your widget with:
   const backendUrl = 'http://localhost:${PORT}/api/atletico-data';

📝 Press Ctrl+C to stop
  `);
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

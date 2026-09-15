// Football Club Widget Backend Server
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

// Validation
if (!API_KEY) {
  console.warn('⚠️  WARNING: API_KEY not set. Copy .env.example to .env and add your football-data.org key.');
}

const AUTH_HEADERS = { 'X-Auth-Token': API_KEY };

// Domestic round-robin leagues selectable in the widget, grouped by country.
// (Continental/cup competitions like Copa Libertadores aren't included here —
// their format doesn't fit the "table + position history" model below.)
const LEAGUE_DISPLAY_NAMES = {
  PL: 'Premier League',
  ELC: 'Championship',
  PD: 'La Liga',
  SA: 'Serie A',
  BL1: 'Bundesliga',
  FL1: 'Ligue 1',
  DED: 'Eredivisie',
  PPL: 'Primeira Liga',
  BSA: 'Brazil Série A',
  CL: 'UCL',
};

// Number of table positions treated as the relegation zone, for the position
// chart's coloring. Approximate: several leagues (Bundesliga, Ligue 1,
// Eredivisie) actually relegate fewer teams directly and send one more to a
// relegation playoff — that playoff spot is folded into this count here,
// since the widget only has one "at risk" color to show.
const RELEGATION_ZONES = {
  PL: 3, ELC: 3, PD: 3, SA: 3, BL1: 3, FL1: 3, DED: 3, PPL: 3, BSA: 4,
};

const DOMESTIC_LEAGUES = [
  { code: 'PL', country: 'England' },
  { code: 'ELC', country: 'England' },
  { code: 'PD', country: 'Spain' },
  { code: 'SA', country: 'Italy' },
  { code: 'BL1', country: 'Germany' },
  { code: 'FL1', country: 'France' },
  { code: 'DED', country: 'Netherlands' },
  { code: 'PPL', country: 'Portugal' },
  { code: 'BSA', country: 'Brazil' },
].map((l) => ({ ...l, name: LEAGUE_DISPLAY_NAMES[l.code], relegationZone: RELEGATION_ZONES[l.code] }));

const DOMESTIC_LEAGUE_CODES = new Set(DOMESTIC_LEAGUES.map((l) => l.code));

function friendlyCompetitionName(code, fallbackName) {
  return LEAGUE_DISPLAY_NAMES[code] || fallbackName;
}

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

function withFriendlyCompetitionNames(matches) {
  return matches.map((m) => ({
    ...m,
    competition: { ...m.competition, name: friendlyCompetitionName(m.competition.code, m.competition.name) },
  }));
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
// scored). Does not account for head-to-head records, which some leagues'
// actual rules use before goal difference in a tie among a subset of teams.
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

function buildLeagueForm(matches, teamId) {
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
    status: '✅ Football Club Widget Backend is running',
    version: '2.0.0',
    endpoints: {
      'GET /': 'Health check',
      'GET /api/leagues': 'List selectable leagues, grouped by country',
      'GET /api/clubs?competition=CODE': 'List clubs in a league',
      'GET /api/club-data?teamId=ID&competition=CODE': 'Get matches, standings and form for a club',
    }
  });
});

// Serve widget HTML
app.get('/widget', (req, res) => {
  res.sendFile(path.join(__dirname, 'widget.html'));
});

// List of selectable leagues, grouped by country
app.get('/api/leagues', (req, res) => {
  res.json({ leagues: DOMESTIC_LEAGUES });
});

// List of clubs within a given league
app.get('/api/clubs', async (req, res) => {
  const competition = String(req.query.competition || '');
  if (!DOMESTIC_LEAGUE_CODES.has(competition)) {
    return res.status(400).json({ error: 'Unknown or unsupported competition code' });
  }

  const data = await fetchJsonOk(`${BASE_URL}/competitions/${competition}/teams`);
  if (!data) {
    return res.status(502).json({ error: 'Failed to fetch clubs from football-data.org' });
  }

  const clubs = data.teams
    .map((t) => ({ id: t.id, name: t.name, shortName: t.shortName, tla: t.tla }))
    .sort((a, b) => a.name.localeCompare(b.name));

  res.json({ competition, clubs });
});

// Main endpoint: matches, standings, position history and form for one club
app.get('/api/club-data', async (req, res) => {
  const competition = String(req.query.competition || '');
  const teamId = parseInt(req.query.teamId, 10);

  if (!DOMESTIC_LEAGUE_CODES.has(competition)) {
    return res.status(400).json({ error: 'Unknown or unsupported competition code' });
  }
  if (!Number.isInteger(teamId) || teamId <= 0) {
    return res.status(400).json({ error: 'Invalid teamId' });
  }

  try {
    console.log(`📡 Fetching data for team ${teamId} (${competition})...`);

    const [team, leagueMatches, leagueStandings, leagueAllFinished] = await Promise.all([
      fetchJsonOk(`${BASE_URL}/teams/${teamId}`),
      fetchJsonOk(`${BASE_URL}/teams/${teamId}/matches?competitions=${competition}`),
      fetchJsonOk(`${BASE_URL}/competitions/${competition}/standings`),
      fetchJsonOk(`${BASE_URL}/competitions/${competition}/matches?status=FINISHED`),
    ]);

    if (!team || !leagueMatches || !leagueStandings) {
      console.error('❌ Failed to fetch core league data');
      return res.status(500).json({ error: 'Failed to fetch league data from football-data.org' });
    }

    const leagueTable = (leagueStandings.standings.find((s) => s.type === 'TOTAL') || leagueStandings.standings[0]).table;
    const positionHistory = leagueAllFinished ? computeStandingsHistory(leagueAllFinished.matches, teamId) : [];
    const leagueForm = buildLeagueForm(leagueMatches.matches, teamId);

    // Champions League is best-effort and only shown when the club is
    // actually in it this season; if any part of it fails, omit the section
    // entirely rather than failing the whole widget.
    let championsLeague = null;
    const inChampionsLeague = (team.runningCompetitions || []).some((c) => c.code === 'CL');
    if (inChampionsLeague) {
      const [clMatches, clStandings] = await Promise.all([
        fetchJsonOk(`${BASE_URL}/teams/${teamId}/matches?competitions=CL`),
        fetchJsonOk(`${BASE_URL}/competitions/CL/standings`),
      ]);
      if (clMatches) {
        const clTable = clStandings ? (clStandings.standings.find((s) => s.stage === 'LEAGUE_STAGE') || clStandings.standings[0]).table : null;
        championsLeague = {
          matches: withFriendlyCompetitionNames(clMatches.matches),
          phases: computeUclForm(clMatches.matches, clTable, teamId),
        };
      }
    }

    console.log('✅ Data fetched successfully');
    console.log(`   - ${team.name}: ${leagueMatches.matches.length} league matches, standings: ${leagueTable.length} teams`);
    console.log(`   - Champions League: ${championsLeague ? championsLeague.matches.length + ' matches' : 'not applicable'}`);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      team: { id: team.id, name: team.name, shortName: team.shortName, crest: team.crest },
      league: {
        code: competition,
        name: friendlyCompetitionName(competition, competition),
        matches: withFriendlyCompetitionNames(leagueMatches.matches),
        standings: leagueTable,
        positionHistory,
        form: leagueForm,
        teamCount: leagueTable.length,
        relegationZone: RELEGATION_ZONES[competition] || 0,
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
      'GET /api/leagues',
      'GET /api/clubs?competition=CODE',
      'GET /api/club-data?teamId=ID&competition=CODE',
      'GET /widget'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  ⚽ Football Club Widget Backend        ║
╚════════════════════════════════════════╝

🚀 Server running on: http://localhost:${PORT}

📊 Available endpoints:
   • GET http://localhost:${PORT}/
   • GET http://localhost:${PORT}/api/leagues
   • GET http://localhost:${PORT}/api/clubs?competition=CODE
   • GET http://localhost:${PORT}/api/club-data?teamId=ID&competition=CODE
   • GET http://localhost:${PORT}/widget

🔑 API Key: ${API_KEY ? API_KEY.substring(0, 8) + '...' : 'NOT SET'}

📝 Press Ctrl+C to stop
  `);
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

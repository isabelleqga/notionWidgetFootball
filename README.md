# Football Club Widget

<p align="center"><strong>Languages:</strong> <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (Brasil)</a></p>

A real-time widget for Notion (or any embeddable page) showing matches, standings, position history, and recent form for a football club you pick from a dropdown — any club across 9 domestic leagues in 8 countries, via [football-data.org](https://www.football-data.org/).

## 📦 What's Included

| File | Purpose |
|---|---|
| `server.js` | Backend Node.js server — proxies API calls, hides your API key |
| `widget.html` | Frontend Notion widget — self-contained, no build step |
| `package.json` | Node.js dependencies |
| `.env.example` | Environment variables template |

## 🚀 Quick Start

1. **Get the project on your PC**, then from inside the folder:
   ```bash
   npm install
   ```
2. **Create your `.env` file**:
   ```bash
   cp .env.example .env
   ```
   Then edit it:
   ```
   PORT=3000
   API_KEY=your_football_data_org_api_key_here
   ```
   (see "API Key & Security" below for how to get one)
3. **Start the server**:
   ```bash
   npm start
   # or, with auto-reload during development:
   npm run dev
   ```
   Your server is now running at **http://localhost:3000**.
4. **Open the widget** — visit `http://localhost:3000/widget`, or open `widget.html` directly in your browser.

## 🌐 Deploying the Backend

Pick one, then point `widget.html`'s `backendUrl` constant at it.

<details>
<summary><strong>Local network</strong> — easiest, for testing only</summary>

- Server runs on `http://localhost:3000`
- Set `const backendUrl = 'http://localhost:3000';` in `widget.html`
- Only works on your own PC
</details>

<details>
<summary><strong>Replit</strong> — free cloud hosting, recommended</summary>

1. Go to https://replit.com and create an account
2. Create a new Node.js Repl
3. Upload all the project files
4. Click **Run**
5. Copy your Repl's URL (`https://your-replit-name.replit.dev`)
6. Set `const backendUrl = 'https://your-replit-name.replit.dev';` in `widget.html`
</details>

<details>
<summary><strong>Vercel</strong> — free cloud hosting</summary>

1. Go to https://vercel.com and connect your GitHub account
2. Import this repository and deploy
3. Copy your Vercel URL and set it as `backendUrl` in `widget.html`
</details>

<details>
<summary><strong>Heroku</strong> — free with account</summary>

1. Go to https://heroku.com and create a new app
2. Connect and deploy this repository
3. Copy your Heroku URL and set it as `backendUrl` in `widget.html`
</details>

## 📝 Using the Widget

**Locally:** start the server (`npm start`), open the widget, and pick a country then a club from the dropdowns. Data refreshes every 5 minutes automatically.

**In Notion:**
1. Set `backendUrl` in `widget.html` to your deployed backend's URL
2. Copy the entire contents of `widget.html`
3. In Notion: **+ Add Block** → **Embed**, then paste the HTML
4. Pick a club — your choice is remembered in that browser for next time, and the selector hides itself automatically after that (click "Change club" to bring it back)

## 🔑 API Key & Security

- Get a free key at https://www.football-data.org/client/register
- Put it in your `.env` file (see `.env.example`) — it's read only on the backend and never sent to the browser
- `.env` is gitignored — **never commit it or share it publicly**
- Safe to embed the widget on private Notion pages

## 📊 Features

- Pick any club across Premier League, Championship, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga, and Brasileirão
- Last 2 results + next 2 fixtures (opponent, home/away, score or 24h kickoff time)
- A single League section with Table (a 5-team window centered on your club, clamped at the top/bottom of the table), Position progress (color-coded by table zone: title contender / top 4 / mid-table / relegation, with the position number only labeled where it changes), and Form — plus a matching Champions League section when the club is in it this season
- Recent form as a grid of win/draw/loss/upcoming squares
- Auto-refresh every 5 minutes
- Club selection remembered per browser (`localStorage`); the country/club dropdowns can be hidden once you've picked a club (they default to hidden after that) and reopened anytime via the "Change club" link
- A layout picker (⚙ next to "Change club") switches between **Scroll** (default), **Tabs** (one section at a time), and **Side-by-side** (sections as cards in a row, stretching to fill the embed's width and splitting League into a Table card + a Position/Form card) — remembered per browser
- Matches Notion's own default look — same font, and the same light/dark background palette Notion pages use
- Light/dark theme aware, fully responsive — including narrow Notion columns (down to ~240px, e.g. a page split into 3+ columns)

## ⚽ Available Leagues & Clubs

The exact roster depends on football-data.org's current season data (promotions, relegations, name changes will shift this over time) — this is what's selectable today. Any of these clubs that's also in the Champions League this season gets the extra Champions League section automatically.

<details>
<summary><strong>Premier League</strong> (🏴󠁧󠁢󠁥󠁮󠁧󠁿 England) — 20 clubs</summary>

AFC Bournemouth, Arsenal FC, Aston Villa FC, Brentford FC, Brighton & Hove Albion FC, Chelsea FC, Coventry City FC, Crystal Palace FC, Everton FC, Fulham FC, Hull City AFC, Ipswich Town FC, Leeds United FC, Liverpool FC, Manchester City FC, Manchester United FC, Newcastle United FC, Nottingham Forest FC, Sunderland AFC, Tottenham Hotspur FC
</details>

<details>
<summary><strong>Championship</strong> (🏴󠁧󠁢󠁥󠁮󠁧󠁿 England) — 24 clubs</summary>

Birmingham City FC, Blackburn Rovers FC, Bolton Wanderers FC, Bristol City FC, Burnley FC, Cardiff City FC, Charlton Athletic FC, Derby County FC, Lincoln City FC, Middlesbrough FC, Millwall FC, Norwich City FC, Portsmouth FC, Preston North End FC, Queens Park Rangers FC, Sheffield United FC, Southampton FC, Stoke City FC, Swansea City AFC, Watford FC, West Bromwich Albion FC, West Ham United FC, Wolverhampton Wanderers FC, Wrexham AFC
</details>

<details>
<summary><strong>La Liga</strong> (🇪🇸 Spain) — 20 clubs</summary>

Athletic Club, CA Osasuna, Club Atlético de Madrid, Deportivo Alavés, Elche CF, FC Barcelona, Getafe CF, Levante UD, Málaga CF, Rayo Vallecano de Madrid, RC Celta de Vigo, RC Deportivo La Coruña, RCD Espanyol de Barcelona, Real Betis Balompié, Real Madrid CF, Real Racing Club de Santander, Real Sociedad de Fútbol, Sevilla FC, Valencia CF, Villarreal CF
</details>

<details>
<summary><strong>Serie A</strong> (🇮🇹 Italy) — 20 clubs</summary>

AC Milan, AC Monza, ACF Fiorentina, AS Roma, Atalanta BC, Bologna FC 1909, Cagliari Calcio, Como 1907, FC Internazionale Milano, Frosinone Calcio, Genoa CFC, Juventus FC, Parma Calcio 1913, SS Lazio, SSC Napoli, Torino FC, Udinese Calcio, US Lecce, US Sassuolo Calcio, Venezia FC
</details>

<details>
<summary><strong>Bundesliga</strong> (🇩🇪 Germany) — 18 clubs</summary>

1. FC Köln, 1. FC Union Berlin, 1. FSV Mainz 05, Bayer 04 Leverkusen, Borussia Dortmund, Borussia Mönchengladbach, Eintracht Frankfurt, FC Augsburg, FC Bayern München, FC Schalke 04, Hamburger SV, RB Leipzig, SC Freiburg, SC Paderborn 07, SV 07 Elversberg, SV Werder Bremen, TSG 1899 Hoffenheim, VfB Stuttgart
</details>

<details>
<summary><strong>Ligue 1</strong> (🇫🇷 France) — 18 clubs</summary>

AJ Auxerre, Angers SCO, AS Monaco FC, ES Troyes AC, FC Lorient, Le Havre AC, Le Mans FC, Lille OSC, OGC Nice, Olympique de Marseille, Olympique Lyonnais, Paris FC, Paris Saint-Germain FC, Racing Club de Lens, RC Strasbourg Alsace, Stade Brestois 29, Stade Rennais FC 1901, Toulouse FC
</details>

<details>
<summary><strong>Eredivisie</strong> (🇳🇱 Netherlands) — 18 clubs</summary>

ADO Den Haag, AFC Ajax, AZ, FC Groningen, FC Twente '65, FC Utrecht, Feyenoord Rotterdam, Fortuna Sittard, Go Ahead Eagles, NEC, PEC Zwolle, PSV, SBV Excelsior, SC Cambuur-Leeuwarden, SC Heerenveen, Sparta Rotterdam, Telstar 1963, Willem II Tilburg
</details>

<details>
<summary><strong>Primeira Liga</strong> (🇵🇹 Portugal) — 18 clubs</summary>

Académico de Viseu FC, Casa Pia AC, CD Nacional, CD Santa Clara, CF Estrela da Amadora, CS Marítimo, FC Alverca, FC Arouca, FC Famalicão, FC Porto, GD Estoril Praia, Gil Vicente FC, Moreirense FC, Rio Ave FC, Sport Lisboa e Benfica, Sporting Clube de Braga, Sporting Clube de Portugal, Vitória SC
</details>

<details>
<summary><strong>Brasileirão</strong> (🇧🇷 Brazil) — 20 clubs</summary>

Botafogo FR, CA Mineiro, CA Paranaense, Chapecoense AF, Clube do Remo, Coritiba FBC, CR Flamengo, CR Vasco da Gama, Cruzeiro EC, EC Bahia, EC Vitória, Fluminense FC, Grêmio FBPA, Mirassol FC, RB Bragantino, Santos FC, São Paulo FC, SC Corinthians Paulista, SC Internacional, SE Palmeiras
</details>

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| "Cannot GET /" | Backend isn't running — run `npm start` |
| "Failed to fetch" / "Could not reach the backend" | Check `backendUrl` in `widget.html`; make sure the backend is running; check the browser console for errors |
| Port already in use | Change `PORT` in `.env`, or stop whatever else is using it |
| Data not updating, or the dropdowns stay empty | Check your API key in `.env`; verify your internet connection; check the browser console |
| Occasional "Failed to fetch" while switching clubs quickly | Expected — the free football-data.org tier allows only 10 requests/minute. Wait a few seconds and try again |

Still stuck? Open the browser console (F12) for detailed error messages.

<img width="1170" height="152" alt="image" src="https://github.com/user-attachments/assets/1b009fb6-c882-4f5a-a67b-9ecbc819ad7a" /># Football Club Widget

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
<summary><strong>⚪🔴⚪ Premier League</strong> — 20 clubs</summary>

<table>
<tr><td>AFC Bournemouth</td><td>Arsenal FC</td><td>Aston Villa FC</td><td>Brentford FC</td></tr>
<tr><td>Brighton &amp; Hove Albion FC</td><td>Chelsea FC</td><td>Coventry City FC</td><td>Crystal Palace FC</td></tr>
<tr><td>Everton FC</td><td>Fulham FC</td><td>Hull City AFC</td><td>Ipswich Town FC</td></tr>
<tr><td>Leeds United FC</td><td>Liverpool FC</td><td>Manchester City FC</td><td>Manchester United FC</td></tr>
<tr><td>Newcastle United FC</td><td>Nottingham Forest FC</td><td>Sunderland AFC</td><td>Tottenham Hotspur FC</td></tr>
</table>
</details>

<details>
<summary><strong>⚪🔴⚪ Championship</strong> — 24 clubs</summary>

<table>
<tr><td>Birmingham City FC</td><td>Blackburn Rovers FC</td><td>Bolton Wanderers FC</td><td>Bristol City FC</td></tr>
<tr><td>Burnley FC</td><td>Cardiff City FC</td><td>Charlton Athletic FC</td><td>Derby County FC</td></tr>
<tr><td>Lincoln City FC</td><td>Middlesbrough FC</td><td>Millwall FC</td><td>Norwich City FC</td></tr>
<tr><td>Portsmouth FC</td><td>Preston North End FC</td><td>Queens Park Rangers FC</td><td>Sheffield United FC</td></tr>
<tr><td>Southampton FC</td><td>Stoke City FC</td><td>Swansea City AFC</td><td>Watford FC</td></tr>
<tr><td>West Bromwich Albion FC</td><td>West Ham United FC</td><td>Wolverhampton Wanderers FC</td><td>Wrexham AFC</td></tr>
</table>
</details>

<details>
<summary><strong>🔴🟡🔴 La Liga</strong> — 20 clubs</summary>

<table>
<tr><td>Athletic Club</td><td>CA Osasuna</td><td>Club Atlético de Madrid</td><td>Deportivo Alavés</td></tr>
<tr><td>Elche CF</td><td>FC Barcelona</td><td>Getafe CF</td><td>Levante UD</td></tr>
<tr><td>Málaga CF</td><td>Rayo Vallecano de Madrid</td><td>RC Celta de Vigo</td><td>RC Deportivo La Coruña</td></tr>
<tr><td>RCD Espanyol de Barcelona</td><td>Real Betis Balompié</td><td>Real Madrid CF</td><td>Real Racing Club de Santander</td></tr>
<tr><td>Real Sociedad de Fútbol</td><td>Sevilla FC</td><td>Valencia CF</td><td>Villarreal CF</td></tr>
</table>
</details>

<details>
<summary><strong>🟢⚪🔴 Serie A</strong> — 20 clubs</summary>

<table>
<tr><td>AC Milan</td><td>AC Monza</td><td>ACF Fiorentina</td><td>AS Roma</td></tr>
<tr><td>Atalanta BC</td><td>Bologna FC 1909</td><td>Cagliari Calcio</td><td>Como 1907</td></tr>
<tr><td>FC Internazionale Milano</td><td>Frosinone Calcio</td><td>Genoa CFC</td><td>Juventus FC</td></tr>
<tr><td>Parma Calcio 1913</td><td>SS Lazio</td><td>SSC Napoli</td><td>Torino FC</td></tr>
<tr><td>Udinese Calcio</td><td>US Lecce</td><td>US Sassuolo Calcio</td><td>Venezia FC</td></tr>
</table>
</details>

<details>
<summary><strong>⚫🔴🟡 Bundesliga</strong> — 18 clubs</summary>

<table>
<tr><td>1. FC Köln</td><td>1. FC Union Berlin</td><td>1. FSV Mainz 05</td><td>Bayer 04 Leverkusen</td></tr>
<tr><td>Borussia Dortmund</td><td>Borussia Mönchengladbach</td><td>Eintracht Frankfurt</td><td>FC Augsburg</td></tr>
<tr><td>FC Bayern München</td><td>FC Schalke 04</td><td>Hamburger SV</td><td>RB Leipzig</td></tr>
<tr><td>SC Freiburg</td><td>SC Paderborn 07</td><td>SV 07 Elversberg</td><td>SV Werder Bremen</td></tr>
<tr><td>TSG 1899 Hoffenheim</td><td>VfB Stuttgart</td><td></td><td></td></tr>
</table>
</details>

<details>
<summary><strong>🔵⚪🔴 Ligue 1</strong> — 18 clubs</summary>

<table>
<tr><td>AJ Auxerre</td><td>Angers SCO</td><td>AS Monaco FC</td><td>ES Troyes AC</td></tr>
<tr><td>FC Lorient</td><td>Le Havre AC</td><td>Le Mans FC</td><td>Lille OSC</td></tr>
<tr><td>OGC Nice</td><td>Olympique de Marseille</td><td>Olympique Lyonnais</td><td>Paris FC</td></tr>
<tr><td>Paris Saint-Germain FC</td><td>Racing Club de Lens</td><td>RC Strasbourg Alsace</td><td>Stade Brestois 29</td></tr>
<tr><td>Stade Rennais FC 1901</td><td>Toulouse FC</td><td></td><td></td></tr>
</table>
</details>

<details>
<summary><strong>🟠🟠🟠 Eredivisie</strong> — 18 clubs</summary>

<table>
<tr><td>ADO Den Haag</td><td>AFC Ajax</td><td>AZ</td><td>FC Groningen</td></tr>
<tr><td>FC Twente '65</td><td>FC Utrecht</td><td>Feyenoord Rotterdam</td><td>Fortuna Sittard</td></tr>
<tr><td>Go Ahead Eagles</td><td>NEC</td><td>PEC Zwolle</td><td>PSV</td></tr>
<tr><td>SBV Excelsior</td><td>SC Cambuur-Leeuwarden</td><td>SC Heerenveen</td><td>Sparta Rotterdam</td></tr>
<tr><td>Telstar 1963</td><td>Willem II Tilburg</td><td></td><td></td></tr>
</table>
</details>

<details>
<summary><strong>🟢🔴🔴 Primeira Liga</strong> — 18 clubs</summary>

<table>
<tr><td>Académico de Viseu FC</td><td>Casa Pia AC</td><td>CD Nacional</td><td>CD Santa Clara</td></tr>
<tr><td>CF Estrela da Amadora</td><td>CS Marítimo</td><td>FC Alverca</td><td>FC Arouca</td></tr>
<tr><td>FC Famalicão</td><td>FC Porto</td><td>GD Estoril Praia</td><td>Gil Vicente FC</td></tr>
<tr><td>Moreirense FC</td><td>Rio Ave FC</td><td>Sport Lisboa e Benfica</td><td>Sporting Clube de Braga</td></tr>
<tr><td>Sporting Clube de Portugal</td><td>Vitória SC</td><td></td><td></td></tr>
</table>
</details>

<details>
<summary><strong>🟢🟡🔵 Brasileirão</strong> — 20 clubs</summary>

<table>
<tr><td>Botafogo FR</td><td>CA Mineiro</td><td>CA Paranaense</td><td>Chapecoense AF</td></tr>
<tr><td>Clube do Remo</td><td>Coritiba FBC</td><td>CR Flamengo</td><td>CR Vasco da Gama</td></tr>
<tr><td>Cruzeiro EC</td><td>EC Bahia</td><td>EC Vitória</td><td>Fluminense FC</td></tr>
<tr><td>Grêmio FBPA</td><td>Mirassol FC</td><td>RB Bragantino</td><td>Santos FC</td></tr>
<tr><td>São Paulo FC</td><td>SC Corinthians Paulista</td><td>SC Internacional</td><td>SE Palmeiras</td></tr>
</table>
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

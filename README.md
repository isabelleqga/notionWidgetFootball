# Football Club Widget

A real-time widget for Notion (or any embeddable page) showing matches, standings, position history, and recent form for a football club you pick from a dropdown — any club across 9 domestic leagues in 8 countries, via [football-data.org](https://www.football-data.org/).

## 📦 What's Included

- `server.js` - Backend Node.js server (proxies API calls, hides your API key)
- `widget.html` - Frontend Notion widget (self-contained, no build step)
- `package.json` - Node.js dependencies
- `.env.example` - Environment variables template

## 🚀 Quick Start

### 1. Extract the ZIP folder to your PC

```bash
# Navigate to the folder
cd atletico-madrid-widget
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```bash
# Copy the example file
cp .env.example .env

# Or create it manually with:
# PORT=3000
# API_KEY=your_football_data_org_api_key_here
```

### 4. Start the server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

Your server will run on: **http://localhost:3000**

## 🌐 Deploy Backend Options

### Option A: Local Network (Easiest for Testing)
- Server runs on `http://localhost:3000`
- Update widget.html line: `const backendUrl = 'http://localhost:3000';`
- Works only on your PC

### Option B: Replit (Free Cloud Hosting - Recommended)
1. Go to https://replit.com and create account
2. Create new Node.js Repl
3. Upload all files to Replit
4. Click "Run"
5. Get your Replit URL: `https://your-replit-name.replit.dev`
6. Update widget.html: `const backendUrl = 'https://your-replit-name.replit.dev';`

### Option C: Vercel (Free Cloud Hosting)
1. Go to https://vercel.com
2. Connect your GitHub/create account
3. Upload repository
4. Deploy
5. Get your Vercel URL
6. Update widget.html with your URL

### Option D: Heroku (Free with account)
1. Go to https://heroku.com
2. Create new app
3. Connect and deploy
4. Get your Heroku URL
5. Update widget.html

## 📝 Usage

### On Your PC (Local Testing)
1. Start server: `npm start`
2. Open `widget.html` in browser (or visit `http://localhost:3000/widget`)
3. Pick a country, then a club, from the dropdowns
4. Data updates every 5 minutes

### In Notion
1. Update `widget.html`'s `backendUrl` with your deployed backend URL
2. Copy entire HTML code
3. In Notion: **+ Add Block** → **Embed**
4. Paste HTML code
5. Pick a club — your choice is remembered in that browser for next time

## 🔑 API Key
- Get a free key at https://www.football-data.org/client/register and put it in your `.env` file (see `.env.example`)
- Stored in backend (hidden from users)
- Never exposed in browser

## 📊 Features

✅ Pick any club across Premier League, Championship, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga, and Brazil's Série A
✅ Last 2 results + next 2 fixtures (opponent, home/away, score or kickoff time in 24h format)
✅ League table (top 5 + your club)
✅ Position-over-time chart, color-coded by table zone (title contender / top 4 / mid-table / relegation)
✅ Recent form as a grid of win/draw/loss/upcoming squares
✅ Champions League form and bracket progress, shown automatically when the club is in it this season
✅ Auto-refresh every 5 minutes
✅ Club selection remembered per browser (localStorage)
✅ Light/dark theme aware
✅ Real-time data from football-data.org

## ⚽ Available Leagues & Clubs

Exact club list depends on the current season's roster from football-data.org (promotions/relegations, name changes, etc. will shift this over time) — this is what's selectable today:

### Premier League (England)
AFC Bournemouth, Arsenal FC, Aston Villa FC, Brentford FC, Brighton & Hove Albion FC, Chelsea FC, Coventry City FC, Crystal Palace FC, Everton FC, Fulham FC, Hull City AFC, Ipswich Town FC, Leeds United FC, Liverpool FC, Manchester City FC, Manchester United FC, Newcastle United FC, Nottingham Forest FC, Sunderland AFC, Tottenham Hotspur FC

### Championship (England)
Birmingham City FC, Blackburn Rovers FC, Bolton Wanderers FC, Bristol City FC, Burnley FC, Cardiff City FC, Charlton Athletic FC, Derby County FC, Lincoln City FC, Middlesbrough FC, Millwall FC, Norwich City FC, Portsmouth FC, Preston North End FC, Queens Park Rangers FC, Sheffield United FC, Southampton FC, Stoke City FC, Swansea City AFC, Watford FC, West Bromwich Albion FC, West Ham United FC, Wolverhampton Wanderers FC, Wrexham AFC

### La Liga (Spain)
Athletic Club, CA Osasuna, Club Atlético de Madrid, Deportivo Alavés, Elche CF, FC Barcelona, Getafe CF, Levante UD, Málaga CF, Rayo Vallecano de Madrid, RC Celta de Vigo, RC Deportivo La Coruña, RCD Espanyol de Barcelona, Real Betis Balompié, Real Madrid CF, Real Racing Club de Santander, Real Sociedad de Fútbol, Sevilla FC, Valencia CF, Villarreal CF

### Serie A (Italy)
AC Milan, AC Monza, ACF Fiorentina, AS Roma, Atalanta BC, Bologna FC 1909, Cagliari Calcio, Como 1907, FC Internazionale Milano, Frosinone Calcio, Genoa CFC, Juventus FC, Parma Calcio 1913, SS Lazio, SSC Napoli, Torino FC, Udinese Calcio, US Lecce, US Sassuolo Calcio, Venezia FC

### Bundesliga (Germany)
1. FC Köln, 1. FC Union Berlin, 1. FSV Mainz 05, Bayer 04 Leverkusen, Borussia Dortmund, Borussia Mönchengladbach, Eintracht Frankfurt, FC Augsburg, FC Bayern München, FC Schalke 04, Hamburger SV, RB Leipzig, SC Freiburg, SC Paderborn 07, SV 07 Elversberg, SV Werder Bremen, TSG 1899 Hoffenheim, VfB Stuttgart

### Ligue 1 (France)
AJ Auxerre, Angers SCO, AS Monaco FC, ES Troyes AC, FC Lorient, Le Havre AC, Le Mans FC, Lille OSC, OGC Nice, Olympique de Marseille, Olympique Lyonnais, Paris FC, Paris Saint-Germain FC, Racing Club de Lens, RC Strasbourg Alsace, Stade Brestois 29, Stade Rennais FC 1901, Toulouse FC

### Eredivisie (Netherlands)
ADO Den Haag, AFC Ajax, AZ, FC Groningen, FC Twente '65, FC Utrecht, Feyenoord Rotterdam, Fortuna Sittard, Go Ahead Eagles, NEC, PEC Zwolle, PSV, SBV Excelsior, SC Cambuur-Leeuwarden, SC Heerenveen, Sparta Rotterdam, Telstar 1963, Willem II Tilburg

### Primeira Liga (Portugal)
Académico de Viseu FC, Casa Pia AC, CD Nacional, CD Santa Clara, CF Estrela da Amadora, CS Marítimo, FC Alverca, FC Arouca, FC Famalicão, FC Porto, GD Estoril Praia, Gil Vicente FC, Moreirense FC, Rio Ave FC, Sport Lisboa e Benfica, Sporting Clube de Braga, Sporting Clube de Portugal, Vitória SC

### Brazil Série A (Brazil)
Botafogo FR, CA Mineiro, CA Paranaense, Chapecoense AF, Clube do Remo, Coritiba FBC, CR Flamengo, CR Vasco da Gama, Cruzeiro EC, EC Bahia, EC Vitória, Fluminense FC, Grêmio FBPA, Mirassol FC, RB Bragantino, Santos FC, São Paulo FC, SC Corinthians Paulista, SC Internacional, SE Palmeiras

Any club in these leagues that's also in the Champions League this season (checked automatically) will show the extra Champions League form/bracket section.

## 🛠️ Troubleshooting

### "Cannot GET /"
- Backend not running, run `npm start`

### "Failed to fetch" / "Could not reach the backend"
- Check `backendUrl` in widget.html
- Ensure backend is running
- Check browser console for errors

### Port already in use
- Change PORT in .env file
- Or stop other Node.js processes

### Data not updating / dropdowns not loading
- Check API key in .env file
- Verify internet connection
- The free football-data.org tier is rate-limited (10 requests/minute) — rapid switching between clubs can trigger a temporary "Failed to fetch" error; wait a few seconds and try again
- Check browser console for errors

## 📱 Mobile Support
Widget is fully responsive and works great on mobile!

## 🔒 Security Notes
- API key is stored on backend (never exposed)
- Safe to share widget on private Notion pages
- Do NOT share the .env file publicly

## 📧 Support
Check browser console (F12) for detailed error messages.

# Atlético Madrid Live Widget

A real-time widget displaying upcoming matches, recent results, and La Liga standings for Atlético de Madrid.

## 📦 What's Included

- `server.js` - Backend Node.js server (proxies API calls)
- `widget.html` - Frontend Notion widget
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
- Update widget.html line: `const backendUrl = 'http://localhost:3000/api/atletico-data';`
- Works only on your PC

### Option B: Replit (Free Cloud Hosting - Recommended)
1. Go to https://replit.com and create account
2. Create new Node.js Repl
3. Upload all files to Replit
4. Click "Run"
5. Get your Replit URL: `https://your-replit-name.replit.dev`
6. Update widget.html: `const backendUrl = 'https://your-replit-name.replit.dev/api/atletico-data';`

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
2. Open `widget.html` in browser
3. Data updates every 5 minutes

### In Notion
1. Update `widget.html` with your backend URL
2. Copy entire HTML code
3. In Notion: **+ Add Block** → **Embed**
4. Paste HTML code
5. Widget loads real Atlético Madrid data!

## 🔑 API Key
- Get a free key at https://www.football-data.org/client/register and put it in your `.env` file (see `.env.example`)
- Stored in backend (hidden from users)
- Never exposed in browser

## 📊 Features

✅ Upcoming Matches (next 2 fixtures)
✅ Last 2 Match Results (with scores)
✅ La Liga Table Position (top 5 + Atlético)
✅ Auto-refresh every 5 minutes
✅ Real-time data from football-data.org
✅ Responsive design (mobile-friendly)
✅ Color-coded results (win/loss/draw)

## 🛠️ Troubleshooting

### "Cannot GET /"
- Backend not running, run `npm start`

### "Failed to fetch"
- Check backend URL in widget.html
- Ensure backend is running
- Check browser console for errors

### Port already in use
- Change PORT in .env file
- Or stop other Node.js processes

### Data not updating
- Check API key in .env file
- Verify internet connection
- Check browser console for errors

## 📱 Mobile Support
Widget is fully responsive and works great on mobile!

## 🔒 Security Notes
- API key is stored on backend (never exposed)
- Safe to share widget on private Notion pages
- Do NOT share the .env file publicly

## 📧 Support
Check browser console (F12) for detailed error messages.

---

Made for Atlético de Madrid fans ❤️⚪🔴

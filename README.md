# 🏏 FZCricket Tournament Website

A complete cricket tournament management website for village-level tournaments.

## Features

- Team Registration (8 teams, 15 players each)
- Player Registration with role selection
- Tournament Schedule Generator
- Live Match Score Updates
- Leaderboard & Results
- Mobile-Friendly Design
- Admin Panel for score updates

## Project Structure

```
FZCricket_Tournament/
├── public/
│   └── index.html      # Frontend (Static Website)
├── index.js          # Backend Server
├── models/           # Database Models
├── routes/           # API Routes
├── .env              # Environment Variables
└── package.json      # Dependencies
```

## Deployment Guide

### Option 1: Frontend Only (GitHub Pages / Netlify)

Upload the `public/` folder contents to any static hosting:
- GitHub Pages
- Netlify (Recommended)
- Vercel

### Option 2: Full Stack Deployment

**Frontend:** Upload `public/index.html` to Netlify/Vercel

**Backend:** Deploy the root folder to:
- Render.com (Free)
- Railway.app
- Heroku

## Environment Variables (.env)

```
MONGODB_URI=mongodb+sha://your_connection_string
PORT=5000
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
ADMIN_SECRET=fzadmin2026
JWT_SECRET=fzsecret2026
```

## API Endpoints

- `GET /api/teams` - List all teams
- `POST /api/teams/register` - Register new team
- `GET /api/matches` - List matches
- `POST /api/matches/create` - Create match
- `POST /api/players/register/:teamId` - Add players
- `POST /api/auth/admin/login` - Admin login

## Admin Credentials

- Username: admin
- Password: fzadmin2026 (change in .env)

## Tech Stack

- Frontend: React + TailwindCSS (via CDN)
- Backend: Node.js + Express
- Database: MongoDB
- Real-time: Socket.io

## License

ISC

---

**For Support:** support@fzcricket.com
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
├── frontend/         # React Frontend (Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── context/
│   ├── package.json
│   └── vite.config.js
├── index.js          # Backend Server (Express + Socket.io)
├── models/           # Database Models (Mongoose)
├── routes/           # API Routes
├── middleware/       # Auth Middleware
├── src/              # Old/unused frontend copy (can be removed)
├── .env              # Environment Variables
└── package.json      # Dependencies
```

## Deployment Guide

### Option 1: Frontend Only (GitHub Pages / Netlify)

Upload the `frontend/` folder contents to any static hosting:
- GitHub Pages
- Netlify (Recommended)
- Vercel

### Option 2: Full Stack Deployment

**Frontend:** Upload `frontend/` folder to Netlify/Vercel

**Backend:** Deploy the root folder to:
- Render.com (Free)
- Railway.app
- Heroku

## Environment Variables (.env)

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
ADMIN_SECRET=your_admin_password
JWT_SECRET=your_jwt_secret
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
- Password: Set in Render.com Environment Variables

## Tech Stack

- Frontend: React + TailwindCSS + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Real-time: Socket.io

## License

ISC

---

**For Support:** shahidansari0512@gmail.com
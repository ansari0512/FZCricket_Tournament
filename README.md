# 🏏 FZCricket Tournament Website

Village level cricket tournament management website.

## Features

- Team Registration (8 teams, 15 players each)
- Player Registration with photo upload
- Tournament Schedule Generator
- Live Match Score Updates
- Leaderboard & Results
- Mobile-Friendly Design
- Admin Panel

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
├── .env              # Environment Variables
└── package.json      # Dependencies
```

## Deployment

- **Frontend:** Vercel
- **Backend:** Render.com
- **Database:** MongoDB Atlas
- **Images:** Cloudinary

## Environment Variables (.env)

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
ADMIN_SECRET=your_admin_password
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=https://fz-cricket-tournament.vercel.app
```

## API Endpoints

- `GET /api/teams` - List all teams
- `POST /api/teams/register` - Register new team
- `GET /api/matches` - List matches
- `POST /api/matches/create` - Create match
- `POST /api/players/register/:teamId` - Add players
- `POST /api/auth/admin/login` - Admin login
- `GET /api/gallery` - Get gallery photos

## Tech Stack

- Frontend: React + TailwindCSS + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Real-time: Socket.io
- Images: Cloudinary

## License

ISC

---

**For Support:** shahidansari0512@gmail.com

# 🚀 Deployment Guide

## How to Deploy FZ Cricket Tournament Website Live

### Step 1: Deploy Backend (Render.com)

1. Go to **Render.com**
2. Create a new web service
3. Connect your GitHub repository
4. Provide these details:
   - Build Command: `npm install`
   - Start Command: `node index.js`
5. Add environment variables:
   - `MONGODB_URI` = MongoDB Atlas connection string
   - `PORT` = 5000
   - `ADMIN_SECRET` = strong password
   - `JWT_SECRET` = random string
   - `ALLOWED_ORIGINS` = https://fz-cricket-tournament.vercel.app

### Step 2: Deploy Frontend (Vercel)

1. Go to **Vercel.com**
2. Connect your GitHub repository
3. Root Directory: `frontend`
4. Framework: `Vite`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add environment variables:
   - `VITE_API_URL` = https://your-backend.onrender.com/api
   - `VITE_CLOUDINARY_CLOUD` = cloudinary cloud name
   - `VITE_CLOUDINARY_PRESET` = fzcricket_gallery
   - `VITE_CLOUDINARY_PLAYERS_PRESET` = fzcricket_players
   - `VITE_CLOUDINARY_PAYMENTS_PRESET` = fzcricket_payments

### Step 3: MongoDB Setup (MongoDB Atlas)

1. Go to MongoDB Atlas
2. Create a free cluster
3. Create a user in Database Access
4. Allow `0.0.0.0/0` in Network Access
5. Copy the connection string and paste it into Render

---

Admin Login:
- URL: yourwebsite.com/admin
- Password: The password you set in ADMIN_SECRET on Render.com

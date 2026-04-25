# 🚀 Deployment Guide (Hindi)

## FZ Cricket Tournament Website Ko Live Kaise Karein

### Step 1: Backend Deploy Karein (Render.com)

1. **Render.com** par jayein
2. New Web Service create karein
3. GitHub repo connect karein
4. Ye details dein:
   - Build Command: `npm install`
   - Start Command: `node index.js`
5. Environment Variables add karein:
   - `MONGODB_URI` = MongoDB Atlas connection string
   - `PORT` = 5000
   - `ADMIN_SECRET` = strong password
   - `JWT_SECRET` = random string
   - `ALLOWED_ORIGINS` = https://fz-cricket-tournament.vercel.app

### Step 2: Frontend Deploy Karein (Vercel)

1. **Vercel.com** par jayein
2. GitHub repo connect karein
3. Root Directory: `frontend`
4. Framework: `Vite`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Environment Variables add karein:
   - `VITE_API_URL` = https://your-backend.onrender.com/api
   - `VITE_CLOUDINARY_CLOUD` = cloudinary cloud name
   - `VITE_CLOUDINARY_PRESET` = fzcricket_gallery
   - `VITE_CLOUDINARY_PLAYERS_PRESET` = fzcricket_players
   - `VITE_CLOUDINARY_PAYMENTS_PRESET` = fzcricket_payments

### Step 3: MongoDB Setup (MongoDB Atlas)

1. MongoDB Atlas par jayein
2. Free cluster create karein
3. Database Access mein user banayein
4. Network Access mein `0.0.0.0/0` allow karein
5. Connection string copy karein aur Render mein daalein

---

Admin Login:
- URL: yourwebsite.com/admin
- Password: Jo tumne Render.com ke ADMIN_SECRET mein set kiya hai

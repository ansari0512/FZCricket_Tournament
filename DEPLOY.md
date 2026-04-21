# 🚀 Deployment Guide (Hindi)

## FZ Cricket Tournament Website Ko Live Kaise Karein

### Step 1: Backend Deploy Karein (Free)

1. **Render.com** par jayein (free service hai)
2. New Web Service create karein
3. Ye details dein:
   - Name: fz-cricket-backend
   - Build Command: (empty)
   - Start Command: node index.js
4. Environment Variables add karein:
   - `MONGODB_URI` = aapka MongoDB Atlas connection string
   - `PORT` = 5000
5. Deploy karein

### Step 2: Frontend Deploy Karein

**Option A: Netlify (Recommend)**
1. Netlify.com par jayein
2. Drag & drop `public` folder upload karein
3. Website live ho jayegi

**Option B: Vercel**
1. Vercel.com par jayein
2. Upload public folder

### Step 3: API URL Update Karein

Jab backend deploy ho jaye, to `public/index.html` mein line 52 par:
```javascript
const API_URL = 'https://your-backend.onrender.com/api';
```
isme apni deployed URL daal dein.

### Step 4: MongoDB Setup (Free)

1. MongoDB Atlas par jayein (mongodb.com)
2. Free account create karein
3. New Cluster create karein
4. Connection string copy karein
5. .env file mein daal dein

---

**Ab aapki website live ho jayegi!**

Admin Login:
- URL: yourwebsite.com → Admin button
- Password: fzadmin2026

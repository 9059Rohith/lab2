# Deployment Guide for new_lab

## ✅ App Works Out-of-the-Box
Your app **does NOT require MongoDB** to deploy! It runs perfectly with in-memory storage.

- ✅ All games work
- ✅ User profiles are saved (during session)
- ✅ Scores tracked
- ✅ Chat history stored
- ✅ Rewards calculated

**Data persists only during the session. After restart, in-memory data is cleared.**

---

## 🚀 Deploy to Vercel (Easiest)

### Step 1: Import Project
1. Go to https://vercel.com/new
2. Select **GitHub** → Search `9059Rohith/lab2`
3. Click **Import**

### Step 2: Configure
- **Project Name**: anything (e.g., `autism-learn-portal`)
- **Framework Preset**: Other
- **Root Directory**: `new_lab`
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install --prefix ./backend && npm install --prefix ./frontend`

### Step 3: Environment Variables (Optional)
Click **Add** for these (all optional):

| Variable | Example | Required? |
|----------|---------|-----------|
| `MONGODB_URI` | `mongodb+srv://user:pass@...` | ❌ No (uses memory mode without it) |
| `CORS_ORIGINS` | `https://yourdomain.vercel.app` | ❌ No (defaults work fine) |
| `GROQ_API_KEY` | Your Groq API key | ❌ No (uses fallback tutor) |

### Step 4: Deploy
Click **Deploy** → Wait 2-3 minutes → ✅ **Live!**

Your app will be at: `https://project-name.vercel.app`

---

## 💾 Add MongoDB Later (Optional)

If you want persistent data across deployments:

### 1. Create MongoDB Atlas Account
- Visit: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Create database user
- Get connection string

### 2. Add to Vercel
- Go to your Vercel project settings
- **Environment Variables** → Add `MONGODB_URI`
- Paste your connection string
- Redeploy (git push or manual redeploy)

### 3. Done!
Data now persists permanently in MongoDB.

---

## 🔧 Local Development

### Start Backend
```bash
cd backend
npm install
PORT=3000 npm start
```

### Start Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

---

## 📊 What's Deployed

✅ **Frontend**
- 5 interactive games
- User profile management
- AI Tutor chat
- Rewards system
- Progress tracking

✅ **Backend API**
- Game scores (CRUD)
- User profiles (CRUD)
- Rewards management
- Chat history
- Fallback tutoring

---

## ⚠️ Important Notes

1. **Without MongoDB**: Data is cleared on redeploy
2. **With MongoDB**: All data persists permanently
3. **Free Vercel tier**: Deployments are fast and free
4. **Free MongoDB Atlas**: 512 MB storage, perfect for testing

---

## 🆘 Troubleshooting

**Build fails?**
- Check Node.js version (must be 18+)
- Verify both `backend/package.json` and `frontend/package.json` exist

**API not responding?**
- Check CORS_ORIGINS environment variable
- Make sure backend is deployed at `/api/*`

**Data not persisting?**
- Without MongoDB? That's expected. Add MongoDB to persist.
- With MongoDB? Check the connection string format.

---

## 📱 Features Work Both Ways

**With Memory Mode (No MongoDB):**
- Games, chat, profiles all work
- Data lost on server restart
- Perfect for testing/demo

**With MongoDB:**
- All features + permanent storage
- Data survives server restarts
- Production-ready

Choose based on your needs! 🎉

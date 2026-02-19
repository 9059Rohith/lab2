# 🚀 QUICK START GUIDE - Star Math Explorer

## Welcome! Let's get your app up and running in 5 minutes! ⏱️

### Step 1: Install Dependencies (2 minutes) 📦

Open PowerShell/Terminal and run:

```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Setup Database (1 minute) 🗄️

1. **MongoDB Atlas Setup:**
   - Already configured connection string in `backend/.env`
   - Database: `autism-space-learn`
   - Connected and ready to use! ✅

### Step 3: Start the Application (1 minute) 🎬

**Option A: Using Two Terminals (Recommended)**

**Terminal 1 - Start Backend:**
```powershell
cd backend
npm start
```
Output should show:
```
🌟 MongoDB Atlas Connected Successfully!
🚀 Server running on port: 3000
```

**Terminal 2 - Start Frontend:**
```powershell
cd frontend
npm run dev
```
Output should show:
```
VITE ready in XXX ms
➜ Local: http://localhost:5173/
```

**Option B: Using Single Command (Coming Soon)**
```powershell
npm run dev:all
```

### Step 4: Open Your Browser (30 seconds) 🌐

Navigate to:
```
http://localhost:5173
```

You should see the beautiful Star Math Explorer landing page! 🚀✨

---

## 🎮 Quick Feature Test

1. **Test Learning Module:**
   - Click "Start Learning"
   - Click on any symbol card
   - Click "🔊 Speak" button
   - Click "⭐ I Learned This!"

2. **Test Activities:**
   - Click "Play Activities"
   - Try the Symbol Quiz

3. **Test Progress:**
   - Click "My Progress"
   - View your learning journey

---

## 🐛 Troubleshooting

### Backend Won't Start?
```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process if needed
# Replace PID with the actual process ID
Stop-Process -Id PID -Force
```

### Frontend Won't Start?
```powershell
# Check if port 5173 is in use
netstat -ano | findstr :5173

# Kill the process if needed
Stop-Process -Id PID -Force
```

### Database Connection Error?
- Check internet connection
- Verify `.env` file in backend folder
- Check MongoDB Atlas is accessible

### Voice Not Working?
- Enable audio in browser
- Check voice toggle button (bottom right)
- Try different browser (Chrome recommended)

---

## 📚 What's Next?

- Read full [README.md](./README.md) for detailed documentation
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment
- Explore [autism_portal_documentation.tex](./autism_portal_documentation.tex) for academic documentation

---

## 🎓 Developer Information

**Created by:** Rohith Kumar  
**Roll No:** CB.SC.U4CSE23018  
**Department:** CSE-A  
**Institution:** Amrita Vishwa Vidyapeetham  
**Course Teacher:** Dr. T. Senthil Kumar

---

## 🎉 You're All Set!

Enjoy exploring Star Math Explorer! 🚀🌟

If you encounter any issues, check the detailed documentation or raise an issue on GitHub.

**GitHub:** https://github.com/9059Rohith/lab2

---

**Happy Learning! ⭐**

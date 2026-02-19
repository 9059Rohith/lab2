# 🚀 Star Math Explorer - Deployment Guide

## 🌟 Overview
This guide will help you deploy the Star Math Explorer application to production.

## 📋 Prerequisites
- Node.js 18 or higher installed
- MongoDB Atlas account (for database)
- Git installed
- Accounts on Vercel/Netlify/Render (for hosting)

## 🗂️ Project Structure
```
lab2/
├── frontend/          # React frontend application
├── backend/           # Node.js Express backend API
├── autism_portal_documentation.tex
└── README.md
```

## 🔧 Backend Deployment

### Option 1: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend folder**
   ```bash
   cd backend
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

5. **Set Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `MONGODB_URI`: Your MongoDB connection string
     - `NODE_ENV`: `production`

### Option 2: Deploy to Render

1. **Create account on [Render.com](https://render.com)**

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select backend folder
   - Build Command: `npm install`
   - Start Command: `node server.js`

3. **Add Environment Variables**
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`

### Option 3: Deploy to Railway

1. **Create account on [Railway.app](https://railway.app)**

2. **Create New Project**
   - Connect GitHub repository
   - Select backend directory

3. **Add Environment Variables** in Railway dashboard

## 🎨 Frontend Deployment

### Option 1: Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

5. **Configure Environment Variables**
   - In Netlify Dashboard → Site Settings → Environment Variables
   - Add: `VITE_API_URL`: Your backend API URL

### Option 2: Deploy to Vercel

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Add Environment Variables** in Vercel Dashboard

### Option 3: Deploy to GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/lab2",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster

2. **Configure Database**
   - Create database: `autism-space-learn`
   - Create collections (will be auto-created by app):
     - `progresses`
     - `feedbacks`
     - `symbollearneds`
     - `contacts`

3. **Get Connection String**
   - Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Whitelist IP Addresses**
   - Network Access → Add IP Address
   - For development: Add your current IP
   - For production: Add `0.0.0.0/0` (allow from anywhere)

## 🔗 Update API Endpoints

After deploying backend, update frontend API calls:

1. **Create `.env` file in frontend folder**
   ```env
   VITE_API_URL=https://your-backend-url.com
   ```

2. **Update axios calls** (if using hardcoded URLs)
   ```javascript
   // Replace
   axios.post('http://localhost:3000/api/...')
   
   // With
   axios.post(`${import.meta.env.VITE_API_URL}/api/...`)
   ```

## ✅ Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend can connect to backend
- [ ] Database operations work correctly
- [ ] All pages load without errors
- [ ] Voice toggle works
- [ ] Games function properly
- [ ] Progress tracking works
- [ ] Mobile responsive design works
- [ ] All assets load correctly
- [ ] HTTPS is enabled

## 🧪 Testing Deployment

1. **Test Backend API**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Test Frontend**
   - Visit your frontend URL
   - Navigate through all pages
   - Test all interactive features
   - Check browser console for errors

## 🐛 Troubleshooting

### Backend Issues
- **500 Error**: Check environment variables
- **Database Connection**: Verify MongoDB URI and IP whitelist
- **CORS Error**: Ensure frontend URL is in CORS config

### Frontend Issues
- **Blank Page**: Check browser console for errors
- **API Errors**: Verify API_URL environment variable
- **Assets Not Loading**: Check build output and paths

## 📊 Monitoring

### Backend Monitoring
- Use Vercel/Render dashboard for logs
- Monitor MongoDB Atlas for database metrics
- Set up error tracking (Sentry, LogRocket)

### Frontend Monitoring
- Use Netlify/Vercel analytics
- Monitor Core Web Vitals
- Set up user analytics (Google Analytics, Plausible)

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` for templates
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Limit IP access when possible
   - Enable MongoDB authentication

3. **API Security**
   - Implement rate limiting
   - Add input validation
   - Use HTTPS only

## 📱 Custom Domain (Optional)

### For Netlify
1. Domain Settings → Add custom domain
2. Update DNS records at your registrar
3. Enable HTTPS

### For Vercel
1. Domains → Add domain
2. Configure DNS
3. HTTPS is automatic

## 🎉 Success!

Your Star Math Explorer application is now live! 🚀

- Frontend URL: `https://your-app.netlify.app`
- Backend URL: `https://your-api.vercel.app`

## 📞 Support

For deployment issues:
- GitHub: https://github.com/9059Rohith/lab2
- Email: rohithkumar@example.com

---

**Made with ❤️ by Rohith Kumar**
**CB.SC.U4CSE23018 | Amrita Vishwa Vidyapeetham**

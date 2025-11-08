# 🚀 Quick Deployment Checklist for Render

## Before You Deploy

- [ ] Push all code to GitHub repository
- [ ] MongoDB Atlas cluster is running
- [ ] Network access in MongoDB Atlas set to allow 0.0.0.0/0
- [ ] Have your API keys ready (VirusTotal, PhishTank - optional)

## Deployment Order

### 1️⃣ ML Service (Deploy First)
```
Service Type: Web Service
Environment: Python 3
Root Directory: ml_service
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120

Environment Variables:
- PORT = 5001
- DEBUG = False
- MODEL_PATH = models/phishing_detector.pkl
```
✅ **Copy ML Service URL**: ___________________________________

### 2️⃣ Backend (Deploy Second)
```
Service Type: Web Service
Environment: Node
Root Directory: backend
Build Command: npm install
Start Command: npm start

Environment Variables:
- NODE_ENV = production
- PORT = 5000
- MONGODB_URI = mongodb+srv://adityaparihar450_db_user:lg3wv4O9K308IVRS@cluster.jkvnyrj.mongodb.net/phish_detector?retryWrites=true&w=majority
- JWT_SECRET = (generate with: openssl rand -base64 32)
- JWT_EXPIRE = 7d
- ML_SERVICE_URL = (paste ML service URL from step 1)
- FRONTEND_URL = (will add after step 3)
- VIRUSTOTAL_API_KEY = (optional)
- PHISHTANK_API_KEY = (optional)
- RATE_LIMIT_WINDOW_MS = 900000
- RATE_LIMIT_MAX_REQUESTS = 100

Health Check: /health
```
✅ **Copy Backend Service URL**: ___________________________________

### 3️⃣ Frontend (Deploy Last)

**First, update frontend/.env.production:**
```env
VITE_API_URL=(paste backend URL from step 2)
```

**Commit and push:**
```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push
```

**Then deploy:**
```
Service Type: Static Site
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist

Environment Variables:
- VITE_API_URL = (paste backend URL from step 2)
```
✅ **Copy Frontend URL**: ___________________________________

### 4️⃣ Update Backend CORS

**Add FRONTEND_URL environment variable to backend:**
- Go to backend service settings
- Add: `FRONTEND_URL` = (paste frontend URL from step 3)
- Service will auto-redeploy

## Testing Checklist

- [ ] Test ML Service: `curl https://your-ml-service.onrender.com/health`
- [ ] Test Backend: `curl https://your-backend.onrender.com/health`
- [ ] Open Frontend URL in browser
- [ ] Register a new account
- [ ] Login successfully
- [ ] Analyze a test URL
- [ ] Check scan history
- [ ] View dashboard stats

## Post-Deployment

- [ ] Bookmark your service URLs
- [ ] Set up monitoring (check Render logs)
- [ ] Consider upgrading from free tier if needed
- [ ] Set up a health check ping service (for free tier)

## Your Deployed URLs

📱 **Frontend**: ___________________________________________
🔧 **Backend**: ___________________________________________
🤖 **ML Service**: ___________________________________________
💾 **MongoDB**: `mongodb+srv://adityaparihar450_db_user:***@cluster.jkvnyrj.mongodb.net/`

## Quick Commands

### Generate JWT Secret
```bash
openssl rand -base64 32
```

### Test Health Endpoints
```bash
# ML Service
curl https://phish-detector-ml.onrender.com/health

# Backend
curl https://phish-detector-backend.onrender.com/health
```

### View Logs
```bash
# From Render Dashboard
Services → Select Service → Logs Tab
```

### Redeploy
```bash
# Manual redeploy from Render dashboard
Services → Select Service → Manual Deploy → Deploy latest commit

# Or push to GitHub (auto-deploy)
git push origin main
```

## Common Issues & Solutions

### ❌ "MongoDB connection failed"
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Verify username/password in connection string
- Ensure cluster is not paused

### ❌ "Service won't start"
- Check logs in Render dashboard
- Verify all environment variables are set
- Check build/start commands are correct

### ❌ "CORS errors in frontend"
- Verify FRONTEND_URL is set in backend
- Check backend CORS configuration
- Ensure URLs don't have trailing slashes

### ❌ "First request takes too long"
- This is normal for free tier (services sleep after 15 min)
- Cold start takes 30-60 seconds
- Consider paid tier or use a ping service

## Need Help?

📖 Full Documentation: See `DEPLOYMENT.md`
🐛 Issues: Check service logs in Render dashboard
💬 Support: Render documentation at https://render.com/docs

---

**Pro Tip:** Keep this checklist handy for future updates and redeployments!

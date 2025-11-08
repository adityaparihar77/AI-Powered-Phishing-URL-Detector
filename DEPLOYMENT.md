# 🚀 Deploying to Render with MongoDB Atlas

This guide will walk you through deploying your AI-Powered Phishing URL Detector to Render.com with MongoDB Atlas.

## Prerequisites

- GitHub account with your code pushed to a repository
- Render account (sign up at https://render.com)
- MongoDB Atlas account (sign up at https://www.mongodb.com/cloud/atlas)
- VirusTotal API key (optional, from https://www.virustotal.com)
- PhishTank API key (optional, from https://www.phishtank.com)

## Part 1: MongoDB Atlas Setup

### 1. Database is Already Configured ✅

Your MongoDB Atlas connection string is:
```
mongodb+srv://adityaparihar450_db_user:lg3wv4O9K308IVRS@cluster.jkvnyrj.mongodb.net/
```

### 2. Configure Network Access

1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access** in the left sidebar
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (0.0.0.0/0)
   - This is necessary for Render to connect
5. Click **Confirm**

### 3. Verify Database User

1. Go to **Database Access**
2. Verify user `adityaparihar450_db_user` exists and has appropriate permissions
3. Ensure password is: `lg3wv4O9K308IVRS`

## Part 2: Prepare Your Repository

### 1. Push Your Code to GitHub

```bash
# If not already initialized
git init
git add .
git commit -m "Prepare for Render deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### 2. Create .gitignore (if not exists)

Ensure these files are NOT committed:
```gitignore
# Environment files with secrets
.env
.env.local
.env.production.local

# But keep these example files
!.env.example
!.env.production

# Node modules
node_modules/
backend/node_modules/
frontend/node_modules/

# Python
ml_service/venv/
ml_service/__pycache__/
*.pyc
*.pyo
*.pyd

# Build files
frontend/dist/
frontend/build/

# Logs
*.log
backend/logs/

# OS
.DS_Store
Thumbs.db
```

## Part 3: Deploy ML Service to Render

### 1. Create ML Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

   **Name:** `phish-detector-ml`
   
   **Environment:** `Python 3`
   
   **Region:** Choose closest to you (e.g., Oregon)
   
   **Branch:** `main`
   
   **Root Directory:** `ml_service`
   
   **Build Command:**
   ```bash
   pip install -r requirements.txt
   ```
   
   **Start Command:**
   ```bash
   gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
   ```

5. **Environment Variables:**
   - `PORT` = `5001`
   - `DEBUG` = `False`
   - `MODEL_PATH` = `models/phishing_detector.pkl`

6. **Plan:** Free

7. Click **Create Web Service**

8. **Copy the Service URL** (e.g., `https://phish-detector-ml.onrender.com`)

## Part 4: Deploy Backend to Render

### 1. Create Backend Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure the service:

   **Name:** `phish-detector-backend`
   
   **Environment:** `Node`
   
   **Region:** Same as ML service
   
   **Branch:** `main`
   
   **Root Directory:** `backend`
   
   **Build Command:**
   ```bash
   npm install
   ```
   
   **Start Command:**
   ```bash
   npm start
   ```

4. **Environment Variables** (click "Add Environment Variable"):

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGODB_URI` | `mongodb+srv://adityaparihar450_db_user:lg3wv4O9K308IVRS@cluster.jkvnyrj.mongodb.net/phish_detector?retryWrites=true&w=majority` |
   | `JWT_SECRET` | Generate a strong random string (use: `openssl rand -base64 32`) |
   | `JWT_EXPIRE` | `7d` |
   | `ML_SERVICE_URL` | Paste the ML service URL from Step 3.8 |
   | `VIRUSTOTAL_API_KEY` | Your VirusTotal API key (or leave blank) |
   | `PHISHTANK_API_KEY` | Your PhishTank API key (or leave blank) |
   | `RATE_LIMIT_WINDOW_MS` | `900000` |
   | `RATE_LIMIT_MAX_REQUESTS` | `100` |

5. **Health Check Path:** `/health`

6. **Plan:** Free

7. Click **Create Web Service**

8. **Copy the Backend Service URL** (e.g., `https://phish-detector-backend.onrender.com`)

## Part 5: Deploy Frontend to Render

### 1. Update Frontend Environment

Before deploying, update `frontend/.env.production` with your backend URL:

```env
VITE_API_URL=https://phish-detector-backend.onrender.com
```

Commit and push this change:
```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push
```

### 2. Create Static Site

1. Click **New +** → **Static Site**
2. Connect your GitHub repository
3. Configure the site:

   **Name:** `phish-detector-frontend`
   
   **Branch:** `main`
   
   **Root Directory:** `frontend`
   
   **Build Command:**
   ```bash
   npm install && npm run build
   ```
   
   **Publish Directory:**
   ```
   dist
   ```

4. **Environment Variables:**
   - `VITE_API_URL` = Your backend URL from Part 4.8

5. **Plan:** Free

6. Click **Create Static Site**

## Part 6: Configure CORS

### 1. Update Backend CORS Settings

In `backend/server.js`, update the CORS configuration:

```javascript
// Update CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://phish-detector-frontend.onrender.com', // Your frontend URL
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

Commit and push:
```bash
git add backend/server.js
git commit -m "Update CORS for production"
git push
```

Render will automatically redeploy the backend.

## Part 7: Testing Your Deployment

### 1. Test ML Service

```bash
curl https://phish-detector-ml.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "ml-service",
  "model_loaded": true
}
```

### 2. Test Backend

```bash
curl https://phish-detector-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-09T...",
  "service": "phish-detector-api"
}
```

### 3. Test Frontend

1. Open your frontend URL: `https://phish-detector-frontend.onrender.com`
2. Register a new account
3. Login
4. Try analyzing a URL

## Part 8: Post-Deployment Configuration

### 1. Set Up Custom Domain (Optional)

1. In Render Dashboard, go to your frontend service
2. Click **Settings** → **Custom Domain**
3. Add your domain and follow DNS configuration instructions

### 2. Enable Auto-Deploy

Render automatically deploys when you push to your main branch. To disable:
1. Go to service **Settings**
2. Scroll to **Build & Deploy**
3. Toggle **Auto-Deploy**

### 3. Monitor Your Services

- **Logs:** Click on each service → **Logs** tab
- **Metrics:** View CPU, memory usage, and response times
- **Events:** See deployment history and status

### 4. Scale Your Services (Paid Plans)

Free tier limitations:
- Services spin down after 15 minutes of inactivity
- 750 hours/month of free usage
- Limited memory and CPU

To upgrade:
1. Go to service **Settings**
2. Click **Change Plan**
3. Select a paid plan for better performance

## Part 9: Troubleshooting

### ML Service Not Starting

**Issue:** Model training timeout

**Solution:**
1. Pre-train the model locally
2. Commit the model file to git
3. Update `app.py` to load pre-trained model:

```python
# Instead of training on startup
try:
    logger.info("Loading pre-trained model...")
    classifier.load_model()
    logger.info("Model loaded successfully")
except Exception as e:
    logger.warning(f"Pre-trained model not found, training new model: {e}")
    classifier.train()
```

### MongoDB Connection Failed

**Issue:** Authentication failed or network error

**Solutions:**
1. Verify IP whitelist includes 0.0.0.0/0
2. Check username and password are correct
3. Ensure connection string format is correct
4. Check MongoDB Atlas cluster is running

### Frontend API Calls Failing

**Issue:** CORS errors or 404s

**Solutions:**
1. Verify `VITE_API_URL` is set correctly
2. Check backend CORS configuration
3. Ensure backend service is running
4. Check browser console for specific errors

### Service Spinning Down (Free Tier)

**Issue:** First request takes 30+ seconds

**Solution:**
- This is expected on free tier
- Consider upgrading to paid plan
- Or use a cron job to ping services every 10 minutes:
  ```bash
  # Use a service like cron-job.org
  curl https://phish-detector-backend.onrender.com/health
  curl https://phish-detector-ml.onrender.com/health
  ```

## Part 10: Maintenance

### Updating Your Application

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically detect the push and redeploy affected services.

### Viewing Logs

```bash
# Via Render Dashboard
1. Select service
2. Click "Logs" tab
3. Use filters and search

# Via Render CLI (optional)
render logs -s phish-detector-backend
```

### Managing Environment Variables

1. Go to service **Settings**
2. Scroll to **Environment**
3. Click **Edit** to modify variables
4. Service will automatically redeploy

### Database Backup

1. In MongoDB Atlas Dashboard
2. Go to **Clusters** → Your cluster
3. Click **...** → **Download Metrics & Monitoring Data**
4. Or set up automated backups in cluster settings

## 🎉 Congratulations!

Your AI-Powered Phishing URL Detector is now live on Render!

**Your URLs:**
- **Frontend:** https://phish-detector-frontend.onrender.com
- **Backend:** https://phish-detector-backend.onrender.com
- **ML Service:** https://phish-detector-ml.onrender.com

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Free Tier Limitations](https://render.com/docs/free)
- [Custom Domains](https://render.com/docs/custom-domains)
- [Environment Groups](https://render.com/docs/environment-variables#environment-groups)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review service logs in Render dashboard
3. Check MongoDB Atlas metrics
4. Open an issue in your GitHub repository

---

**Important Notes:**

⚠️ **Free Tier Limitations:**
- Services sleep after 15 minutes of inactivity
- Cold starts take 30-60 seconds
- Limited to 750 hours/month across all services

💡 **Security Best Practices:**
- Regularly rotate your JWT_SECRET
- Keep API keys in environment variables, never in code
- Enable MongoDB Atlas backup
- Monitor service logs for suspicious activity
- Consider adding rate limiting and DDoS protection

📊 **Performance Tips:**
- Pre-train ML model and commit to repo
- Enable caching where appropriate
- Optimize bundle size for frontend
- Consider using CDN for static assets
- Monitor and optimize slow queries in MongoDB

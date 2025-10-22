# Ahmad Store - Render Deployment Guide

## Quick Deploy Settings

### Service Configuration

**Name:** `ahmad-store-api`  
**Environment:** `Node`  
**Region:** `Frankfurt` (or your choice)  
**Branch:** `main`

---

## 📦 Build & Deploy Commands

### Root Directory
```
apps/api
```

### Build Command
```bash
npm ci --only=production
```

### Pre-Deploy Command
```bash
# Leave empty or use:
echo "Starting deployment..."
```

### Start Command
```bash
node src/server.js
```

---

## 🌍 Environment Variables

Set these in Render Dashboard → Environment:

### Required Variables

```env
NODE_ENV=production
NODE_VERSION=20
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ahmadstore?retryWrites=true&w=majority
```

### Optional Variables

```env
# CORS Configuration (your frontend URL)
CORS_ORIGINS=https://ahmad-store.vercel.app,https://your-custom-domain.com

# Auto-seed database on first deploy
AUTO_SEED=true

# AI Assistant (optional)
HUGGINGFACE_TOKEN=hf_your_token_here
LLM_ENDPOINT=https://your-llm-service.onrender.com

# Custom port (Render auto-assigns if not set)
PORT=3001
```

---

## 🚀 Step-by-Step Deployment

### 1. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Connect your GitHub account if not connected
5. Find and select: `avesoftwarahmad/storefinal`

### 2. Configure Service Settings

**Basic Settings:**
- **Name:** `ahmad-store-api`
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** `apps/api`
- **Runtime:** `Node`

**Build Settings:**
- **Build Command:** `npm ci --only=production`
- **Start Command:** `node src/server.js`

**Advanced Settings:**
- **Auto-Deploy:** ✅ Yes
- **Health Check Path:** `/api/health`

### 3. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add each variable from the list above:

```
NODE_ENV = production
NODE_VERSION = 20
MONGODB_URI = [your MongoDB connection string]
CORS_ORIGINS = [your frontend URL]
AUTO_SEED = true
```

### 4. Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete (3-5 minutes)
3. Your API will be live at: `https://ahmad-store-api.onrender.com`

---

## ✅ Verify Deployment

After deployment completes, test these endpoints:

### Health Check
```bash
curl https://ahmad-store-api.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-22T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Products API
```bash
curl https://ahmad-store-api.onrender.com/api/products
```

### Assistant Info
```bash
curl https://ahmad-store-api.onrender.com/api/assistant/info
```

---

## 🔗 Connect Frontend

After your backend is deployed, update your frontend environment variables:

**Vercel Environment Variable:**
```
VITE_API_URL=https://ahmad-store-api.onrender.com
```

Or in your frontend `.env`:
```env
VITE_API_URL=https://ahmad-store-api.onrender.com
```

---

## 📊 Database Setup (MongoDB Atlas)

If you don't have MongoDB set up yet:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user
4. Whitelist Render's IPs (or use `0.0.0.0/0` for all IPs)
5. Get your connection string
6. Add it to Render as `MONGODB_URI`

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/ahmadstore?retryWrites=true&w=majority
```

---

## 🐛 Troubleshooting

### Build Fails

**Problem:** `npm ci` fails  
**Solution:** Make sure `package-lock.json` is committed to git

**Problem:** Module not found  
**Solution:** Check that `node-fetch` is in `dependencies` (not `devDependencies`)

### Runtime Errors

**Problem:** "Cannot connect to database"  
**Solution:** Check `MONGODB_URI` is correct and network access is allowed

**Problem:** CORS errors  
**Solution:** Add your frontend URL to `CORS_ORIGINS`

### Performance

**Problem:** API is slow on free tier  
**Solution:** Render free tier spins down after inactivity. Consider upgrading or use a keep-alive service.

---

## 🔄 CI/CD - Automatic Deployments

With Auto-Deploy enabled, every push to `main` branch will trigger a new deployment:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Render automatically deploys!
```

---

## 📝 Important Notes

1. **Free Tier Limitations:**
   - Spins down after 15 minutes of inactivity
   - 750 hours/month free
   - Slower than paid tiers

2. **Environment Variables:**
   - Never commit sensitive data to git
   - Use Render's environment variable UI
   - Variables marked `sync: false` in render.yaml need manual setup

3. **Node Version:**
   - Specified in `package.json`: `"node": "^20.0.0"`
   - Also set `NODE_VERSION=20` in Render env vars

4. **Database:**
   - Free MongoDB Atlas tier: 512MB storage
   - Set `AUTO_SEED=true` to populate sample data on first run

---

## 🎯 Your API Endpoints

Once deployed, your API will be available at:

```
https://ahmad-store-api.onrender.com

GET  /api/health              - Health check
GET  /api/products            - List products
GET  /api/products/:id        - Get product
POST /api/orders              - Create order
GET  /api/orders/:id          - Get order
POST /api/assistant/chat      - AI assistant chat
GET  /api/assistant/info      - Assistant info
GET  /api/dashboard/business-metrics - Dashboard metrics
```

---

## ✨ Success!

Your Ahmad Store API should now be live on Render! 🎉

**Next Steps:**
1. Test all endpoints
2. Deploy frontend to Vercel
3. Update frontend with API URL
4. Test end-to-end flow


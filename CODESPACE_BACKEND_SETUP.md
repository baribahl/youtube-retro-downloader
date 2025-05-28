# 🚀 Codespace Backend Setup Guide

This guide explains how to set up your GitHub Codespace as the backend API server for the YouTube Retro Downloader GitHub Pages deployment.

## 📋 Overview

**Current Setup:**
- ✅ **Frontend**: Deployed on GitHub Pages at https://baribahl.github.io/youtube-retro-downloader/
- ⚙️ **Backend**: Needs to be running in a Codespace (this guide)

## 🔧 Step 1: Create and Configure Codespace

### 1.1 Create Codespace
1. Go to your GitHub repository: https://github.com/baribahl/youtube-retro-downloader
2. Click the green **"Code"** button
3. Go to **"Codespaces"** tab
4. Click **"Create codespace on main"**
5. Wait for the Codespace to initialize (this may take a few minutes)

### 1.2 Verify Codespace Setup
Once your Codespace is ready, the following should happen automatically:
- Node.js 18 will be installed
- Python 3.11 will be installed  
- `npm install` will run automatically
- `pip install yt-dlp` will run automatically
- Ports 3000 and 3001 will be forwarded

## 🌐 Step 2: Get Your Codespace Backend URL

### 2.1 Start the Backend Server
In your Codespace terminal, run:
```bash
node server.js
```

### 2.2 Get the Public URL
1. In VS Code, go to the **"PORTS"** tab (bottom panel)
2. Find port **3001** (Backend API)
3. Right-click on port 3001
4. Select **"Port Visibility"** → **"Public"**
5. Copy the **"Forwarded Address"** URL (looks like: `https://fuzzy-space-disco-abc123-3001.github.dev`)

Your backend URL will look like:
```
https://CODESPACE_NAME-3001.GITHUB_CODESPACES_DOMAIN
```

Example:
```
https://fuzzy-space-disco-w9x4v5r6q9p-3001.github.dev
```

## ⚙️ Step 3: Configure Frontend to Use Codespace Backend

### 3.1 Update Environment Variables
1. Open the `.env.production` file in your repository
2. Replace the placeholder URL with your actual Codespace URL:

```bash
# Replace this:
VITE_BACKEND_URL=https://your-codespace-name-3001.github.dev/api

# With your actual URL:
VITE_BACKEND_URL=https://fuzzy-space-disco-w9x4v5r6q9p-3001.github.dev/api
```

**Important**: Add `/api` to the end of your Codespace URL!

### 3.2 Test Backend Connection
Test your backend by visiting:
```
https://YOUR_CODESPACE_URL/api/test
```

You should see:
```json
{
  "status": "ok",
  "message": "Backend server is running!",
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

## 🚀 Step 4: Rebuild and Deploy Frontend

### 4.1 Commit Environment Changes
```bash
git add .env.production
git commit -m "Configure Codespace backend URL for production"
git push origin main
```

### 4.2 Trigger GitHub Pages Rebuild
The GitHub Actions workflow will automatically rebuild and deploy when you push changes. You can monitor the deployment:

1. Go to **Actions** tab in your GitHub repository
2. Watch the **"Deploy to GitHub Pages"** workflow
3. Wait for it to complete (green checkmark)

## 🧪 Step 5: Test the Full Integration

### 5.1 Verify GitHub Pages Frontend
1. Visit: https://baribahl.github.io/youtube-retro-downloader/
2. The app should show "Backend Available ✅" instead of "Backend Unavailable ❌"

### 5.2 Test Download Functionality
1. Enter a YouTube URL (try the quick test buttons)
2. Click "Get Video Info"
3. Select format and click "Download"
4. The download should work with your Codespace backend!

## 🔄 Step 6: Keep Codespace Running

### 6.1 Codespace Lifecycle
- **Free Tier**: 60 hours/month, auto-stops after 30 minutes of inactivity
- **Pro Tier**: 180 hours/month
- **Restart**: Codespaces can be restarted when needed

### 6.2 Keep Backend Running
To keep your backend running:

```bash
# Start server (keeps running until Codespace stops)
node server.js

# Or use PM2 for process management (optional)
npm install -g pm2
pm2 start server.js --name "youtube-backend"
pm2 save
```

## 🔧 Troubleshooting

### Backend Not Available
1. **Check Codespace Status**: Make sure your Codespace is running
2. **Check Port Visibility**: Ensure port 3001 is set to "Public"
3. **Check Server**: Run `node server.js` in Codespace terminal
4. **Check URL**: Verify the backend URL in `.env.production` is correct

### CORS Errors
The server is configured to allow requests from GitHub Pages. If you see CORS errors:
1. Check that your GitHub Pages domain is in the CORS whitelist
2. Ensure the backend URL includes `/api` at the end
3. Make sure port 3001 is public in your Codespace

### Download Issues
1. **Check yt-dlp**: Run `yt-dlp --version` in Codespace terminal
2. **Check Permissions**: Ensure downloads directory exists and is writable
3. **Check URL Format**: Use valid YouTube URLs

## 📊 Architecture Overview

```
GitHub Pages Frontend (Static)
         ↓ (API calls)
GitHub Codespace Backend (Dynamic)
         ↓ (yt-dlp)
YouTube Content Download
```

## 🎯 Quick Reference

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | https://baribahl.github.io/youtube-retro-downloader/ | User interface |
| Backend | https://YOUR_CODESPACE-3001.github.dev | API server |
| Test Endpoint | https://YOUR_CODESPACE-3001.github.dev/api/test | Connection test |

## 💡 Tips

1. **Bookmark Your Codespace**: Keep the Codespace URL handy
2. **Monitor Usage**: Check GitHub Codespace hours in your account settings
3. **Backup Important Data**: Codespaces are ephemeral - don't store important files there
4. **Environment Variables**: Always use `.env.production` for production configuration

---

**Next Steps**: Once you've completed this setup, your YouTube Retro Downloader will be fully functional with GitHub Pages frontend and Codespace backend! 🎉

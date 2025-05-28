# 🎮 Quick Reference: Codespace Setup

## 🚀 Step 1: Create Codespace
1. Go to: https://github.com/baribahl/youtube-retro-downloader
2. Click **"Code"** → **"Codespaces"** → **"Create codespace on master"**
3. Wait for initialization (2-3 minutes)

## ⚡ Step 2: Start Backend (in Codespace terminal)
```bash
npm run backend
```

## 🌐 Step 3: Get Codespace URL
1. In Codespace VS Code: **"PORTS"** tab (bottom)
2. Find port **3001** → Right-click → **"Port Visibility"** → **"Public"**
3. Copy the **"Forwarded Address"** URL

Example URL: `https://fuzzy-space-disco-abc123-3001.github.dev`

## ⚙️ Step 4: Configure Production (back in local terminal)

### Option A: PowerShell Script (Recommended)
```powershell
cd c:\Users\paula\Projects\2025\05-May\ytdl\youtube-retro-downloader
.\configure-production.ps1 "https://YOUR-CODESPACE-URL-HERE"
```

### Option B: Manual Edit
1. Edit `.env.production`
2. Replace: `VITE_BACKEND_URL=https://YOUR-CODESPACE-URL-HERE/api`

## 📤 Step 5: Deploy
```powershell
git add .env.production
git commit -m "Configure production backend URL"
git push origin master
```

## ✅ Step 6: Test
- Frontend: https://baribahl.github.io/youtube-retro-downloader/
- Should show: "Backend Available ✅"

---

**📍 Your Current Location**: You are here → **Step 1: Create Codespace**

**🎯 Next Action**: Go to GitHub and create your Codespace!

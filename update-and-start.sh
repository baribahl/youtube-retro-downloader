#!/bin/bash

# 🎮 YouTube Retro Downloader - Codespace Update & Start Script
echo "🎮 YouTube Retro Downloader - Updating and Starting..."
echo "===================================================="

# Pull latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin master

# Check if dependencies are up to date
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "📦 Updating Node.js dependencies..."
    npm install
fi

# Check if yt-dlp is installed and up to date
if ! command -v yt-dlp &> /dev/null; then
    echo "📦 Installing yt-dlp..."
    pip install yt-dlp
else
    echo "📦 Updating yt-dlp..."
    pip install --upgrade yt-dlp
fi

# Create downloads directory if it doesn't exist
if [ ! -d "downloads" ]; then
    echo "📁 Creating downloads directory..."
    mkdir downloads
fi

# Show versions
echo ""
echo "✅ Versions:"
echo "   - yt-dlp: $(yt-dlp --version)"
echo "   - Node.js: $(node --version)"
echo "   - npm: $(npm --version)"

echo ""
echo "🌐 Backend will be available at:"
echo "   https://orange-couscous-975r7w96xq9h7w7v-3001.app.github.dev"
echo ""
echo "📋 Important reminders:"
echo "   1. Make sure port 3001 is set to PUBLIC in VS Code PORTS tab"
echo "   2. Frontend is live at: https://baribahl.github.io/youtube-retro-downloader/"
echo "   3. Test endpoint: https://orange-couscous-975r7w96xq9h7w7v-3001.app.github.dev/api/test"
echo ""
echo "🚀 Starting backend server..."
echo "===================================================="

# Start the server
node server.js

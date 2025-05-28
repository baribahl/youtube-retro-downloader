#!/bin/bash

# 🎮 YouTube Retro Downloader - Codespace Startup Script
# This script sets up and starts the backend server in your Codespace

echo "🎮 YouTube Retro Downloader - Starting Backend Server..."
echo "=================================================="

# Check if yt-dlp is installed
if ! command -v yt-dlp &> /dev/null; then
    echo "📦 Installing yt-dlp..."
    pip install yt-dlp
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Create downloads directory if it doesn't exist
if [ ! -d "downloads" ]; then
    echo "📁 Creating downloads directory..."
    mkdir downloads
fi

# Check yt-dlp version
echo "✅ yt-dlp version: $(yt-dlp --version)"
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

echo ""
echo "🚀 Starting backend server on port 3001..."
echo "🌐 Make sure to set port 3001 to PUBLIC in VS Code PORTS tab"
echo "📋 Copy the forwarded URL and update .env.production in your repo"
echo ""
echo "Backend will be available at:"
echo "https://YOUR_CODESPACE_NAME-3001.github.dev/api"
echo ""
echo "Test endpoint:"
echo "https://YOUR_CODESPACE_NAME-3001.github.dev/api/test"
echo ""
echo "=================================================="

# Start the server
node server.js

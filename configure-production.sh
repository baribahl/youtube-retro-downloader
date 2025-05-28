#!/bin/bash

# 🎮 YouTube Retro Downloader - Production Configuration Script
# This script updates the production environment with your Codespace backend URL

echo "🎮 YouTube Retro Downloader - Production Configuration"
echo "=================================================="

# Check if URL parameter is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your Codespace URL"
    echo ""
    echo "Usage: ./configure-production.sh <CODESPACE_URL>"
    echo ""
    echo "Example:"
    echo "./configure-production.sh https://fuzzy-space-disco-abc123-3001.github.dev"
    echo ""
    echo "Note: Do NOT include '/api' at the end - it will be added automatically"
    exit 1
fi

CODESPACE_URL="$1"
BACKEND_URL="${CODESPACE_URL}/api"

echo "🌐 Codespace URL: $CODESPACE_URL"
echo "🔗 Backend URL: $BACKEND_URL"
echo ""

# Update .env.production
echo "📝 Updating .env.production..."
cat > .env.production << EOF
# Production environment variables for GitHub Pages deployment
# Updated on $(date)

# Backend API URL for your Codespace
VITE_BACKEND_URL=$BACKEND_URL

# Codespace Configuration:
# - Codespace URL: $CODESPACE_URL
# - Backend Port: 3001 (set to PUBLIC)
# - API Endpoint: $BACKEND_URL
EOF

echo "✅ .env.production updated!"
echo ""

# Test the backend URL
echo "🧪 Testing backend connection..."
if curl -s --connect-timeout 10 "$BACKEND_URL/test" > /dev/null; then
    echo "✅ Backend is reachable!"
else
    echo "⚠️  Backend test failed - make sure:"
    echo "   1. Your Codespace is running"
    echo "   2. Backend server is started (npm run backend)"
    echo "   3. Port 3001 is set to PUBLIC"
fi

echo ""
echo "🚀 Ready to deploy! Run these commands:"
echo "git add .env.production"
echo "git commit -m 'Configure production backend URL'"
echo "git push origin master"
echo ""
echo "📋 Monitor deployment at:"
echo "https://github.com/baribahl/youtube-retro-downloader/actions"
echo ""
echo "🌐 Test your app at:"
echo "https://baribahl.github.io/youtube-retro-downloader/"

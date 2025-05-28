#!/bin/bash

# 🧪 End-to-End Testing Script for YouTube Retro Downloader
# Run this in your Codespace to verify everything is working

echo "🎮 YouTube Retro Downloader - End-to-End Test"
echo "=============================================="

# Test 1: Check if backend server is running locally
echo ""
echo "🔍 Test 1: Local Backend Server Status"
echo "Checking: http://localhost:3001/api/test"
if curl -s http://localhost:3001/api/test > /dev/null; then
    echo "✅ Local backend is running"
    curl -s http://localhost:3001/api/test | jq '.'
else
    echo "❌ Local backend is NOT running"
    echo "💡 Run: node server.js"
fi

# Test 2: Check if port 3001 is accessible externally
echo ""
echo "🌐 Test 2: External Port Access"
CODESPACE_URL=$(gh codespace ports --json | jq -r '.[] | select(.port == 3001) | .browse_url')
if [ "$CODESPACE_URL" != "null" ] && [ "$CODESPACE_URL" != "" ]; then
    echo "✅ Port 3001 is forwarded"
    echo "🔗 External URL: $CODESPACE_URL"
    echo "📝 API endpoint: $CODESPACE_URL/api/test"
else
    echo "❌ Port 3001 is not properly forwarded"
    echo "💡 Check VS Code PORTS tab and set port 3001 to Public"
fi

# Test 3: Check GitHub Pages frontend
echo ""
echo "📄 Test 3: GitHub Pages Frontend"
echo "🔗 Frontend URL: https://baribahl.github.io/youtube-retro-downloader/"
if curl -s https://baribahl.github.io/youtube-retro-downloader/ > /dev/null; then
    echo "✅ GitHub Pages frontend is accessible"
else
    echo "❌ GitHub Pages frontend is not accessible"
fi

# Test 4: Test cross-origin connection
echo ""
echo "🔗 Test 4: Cross-Origin Connection Test"
echo "This test simulates the frontend connecting to the Codespace backend..."
if [ "$CODESPACE_URL" != "null" ] && [ "$CODESPACE_URL" != "" ]; then
    echo "Testing: $CODESPACE_URL/api/test"
    curl -s "$CODESPACE_URL/api/test" || echo "❌ Cross-origin connection failed"
else
    echo "❌ Cannot test - no Codespace URL available"
fi

echo ""
echo "🎯 Summary"
echo "=========="
echo "Frontend: https://baribahl.github.io/youtube-retro-downloader/"
echo "Backend:  $CODESPACE_URL"
echo ""
echo "💡 To fix issues:"
echo "1. Make sure backend is running: node server.js"
echo "2. Set port 3001 to Public in VS Code PORTS tab"
echo "3. Wait a few minutes for GitHub Pages to update"
echo ""
echo "🧪 Manual test: Open frontend and try downloading a YouTube video!"

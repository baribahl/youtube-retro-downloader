# 🎮 Configure Production Backend - PowerShell Script

param(
    [Parameter(Mandatory=$true)]
    [string]$CodespaceUrl
)

Write-Host "🎮 YouTube Retro Downloader - Production Configuration" -ForegroundColor Magenta
Write-Host "==================================================" -ForegroundColor Cyan

$BackendUrl = "$CodespaceUrl/api"

Write-Host "🌐 Codespace URL: $CodespaceUrl" -ForegroundColor Green
Write-Host "🔗 Backend URL: $BackendUrl" -ForegroundColor Green
Write-Host ""

# Update .env.production
Write-Host "📝 Updating .env.production..." -ForegroundColor Yellow

$envContent = @"
# Production environment variables for GitHub Pages deployment
# Updated on $(Get-Date)

# Backend API URL for your Codespace
VITE_BACKEND_URL=$BackendUrl

# Codespace Configuration:
# - Codespace URL: $CodespaceUrl
# - Backend Port: 3001 (set to PUBLIC)
# - API Endpoint: $BackendUrl
"@

$envContent | Out-File -FilePath ".env.production" -Encoding UTF8

Write-Host "✅ .env.production updated!" -ForegroundColor Green
Write-Host ""

# Test the backend URL
Write-Host "🧪 Testing backend connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/test" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Backend is reachable!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend test failed - make sure:" -ForegroundColor Red
    Write-Host "   1. Your Codespace is running" -ForegroundColor Yellow
    Write-Host "   2. Backend server is started (npm run backend)" -ForegroundColor Yellow
    Write-Host "   3. Port 3001 is set to PUBLIC" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Ready to deploy! Run these commands:" -ForegroundColor Cyan
Write-Host "git add .env.production" -ForegroundColor White
Write-Host "git commit -m 'Configure production backend URL'" -ForegroundColor White
Write-Host "git push origin master" -ForegroundColor White
Write-Host ""
Write-Host "📋 Monitor deployment at:" -ForegroundColor Cyan
Write-Host "https://github.com/baribahl/youtube-retro-downloader/actions" -ForegroundColor Blue
Write-Host ""
Write-Host "🌐 Test your app at:" -ForegroundColor Cyan
Write-Host "https://baribahl.github.io/youtube-retro-downloader/" -ForegroundColor Blue

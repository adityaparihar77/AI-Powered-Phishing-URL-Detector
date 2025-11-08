# Deployment Preparation Script for Render (PowerShell)
# This script helps prepare your project for Render deployment

Write-Host "🚀 AI-Powered Phishing URL Detector - Render Deployment Prep" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
Write-Host "📋 Checking Git repository..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "✓ Git repository found" -ForegroundColor Green
}
else {
    Write-Host "⚠ Git repository not found. Initializing..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

# Check if remote is set
Write-Host ""
Write-Host "📋 Checking Git remote..." -ForegroundColor Yellow
$remote = git remote -v | Select-String "origin" | Select-Object -First 1
if ($null -eq $remote) {
    Write-Host "⚠ No remote repository configured" -ForegroundColor Yellow
    Write-Host "Please add your GitHub repository:" -ForegroundColor White
    Write-Host "  git remote add origin https://github.com/yourusername/your-repo.git" -ForegroundColor White
}
else {
    Write-Host "✓ Remote configured: $remote" -ForegroundColor Green
}

# Check for important files
Write-Host ""
Write-Host "📋 Checking deployment files..." -ForegroundColor Yellow
$files = @("render.yaml", "DEPLOYMENT.md", "DEPLOYMENT_CHECKLIST.md", "MONGODB_SETUP.md", ".gitignore")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Red
    }
}

# Check backend files
Write-Host ""
Write-Host "📋 Checking backend configuration..." -ForegroundColor Yellow
if (Test-Path "backend/package.json") {
    Write-Host "✓ backend/package.json exists" -ForegroundColor Green
}
else {
    Write-Host "✗ backend/package.json missing" -ForegroundColor Red
}

if (Test-Path "backend/.env.example") {
    Write-Host "✓ backend/.env.example exists" -ForegroundColor Green
}
else {
    Write-Host "✗ backend/.env.example missing" -ForegroundColor Red
}

# Check ML service files
Write-Host ""
Write-Host "📋 Checking ML service configuration..." -ForegroundColor Yellow
if (Test-Path "ml_service/requirements.txt") {
    Write-Host "✓ ml_service/requirements.txt exists" -ForegroundColor Green
    
    # Check for gunicorn
    $content = Get-Content "ml_service/requirements.txt" -Raw
    if ($content -match "gunicorn") {
        Write-Host "✓ gunicorn found in requirements.txt" -ForegroundColor Green
    }
    else {
        Write-Host "✗ gunicorn missing from requirements.txt" -ForegroundColor Red
    }
}
else {
    Write-Host "✗ ml_service/requirements.txt missing" -ForegroundColor Red
}

# Check frontend files
Write-Host ""
Write-Host "📋 Checking frontend configuration..." -ForegroundColor Yellow
if (Test-Path "frontend/package.json") {
    Write-Host "✓ frontend/package.json exists" -ForegroundColor Green
}
else {
    Write-Host "✗ frontend/package.json missing" -ForegroundColor Red
}

if (Test-Path "frontend/.env.production") {
    Write-Host "✓ frontend/.env.production exists" -ForegroundColor Green
}
else {
    Write-Host "⚠ frontend/.env.production missing (will be created during deployment)" -ForegroundColor Yellow
}

# Check node_modules
Write-Host ""
Write-Host "📋 Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "backend/node_modules") {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "⚠ Backend dependencies not installed (will be installed on Render)" -ForegroundColor Yellow
}

if (Test-Path "frontend/node_modules") {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "⚠ Frontend dependencies not installed (will be installed on Render)" -ForegroundColor Yellow
}

if ((Test-Path "ml_service/venv") -or (Test-Path "ml_service/venv311")) {
    Write-Host "✓ Python virtual environment exists" -ForegroundColor Green
}
else {
    Write-Host "⚠ Python virtual environment not found (will be created on Render)" -ForegroundColor Yellow
}

# Git status
Write-Host ""
Write-Host "📋 Git status..." -ForegroundColor Yellow
$status = git status --porcelain
$untracked = ($status | Select-String "^\?\?").Count
$modified = ($status | Select-String "^ M").Count
$staged = ($status | Select-String "^M ").Count

if ($untracked -gt 0) {
    Write-Host "⚠ $untracked untracked file(s)" -ForegroundColor Yellow
}
if ($modified -gt 0) {
    Write-Host "⚠ $modified modified file(s)" -ForegroundColor Yellow
}
if ($staged -gt 0) {
    Write-Host "✓ $staged staged file(s)" -ForegroundColor Green
}

# Check if there are uncommitted changes
if ($status) {
    Write-Host ""
    Write-Host "⚠ You have uncommitted changes. Stage and commit them before deploying." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To commit changes:" -ForegroundColor White
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'Prepare for Render deployment'" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
}
else {
    Write-Host "✓ No uncommitted changes" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "📝 Pre-Deployment Checklist:" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before deploying to Render, ensure:" -ForegroundColor White
Write-Host ""
Write-Host "1. ✓ All code is committed and pushed to GitHub" -ForegroundColor White
Write-Host "2. ✓ MongoDB Atlas is configured:" -ForegroundColor White
Write-Host "   - Network Access: 0.0.0.0/0 whitelisted" -ForegroundColor Gray
Write-Host "   - User: adityaparihar450_db_user has proper permissions" -ForegroundColor Gray
Write-Host "   - Cluster is active and running" -ForegroundColor Gray
Write-Host ""
Write-Host "3. ✓ Environment variables are ready:" -ForegroundColor White
Write-Host "   - MONGODB_URI (MongoDB Atlas connection string)" -ForegroundColor Gray
Write-Host "   - JWT_SECRET (generate with: openssl rand -base64 32)" -ForegroundColor Gray
Write-Host "   - VIRUSTOTAL_API_KEY (optional)" -ForegroundColor Gray
Write-Host "   - PHISHTANK_API_KEY (optional)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. ✓ Review deployment documentation:" -ForegroundColor White
Write-Host "   - DEPLOYMENT_CHECKLIST.md - Quick reference" -ForegroundColor Gray
Write-Host "   - DEPLOYMENT.md - Complete guide" -ForegroundColor Gray
Write-Host "   - MONGODB_SETUP.md - Database configuration" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review MONGODB_SETUP.md and configure MongoDB Atlas" -ForegroundColor White
Write-Host "2. Follow DEPLOYMENT_CHECKLIST.md for step-by-step deployment" -ForegroundColor White
Write-Host "3. Deploy services in order: ML Service → Backend → Frontend" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready to deploy to Render!" -ForegroundColor Green
Write-Host ""

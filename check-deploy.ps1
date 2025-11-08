# Deployment Preparation Script for Render
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "  AI-Powered Phishing URL Detector - Deployment Prep" -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking Git repository..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "[OK] Git repository found" -ForegroundColor Green
} else {
    Write-Host "[WARN] Git repository not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Checking deployment files..." -ForegroundColor Yellow
$files = @("render.yaml", "DEPLOYMENT.md", "DEPLOYMENT_CHECKLIST.md", "MONGODB_SETUP.md", ".gitignore")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "[OK] $file" -ForegroundColor Green
    } else {
        Write-Host "[MISSING] $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Checking backend..." -ForegroundColor Yellow
if (Test-Path "backend/package.json") {
    Write-Host "[OK] backend/package.json" -ForegroundColor Green
} else {
    Write-Host "[MISSING] backend/package.json" -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking ML service..." -ForegroundColor Yellow
if (Test-Path "ml_service/requirements.txt") {
    Write-Host "[OK] ml_service/requirements.txt" -ForegroundColor Green
} else {
    Write-Host "[MISSING] ml_service/requirements.txt" -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking frontend..." -ForegroundColor Yellow
if (Test-Path "frontend/package.json") {
    Write-Host "[OK] frontend/package.json" -ForegroundColor Green
} else {
    Write-Host "[MISSING] frontend/package.json" -ForegroundColor Red
}

if (Test-Path "frontend/.env.production") {
    Write-Host "[OK] frontend/.env.production" -ForegroundColor Green
} else {
    Write-Host "[INFO] frontend/.env.production will be created" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "  Pre-Deployment Checklist" -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before deploying to Render, ensure:" -ForegroundColor White
Write-Host ""
Write-Host "1. MongoDB Atlas is configured (0.0.0.0/0 Network Access)" -ForegroundColor White
Write-Host "2. Code is committed and pushed to GitHub" -ForegroundColor White
Write-Host "3. API keys are ready (VirusTotal, PhishTank - optional)" -ForegroundColor White
Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Step: Follow DEPLOYMENT_CHECKLIST.md" -ForegroundColor Green
Write-Host ""

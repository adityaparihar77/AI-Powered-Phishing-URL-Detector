#!/bin/bash

# Deployment Preparation Script for Render
# This script helps prepare your project for Render deployment

echo "🚀 AI-Powered Phishing URL Detector - Render Deployment Prep"
echo "============================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is initialized
echo "📋 Checking Git repository..."
if [ -d .git ]; then
    echo -e "${GREEN}✓${NC} Git repository found"
else
    echo -e "${YELLOW}⚠${NC} Git repository not found. Initializing..."
    git init
    echo -e "${GREEN}✓${NC} Git repository initialized"
fi

# Check if remote is set
echo ""
echo "📋 Checking Git remote..."
REMOTE=$(git remote -v | grep origin | head -n 1)
if [ -z "$REMOTE" ]; then
    echo -e "${YELLOW}⚠${NC} No remote repository configured"
    echo "Please add your GitHub repository:"
    echo "  git remote add origin https://github.com/yourusername/your-repo.git"
else
    echo -e "${GREEN}✓${NC} Remote configured: ${REMOTE}"
fi

# Check for important files
echo ""
echo "📋 Checking deployment files..."
FILES=("render.yaml" "DEPLOYMENT.md" "DEPLOYMENT_CHECKLIST.md" "MONGODB_SETUP.md" ".gitignore")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
    fi
done

# Check backend files
echo ""
echo "📋 Checking backend configuration..."
if [ -f "backend/package.json" ]; then
    echo -e "${GREEN}✓${NC} backend/package.json exists"
else
    echo -e "${RED}✗${NC} backend/package.json missing"
fi

if [ -f "backend/.env.example" ]; then
    echo -e "${GREEN}✓${NC} backend/.env.example exists"
else
    echo -e "${RED}✗${NC} backend/.env.example missing"
fi

# Check ML service files
echo ""
echo "📋 Checking ML service configuration..."
if [ -f "ml_service/requirements.txt" ]; then
    echo -e "${GREEN}✓${NC} ml_service/requirements.txt exists"
    
    # Check for gunicorn
    if grep -q "gunicorn" ml_service/requirements.txt; then
        echo -e "${GREEN}✓${NC} gunicorn found in requirements.txt"
    else
        echo -e "${RED}✗${NC} gunicorn missing from requirements.txt"
    fi
else
    echo -e "${RED}✗${NC} ml_service/requirements.txt missing"
fi

# Check frontend files
echo ""
echo "📋 Checking frontend configuration..."
if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}✓${NC} frontend/package.json exists"
else
    echo -e "${RED}✗${NC} frontend/package.json missing"
fi

if [ -f "frontend/.env.production" ]; then
    echo -e "${GREEN}✓${NC} frontend/.env.production exists"
else
    echo -e "${YELLOW}⚠${NC} frontend/.env.production missing (will be created during deployment)"
fi

# Check node_modules
echo ""
echo "📋 Checking dependencies..."
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed (will be installed on Render)"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed (will be installed on Render)"
fi

if [ -d "ml_service/venv" ] || [ -d "ml_service/venv311" ]; then
    echo -e "${GREEN}✓${NC} Python virtual environment exists"
else
    echo -e "${YELLOW}⚠${NC} Python virtual environment not found (will be created on Render)"
fi

# Git status
echo ""
echo "📋 Git status..."
UNTRACKED=$(git status --porcelain | grep "^??" | wc -l)
MODIFIED=$(git status --porcelain | grep "^ M" | wc -l)
STAGED=$(git status --porcelain | grep "^M " | wc -l)

if [ $UNTRACKED -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} $UNTRACKED untracked file(s)"
fi
if [ $MODIFIED -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} $MODIFIED modified file(s)"
fi
if [ $STAGED -gt 0 ]; then
    echo -e "${GREEN}✓${NC} $STAGED staged file(s)"
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo ""
    echo -e "${YELLOW}⚠${NC} You have uncommitted changes. Stage and commit them before deploying."
    echo ""
    echo "To commit changes:"
    echo "  git add ."
    echo "  git commit -m \"Prepare for Render deployment\""
    echo "  git push origin main"
else
    echo -e "${GREEN}✓${NC} No uncommitted changes"
fi

# Summary
echo ""
echo "============================================================"
echo "📝 Pre-Deployment Checklist:"
echo "============================================================"
echo ""
echo "Before deploying to Render, ensure:"
echo ""
echo "1. ✓ All code is committed and pushed to GitHub"
echo "2. ✓ MongoDB Atlas is configured:"
echo "   - Network Access: 0.0.0.0/0 whitelisted"
echo "   - User: adityaparihar450_db_user has proper permissions"
echo "   - Cluster is active and running"
echo ""
echo "3. ✓ Environment variables are ready:"
echo "   - MONGODB_URI (MongoDB Atlas connection string)"
echo "   - JWT_SECRET (generate with: openssl rand -base64 32)"
echo "   - VIRUSTOTAL_API_KEY (optional)"
echo "   - PHISHTANK_API_KEY (optional)"
echo ""
echo "4. ✓ Review deployment documentation:"
echo "   - DEPLOYMENT_CHECKLIST.md - Quick reference"
echo "   - DEPLOYMENT.md - Complete guide"
echo "   - MONGODB_SETUP.md - Database configuration"
echo ""
echo "============================================================"
echo ""
echo "Next steps:"
echo "1. Review MONGODB_SETUP.md and configure MongoDB Atlas"
echo "2. Follow DEPLOYMENT_CHECKLIST.md for step-by-step deployment"
echo "3. Deploy services in order: ML Service → Backend → Frontend"
echo ""
echo "🚀 Ready to deploy to Render!"
echo ""

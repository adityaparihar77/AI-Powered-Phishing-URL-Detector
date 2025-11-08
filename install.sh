#!/bin/bash

echo "========================================"
echo "AI-Powered Phishing URL Detector"
echo "Quick Installation Script"
echo "========================================"
echo ""

# Check Node.js
echo "[1/5] Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
node --version
echo ""

# Check Python
echo "[2/5] Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python is not installed!"
    echo "Please install Python 3.11+ from https://www.python.org/"
    exit 1
fi
python3 --version
echo ""

# Check Docker
echo "[3/5] Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "WARNING: Docker is not installed!"
    echo "You'll need to install MongoDB manually or install Docker"
    echo ""
else
    docker --version
    echo ""
fi

# Setup Backend
echo "[4/5] Setting up Backend..."
cd backend
if [ ! -f ".env" ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
fi
echo "Installing backend dependencies..."
npm install
cd ..
echo "Backend setup complete!"
echo ""

# Setup Frontend
echo "[5/5] Setting up Frontend..."
cd frontend
echo "Installing frontend dependencies..."
npm install
cd ..
echo "Frontend setup complete!"
echo ""

# Setup ML Service
echo "Setting up ML Service..."
cd ml_service
if [ ! -f ".env" ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
fi
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi
echo "Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..
echo "ML Service setup complete!"
echo ""

echo "========================================"
echo "Installation Complete! ✓"
echo "========================================"
echo ""
echo "Next Steps:"
echo ""
echo "1. Start MongoDB:"
echo "   docker run -d -p 27017:27017 --name phish-mongo mongo:7"
echo ""
echo "2. Start Backend (new terminal):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Start ML Service (new terminal):"
echo "   cd ml_service"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "4. Start Frontend (new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "5. Open browser: http://localhost:3000"
echo ""
echo "OR use Docker Compose:"
echo "   docker-compose up -d"
echo ""
echo "For detailed instructions, see SETUP.md"
echo ""

@echo off
echo ========================================
echo AI-Powered Phishing URL Detector
echo Quick Installation Script
echo ========================================
echo.

REM Check Node.js
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo.

REM Check Python
echo [2/5] Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed!
    echo Please install Python 3.11+ from https://www.python.org/
    pause
    exit /b 1
)
python --version
echo.

REM Check MongoDB/Docker
echo [3/5] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Docker is not installed!
    echo You'll need to install MongoDB manually or install Docker
    echo.
) else (
    docker --version
    echo.
)

REM Setup Backend
echo [4/5] Setting up Backend...
cd backend
if not exist ".env" (
    echo Copying .env.example to .env...
    copy .env.example .env
)
echo Installing backend dependencies...
call npm install
cd ..
echo Backend setup complete!
echo.

REM Setup Frontend
echo [5/5] Setting up Frontend...
cd frontend
echo Installing frontend dependencies...
call npm install
cd ..
echo Frontend setup complete!
echo.

REM Setup ML Service
echo Setting up ML Service...
cd ml_service
if not exist ".env" (
    echo Copying .env.example to .env...
    copy .env.example .env
)
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)
echo Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
call venv\Scripts\deactivate.bat
cd ..
echo ML Service setup complete!
echo.

echo ========================================
echo Installation Complete! ✓
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Start MongoDB:
echo    docker run -d -p 27017:27017 --name phish-mongo mongo:7
echo.
echo 2. Start Backend (new terminal):
echo    cd backend
echo    npm run dev
echo.
echo 3. Start ML Service (new terminal):
echo    cd ml_service
echo    venv\Scripts\activate
echo    python app.py
echo.
echo 4. Start Frontend (new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 5. Open browser: http://localhost:3000
echo.
echo OR use Docker Compose:
echo    docker-compose up -d
echo.
echo For detailed instructions, see SETUP.md
echo.
pause

@echo off
echo 🎵 Starting MusicGen AI Service...
echo.
echo This will:
echo 1. Check Python installation
echo 2. Install dependencies if needed
echo 3. Start the MusicGen server on port 5000
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo ✅ Python found
python --version
echo.

REM Navigate to ai-service directory
cd ai-service

REM Check if requirements are installed
echo 📦 Checking dependencies...
python -c "import audiocraft" >nul 2>&1
if errorlevel 1 (
    echo Installing Python dependencies (this may take 5-10 minutes on first run)...
    pip install -r requirements.txt
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🚀 Starting MusicGen server...
echo Server will run on http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

python musicgen_server.py

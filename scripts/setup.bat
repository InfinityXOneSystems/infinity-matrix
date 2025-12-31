@echo off
REM Setup script for Windows

echo ========================================
echo Lead Generation Pipeline - Setup Script
echo ========================================
echo.

REM Check Python version
echo Checking Python version...
python --version
echo.

REM Create virtual environment
echo Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo Virtual environment created
) else (
    echo Virtual environment already exists
)
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip setuptools wheel

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create .env file
echo Setting up environment variables...
if not exist ".env" (
    copy .env.example .env
    echo Created .env file from template
    echo Please edit .env and add your API keys
) else (
    echo .env file already exists
)

REM Create directories
echo Creating directories...
if not exist "database" mkdir database
if not exist "logs" mkdir logs
if not exist "frontend\assets" mkdir frontend\assets

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your API keys
echo 2. Run: venv\Scripts\activate.bat
echo 3. Run: python -m backend.main
echo 4. Open frontend\index.html in your browser
echo.
pause

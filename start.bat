@echo off
echo ============================================
echo   Glatec HR Platform - Starting...
echo ============================================

cd /d "%~dp0"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python nicht gefunden. Bitte Python 3.10+ installieren.
    pause
    exit /b 1
)

REM Check if venv is valid
set VENV_OK=0
if exist "venv\Scripts\uvicorn.exe" set VENV_OK=1

if "%VENV_OK%"=="0" (
    echo Installing dependencies...
    if exist "venv" rmdir /s /q venv
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

REM Always run seed - skips existing data automatically
echo Checking database...
cd backend
python seed.py
cd ..

echo.
echo ============================================
echo   App laeuft auf: http://localhost:8000
echo   Zum Beenden: CTRL+C
echo ============================================
echo.

cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

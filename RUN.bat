@echo off
echo ===========================================
echo  Starting Task Manager Servers
echo ===========================================
echo.

echo [1] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend npm install failed
    pause
    exit /b 1
)

echo.
echo [2] Starting Backend Server...
echo    This window will show backend logs
start "BACKEND SERVER" cmd /k "cd /d %~dp0backend && node server.js"

timeout /t 3 /nobreak >nul

echo.
echo [3] Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend npm install failed
    pause
    exit /b 1
)

echo.
echo [4] Starting Frontend Server...
start "FRONTEND SERVER" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ===========================================
echo  SERVERS STARTING...
echo ===========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Wait 10-15 seconds, then visit:
echo http://localhost:3000
echo.
echo TWO terminal windows should be open showing server logs
echo.
echo ===========================================
pause

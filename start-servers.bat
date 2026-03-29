@echo off
echo ===========================================
echo  Task Manager - Starting Both Servers
echo ===========================================
echo.

:: Kill any existing node processes on ports 3000 and 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a 2>nul

echo [1/3] Killed any existing server processes...
timeout /t 1 /nobreak >nul

:: Create .env file for backend if it doesn't exist
if not exist "backend\.env" (
    echo Creating .env file for backend...
    (
        echo DB_TYPE=sqlite
        echo JWT_SECRET=dev_jwt_secret_key_2024
        echo JWT_EXPIRES_IN=24h
        echo PORT=5000
        echo NODE_ENV=development
        echo FRONTEND_URL=http://localhost:3000
    ) > "backend\.env"
)

echo [2/3] Environment configured...
timeout /t 1 /nobreak >nul

:: Start Backend Server
echo [3/3] Starting Backend Server on port 5000...
start "Backend Server - Port 5000" cmd /k "cd /d %~dp0backend && echo. && echo =================================== && echo  BACKEND SERVER && echo =================================== && npm start"

timeout /t 3 /nobreak >nul

:: Start Frontend Server
echo        Starting Frontend Server on port 3000...
start "Frontend Server - Port 3000" cmd /k "cd /d %~dp0frontend && echo. && echo =================================== && echo  FRONTEND SERVER && echo =================================== && npm start"

echo.
echo ===========================================
echo  Servers Starting...
echo ===========================================
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo  API Docs: http://localhost:5000/api-docs
echo.
echo  Wait 10-15 seconds for both servers to start
echo  Then open http://localhost:3000 in your browser
echo.
echo ===========================================

:: Wait for user before closing
pause

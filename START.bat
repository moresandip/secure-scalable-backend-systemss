@echo off
echo ===========================================
echo  Task Manager - Complete Setup ^& Start
echo ===========================================
echo.

:: Kill any existing node processes
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a 2>nul
taskkill /F /IM node.exe 2>nul

echo [1/4] Cleaned up existing processes...
timeout /t 2 /nobreak >nul

:: Install backend dependencies
echo [2/4] Installing Backend Dependencies...
cd backend
call npm install
cd ..

:: Install frontend dependencies  
echo [3/4] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

:: Start Backend
echo [4/4] Starting Backend Server...
start "BACKEND - Port 5000" cmd /k "cd backend && echo =================================== && echo  BACKEND SERVER && echo =================================== && node app.js && pause"

timeout /t 3 /nobreak >nul

:: Start Frontend
echo        Starting Frontend Server...
start "FRONTEND - Port 3000" cmd /k "cd frontend && echo =================================== && echo  FRONTEND SERVER && echo =================================== && npm start"

echo.
echo ===========================================
echo  Setup Complete! Servers Starting...
echo ===========================================
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo.
echo  Wait 15-20 seconds for both servers
echo  Then open http://localhost:3000
echo.
echo  PRESS ANY KEY TO CLOSE THIS WINDOW
echo  (Servers will keep running)
echo ===========================================
pause >nul

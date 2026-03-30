@echo off
echo ==========================================
echo  Fixing package-lock.json sync issue
echo ==========================================
echo.
echo Step 1: Navigate to frontend folder
cd /d "c:\Users\mores\OneDrive\Desktop\secure, scalable backend systems\secure-scalable-backend-systemss\frontend"

echo Step 2: Delete old package-lock.json
del /f package-lock.json 2>nul
echo    Done.

echo Step 3: Regenerate with npm install
call npm install
echo    Done.

echo.
echo Step 4: Commit changes
cd /d "c:\Users\mores\OneDrive\Desktop\secure, scalable backend systems\secure-scalable-backend-systemss"
git add frontend/package-lock.json
git commit -m "fix: regenerate package-lock.json to sync with package.json"
git push origin main

echo.
echo ==========================================
echo  Fix complete! Check Netlify build now.
echo ==========================================
pause

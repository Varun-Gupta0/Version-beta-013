@echo off
echo ==============================
echo 🔧 Node.js Project Cleanup Tool
echo ==============================
echo.

REM 1. Stop any running Node.js processes
echo 🛑 Stopping running Node.js processes...
taskkill /f /im node.exe >nul 2>&1

REM 2. Remove node_modules and package-lock.json safely
echo 🧹 Cleaning up node_modules and package-lock.json...

if exist node_modules (
    echo Deleting node_modules folder...
    rmdir /s /q node_modules
) else (
    echo node_modules folder not found.
)

if exist package-lock.json (
    echo Deleting package-lock.json file...
    del /f /q package-lock.json
) else (
    echo package-lock.json not found.
)

REM 3. Clear npm cache (optional but recommended)
echo 🗑 Clearing npm cache...
npm cache clean --force

REM 4. Reinstall dependencies
echo 📦 Reinstalling dependencies...
npm install

echo.
echo ✅ Cleanup complete! You can now run: npm run dev
pause

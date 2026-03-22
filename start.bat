@echo off
title HORA Launcher

:: Detect if running from inside a ZIP (Windows extracts to Temp)
echo %~dp0 | findstr /i "\\Temp\\" >nul
if %errorlevel% equ 0 (
    echo %~dp0 | findstr /i ".zip" >nul
    if %errorlevel% equ 0 (
        echo.
        echo  ╔══════════════════════════════════════════════════╗
        echo  ║               ACTION REQUIRED                    ║
        echo  ╚══════════════════════════════════════════════════╝
        echo.
        echo  You opened this file directly from inside the ZIP.
        echo.
        echo  Please do this instead:
        echo.
        echo    1. Close this window
        echo    2. Right-click the ZIP file
        echo    3. Click "Extract All..."
        echo    4. Choose a folder ^(e.g. Desktop^) and click Extract
        echo    5. Open the extracted folder
        echo    6. Double-click start.bat inside that folder
        echo.
        pause
        exit /b 1
    )
)

echo.
echo  Starting HORA...
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Python is not installed on this computer.
    echo.
    echo  Please download and install Python from:
    echo  https://www.python.org/downloads/
    echo.
    echo  Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

:: Run the launcher
python "%~dp0start.py"
pause

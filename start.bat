@echo off
title HORA Launcher
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

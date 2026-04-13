@echo off
title Inventory Hub - Cloudflare Tunnel (Bun)
color 0A

echo ========================================
echo   Inventory Hub - Development Tunnel
echo   Using Bun Runtime
echo ========================================
echo.

REM Check if cloudflared exists
where cloudflared >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] cloudflared tidak ditemukan!
    echo.
    echo Silakan download dari:
    echo https://github.com/cloudflare/cloudflared/releases
    echo.
    echo Atau jalankan command ini di PowerShell:
    echo Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting Development Server with Bun...
echo.
start "Dev Server (Bun)" cmd /k "bun run dev"

echo [2/3] Waiting for server to be ready...
timeout /t 8 /nobreak >nul

echo [3/3] Starting Cloudflare Tunnel...
echo.
echo ========================================
echo   Tunnel akan membuat URL publik
echo   Share URL tersebut ke teman Anda!
echo ========================================
echo.

cloudflared tunnel --url http://localhost:5173

pause

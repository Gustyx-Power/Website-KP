# Inventory Hub - Cloudflare Tunnel Starter
# PowerShell Script for Windows

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Inventory Hub - Development Tunnel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if cloudflared is installed
$cloudflaredExists = Get-Command cloudflared -ErrorAction SilentlyContinue

if (-not $cloudflaredExists) {
    Write-Host "[ERROR] cloudflared tidak ditemukan!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Downloading cloudflared..." -ForegroundColor Yellow
    
    try {
        $downloadUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
        $outputPath = "$PSScriptRoot\cloudflared.exe"
        
        Invoke-WebRequest -Uri $downloadUrl -OutFile $outputPath
        Write-Host "✓ cloudflared berhasil didownload!" -ForegroundColor Green
        Write-Host ""
        
        # Add to current session PATH
        $env:Path += ";$PSScriptRoot"
    }
    catch {
        Write-Host "✗ Gagal download cloudflared" -ForegroundColor Red
        Write-Host "Silakan download manual dari:" -ForegroundColor Yellow
        Write-Host "https://github.com/cloudflare/cloudflared/releases" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Check if port 5173 is already in use
$portInUse = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "[INFO] Port 5173 sudah digunakan. Melewati start dev server..." -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "[1/3] Starting Development Server..." -ForegroundColor Green
    Write-Host ""
    
    # Start dev server in new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
    
    Write-Host "[2/3] Waiting for server to be ready..." -ForegroundColor Green
    Start-Sleep -Seconds 8
}

Write-Host "[3/3] Starting Cloudflare Tunnel..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tunnel akan membuat URL publik" -ForegroundColor Cyan
Write-Host "  Share URL tersebut ke teman Anda!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tekan Ctrl+C untuk stop tunnel" -ForegroundColor Yellow
Write-Host ""

# Start cloudflare tunnel
if (Test-Path "$PSScriptRoot\cloudflared.exe") {
    & "$PSScriptRoot\cloudflared.exe" tunnel --url http://localhost:5173
} else {
    cloudflared tunnel --url http://localhost:5173
}

Read-Host "Press Enter to exit"

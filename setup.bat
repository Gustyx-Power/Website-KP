@echo off
echo ========================================
echo Setup Project Website KP
echo ========================================
echo.

REM Cek apakah Bun sudah terinstall
echo [1/6] Mengecek Bun...
where bun >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Bun belum terinstall!
    echo Silakan install Bun terlebih dahulu dari: https://bun.sh
    echo Atau jalankan: powershell -c "irm bun.sh/install.ps1 | iex"
    pause
    exit /b 1
)
echo [OK] Bun sudah terinstall
echo.

REM Install dependencies
echo [2/6] Menginstall dependencies...
call bun install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Gagal menginstall dependencies!
    pause
    exit /b 1
)
echo [OK] Dependencies berhasil diinstall
echo.

REM Copy .env file jika belum ada
echo [3/6] Mengecek file .env...
if not exist .env (
    echo Membuat file .env dari .env-example...
    copy .env-example .env
    echo.
    echo [PENTING] Silakan edit file .env dan isi DATABASE_URL dengan connection string PostgreSQL Anda!
    echo Contoh: DATABASE_URL="postgresql://user:password@localhost:5432/database_name"
    echo.
    pause
) else (
    echo [OK] File .env sudah ada
)
echo.

REM Generate Prisma Client
echo [4/6] Generate Prisma Client...
call bunx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Gagal generate Prisma Client!
    pause
    exit /b 1
)
echo [OK] Prisma Client berhasil di-generate
echo.

REM Jalankan migrasi database
echo [5/6] Menjalankan migrasi database...
echo Pastikan PostgreSQL sudah berjalan dan DATABASE_URL sudah benar!
echo.
choice /C YN /M "Lanjutkan migrasi database"
if errorlevel 2 goto skip_migration
if errorlevel 1 goto run_migration

:run_migration
call bun run db:migrate
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Migrasi database gagal. Pastikan DATABASE_URL sudah benar di file .env
    echo.
) else (
    echo [OK] Migrasi database berhasil
    echo.
    
    REM Seed database
    echo [6/6] Seed database dengan data awal...
    choice /C YN /M "Jalankan seed database"
    if errorlevel 2 goto skip_seed
    if errorlevel 1 goto run_seed
    
    :run_seed
    call bun run db:seed
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] Seed database gagal
    ) else (
        echo [OK] Seed database berhasil
    )
)
goto finish

:skip_migration
echo [SKIP] Migrasi database dilewati
echo.

:skip_seed
echo [SKIP] Seed database dilewati
echo.

:finish
echo.
echo ========================================
echo Setup Selesai!
echo ========================================
echo.
echo Langkah selanjutnya:
echo 1. Pastikan file .env sudah diisi dengan DATABASE_URL yang benar
echo 2. Jalankan: bun run dev (untuk development)
echo 3. Atau jalankan: bun run server (untuk production server)
echo.
echo Akses aplikasi di: http://localhost:5173 (dev) atau http://localhost:3000 (server)
echo.
pause

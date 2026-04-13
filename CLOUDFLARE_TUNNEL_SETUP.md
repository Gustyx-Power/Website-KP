# Setup Cloudflare Tunnel di Windows

## Cara 1: Quick Tunnel (Paling Mudah - Tidak Perlu Login)

### Langkah-langkah:

1. **Download cloudflared untuk Windows**
   - Buka: https://github.com/cloudflare/cloudflared/releases
   - Download file: `cloudflared-windows-amd64.exe`
   - Atau gunakan command ini di PowerShell:
   ```powershell
   Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"
   ```

2. **Jalankan Development Server Anda**
   ```bash
   npm run dev
   # Atau
   bun run dev
   ```
   Pastikan server berjalan di port tertentu (misal: http://localhost:5173)

3. **Buka Terminal Baru dan Jalankan Cloudflare Tunnel**
   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```

4. **Anda akan mendapat URL publik seperti:**
   ```
   https://random-name-123.trycloudflare.com
   ```

5. **Share URL tersebut ke teman Anda!**
   - URL ini bisa diakses dari mana saja
   - Gratis dan tidak perlu akun Cloudflare
   - Selama terminal tidak ditutup, tunnel akan tetap aktif

### Kelebihan Quick Tunnel:
- ✅ Gratis selamanya
- ✅ Tidak perlu login/akun
- ✅ Setup cepat (1 command)
- ✅ HTTPS otomatis
- ✅ Tidak perlu konfigurasi router/firewall

### Kekurangan:
- ⚠️ URL random setiap kali restart
- ⚠️ Tunnel mati jika terminal ditutup

---

## Cara 2: Named Tunnel (URL Tetap - Perlu Akun Cloudflare)

Jika Anda ingin URL yang tetap (tidak berubah-ubah), gunakan cara ini:

### Langkah-langkah:

1. **Login ke Cloudflare**
   ```bash
   cloudflared tunnel login
   ```
   Browser akan terbuka, pilih domain Anda (atau buat akun gratis)

2. **Buat Tunnel dengan Nama**
   ```bash
   cloudflared tunnel create inventory-hub
   ```

3. **Buat File Konfigurasi**
   Buat file `config.yml` di folder yang sama dengan `cloudflared.exe`:
   ```yaml
   tunnel: inventory-hub
   credentials-file: C:\Users\YourUsername\.cloudflared\<tunnel-id>.json

   ingress:
     - hostname: inventory-hub.yourdomain.com
       service: http://localhost:5173
     - service: http_status:404
   ```

4. **Route DNS**
   ```bash
   cloudflared tunnel route dns inventory-hub inventory-hub.yourdomain.com
   ```

5. **Jalankan Tunnel**
   ```bash
   cloudflared tunnel run inventory-hub
   ```

### Kelebihan Named Tunnel:
- ✅ URL tetap (custom subdomain)
- ✅ Bisa setup multiple services
- ✅ Lebih professional

### Kekurangan:
- ⚠️ Perlu akun Cloudflare
- ⚠️ Perlu domain (bisa pakai domain gratis dari Cloudflare)

---

## Cara 3: Alternatif Lain (Jika Cloudflare Tidak Cocok)

### A. Ngrok (Populer, Mudah)
```bash
# Download dari: https://ngrok.com/download
ngrok http 5173
```
- Gratis dengan batasan
- URL random (gratis) atau custom (berbayar)

### B. LocalTunnel
```bash
npm install -g localtunnel
lt --port 5173
```
- Gratis
- Open source
- Kadang tidak stabil

### C. Serveo (Paling Simpel)
```bash
ssh -R 80:localhost:5173 serveo.net
```
- Tidak perlu install apapun
- Gratis
- Kadang down

---

## Rekomendasi untuk Anda:

**Untuk Development/Testing dengan Teman:**
→ Gunakan **Cloudflare Quick Tunnel** (Cara 1)
- Paling mudah
- Gratis
- Aman
- Tidak perlu setup ribet

**Untuk Demo ke Client/Production Preview:**
→ Gunakan **Named Tunnel** (Cara 2)
- URL tetap dan professional
- Bisa custom domain

---

## Script Helper untuk Windows

Saya buatkan script batch untuk memudahkan:

### File: `start-tunnel.bat`
```batch
@echo off
echo Starting Development Server...
start cmd /k "npm run dev"

timeout /t 5

echo Starting Cloudflare Tunnel...
cloudflared tunnel --url http://localhost:5173

pause
```

Cara pakai:
1. Simpan script di atas sebagai `start-tunnel.bat`
2. Double-click file tersebut
3. Tunnel akan otomatis start setelah dev server ready

---

## Troubleshooting

### Error: "cloudflared: command not found"
- Pastikan `cloudflared.exe` ada di folder yang sama dengan terminal Anda
- Atau tambahkan ke PATH Windows

### Error: "Connection refused"
- Pastikan dev server sudah running di port yang benar
- Cek dengan buka http://localhost:5173 di browser

### Tunnel Lambat
- Cloudflare tunnel gratis kadang agak lambat
- Untuk performa lebih baik, gunakan named tunnel atau ngrok premium

### Database Connection Error
- Pastikan database PostgreSQL juga running
- Tunnel hanya expose web server, bukan database

---

## Keamanan

⚠️ **PENTING:**
- Jangan share tunnel URL ke publik jika ada data sensitif
- Gunakan hanya untuk testing/demo
- Untuk production, gunakan proper hosting
- Pastikan `.env` tidak ter-commit ke git

---

## Tips

1. **Gunakan 2 Terminal:**
   - Terminal 1: `npm run dev`
   - Terminal 2: `cloudflared tunnel --url http://localhost:5173`

2. **Bookmark URL:**
   - Quick tunnel URL berubah setiap restart
   - Kirim URL baru ke teman setiap kali restart

3. **Testing Multi-Device:**
   - Buka URL tunnel di HP Anda
   - Test responsive design
   - Test di browser berbeda
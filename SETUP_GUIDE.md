# Panduan Setup Project di Laptop Windows Lain

## File yang Perlu Di-Copy

Untuk setup di laptop Windows lain, copy folder/file berikut:

### ✅ WAJIB DI-COPY:
```
├── src/                    (semua source code)
├── prisma/                 (schema & migrations)
├── static/                 (file statis)
├── .env-example           (template environment)
├── .gitignore
├── .npmrc
├── .prettierignore
├── .prettierrc
├── bun.lock               (lock file dependencies)
├── eslint.config.js
├── package.json           (dependencies & scripts)
├── postcss.config.js
├── prisma.config.ts
├── README.md
├── server.ts
├── setup.bat              (file setup otomatis)
├── svelte.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### ❌ JANGAN DI-COPY:
```
├── .env                   (berisi kredensial, buat baru di laptop lain)
├── .git/                  (jika tidak perlu git history)
├── .svelte-kit/           (generated files, akan dibuat otomatis)
├── node_modules/          (akan diinstall otomatis)
```

## Cara Setup Otomatis

### Prasyarat:
1. **Bun** harus sudah terinstall
   - Download dari: https://bun.sh
   - Atau install via PowerShell: `powershell -c "irm bun.sh/install.ps1 | iex"`

2. **PostgreSQL** harus sudah terinstall dan berjalan
   - Download dari: https://www.postgresql.org/download/windows/

### Langkah Setup:

1. **Copy semua file project** ke laptop Windows lain

2. **Jalankan setup.bat**
   ```cmd
   setup.bat
   ```

3. **Edit file .env** yang sudah dibuat otomatis:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/nama_database"
   ```
   
   Ganti:
   - `username` = username PostgreSQL Anda
   - `password` = password PostgreSQL Anda
   - `nama_database` = nama database yang ingin digunakan

4. **Jalankan ulang setup.bat** jika tadi skip migrasi database

5. **Jalankan aplikasi:**
   - Development: `bun run dev`
   - Production: `bun run server`

## Apa yang Dilakukan setup.bat?

1. ✅ Cek apakah Bun sudah terinstall
2. ✅ Install semua dependencies dari package.json
3. ✅ Copy .env-example menjadi .env (jika belum ada)
4. ✅ Generate Prisma Client
5. ✅ Jalankan migrasi database (opsional)
6. ✅ Seed database dengan data awal (opsional)

## Troubleshooting

### Error: "Bun belum terinstall"
- Install Bun dari https://bun.sh

### Error: "Migrasi database gagal"
- Pastikan PostgreSQL sudah berjalan
- Cek DATABASE_URL di file .env sudah benar
- Pastikan database sudah dibuat di PostgreSQL

### Error: "Module not found"
- Jalankan ulang: `bun install`

### Port sudah digunakan
- Development (5173): Edit vite.config.ts
- Production (3000): Edit server.ts

## Perintah Berguna

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Production server
bun run server

# Database migration
bun run db:migrate

# Database seed
bun run db:seed

# Format code
bun run format

# Lint code
bun run lint

# Type check
bun run check
```

## Struktur Database

Project ini menggunakan PostgreSQL dengan Prisma ORM. Schema mencakup:

- **User & Session** (Autentikasi)
- **Toko** (Gudang Pusat & Cabang)
- **Kategori** (Kategori produk)
- **Stok** (Inventori per toko)
- **Distribusi** (Transfer barang antar toko)
- **Penjualan** (Transaksi penjualan)
- **Retur** (Pengembalian barang)

## Role User

- **OWNER**: Akses penuh ke semua fitur
- **ADMIN**: Manajemen distribusi & laporan
- **KASIR**: Input penjualan & retur (terbatas per toko)

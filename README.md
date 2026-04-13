# Inventory Hub - Warehouse Management System

Sistem manajemen gudang dan distribusi untuk mengelola stok, penjualan, dan distribusi antar cabang toko.

## Tech Stack

- **Frontend:** SvelteKit + TypeScript
- **Styling:** TailwindCSS + Aeon Interface Design System
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Session-based with Argon2 password hashing
- **Runtime:** Node.js / Bun

## Features

- 🏢 Multi-role system (Owner, Admin, Kasir)
- 📦 Inventory management (Inbound stock, Stock tracking)
- 🚚 Distribution management (Warehouse to branches)
- 💰 Sales tracking and reporting
- 🔄 Return management
- 📊 Real-time dashboard with metrics
- 🎨 Modern UI with Aeon Interface design system

## Getting Started

### Prerequisites

- **Bun** (recommended) or Node.js 18+
- **PostgreSQL** (via Laragon) OR **SQLite** (no server needed!)
- Git

### Installation

1. Clone the repository
```sh
git clone <repository-url>
cd inventory-hub
```

2. Install dependencies
```sh
bun install
```

3. Setup environment variables
```sh
cp .env-example .env
```

**Option A: PostgreSQL (via Laragon)**
```env
DATABASE_URL="postgresql://root:@localhost:5432/inventory_hub"
```

**Option B: SQLite (No Laragon needed!)**
```env
DATABASE_URL="file:./dev.db"
```

4. Setup database

**For PostgreSQL:**
```sh
# Start Laragon PostgreSQL first!
bunx prisma migrate dev
bunx prisma db seed
```

**For SQLite:**
```sh
# No Laragon needed!
bunx prisma migrate dev
bunx prisma db seed
```

5. Start development server
```sh
bun run dev
```

Visit `http://localhost:5173`

### Migrate from PostgreSQL to SQLite

Want to ditch Laragon and use SQLite instead?

```sh
# Run migration script
migrate-to-sqlite.bat

# After migration, you don't need Laragon anymore!
bun run dev
```

See [MIGRASI_BUN_LARAGON.md](./MIGRASI_BUN_LARAGON.md) for details.

### Default Login Credentials

After seeding, you can login with:

- **Owner:** owner@example.com / password123
- **Admin:** admin@example.com / password123
- **Kasir:** kasir@example.com / password123

## Development

### Running the dev server

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Database commands

```sh
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio (Database GUI)
npx prisma studio

# Seed database
npx prisma db seed
```

## Share Preview with Cloudflare Tunnel

Ingin share preview aplikasi ke teman tanpa deploy? Gunakan Cloudflare Tunnel!

### Quick Start (Paling Mudah)

1. **Download cloudflared** (sekali saja)
```powershell
# PowerShell
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"
```

2. **Jalankan dengan script otomatis**
```sh
# Double-click salah satu file ini:
start-tunnel.bat          # Untuk npm
start-tunnel-bun.bat      # Untuk bun

# Atau dengan PowerShell:
.\Start-Tunnel.ps1
```

3. **Share URL yang muncul!**
```
Your quick Tunnel has been created! Visit it at:
https://random-name-123.trycloudflare.com
```

### Manual Start

```sh
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start tunnel
cloudflared tunnel --url http://localhost:5173
```

**Kelebihan:**
- ✅ Gratis selamanya
- ✅ HTTPS otomatis
- ✅ Tidak perlu konfigurasi router/firewall
- ✅ Bisa diakses dari mana saja
- ✅ Perfect untuk demo/testing

**Catatan:**
- URL berubah setiap restart (untuk URL tetap, lihat `CLOUDFLARE_TUNNEL_SETUP.md`)
- Tunnel mati jika terminal ditutup
- Hanya untuk development/testing, bukan production

Dokumentasi lengkap: [CLOUDFLARE_TUNNEL_SETUP.md](./CLOUDFLARE_TUNNEL_SETUP.md)

## Testing Multi-Role

Karena browser berbagi cookie untuk domain yang sama, Anda tidak bisa login sebagai user berbeda di tab yang berbeda. Gunakan salah satu cara ini:

1. **Browser Berbeda** (Recommended)
   - Chrome untuk Admin
   - Firefox untuk Owner
   - Edge untuk Kasir

2. **Incognito/Private Windows**
   - Window normal untuk Admin
   - Incognito window untuk Owner
   - Private window lain untuk Kasir

3. **Browser Profiles** (Chrome/Edge)
   - Buat profile terpisah untuk setiap role

## Building for Production

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with:

```sh
npm run preview
```

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Project Structure

```
inventory-hub/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Database seeder
│   └── migrations/        # Database migrations
├── src/
│   ├── lib/
│   │   ├── server/        # Server-side code
│   │   │   ├── auth.ts    # Authentication logic
│   │   │   └── prisma.ts  # Prisma client
│   │   └── schemas/       # Validation schemas
│   ├── routes/
│   │   ├── admin/         # Admin pages
│   │   ├── kasir/         # Kasir pages
│   │   ├── owner/         # Owner pages
│   │   └── +layout.svelte # Root layout
│   ├── app.css            # Global styles
│   └── hooks.server.ts    # Server hooks (auth, RBAC)
├── static/                # Static assets
├── DESIGN.md              # Aeon Interface design system
└── README.md              # This file
```

## Design System

This project uses the **Aeon Interface** design system. Key principles:

- **No-Line Rule:** No borders, use background color shifts
- **Tonal Elevation:** Layered surfaces instead of shadows
- **Color Palette:** Teal primary (#306677), refined greys
- **Typography:** Manrope for headings, Inter for body
- **Glassmorphism:** Backdrop blur for floating elements

See [DESIGN.md](./DESIGN.md) for complete design guidelines.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

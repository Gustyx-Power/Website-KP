import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from '@node-rs/argon2';
import pg from 'pg';

// Use the same PrismaPg adapter pattern as the main SvelteKit app
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PORT = 5000;
const MASTER_KEY = 'IMDSystemCore123';

// ------------------------------------------------------------------
// In-memory Global State for Maintenance Mode
// ------------------------------------------------------------------
let isMaintenanceMode = false;

// ------------------------------------------------------------------
// HELPER: Auth check
// ------------------------------------------------------------------
function isMasterAuthorized(req: Request): boolean {
	return req.headers.get('x-master-key') === MASTER_KEY;
}

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
	});
}

// ------------------------------------------------------------------
// SERVER PANEL WEB UI (Root)
// ------------------------------------------------------------------
const PANEL_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>IMDClothes Server Panel</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0a0f1e; color: #e2e8f0; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 40px 16px; }
  .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.03em; margin-bottom: 4px; }
  .logo span { color: #818cf8; }
  .subtitle { font-size: 0.72rem; color: #64748b; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 40px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; max-width: 860px; }
  @media(max-width: 640px){ .grid { grid-template-columns: 1fr; } }
  .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 28px; }
  .card h2 { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #475569; margin-bottom: 20px; }
  .status-row { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .dot.green { background: #22c55e; box-shadow: 0 0 8px #22c55e; }
  .dot.red { background: #ef4444; box-shadow: 0 0 8px #ef4444; animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  .status-text { font-size: 1rem; font-weight: 700; }
  label { font-size: 0.68rem; color: #475569; display: block; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.08em; }
  input, select { width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px 14px; color: #e2e8f0; font-size: 0.875rem; margin-bottom: 12px; outline: none; transition: border .15s; }
  input:focus, select:focus { border-color: #6366f1; }
  button { width: 100%; padding: 11px 16px; border-radius: 10px; border: none; font-weight: 700; font-size: 0.875rem; cursor: pointer; transition: all .2s; }
  .btn-danger { background: #ef4444; color: white; }
  .btn-primary { background: #6366f1; color: white; }
  .btn-success { background: #22c55e; color: #0f172a; }
  button:hover { opacity:.85; transform: translateY(-1px); }
  .alert { padding: 12px 16px; border-radius: 8px; font-size: .8rem; font-weight: 600; margin-top: 12px; display: none; }
  .alert.ok { background: #052e16; color: #4ade80; border: 1px solid #166534; }
  .alert.err { background: #1c0e0e; color: #f87171; border: 1px solid #7f1d1d; }
  hr { border: none; border-top: 1px solid #1e293b; margin: 14px 0; }
</style>
</head>
<body>
<div class="logo">IMD<span>Clothes</span></div>
<div class="subtitle">🔥 God Mode &mdash; Server Control Panel &nbsp;|&nbsp; Port ${PORT}</div>

<div class="grid">
  <!-- MAINTENANCE CARD -->
  <div class="card">
    <h2>⚡ Maintenance Control</h2>
    <div class="status-row">
      <div class="dot" id="dot"></div>
      <div class="status-text" id="status-text">Memuat...</div>
    </div>
    <label>Master Key</label>
    <input type="password" id="mkey" placeholder="Masukkan master key..." />
    <button id="toggle-btn" class="btn-danger" onclick="toggleMaintenance()">Toggle Maintenance</button>
    <div class="alert" id="maint-alert"></div>
  </div>

  <!-- REGISTER CARD -->
  <div class="card">
    <h2>👑 Daftarkan Eksekutif</h2>
    <label>Master Key</label>
    <input type="password" id="rkey" placeholder="Masukkan master key..." />
    <hr/>
    <label>Nama Lengkap</label>
    <input type="text" id="r-name" placeholder="Budi Santoso" />
    <label>Email</label>
    <input type="email" id="r-email" placeholder="budi@cvimdi.com" />
    <label>Password</label>
    <input type="password" id="r-pw" placeholder="Min. 8 karakter" />
    <label>Role</label>
    <select id="r-role">
      <option value="OWNER">OWNER (Eksekutif / Pemilik)</option>
      <option value="ADMIN">ADMIN (Kepala Pusat)</option>
    </select>
    <button class="btn-primary" onclick="registerExec()">Daftarkan Akun Sekarang</button>
    <div class="alert" id="reg-alert"></div>
  </div>
</div>

<script>
async function loadStatus() {
  try {
    const d = await (await fetch('/api/maintenance/status')).json();
    updateUI(d.isMaintenance);
  } catch(e) { document.getElementById('status-text').textContent = 'Gagal membaca status'; }
}

function updateUI(on) {
  document.getElementById('dot').className = 'dot ' + (on ? 'red' : 'green');
  document.getElementById('status-text').textContent = on ? 'MAINTENANCE MODE — Aktif 🔴' : 'SISTEM ONLINE — Normal 🟢';
  const btn = document.getElementById('toggle-btn');
  btn.className = on ? 'btn-success' : 'btn-danger';
  btn.textContent = on ? 'Matikan Maintenance Mode' : 'Aktifkan Maintenance Mode';
}

async function toggleMaintenance() {
  const el = document.getElementById('maint-alert');
  try {
    const r = await fetch('/api/maintenance/toggle', { method:'POST', headers:{'x-master-key': document.getElementById('mkey').value} });
    const d = await r.json();
    if (!r.ok) return show(el, 'err', d.error || 'Akses ditolak');
    updateUI(d.isMaintenance);
    show(el, 'ok', d.message);
  } catch(e) { show(el, 'err', 'Error: ' + e.message); }
}

async function registerExec() {
  const el = document.getElementById('reg-alert');
  const body = { name: document.getElementById('r-name').value, email: document.getElementById('r-email').value, password: document.getElementById('r-pw').value, role: document.getElementById('r-role').value };
  try {
    const r = await fetch('/api/auth/register-executive', { method:'POST', headers:{'x-master-key': document.getElementById('rkey').value, 'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const d = await r.json();
    if (!r.ok) return show(el, 'err', d.error || 'Gagal');
    show(el, 'ok', '\u2713 ' + d.message + ' (' + d.user.email + ')');
    ['r-name','r-email','r-pw'].forEach(id => document.getElementById(id).value = '');
  } catch(e) { show(el, 'err', 'Error: ' + e.message); }
}

function show(el, type, msg) { el.className='alert '+type; el.style.display='block'; el.textContent=msg; setTimeout(()=>el.style.display='none', 5000); }

loadStatus();
setInterval(loadStatus, 8000);
</script>
</body>
</html>`;

// ------------------------------------------------------------------
// BUN NATIVE HTTP SERVER (keeps process alive properly in Bun runtime)
// ------------------------------------------------------------------
const server = Bun.serve({
	port: PORT,
	async fetch(req: Request) {
		const url = new URL(req.url);
		const path = url.pathname;
		const method = req.method;

		// CORS preflight
		if (method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, x-master-key'
				}
			});
		}

		// Root: Serve Web UI
		if (method === 'GET' && path === '/') {
			return new Response(PANEL_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
		}

		// GET /api/maintenance/status — Public (read by SvelteKit hooks.server.ts)
		if (method === 'GET' && path === '/api/maintenance/status') {
			return json({ isMaintenance: isMaintenanceMode });
		}

		// POST /api/maintenance/toggle — Protected
		if (method === 'POST' && path === '/api/maintenance/toggle') {
			if (!isMasterAuthorized(req)) return json({ error: 'Master Controller Access Denied.' }, 401);
			isMaintenanceMode = !isMaintenanceMode;
			const action = isMaintenanceMode ? 'ENABLED' : 'DISABLED';
			console.log(`[ALERT] Maintenance Mode ${action}.`);
			return json({
				success: true,
				isMaintenance: isMaintenanceMode,
				message: `System is now ${isMaintenanceMode ? 'UNDER MAINTENANCE 🛑' : 'ONLINE ✅'}`
			});
		}

		// POST /api/auth/register-executive — Protected
		if (method === 'POST' && path === '/api/auth/register-executive') {
			if (!isMasterAuthorized(req)) return json({ error: 'Master Controller Access Denied.' }, 401);
			try {
				const { email, password, name, role } = await req.json();
				if (!['OWNER', 'ADMIN'].includes(role)) {
					return json({ error: 'Role harus OWNER atau ADMIN.' }, 400);
				}
				const existing = await prisma.user.findUnique({ where: { email } });
				if (existing) return json({ error: 'Email sudah terdaftar.' }, 400);
				const hashedPassword = await hash(password);
				const newUser = await prisma.user.create({
					data: { email, name, password: hashedPassword, role }
				});
				console.log(`[NEW EXEC] ${newUser.role} registered: ${newUser.email}`);
				return json({
					success: true,
					message: `Akun ${role} berhasil didaftarkan`,
					user: { id: newUser.id, email: newUser.email, role: newUser.role }
				}, 201);
			} catch (err: any) {
				console.error('SuperAdmin Reg Error:', err);
				return json({ error: 'Gagal membuat akun eksekutif.' }, 500);
			}
		}

		// 404 for unknown routes
		return json({ error: 'Endpoint tidak ditemukan.' }, 404);
	}
});

console.log(`\n==============================================`);
console.log(`🔥 IMDClothes SERVER PANEL & MAIN CONTROLLER`);
console.log(`==============================================`);
console.log(`-> God Mode UI  : http://localhost:${server.port}`);
console.log(`-> Prisma DB    : [ACTIVE]`);
console.log(`-> Master Key   : [PROTECTED]`);
console.log(`\nServer berjalan... (Ctrl+C untuk berhenti)\n`);

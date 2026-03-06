import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { hash } from '@node-rs/argon2';

// Setup koneksi menggunakan adapter yang sama dengan proyek
const pool = new pg.Pool({
	connectionString: 'postgresql://postgres:gusti717@localhost:5432/db_imd?schema=public'
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ARGON2_OPTIONS = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

async function main() {
	console.log('🌱 Seeding database...');

	// ─── 1. Wipe existing data (dev only) ───
	await prisma.$transaction([
		prisma.distribusiItem.deleteMany(),
		prisma.distribusi.deleteMany(),
		prisma.penjualan.deleteMany(),
		prisma.retur.deleteMany(),
		prisma.stok.deleteMany(),
		prisma.session.deleteMany(),
		prisma.user.deleteMany(),
		prisma.kategori.deleteMany(),
		prisma.toko.deleteMany()
	]);

	// ─── 2. Kategori Pakaian ───
	const kategoriData = [
		'Kaos Dewasa',
		'Kaos Anak',
		'Kemeja',
		'Celana Dewasa',
		'Celana Anak',
		'Gamis',
		'Jaket',
		'Dress'
	];

	const kategoriRecords = await Promise.all(
		kategoriData.map((nama) =>
			prisma.kategori.create({ data: { nama_kategori: nama } })
		)
	);
	console.log(`✅ ${kategoriRecords.length} kategori created`);

	// ─── 3. Toko (1 Gudang Pusat + 3 Cabang) ───
	const gudangPusat = await prisma.toko.create({
		data: { nama_toko: 'Gudang Pusat', alamat: 'Jl. Utama No.1', is_pusat: true }
	});

	const tokoA = await prisma.toko.create({
		data: { nama_toko: 'Toko A', alamat: 'Jl. Cabang A No.10' }
	});

	const tokoB = await prisma.toko.create({
		data: { nama_toko: 'Toko B', alamat: 'Jl. Cabang B No.20' }
	});

	const tokoC = await prisma.toko.create({
		data: { nama_toko: 'Toko C', alamat: 'Jl. Cabang C No.30' }
	});

	console.log('✅ 4 toko created (1 pusat + 3 cabang)');

	// ─── 4. Users (Owner, Admin, 3 Kasir) ───
	const passwordHash = await hash('password123', ARGON2_OPTIONS);

	await prisma.user.create({
		data: {
			email: 'owner@cvimdi.com',
			password: passwordHash,
			name: 'Owner IMD',
			role: Role.OWNER,
			tokoId: null
		}
	});

	await prisma.user.create({
		data: {
			email: 'admin@cvimdi.com',
			password: passwordHash,
			name: 'Admin Pusat',
			role: Role.ADMIN,
			tokoId: gudangPusat.id
		}
	});

	await prisma.user.create({
		data: {
			email: 'kasir.a@cvimdi.com',
			password: passwordHash,
			name: 'Kasir Toko A',
			role: Role.KASIR,
			tokoId: tokoA.id
		}
	});

	await prisma.user.create({
		data: {
			email: 'kasir.b@cvimdi.com',
			password: passwordHash,
			name: 'Kasir Toko B',
			role: Role.KASIR,
			tokoId: tokoB.id
		}
	});

	await prisma.user.create({
		data: {
			email: 'kasir.c@cvimdi.com',
			password: passwordHash,
			name: 'Kasir Toko C',
			role: Role.KASIR,
			tokoId: tokoC.id
		}
	});

	console.log('✅ 5 users created (1 owner, 1 admin, 3 kasir)');

	// ─── 5. Stok Awal di Gudang Pusat ───
	const stokPusatData = kategoriRecords.map((kat, i) => ({
		jumlah: (i + 1) * 50,
		harga_modal: (i + 1) * 5000,
		id_toko: gudangPusat.id,
		id_kategori: kat.id
	}));

	await prisma.stok.createMany({ data: stokPusatData });
	console.log(`✅ ${stokPusatData.length} stok gudang pusat created`);

	// ─── Summary ───
	console.log('\n📋 Seed Summary:');
	console.log('────────────────────────────────────');
	console.log('  Owner  : owner@cvimdi.com');
	console.log('  Admin  : admin@cvimdi.com');
	console.log('  Kasir A: kasir.a@cvimdi.com');
	console.log('  Kasir B: kasir.b@cvimdi.com');
	console.log('  Kasir C: kasir.c@cvimdi.com');
	console.log('  Password: password123 (semua akun)');
	console.log('────────────────────────────────────');
	console.log('🌱 Seeding complete!\n');
}

main()
	.catch((e) => {
		console.error('❌ Seed error:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		await pool.end();
	});

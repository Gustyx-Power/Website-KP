import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAuditLog() {
  console.log('🌱 Seeding audit log...');

  // Get some users and tokos for reference
  const users = await prisma.user.findMany({ take: 3 });
  const tokos = await prisma.toko.findMany({ take: 2 });
  const kategoris = await prisma.kategori.findMany({ take: 3 });

  if (users.length === 0 || tokos.length === 0 || kategoris.length === 0) {
    console.log('❌ No users, tokos, or kategoris found. Please run main seed first.');
    return;
  }

  // Create sample audit logs
  const auditLogs = [
    {
      userId: users[0].id,
      userName: users[0].name,
      userRole: users[0].role,
      action: 'INBOUND',
      entity: 'STOK',
      entityId: '1',
      tokoId: tokos[0].id,
      tokoName: tokos[0].nama_toko,
      kategoriId: kategoris[0].id,
      kategoriName: kategoris[0].nama_kategori,
      newValue: JSON.stringify({ jumlah: 100, harga_modal: 50000 }),
      description: `Membuat stok baru ${kategoris[0].nama_kategori} sebanyak 100 pcs di ${tokos[0].nama_toko}`,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      userId: users[1].id,
      userName: users[1].name,
      userRole: users[1].role,
      action: 'PENJUALAN',
      entity: 'PENJUALAN',
      entityId: '1',
      tokoId: tokos[1].id,
      tokoName: tokos[1].nama_toko,
      kategoriId: kategoris[1].id,
      kategoriName: kategoris[1].nama_kategori,
      newValue: JSON.stringify({ qty: 10, total: 150000 }),
      description: `Mencatat penjualan ${kategoris[1].nama_kategori} sebanyak 10 pcs di ${tokos[1].nama_toko} dengan total Rp 150.000`,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      userId: users[0].id,
      userName: users[0].name,
      userRole: users[0].role,
      action: 'DISTRIBUSI_CREATE',
      entity: 'DISTRIBUSI',
      entityId: '1',
      tokoId: tokos[0].id,
      tokoName: tokos[0].nama_toko,
      kategoriId: kategoris[2].id,
      kategoriName: kategoris[2].nama_kategori,
      newValue: JSON.stringify({ qty: 50, status: 'PENDING' }),
      description: `Membuat permintaan distribusi ${kategoris[2].nama_kategori} sebanyak 50 pcs dari ${tokos[0].nama_toko}`,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    },
    {
      userId: users[0].id,
      userName: users[0].name,
      userRole: users[0].role,
      action: 'DISTRIBUSI_APPROVE',
      entity: 'DISTRIBUSI',
      entityId: '1',
      tokoId: tokos[0].id,
      tokoName: tokos[0].nama_toko,
      oldValue: JSON.stringify({ status: 'PENDING' }),
      newValue: JSON.stringify({ status: 'DIKIRIM' }),
      description: `Menyetujui distribusi ke ${tokos[0].nama_toko}`,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
    },
    {
      userId: users[1].id,
      userName: users[1].name,
      userRole: users[1].role,
      action: 'UPDATE_STOK',
      entity: 'STOK',
      entityId: '2',
      tokoId: tokos[1].id,
      tokoName: tokos[1].nama_toko,
      kategoriId: kategoris[0].id,
      kategoriName: kategoris[0].nama_kategori,
      oldValue: JSON.stringify({ jumlah: 50, harga_modal: 45000 }),
      newValue: JSON.stringify({ jumlah: 75, harga_modal: 48000 }),
      description: `Mengupdate stok ${kategoris[0].nama_kategori} di ${tokos[1].nama_toko}. Jumlah: 50 → 75, Harga Modal: Rp 45.000 → Rp 48.000`,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.create({ data: log });
  }

  console.log(`✅ ${auditLogs.length} audit logs created`);
  console.log('🌱 Audit log seeding complete!\n');
}

seedAuditLog()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

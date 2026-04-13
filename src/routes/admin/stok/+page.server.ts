import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { createAuditLog } from '$lib/server/audit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    const stok = await prisma.stok.findMany({
        include: { toko: true, kategori: true },
        orderBy: { id: 'desc' }
    });
    const toko = await prisma.toko.findMany({
        where: { isActive: true, is_pusat: true }
    });
    const kategori = await prisma.kategori.findMany({
        where: { isActive: true }
    });

    // Calculate metrics for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Items added today (stok entries don't have createdAt, so we'll count all for now)
    const itemsInboundToday = stok.filter(s => s.toko.is_pusat).length;

    // Calculate last month's stock value for comparison
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    // Get current total stock value
    const currentStockValue = stok.reduce((sum, item) => sum + (item.harga_modal * item.jumlah), 0);
    
    // Calculate efficiency rate based on stock accuracy
    // Efficiency = (Total items - Critical items) / Total items * 100
    const totalStockItems = stok.length;
    const criticalItems = stok.filter(item => item.jumlah < 10).length;
    const efficiencyRate = totalStockItems > 0 
        ? ((totalStockItems - criticalItems) / totalStockItems * 100).toFixed(1)
        : 100;

    // Count active warehouses
    const activeWarehouses = await prisma.toko.count({
        where: { isActive: true, is_pusat: true }
    });

    return { 
        stok, 
        toko, 
        kategori,
        itemsInboundToday,
        efficiencyRate: parseFloat(efficiencyRate),
        activeWarehouses
    };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const data = await request.formData();
        const jumlah = Number(data.get('jumlah'));
        const harga_modal = Number(data.get('harga_modal'));
        const id_toko = Number(data.get('id_toko'));
        const id_kategori = Number(data.get('id_kategori'));

        if (isNaN(jumlah) || isNaN(harga_modal) || !id_toko || !id_kategori) {
            return fail(400, { error: 'All fields are required' });
        }

        const [toko, kategori] = await Promise.all([
            prisma.toko.findUnique({ where: { id: id_toko } }),
            prisma.kategori.findUnique({ where: { id: id_kategori } })
        ]);

        const existingStok = await prisma.stok.findFirst({
            where: { id_toko, id_kategori }
        });

        if (existingStok) {
            const oldValue = { jumlah: existingStok.jumlah, harga_modal: existingStok.harga_modal };
            const newValue = { jumlah: existingStok.jumlah + jumlah, harga_modal };

            await prisma.stok.update({
                where: { id: existingStok.id },
                data: {
                    jumlah: { increment: jumlah },
                    harga_modal // Update to latest price
                }
            });

            // Audit log
            if (locals.user) {
                await createAuditLog({
                    userId: locals.user.id,
                    userName: locals.user.name,
                    userRole: locals.user.role,
                    action: 'INBOUND',
                    entity: 'STOK',
                    entityId: existingStok.id.toString(),
                    tokoId: id_toko,
                    tokoName: toko?.nama_toko,
                    kategoriId: id_kategori,
                    kategoriName: kategori?.nama_kategori,
                    oldValue,
                    newValue,
                    description: `Menambah stok ${kategori?.nama_kategori} sebanyak ${jumlah} pcs di ${toko?.nama_toko}. Stok sebelum: ${oldValue.jumlah}, stok sesudah: ${newValue.jumlah}`
                });
            }
        } else {
            const newStok = await prisma.stok.create({
                data: { jumlah, harga_modal, id_toko, id_kategori }
            });

            // Audit log
            if (locals.user) {
                await createAuditLog({
                    userId: locals.user.id,
                    userName: locals.user.name,
                    userRole: locals.user.role,
                    action: 'INBOUND',
                    entity: 'STOK',
                    entityId: newStok.id.toString(),
                    tokoId: id_toko,
                    tokoName: toko?.nama_toko,
                    kategoriId: id_kategori,
                    kategoriName: kategori?.nama_kategori,
                    newValue: { jumlah, harga_modal },
                    description: `Membuat stok baru ${kategori?.nama_kategori} sebanyak ${jumlah} pcs di ${toko?.nama_toko}`
                });
            }
        }
        
        return { success: true };
    },
    update: async ({ request, locals }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        const jumlah = Number(data.get('jumlah'));
        const harga_modal = Number(data.get('harga_modal'));

        if (!id || isNaN(jumlah) || isNaN(harga_modal)) {
            return fail(400, { error: 'ID, Jumlah, and Harga Modal are required' });
        }

        const existingStok = await prisma.stok.findUnique({
            where: { id },
            include: { toko: true, kategori: true }
        });

        if (!existingStok) {
            return fail(404, { error: 'Stok not found' });
        }

        const oldValue = { jumlah: existingStok.jumlah, harga_modal: existingStok.harga_modal };
        const newValue = { jumlah, harga_modal };

        await prisma.stok.update({
            where: { id },
            data: { jumlah, harga_modal }
        });

        // Audit log
        if (locals.user) {
            await createAuditLog({
                userId: locals.user.id,
                userName: locals.user.name,
                userRole: locals.user.role,
                action: 'UPDATE_STOK',
                entity: 'STOK',
                entityId: id.toString(),
                tokoId: existingStok.id_toko,
                tokoName: existingStok.toko.nama_toko,
                kategoriId: existingStok.id_kategori,
                kategoriName: existingStok.kategori.nama_kategori,
                oldValue,
                newValue,
                description: `Mengupdate stok ${existingStok.kategori.nama_kategori} di ${existingStok.toko.nama_toko}. Jumlah: ${oldValue.jumlah} → ${newValue.jumlah}, Harga Modal: Rp ${oldValue.harga_modal.toLocaleString()} → Rp ${newValue.harga_modal.toLocaleString()}`
            });
        }

        return { success: true };
    }
};

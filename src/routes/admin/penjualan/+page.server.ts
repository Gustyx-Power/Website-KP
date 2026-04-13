import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { createAuditLog } from '$lib/server/audit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    const penjualan = await prisma.penjualan.findMany({
        include: { toko: true, kategori: true },
        orderBy: { id: 'desc' }
    });
    const toko = await prisma.toko.findMany();
    const kategori = await prisma.kategori.findMany();

    return { penjualan, toko, kategori };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const data = await request.formData();
        const qty_terjual = Number(data.get('qty_terjual'));
        const total_uang = Number(data.get('total_uang'));
        const id_toko = Number(data.get('id_toko'));
        const id_kategori = Number(data.get('id_kategori'));

        if (isNaN(qty_terjual) || isNaN(total_uang) || !id_toko || !id_kategori) {
            return fail(400, { error: 'All fields are required' });
        }

        // Check stock before proceeding
        const stok = await prisma.stok.findFirst({
            where: { id_toko, id_kategori }
        });

        if (!stok || qty_terjual > stok.jumlah) {
            return fail(400, { error: 'Stok tidak mencukupi!' });
        }

        // Get toko and kategori info for audit
        const toko = await prisma.toko.findUnique({ where: { id: id_toko } });
        const kategori = await prisma.kategori.findUnique({ where: { id: id_kategori } });

        // Apply Prisma explicit transaction
        const penjualan = await prisma.$transaction(async (tx) => {
            // 1. Insert Penjualan
            const newPenjualan = await tx.penjualan.create({
                data: {
                    qty_terjual,
                    total_uang,
                    harga_jual: Math.floor(total_uang / qty_terjual), // Fallback calculate
                    id_toko,
                    id_kategori,
                    createdById: locals.user?.id || ''
                }
            });
            
            // 2. Decrement Stok logic
            await tx.stok.updateMany({
                where: { id_toko, id_kategori },
                data: {
                    jumlah: { decrement: qty_terjual }
                }
            });
            
            return newPenjualan;
        });

        // Create audit log
        await createAuditLog({
            userId: locals.user?.id || '',
            userName: locals.user?.name || 'Unknown',
            userRole: locals.user?.role || 'ADMIN',
            action: 'PENJUALAN',
            entity: 'PENJUALAN',
            entityId: penjualan.id.toString(),
            tokoId: id_toko,
            tokoName: toko?.nama_toko,
            kategoriId: id_kategori,
            kategoriName: kategori?.nama_kategori,
            newValue: { qty_terjual, total_uang, harga_jual: penjualan.harga_jual },
            description: `Penjualan ${qty_terjual} unit ${kategori?.nama_kategori} di ${toko?.nama_toko} senilai Rp ${total_uang.toLocaleString('id-ID')}`,
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
            userAgent: request.headers.get('user-agent') || undefined
        });

        return { success: true };
    }
};

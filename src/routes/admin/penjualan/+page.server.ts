import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
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
    create: async ({ request }) => {
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

        // Apply Prisma explicit transaction
        await prisma.$transaction([
            // 1. Insert Penjualan
            prisma.penjualan.create({
                data: { qty_terjual, total_uang, id_toko, id_kategori }
            }),
            // 2. Decrement Stok logic
            prisma.stok.updateMany({
                where: { id_toko, id_kategori },
                data: {
                    jumlah: { decrement: qty_terjual }
                }
            })
        ]);

        return { success: true };
    }
};

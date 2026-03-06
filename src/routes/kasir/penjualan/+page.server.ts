import { fail } from '@sveltejs/kit';
import { catatPenjualanHarian } from '$lib/server/services/inventory';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user!;
    
    // Check if user has a store
    if (!user.tokoId) return { stokToko: [] };

    // Fetch existing categories that actually have stock in this store
    const stokToko = await prisma.stok.findMany({
        where: { id_toko: user.tokoId, jumlah: { gt: 0 } },
        include: { kategori: true }
    });

    return { stokToko };
};

export const actions: Actions = {
    lapor: async ({ request, locals }) => {
        const user = locals.user!;
        if (!user.tokoId) {
            return fail(403, { error: 'Anda belum ditugaskan ke sebuah toko.' });
        }

        const data = await request.formData();
        const id_kategori = Number(data.get('id_kategori'));
        const qty_terjual = Number(data.get('qty_terjual'));
        const total_uang = Number(data.get('total_uang'));

        if (!id_kategori || isNaN(qty_terjual) || isNaN(total_uang) || qty_terjual <= 0) {
            return fail(400, { error: 'Formulir setoran tidak lengkap/valid.' });
        }

        try {
            await catatPenjualanHarian({
                id_toko: user.tokoId,
                items: [{
                    id_kategori,
                    qty: qty_terjual,
                    harga_jual: Math.floor(total_uang / qty_terjual)
                }],
                createdById: user.id
            });
            return { success: true };
        } catch (error: any) {
            return fail(400, { error: error.message || 'Gagal menyimpan setoran.' });
        }
    }
};

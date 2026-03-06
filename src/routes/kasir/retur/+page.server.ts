import { fail } from '@sveltejs/kit';
import { ajukanRetur } from '$lib/server/services/inventory';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user!;
    
    if (!user.tokoId) return { stokToko: [] };

    const stokToko = await prisma.stok.findMany({
        where: { id_toko: user.tokoId, jumlah: { gt: 0 } },
        include: { kategori: true }
    });

    return { stokToko };
};

export const actions: Actions = {
    retur: async ({ request, locals }) => {
        const user = locals.user!;
        if (!user.tokoId) {
            return fail(403, { error: 'Anda belum ditugaskan ke sebuah toko.' });
        }

        const data = await request.formData();
        const id_kategori = Number(data.get('id_kategori'));
        const qty_retur = Number(data.get('qty_retur'));
        const keterangan = data.get('keterangan')?.toString() || '';

        if (!id_kategori || isNaN(qty_retur) || qty_retur <= 0) {
            return fail(400, { error: 'Formulir retur tidak lengkap/valid.' });
        }

        try {
            await ajukanRetur({
                id_toko: user.tokoId,
                id_kategori,
                qty: qty_retur,
                keterangan: keterangan.trim() !== '' ? keterangan : undefined,
                createdById: user.id
            });
            return { success: true };
        } catch (error: any) {
            return fail(400, { error: error.message || 'Gagal mengajukan retur.' });
        }
    }
};

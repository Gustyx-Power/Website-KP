import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    const stok = await prisma.stok.findMany({
        include: { toko: true, kategori: true },
        orderBy: { id: 'desc' }
    });
    const toko = await prisma.toko.findMany();
    const kategori = await prisma.kategori.findMany();

    return { stok, toko, kategori };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const jumlah = Number(data.get('jumlah'));
        const harga_modal = Number(data.get('harga_modal'));
        const id_toko = Number(data.get('id_toko'));
        const id_kategori = Number(data.get('id_kategori'));

        if (isNaN(jumlah) || isNaN(harga_modal) || !id_toko || !id_kategori) {
            return fail(400, { error: 'All fields are required' });
        }

        await prisma.stok.create({
            data: { jumlah, harga_modal, id_toko, id_kategori }
        });
        return { success: true };
    },
    update: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        const jumlah = Number(data.get('jumlah'));
        const harga_modal = Number(data.get('harga_modal'));

        if (!id || isNaN(jumlah) || isNaN(harga_modal)) {
            return fail(400, { error: 'ID, Jumlah, and Harga Modal are required' });
        }

        await prisma.stok.update({
            where: { id },
            data: { jumlah, harga_modal }
        });
        return { success: true };
    }
};

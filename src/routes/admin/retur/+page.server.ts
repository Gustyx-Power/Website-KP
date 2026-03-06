import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    const retur = await prisma.retur.findMany({
        include: { toko: true, kategori: true },
        orderBy: { id: 'desc' }
    });
    const toko = await prisma.toko.findMany();
    const kategori = await prisma.kategori.findMany();

    return { retur, toko, kategori };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
        const qty_retur = Number(data.get('qty_retur'));
        const keterangan = data.get('keterangan')?.toString() || null;
        const id_toko = Number(data.get('id_toko'));
        const id_kategori = Number(data.get('id_kategori'));

        if (isNaN(qty_retur) || !id_toko || !id_kategori) {
            return fail(400, { error: 'qty_retur, id_toko, and id_kategori are required' });
        }

		// Apply Prisma explicit transaction
		await prisma.$transaction([
			// 1. Insert Retur
			prisma.retur.create({
				data: {
					qty_retur,
					keterangan,
					id_toko,
					id_kategori,
					createdById: locals.user?.id || ''
				}
			}),
            // 2. Increment Stok logic
            prisma.stok.updateMany({
                where: { id_toko, id_kategori },
                data: {
                    jumlah: { increment: qty_retur }
                }
            })
        ]);

        return { success: true };
    }
};

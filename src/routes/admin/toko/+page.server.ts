import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const toko = await prisma.toko.findMany({
		where: { isActive: true },
		orderBy: { id: 'asc' }
	});
	return { toko };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const nama_toko = data.get('nama_toko')?.toString();
		const alamat = data.get('alamat')?.toString() || null;
		const is_pusat = data.get('is_pusat') === 'on'; // Checkbox

		if (!nama_toko) {
			return fail(400, { error: 'Nama Toko is required' });
		}

		await prisma.toko.create({ data: { nama_toko, alamat, is_pusat } });
		return { success: true };
	},
    update: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        const nama_toko = data.get('nama_toko')?.toString();
        const alamat = data.get('alamat')?.toString() || null;

        if (!id || !nama_toko) {
            return fail(400, { error: 'ID and Nama Toko are required' });
        }

        await prisma.toko.update({
            where: { id },
            data: { nama_toko, alamat }
        });
        return { success: true };
    },
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (!id) {
			return fail(400, { error: 'ID is required' });
		}

		// Soft Delete
		await prisma.toko.update({
			where: { id },
			data: { isActive: false }
		});
		return { success: true };
	}
};

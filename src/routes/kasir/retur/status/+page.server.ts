import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user!;

    if (!user.tokoId) {
        return { returList: [] };
    }

    // Get all return requests for this store
    const returList = await prisma.retur.findMany({
        where: {
            id_toko: user.tokoId
        },
        include: {
            kategori: true,
            toko: true,
            createdBy: true
        },
        orderBy: { tanggal: 'desc' }
    });

    return {
        returList
    };
};

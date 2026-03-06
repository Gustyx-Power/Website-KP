import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user!;
    
    // Fetch stock for their assigned store
    let tokosStok: any[] = [];
    if (user.tokoId) {
        tokosStok = await prisma.stok.findMany({
            where: { id_toko: user.tokoId },
            include: { kategori: true },
            orderBy: { id: 'asc' }
        });
    }

    return { stoks: tokosStok };
};

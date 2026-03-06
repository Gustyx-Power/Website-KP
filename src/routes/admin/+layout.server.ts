import { prisma } from '$lib/server/prisma';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    // Ambil jumlah request retur yang masih pending
    const pendingRetur = await prisma.retur.count({
        where: { status: 'PENDING' }
    });

    return {
        pendingRetur
    };
};

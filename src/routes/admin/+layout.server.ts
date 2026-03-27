import { prisma } from '$lib/server/prisma';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    // Ambil jumlah request retur dan distribusi yang masih pending
    const [pendingRetur, pendingDistribusi] = await Promise.all([
        prisma.retur.count({ where: { status: 'PENDING' } }),
        prisma.distribusi.count({ where: { status: 'PENDING' } })
    ]);

    return {
        pendingRetur,
        pendingDistribusi
    };
};

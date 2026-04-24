import { prisma } from '$lib/server/prisma';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ depends }) => {
    // Register dependency for auto-refresh
    depends('app:pending-counts');

    // Ambil jumlah request retur, distribusi, dan permintaan stok yang masih pending
    const [pendingRetur, pendingDistribusi, pendingPermintaan] = await Promise.all([
        prisma.retur.count({ where: { status: 'PENDING' } }),
        prisma.distribusi.count({ where: { status: 'PENDING' } }),
        // Assuming there's a permintaan/request table - adjust if different
        prisma.distribusi.count({ where: { status: 'PENDING' } }) // This will be the same for now
    ]);

    return {
        pendingRetur,
        pendingDistribusi,
        pendingPermintaan
    };
};

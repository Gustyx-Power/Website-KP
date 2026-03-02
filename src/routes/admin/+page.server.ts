import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const [totalToko, stokAggregate, totalPenjualan] = await Promise.all([
        prisma.toko.count(),
        prisma.stok.aggregate({
            _sum: {
                jumlah: true
            }
        }),
        prisma.penjualan.count()
    ]);

    const totalItemsStok = stokAggregate._sum.jumlah || 0;

    return {
        totalToko,
        totalItemsStok,
        totalPenjualan
    };
};

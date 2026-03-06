import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // 1. Get Gudang Pusat info
    const gudangPusat = await prisma.toko.findFirst({
        where: { is_pusat: true, isActive: true }
    });

    let totalStokPusat = 0;
    if (gudangPusat) {
        const stokAggregate = await prisma.stok.aggregate({
            where: { id_toko: gudangPusat.id },
            _sum: { jumlah: true }
        });
        totalStokPusat = stokAggregate._sum.jumlah || 0;
    }

    // 2. Fetch other operational metrics
    const [totalTokoCabang, pendingRetur, totalPenjualan] = await Promise.all([
        prisma.toko.count({ where: { is_pusat: false, isActive: true } }),
        prisma.retur.count({ where: { status: 'PENDING' } }),
        prisma.penjualan.count()
    ]);

    return {
        totalStokPusat,
        totalTokoCabang,
        pendingRetur,
        totalPenjualan
    };
};

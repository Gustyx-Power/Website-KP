import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
    // 1. Ringkasan Omzet & Modal
    // Total Omzet
    const penjualan = await prisma.penjualan.aggregate({
        _sum: {
            total_uang: true,
            qty_terjual: true
        }
    });

    // Total Modal Terkunci (Hitung manual karena butuh perkalian per row)
    const stoks = await prisma.stok.findMany();
    
    const totalAsetModal = stoks.reduce((acc, curr) => {
        return acc + (curr.jumlah * curr.harga_modal);
    }, 0);

    const totalStokBarang = stoks.reduce((acc, curr) => acc + curr.jumlah, 0);

    // 2. Barang Paling Laku
    const penjualanRaw = await prisma.penjualan.findMany({
        include: { kategori: true }
    });
    
    const summaryLakuM: Record<string, { nama: string, qty: number, omzet: number }> = {};
    for (const p of penjualanRaw) {
        if (!summaryLakuM[p.id_kategori]) {
            summaryLakuM[p.id_kategori] = { nama: p.kategori.nama_kategori, qty: 0, omzet: 0 };
        }
        summaryLakuM[p.id_kategori].qty += p.qty_terjual;
        summaryLakuM[p.id_kategori].omzet += p.total_uang;
    }

    const barangPalingLaku = Object.values(summaryLakuM)
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5); // Ambil Top 5

    // 3. Low-Stock Alert
    const lowStocks = await prisma.stok.findMany({
        where: {
            jumlah: { lte: 15, gt: 0 } // Threshold 15 pcs
        },
        include: {
            toko: true,
            kategori: true
        },
        orderBy: {
            jumlah: 'asc'
        },
        take: 10
    });

    return {
        dashboard: {
            totalOmzet: penjualan._sum.total_uang || 0,
            totalBarangTerjual: penjualan._sum.qty_terjual || 0,
            totalAsetModal,
            totalStokBarang,
            barangPalingLaku,
            lowStocks
        }
    };
};

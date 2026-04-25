import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    // Get list of toko for filter dropdown
    const tokoList = await prisma.toko.findMany({
        where: { isActive: true },
        select: { id: true, nama_toko: true, is_pusat: true },
        orderBy: { nama_toko: 'asc' }
    });

    return { tokoList };
};

export const actions: Actions = {
    getRingkasanData: async ({ request }) => {
        const formData = await request.formData();
        const periode = formData.get('periode') as string;
        const customStartDate = formData.get('customStartDate') as string;
        const customEndDate = formData.get('customEndDate') as string;

        // Calculate date range
        let startDate = new Date();
        let endDate = new Date();

        if (periode === 'custom' && customStartDate && customEndDate) {
            startDate = new Date(customStartDate);
            endDate = new Date(customEndDate);
        } else {
            const days = parseInt(periode) || 7;
            startDate.setDate(startDate.getDate() - days);
        }

        // 1. Get Gudang Pusat info
        const gudangPusat = await prisma.toko.findFirst({
            where: { is_pusat: true, isActive: true }
        });

        let totalStokPusat = 0;
        let stokPusatDetail: any[] = [];
        if (gudangPusat) {
            const stokAggregate = await prisma.stok.aggregate({
                where: { id_toko: gudangPusat.id },
                _sum: { jumlah: true }
            });
            totalStokPusat = stokAggregate._sum.jumlah || 0;

            // Get detailed stock
            stokPusatDetail = await prisma.stok.findMany({
                where: { id_toko: gudangPusat.id },
                include: { kategori: true },
                orderBy: { jumlah: 'desc' }
            });
        }

        // 2. Get operational metrics
        const [totalTokoCabang, pendingRetur, totalPenjualan, pengirimanAktif] = await Promise.all([
            prisma.toko.count({ where: { is_pusat: false, isActive: true } }),
            prisma.retur.count({ where: { status: 'PENDING' } }),
            prisma.penjualan.count({
                where: {
                    tanggal: { gte: startDate, lte: endDate }
                }
            }),
            prisma.distribusi.count({ where: { status: 'DIKIRIM' } })
        ]);

        // 3. Get total balance (revenue)
        const balanceAggregate = await prisma.penjualan.aggregate({
            where: {
                tanggal: { gte: startDate, lte: endDate }
            },
            _sum: { total_uang: true }
        });
        const totalPendapatan = balanceAggregate._sum.total_uang || 0;

        // 4. Get sales by day for chart
        const salesByDay = await prisma.penjualan.groupBy({
            by: ['tanggal'],
            where: { tanggal: { gte: startDate, lte: endDate } },
            _sum: { total_uang: true, qty_terjual: true },
            orderBy: { tanggal: 'asc' }
        });

        // 5. Get popular products
        const popularProducts = await prisma.penjualan.groupBy({
            by: ['id_kategori'],
            where: {
                tanggal: { gte: startDate, lte: endDate }
            },
            _sum: { qty_terjual: true, total_uang: true },
            orderBy: { _sum: { total_uang: 'desc' } },
            take: 10
        });

        const productsWithDetails = await Promise.all(
            popularProducts.map(async (p) => {
                const kategori = await prisma.kategori.findUnique({
                    where: { id: p.id_kategori }
                });
                return {
                    nama: kategori?.nama_kategori || 'Unknown',
                    revenue: p._sum.total_uang || 0,
                    quantity: p._sum.qty_terjual || 0
                };
            })
        );

        // 6. Get distribusi summary
        const distribusiSummary = await prisma.distribusi.groupBy({
            by: ['status'],
            where: {
                tanggal: { gte: startDate, lte: endDate }
            },
            _count: { id: true }
        });

        // 7. Get retur summary
        const returSummary = await prisma.retur.groupBy({
            by: ['status'],
            where: {
                tanggal: { gte: startDate, lte: endDate }
            },
            _count: { id: true }
        });

        // 8. Get low stock items
        const lowStockItems = await prisma.stok.findMany({
            where: {
                jumlah: { lt: 15 }
            },
            include: {
                kategori: true,
                toko: true
            },
            orderBy: { jumlah: 'asc' },
            take: 10
        });

        return {
            success: true,
            data: {
                periode: {
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                },
                ringkasan: {
                    totalStokPusat,
                    totalTokoCabang,
                    totalPendapatan,
                    totalPenjualan,
                    pengirimanAktif,
                    pendingRetur
                },
                stokPusatDetail,
                salesByDay,
                popularProducts: productsWithDetails,
                distribusiSummary,
                returSummary,
                lowStockItems
            }
        };
    },

    getStokPusatData: async ({ request }) => {
        // Get Gudang Pusat
        const gudangPusat = await prisma.toko.findFirst({
            where: { is_pusat: true, isActive: true }
        });

        if (!gudangPusat) {
            return { success: false, error: 'Gudang pusat tidak ditemukan' };
        }

        // Get all stock in central warehouse with category details
        const stokPusat = await prisma.stok.findMany({
            where: { id_toko: gudangPusat.id },
            include: { 
                kategori: true 
            },
            orderBy: { jumlah: 'desc' }
        });

        // Calculate totals with proper null handling
        const totalUnit = stokPusat.reduce((sum, item) => sum + (item.jumlah || 0), 0);
        const totalNilaiModal = stokPusat.reduce((sum, item) => {
            const hargaModal = item.harga_modal || 0; // harga_modal ada di tabel Stok
            const jumlah = item.jumlah || 0;
            return sum + (jumlah * hargaModal);
        }, 0);

        // Get low stock items (< 15 unit)
        const stokMenipis = stokPusat.filter(item => item.jumlah < 15);

        // Get stock by category summary with null handling
        const stokPerKategori = stokPusat.map(item => {
            const hargaModal = item.harga_modal || 0; // harga_modal ada di tabel Stok
            const jumlah = item.jumlah || 0;
            const nilaiTotal = jumlah * hargaModal;
            
            return {
                kategori: item.kategori?.nama_kategori || 'Unknown',
                jumlah: jumlah,
                hargaModal: hargaModal,
                nilaiTotal: nilaiTotal,
                status: jumlah < 5 ? 'Kritis' : jumlah < 15 ? 'Menipis' : 'Aman'
            };
        });

        return {
            success: true,
            data: {
                gudangPusat: {
                    nama: gudangPusat.nama_toko,
                    alamat: gudangPusat.alamat
                },
                ringkasan: {
                    totalKategori: stokPusat.length,
                    totalUnit,
                    totalNilaiModal,
                    jumlahStokMenipis: stokMenipis.length
                },
                stokPerKategori,
                stokMenipis: stokMenipis.map(item => ({
                    kategori: item.kategori?.nama_kategori || 'Unknown',
                    jumlah: item.jumlah || 0,
                    hargaModal: item.harga_modal || 0 // harga_modal ada di tabel Stok
                }))
            }
        };
    },

    getPenjualanData: async ({ request }) => {
        const formData = await request.formData();
        const periode = formData.get('periode') as string;
        const customStartDate = formData.get('customStartDate') as string;
        const customEndDate = formData.get('customEndDate') as string;
        const tokoId = formData.get('tokoId') as string;

        // Calculate date range
        let startDate = new Date();
        let endDate = new Date();

        if (periode === 'custom' && customStartDate && customEndDate) {
            startDate = new Date(customStartDate);
            endDate = new Date(customEndDate);
        } else {
            const days = parseInt(periode) || 7;
            startDate.setDate(startDate.getDate() - days);
        }

        // Build where clause
        const whereClause: any = {
            tanggal: { gte: startDate, lte: endDate }
        };

        if (tokoId && tokoId !== 'semua') {
            whereClause.id_toko = parseInt(tokoId);
        }

        // Get all sales with details
        const penjualanList = await prisma.penjualan.findMany({
            where: whereClause,
            include: {
                kategori: true,
                toko: true,
                createdBy: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { tanggal: 'desc' }
        });

        // Calculate summary
        const totalTransaksi = penjualanList.length;
        const totalQtyTerjual = penjualanList.reduce((sum, p) => sum + (p.qty_terjual || 0), 0);
        const totalPendapatan = penjualanList.reduce((sum, p) => sum + (p.total_uang || 0), 0);

        // Get sales by category
        const salesByCategory = await prisma.penjualan.groupBy({
            by: ['id_kategori'],
            where: whereClause,
            _sum: { qty_terjual: true, total_uang: true },
            orderBy: { _sum: { total_uang: 'desc' } }
        });

        const categoryDetails = await Promise.all(
            salesByCategory.map(async (item) => {
                const kategori = await prisma.kategori.findUnique({
                    where: { id: item.id_kategori }
                });
                return {
                    kategori: kategori?.nama_kategori || 'Unknown',
                    qty: item._sum.qty_terjual || 0,
                    revenue: item._sum.total_uang || 0
                };
            })
        );

        // Get sales by toko
        const salesByToko = await prisma.penjualan.groupBy({
            by: ['id_toko'],
            where: whereClause,
            _sum: { qty_terjual: true, total_uang: true },
            _count: { id: true },
            orderBy: { _sum: { total_uang: 'desc' } }
        });

        const tokoDetails = await Promise.all(
            salesByToko.map(async (item) => {
                const toko = await prisma.toko.findUnique({
                    where: { id: item.id_toko }
                });
                return {
                    toko: toko?.nama_toko || 'Unknown',
                    transaksi: item._count.id,
                    qty: item._sum.qty_terjual || 0,
                    revenue: item._sum.total_uang || 0
                };
            })
        );

        // Get sales by day
        const salesByDay = await prisma.penjualan.groupBy({
            by: ['tanggal'],
            where: whereClause,
            _sum: { qty_terjual: true, total_uang: true },
            _count: { id: true },
            orderBy: { tanggal: 'asc' }
        });

        // Get toko name if filtered
        let tokoName = 'Semua Toko';
        if (tokoId && tokoId !== 'semua') {
            const toko = await prisma.toko.findUnique({
                where: { id: parseInt(tokoId) }
            });
            tokoName = toko?.nama_toko || 'Unknown';
        }

        return {
            success: true,
            data: {
                periode: {
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                },
                filter: {
                    toko: tokoName
                },
                ringkasan: {
                    totalTransaksi,
                    totalQtyTerjual,
                    totalPendapatan
                },
                penjualanList: penjualanList.map(p => ({
                    id: p.id,
                    tanggal: p.tanggal.toISOString(),
                    kategori: p.kategori.nama_kategori,
                    toko: p.toko.nama_toko,
                    qty: p.qty_terjual,
                    hargaJual: p.harga_jual,
                    total: p.total_uang,
                    kasir: p.createdBy.name
                })),
                salesByCategory: categoryDetails,
                salesByToko: tokoDetails,
                salesByDay
            }
        };
    }
};

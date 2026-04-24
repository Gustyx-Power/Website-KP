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
    const [totalTokoCabang, pendingRetur, totalPenjualan, pendingDistribusi] = await Promise.all([
        prisma.toko.count({ where: { is_pusat: false, isActive: true } }),
        prisma.retur.count({ where: { status: 'PENDING' } }),
        prisma.penjualan.count(),
        prisma.distribusi.count({ where: { status: 'DIKIRIM' } }) // DIKIRIM = sudah disetujui tapi belum dikonfirmasi diterima
    ]);

    // 3. Get total balance (total revenue from sales)
    const balanceAggregate = await prisma.penjualan.aggregate({
        _sum: { total_uang: true }
    });
    const totalBalance = balanceAggregate._sum.total_uang || 0;

    // 4. Get previous month balance for comparison
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const [thisMonthBalance, lastMonthBalance] = await Promise.all([
        prisma.penjualan.aggregate({
            where: { tanggal: { gte: firstDayThisMonth } },
            _sum: { total_uang: true }
        }),
        prisma.penjualan.aggregate({
            where: { 
                tanggal: { 
                    gte: firstDayLastMonth,
                    lt: firstDayThisMonth
                }
            },
            _sum: { total_uang: true }
        })
    ]);

    const thisMonth = thisMonthBalance._sum.total_uang || 0;
    const lastMonth = lastMonthBalance._sum.total_uang || 1;
    const balanceChange = ((thisMonth - lastMonth) / lastMonth) * 100;

    // 5. Get recent customers (users with role KASIR)
    const recentCustomers = await prisma.user.findMany({
        where: { role: 'KASIR', isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true }
    });

    // 6. Get sales data for last 7 days for chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const salesByDay = await prisma.penjualan.groupBy({
        by: ['tanggal'],
        where: { tanggal: { gte: sevenDaysAgo } },
        _sum: { total_uang: true },
        orderBy: { tanggal: 'asc' }
    });

    // 7. Get popular products (top 5 by sales quantity)
    const popularProducts = await prisma.penjualan.groupBy({
        by: ['id_kategori'],
        _sum: { qty_terjual: true, total_uang: true },
        orderBy: { _sum: { total_uang: 'desc' } },
        take: 5
    });

    const productsWithDetails = await Promise.all(
        popularProducts.map(async (p) => {
            const kategori = await prisma.kategori.findUnique({
                where: { id: p.id_kategori }
            });
            return {
                name: kategori?.nama_kategori || 'Unknown',
                revenue: p._sum.total_uang || 0,
                quantity: p._sum.qty_terjual || 0
            };
        })
    );

    // 8. Get recent comments/transactions
    const recentTransactions = await prisma.penjualan.findMany({
        take: 3,
        orderBy: { tanggal: 'desc' },
        include: {
            createdBy: { select: { name: true } },
            kategori: { select: { nama_kategori: true } }
        }
    });

    return {
        totalStokPusat,
        totalTokoCabang,
        pendingRetur,
        totalPenjualan,
        pendingDistribusi,
        totalBalance,
        balanceChange,
        recentCustomers,
        salesByDay,
        popularProducts: productsWithDetails,
        recentTransactions
    };
};

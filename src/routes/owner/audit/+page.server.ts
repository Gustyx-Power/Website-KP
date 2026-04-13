import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ url }) => {
  // Get filter parameters from URL
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 50;
  const skip = (page - 1) * limit;
  
  const action = url.searchParams.get('action') || undefined;
  const userId = url.searchParams.get('userId') || undefined;
  const tokoId = url.searchParams.get('tokoId') ? parseInt(url.searchParams.get('tokoId')!) : undefined;
  const startDate = url.searchParams.get('startDate') || undefined;
  const endDate = url.searchParams.get('endDate') || undefined;

  // Build where clause
  const where: any = {};
  
  if (action && action !== 'ALL') {
    where.action = action;
  }
  
  if (userId && userId !== 'ALL') {
    where.userId = userId;
  }
  
  if (tokoId) {
    where.tokoId = tokoId;
  }
  
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) {
      where.timestamp.gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.timestamp.lte = end;
    }
  }

  // Get audit logs with pagination
  const [logs, totalCount, users, tokos] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip
    }),
    prisma.auditLog.count({ where }),
    prisma.user.findMany({
      select: { id: true, name: true, role: true },
      orderBy: { name: 'asc' }
    }),
    prisma.toko.findMany({
      select: { id: true, nama_toko: true },
      orderBy: { nama_toko: 'asc' }
    })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    logs,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit
    },
    filters: {
      users,
      tokos,
      actions: [
        'INBOUND',
        'PENJUALAN',
        'DISTRIBUSI_CREATE',
        'DISTRIBUSI_APPROVE',
        'DISTRIBUSI_REJECT',
        'RETUR_CREATE',
        'RETUR_APPROVE',
        'UPDATE_STOK',
        'DELETE_USER',
        'DELETE_TOKO',
        'DELETE_KATEGORI'
      ]
    },
    currentFilters: {
      action,
      userId,
      tokoId,
      startDate,
      endDate
    }
  };
};

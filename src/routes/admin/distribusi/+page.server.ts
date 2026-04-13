import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { createAuditLog } from '$lib/server/audit';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    // Get all distribution requests
    const distribusiList = await prisma.distribusi.findMany({
        include: {
            tokoAsal: true,
            tokoTujuan: true,
            createdBy: true,
            items: {
                include: {
                    kategori: true
                }
            }
        },
        orderBy: { tanggal: 'desc' }
    });

    // Calculate totals for each distribution
    const distribusiWithTotals = await Promise.all(
        distribusiList.map(async (dist) => {
            let totalModal = 0;
            for (const item of dist.items) {
                const stok = await prisma.stok.findUnique({
                    where: {
                        id_toko_id_kategori: {
                            id_toko: dist.id_toko_asal,
                            id_kategori: item.id_kategori
                        }
                    }
                });
                totalModal += (stok?.harga_modal || 0) * item.jumlah;
            }
            return {
                ...dist,
                totalModal
            };
        })
    );

    return {
        distribusiList: distribusiWithTotals
    };
};

export const actions: Actions = {
    approve: async ({ request, locals }) => {
        const formData = await request.formData();
        const distribusiId = parseInt(formData.get('distribusiId') as string);

        const distribusi = await prisma.distribusi.findUnique({
            where: { id: distribusiId },
            include: { items: true }
        });

        if (!distribusi) {
            return fail(404, { error: 'Distribusi tidak ditemukan' });
        }

        if (distribusi.status !== 'PENDING') {
            return fail(400, { error: 'Distribusi sudah diproses' });
        }

        // Validate stock availability
        for (const item of distribusi.items) {
            const stok = await prisma.stok.findUnique({
                where: {
                    id_toko_id_kategori: {
                        id_toko: distribusi.id_toko_asal,
                        id_kategori: item.id_kategori
                    }
                }
            });

            if (!stok || stok.jumlah < item.jumlah) {
                return fail(400, { 
                    error: `Stok tidak mencukupi untuk kategori ID ${item.id_kategori}` 
                });
            }
        }

        // Get toko info for audit
        const tokoAsal = await prisma.toko.findUnique({ where: { id: distribusi.id_toko_asal } });
        const tokoTujuan = await prisma.toko.findUnique({ where: { id: distribusi.id_toko_tujuan } });

        // Process distribution in transaction
        await prisma.$transaction(async (tx) => {
            // Update distribution status
            await tx.distribusi.update({
                where: { id: distribusiId },
                data: { status: 'DIKIRIM' }
            });

            // Process each item
            for (const item of distribusi.items) {
                // Reduce stock from source (central warehouse)
                await tx.stok.update({
                    where: {
                        id_toko_id_kategori: {
                            id_toko: distribusi.id_toko_asal,
                            id_kategori: item.id_kategori
                        }
                    },
                    data: {
                        jumlah: { decrement: item.jumlah }
                    }
                });

                // Add stock to destination (branch store)
                const existingStok = await tx.stok.findUnique({
                    where: {
                        id_toko_id_kategori: {
                            id_toko: distribusi.id_toko_tujuan,
                            id_kategori: item.id_kategori
                        }
                    }
                });

                if (existingStok) {
                    // Update existing stock
                    await tx.stok.update({
                        where: {
                            id_toko_id_kategori: {
                                id_toko: distribusi.id_toko_tujuan,
                                id_kategori: item.id_kategori
                            }
                        },
                        data: {
                            jumlah: { increment: item.jumlah }
                        }
                    });
                } else {
                    // Get harga_modal from source
                    const sourceStok = await tx.stok.findUnique({
                        where: {
                            id_toko_id_kategori: {
                                id_toko: distribusi.id_toko_asal,
                                id_kategori: item.id_kategori
                            }
                        }
                    });

                    // Create new stock entry
                    await tx.stok.create({
                        data: {
                            id_toko: distribusi.id_toko_tujuan,
                            id_kategori: item.id_kategori,
                            jumlah: item.jumlah,
                            harga_modal: sourceStok?.harga_modal || 0
                        }
                    });
                }
            }
        });

        // Create audit log
        const itemsSummary = distribusi.items.map(item => `${item.jumlah} unit (ID: ${item.id_kategori})`).join(', ');
        await createAuditLog({
            userId: locals.user?.id || '',
            userName: locals.user?.name || 'Unknown',
            userRole: locals.user?.role || 'ADMIN',
            action: 'DISTRIBUSI_APPROVE',
            entity: 'DISTRIBUSI',
            entityId: distribusiId.toString(),
            tokoId: distribusi.id_toko_tujuan,
            tokoName: tokoTujuan?.nama_toko,
            oldValue: { status: 'PENDING' },
            newValue: { status: 'DIKIRIM', items: distribusi.items },
            description: `Menyetujui distribusi dari ${tokoAsal?.nama_toko} ke ${tokoTujuan?.nama_toko}: ${itemsSummary}`,
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
            userAgent: request.headers.get('user-agent') || undefined
        });

        return { success: true };
    },

    reject: async ({ request, locals }) => {
        const formData = await request.formData();
        const distribusiId = parseInt(formData.get('distribusiId') as string);
        const alasan = formData.get('alasan') as string;

        const distribusi = await prisma.distribusi.findUnique({
            where: { id: distribusiId },
            include: { tokoAsal: true, tokoTujuan: true, items: true }
        });

        if (!distribusi) {
            return fail(404, { error: 'Distribusi tidak ditemukan' });
        }

        if (distribusi.status !== 'PENDING') {
            return fail(400, { error: 'Distribusi sudah diproses' });
        }

        // Update status to rejected (we'll use DITERIMA with rejection note)
        await prisma.distribusi.update({
            where: { id: distribusiId },
            data: { 
                status: 'DITERIMA',
                keterangan: `DITOLAK: ${alasan || 'Tidak ada alasan'}`
            }
        });

        // Create audit log
        await createAuditLog({
            userId: locals.user?.id || '',
            userName: locals.user?.name || 'Unknown',
            userRole: locals.user?.role || 'ADMIN',
            action: 'DISTRIBUSI_REJECT',
            entity: 'DISTRIBUSI',
            entityId: distribusiId.toString(),
            tokoId: distribusi.id_toko_tujuan,
            tokoName: distribusi.tokoTujuan?.nama_toko,
            oldValue: { status: 'PENDING' },
            newValue: { status: 'DITOLAK', alasan },
            description: `Menolak distribusi dari ${distribusi.tokoAsal?.nama_toko} ke ${distribusi.tokoTujuan?.nama_toko}. Alasan: ${alasan || 'Tidak ada alasan'}`,
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
            userAgent: request.headers.get('user-agent') || undefined
        });

        return { success: true };
    }
};

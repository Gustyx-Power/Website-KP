import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user!;

    if (!user.tokoId) {
        return { distribusiList: [] };
    }

    // Get distributions for this store
    const distribusiList = await prisma.distribusi.findMany({
        where: {
            id_toko_tujuan: user.tokoId
        },
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
    confirmReceived: async ({ request, locals }) => {
        const user = locals.user!;
        const formData = await request.formData();
        const distribusiId = parseInt(formData.get('distribusiId') as string);

        const distribusi = await prisma.distribusi.findUnique({
            where: { id: distribusiId },
            include: { items: true }
        });

        if (!distribusi) {
            return fail(404, { error: 'Distribusi tidak ditemukan' });
        }

        if (distribusi.id_toko_tujuan !== user.tokoId) {
            return fail(403, { error: 'Anda tidak memiliki akses ke distribusi ini' });
        }

        if (distribusi.status !== 'DIKIRIM') {
            return fail(400, { error: 'Distribusi belum dikirim atau sudah diterima' });
        }

        // Update status to received
        await prisma.distribusi.update({
            where: { id: distribusiId },
            data: { 
                status: 'DITERIMA',
                keterangan: `Diterima oleh ${user.name} pada ${new Date().toLocaleString('id-ID')}`
            }
        });

        return { success: true };
    }
};

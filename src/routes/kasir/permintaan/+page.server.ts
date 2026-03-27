import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user!;

    // Get central warehouse
    const gudangPusat = await prisma.toko.findFirst({
        where: { is_pusat: true, isActive: true }
    });

    if (!gudangPusat) {
        return { stokPusat: [], toko: null, error: 'Gudang pusat tidak ditemukan' };
    }

    // Get available stock in central warehouse
    const stokPusat = await prisma.stok.findMany({
        where: { 
            id_toko: gudangPusat.id,
            jumlah: { gt: 0 } // Only show items with stock
        },
        include: { kategori: true },
        orderBy: { kategori: { nama_kategori: 'asc' } }
    });

    // Get user's store info
    const toko = user.tokoId ? await prisma.toko.findUnique({
        where: { id: user.tokoId }
    }) : null;

    // Get pending requests for this store
    const pendingRequests = user.tokoId ? await prisma.distribusi.findMany({
        where: {
            id_toko_tujuan: user.tokoId,
            status: 'PENDING'
        },
        include: {
            items: {
                include: { kategori: true }
            }
        },
        orderBy: { tanggal: 'desc' }
    }) : [];

    return { 
        stokPusat, 
        toko,
        pendingRequests
    };
};

export const actions: Actions = {
    request: async ({ request, locals }) => {
        const user = locals.user!;
        
        if (!user.tokoId) {
            return fail(400, { error: 'Anda belum ditugaskan ke toko manapun' });
        }

        const formData = await request.formData();
        const items = formData.get('items');
        const keterangan = formData.get('keterangan') as string;

        if (!items) {
            return fail(400, { error: 'Tidak ada item yang dipilih' });
        }

        const itemsData = JSON.parse(items as string);
        
        if (itemsData.length === 0) {
            return fail(400, { error: 'Pilih minimal 1 item' });
        }

        // Get central warehouse
        const gudangPusat = await prisma.toko.findFirst({
            where: { is_pusat: true, isActive: true }
        });

        if (!gudangPusat) {
            return fail(400, { error: 'Gudang pusat tidak ditemukan' });
        }

        // Validate stock availability
        for (const item of itemsData) {
            const stok = await prisma.stok.findUnique({
                where: {
                    id_toko_id_kategori: {
                        id_toko: gudangPusat.id,
                        id_kategori: item.id_kategori
                    }
                }
            });

            if (!stok || stok.jumlah < item.jumlah) {
                const kategori = await prisma.kategori.findUnique({
                    where: { id: item.id_kategori }
                });
                return fail(400, { 
                    error: `Stok ${kategori?.nama_kategori} tidak mencukupi. Tersedia: ${stok?.jumlah || 0}, Diminta: ${item.jumlah}` 
                });
            }
        }

        // Create distribution request
        const distribusi = await prisma.distribusi.create({
            data: {
                id_toko_asal: gudangPusat.id,
                id_toko_tujuan: user.tokoId,
                status: 'PENDING',
                keterangan: keterangan || 'Permintaan stok dari kasir',
                createdById: user.id,
                items: {
                    create: itemsData.map((item: any) => ({
                        id_kategori: item.id_kategori,
                        jumlah: item.jumlah
                    }))
                }
            }
        });

        throw redirect(303, '/kasir/permintaan?success=true');
    }
};

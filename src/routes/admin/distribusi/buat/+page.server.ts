import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Get central warehouse
    const gudangPusat = await prisma.toko.findFirst({
        where: { is_pusat: true, isActive: true }
    });

    if (!gudangPusat) {
        throw new Error('Gudang pusat tidak ditemukan');
    }

    // Get branch stores (not central warehouse)
    const tokoCabang = await prisma.toko.findMany({
        where: { 
            is_pusat: false, 
            isActive: true 
        },
        orderBy: { nama_toko: 'asc' }
    });

    // Get available stock from central warehouse
    const stokPusat = await prisma.stok.findMany({
        where: { 
            id_toko: gudangPusat.id,
            jumlah: { gt: 0 } // Only items with stock
        },
        include: { 
            kategori: true,
            toko: true
        },
        orderBy: { kategori: { nama_kategori: 'asc' } }
    });

    return { 
        gudangPusat,
        tokoCabang, 
        stokPusat,
        user: locals.user
    };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const data = await request.formData();
        const id_toko_tujuan = Number(data.get('id_toko_tujuan'));
        const keterangan = data.get('keterangan')?.toString() || '';
        
        // Parse items from form
        const items: Array<{ id_kategori: number; jumlah: number }> = [];
        
        // Get all form entries
        for (const [key, value] of data.entries()) {
            if (key.startsWith('jumlah_')) {
                const id_kategori = Number(key.replace('jumlah_', ''));
                const jumlah = Number(value);
                
                if (jumlah > 0) {
                    items.push({ id_kategori, jumlah });
                }
            }
        }

        // Validation
        if (!id_toko_tujuan || items.length === 0) {
            return fail(400, { 
                error: 'Pilih toko tujuan dan minimal 1 item untuk didistribusikan' 
            });
        }

        // Get central warehouse
        const gudangPusat = await prisma.toko.findFirst({
            where: { is_pusat: true, isActive: true }
        });

        if (!gudangPusat) {
            return fail(400, { error: 'Gudang pusat tidak ditemukan' });
        }

        // Validate stock availability
        for (const item of items) {
            const stok = await prisma.stok.findFirst({
                where: {
                    id_toko: gudangPusat.id,
                    id_kategori: item.id_kategori
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

        try {
            // Create distribution with items in a transaction
            await prisma.$transaction(async (tx) => {
                // Create distribution
                const distribusi = await tx.distribusi.create({
                    data: {
                        id_toko_asal: gudangPusat.id,
                        id_toko_tujuan,
                        status: 'DIKIRIM', // Auto-approve since created by admin
                        keterangan,
                        createdById: locals.user!.id
                    }
                });

                // Create distribution items and update stock
                for (const item of items) {
                    // Create distribution item
                    await tx.distribusiItem.create({
                        data: {
                            distribusiId: distribusi.id,
                            id_kategori: item.id_kategori,
                            jumlah: item.jumlah
                        }
                    });

                    // Reduce stock from central warehouse
                    await tx.stok.update({
                        where: {
                            id_toko_id_kategori: {
                                id_toko: gudangPusat.id,
                                id_kategori: item.id_kategori
                            }
                        },
                        data: {
                            jumlah: { decrement: item.jumlah }
                        }
                    });

                    // Add or update stock in branch store
                    const existingStok = await tx.stok.findFirst({
                        where: {
                            id_toko: id_toko_tujuan,
                            id_kategori: item.id_kategori
                        }
                    });

                    if (existingStok) {
                        await tx.stok.update({
                            where: { id: existingStok.id },
                            data: {
                                jumlah: { increment: item.jumlah }
                            }
                        });
                    } else {
                        // Get harga_modal from central warehouse
                        const stokPusat = await tx.stok.findFirst({
                            where: {
                                id_toko: gudangPusat.id,
                                id_kategori: item.id_kategori
                            }
                        });

                        await tx.stok.create({
                            data: {
                                id_toko: id_toko_tujuan,
                                id_kategori: item.id_kategori,
                                jumlah: item.jumlah,
                                harga_modal: stokPusat!.harga_modal
                            }
                        });
                    }
                }
            });

            throw redirect(303, '/admin/distribusi');
        } catch (error) {
            if (error instanceof Response) throw error;
            console.error('Error creating distribution:', error);
            return fail(500, { error: 'Gagal membuat distribusi' });
        }
    }
};

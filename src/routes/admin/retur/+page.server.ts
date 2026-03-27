import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    // Get all return requests with status
    const returList = await prisma.retur.findMany({
        include: { 
            toko: true, 
            kategori: true,
            createdBy: true
        },
        orderBy: { tanggal: 'desc' }
    });

    const toko = await prisma.toko.findMany({ where: { isActive: true } });
    const kategori = await prisma.kategori.findMany({ where: { isActive: true } });

    return { returList, toko, kategori };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
        const qty_retur = Number(data.get('qty_retur'));
        const keterangan = data.get('keterangan')?.toString() || null;
        const id_toko = Number(data.get('id_toko'));
        const id_kategori = Number(data.get('id_kategori'));

        if (isNaN(qty_retur) || !id_toko || !id_kategori) {
            return fail(400, { error: 'qty_retur, id_toko, and id_kategori are required' });
        }

		// Apply Prisma explicit transaction
		await prisma.$transaction([
			// 1. Insert Retur with DISETUJUI status (admin created)
			prisma.retur.create({
				data: {
					qty_retur,
					keterangan,
					id_toko,
					id_kategori,
					status: 'DISETUJUI',
					createdById: locals.user?.id || ''
				}
			}),
            // 2. Increment Stok at central warehouse
            prisma.stok.updateMany({
                where: { id_toko, id_kategori },
                data: {
                    jumlah: { increment: qty_retur }
                }
            })
        ]);

        return { success: true };
    },

	approve: async ({ request }) => {
		const formData = await request.formData();
		const returId = parseInt(formData.get('returId') as string);

		const retur = await prisma.retur.findUnique({
			where: { id: returId },
			include: { toko: true }
		});

		if (!retur) {
			return fail(404, { error: 'Retur tidak ditemukan' });
		}

		if (retur.status !== 'PENDING') {
			return fail(400, { error: 'Retur sudah diproses' });
		}

		// Get central warehouse
		const gudangPusat = await prisma.toko.findFirst({
			where: { is_pusat: true, isActive: true }
		});

		if (!gudangPusat) {
			return fail(400, { error: 'Gudang pusat tidak ditemukan' });
		}

		// Validate stock at branch store
		const stokCabang = await prisma.stok.findUnique({
			where: {
				id_toko_id_kategori: {
					id_toko: retur.id_toko,
					id_kategori: retur.id_kategori
				}
			}
		});

		if (!stokCabang || stokCabang.jumlah < retur.qty_retur) {
			return fail(400, { 
				error: `Stok di cabang tidak mencukupi. Tersedia: ${stokCabang?.jumlah || 0}, Diminta retur: ${retur.qty_retur}` 
			});
		}

		// Process return in transaction
		await prisma.$transaction(async (tx) => {
			// Update retur status
			await tx.retur.update({
				where: { id: returId },
				data: { status: 'DISETUJUI' }
			});

			// Reduce stock from branch store
			await tx.stok.update({
				where: {
					id_toko_id_kategori: {
						id_toko: retur.id_toko,
						id_kategori: retur.id_kategori
					}
				},
				data: {
					jumlah: { decrement: retur.qty_retur }
				}
			});

			// Add stock to central warehouse
			const existingStokPusat = await tx.stok.findUnique({
				where: {
					id_toko_id_kategori: {
						id_toko: gudangPusat.id,
						id_kategori: retur.id_kategori
					}
				}
			});

			if (existingStokPusat) {
				// Update existing stock
				await tx.stok.update({
					where: {
						id_toko_id_kategori: {
							id_toko: gudangPusat.id,
							id_kategori: retur.id_kategori
						}
					},
					data: {
						jumlah: { increment: retur.qty_retur }
					}
				});
			} else {
				// Create new stock entry (use same harga_modal as branch)
				await tx.stok.create({
					data: {
						id_toko: gudangPusat.id,
						id_kategori: retur.id_kategori,
						jumlah: retur.qty_retur,
						harga_modal: stokCabang.harga_modal
					}
				});
			}
		});

		return { success: true };
	},

	reject: async ({ request }) => {
		const formData = await request.formData();
		const returId = parseInt(formData.get('returId') as string);
		const alasan = formData.get('alasan') as string;

		const retur = await prisma.retur.findUnique({
			where: { id: returId }
		});

		if (!retur) {
			return fail(404, { error: 'Retur tidak ditemukan' });
		}

		if (retur.status !== 'PENDING') {
			return fail(400, { error: 'Retur sudah diproses' });
		}

		// Update status to rejected
		await prisma.retur.update({
			where: { id: returId },
			data: { 
				status: 'DITOLAK',
				keterangan: alasan ? `${retur.keterangan || ''}\n\nDITOLAK: ${alasan}`.trim() : retur.keterangan
			}
		});

		return { success: true };
	}
};

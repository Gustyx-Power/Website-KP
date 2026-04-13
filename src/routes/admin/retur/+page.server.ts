import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { createAuditLog } from '$lib/server/audit';
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

        // Get toko and kategori info for audit
        const toko = await prisma.toko.findUnique({ where: { id: id_toko } });
        const kategori = await prisma.kategori.findUnique({ where: { id: id_kategori } });

		// Apply Prisma explicit transaction
		const retur = await prisma.$transaction(async (tx) => {
            // 1. Insert Retur with DISETUJUI status (admin created)
            const newRetur = await tx.retur.create({
                data: {
                    qty_retur,
                    keterangan,
                    id_toko,
                    id_kategori,
                    status: 'DISETUJUI',
                    createdById: locals.user?.id || ''
                }
            });
            
            // 2. Increment Stok at central warehouse
            await tx.stok.updateMany({
                where: { id_toko, id_kategori },
                data: {
                    jumlah: { increment: qty_retur }
                }
            });
            
            return newRetur;
        });

        // Create audit log
        await createAuditLog({
            userId: locals.user?.id || '',
            userName: locals.user?.name || 'Unknown',
            userRole: locals.user?.role || 'ADMIN',
            action: 'RETUR_CREATE',
            entity: 'RETUR',
            entityId: retur.id.toString(),
            tokoId: id_toko,
            tokoName: toko?.nama_toko,
            kategoriId: id_kategori,
            kategoriName: kategori?.nama_kategori,
            newValue: { qty_retur, keterangan, status: 'DISETUJUI' },
            description: `Membuat retur ${qty_retur} unit ${kategori?.nama_kategori} dari ${toko?.nama_toko}${keterangan ? `. Keterangan: ${keterangan}` : ''}`,
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
            userAgent: request.headers.get('user-agent') || undefined
        });

        return { success: true };
    },

	approve: async ({ request, locals }) => {
		const formData = await request.formData();
		const returId = parseInt(formData.get('returId') as string);

		const retur = await prisma.retur.findUnique({
			where: { id: returId },
			include: { toko: true, kategori: true }
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

		// Create audit log
		await createAuditLog({
			userId: locals.user?.id || '',
			userName: locals.user?.name || 'Unknown',
			userRole: locals.user?.role || 'ADMIN',
			action: 'RETUR_APPROVE',
			entity: 'RETUR',
			entityId: returId.toString(),
			tokoId: retur.id_toko,
			tokoName: retur.toko?.nama_toko,
			kategoriId: retur.id_kategori,
			kategoriName: retur.kategori?.nama_kategori,
			oldValue: { status: 'PENDING' },
			newValue: { status: 'DISETUJUI', qty_retur: retur.qty_retur },
			description: `Menyetujui retur ${retur.qty_retur} unit ${retur.kategori?.nama_kategori} dari ${retur.toko?.nama_toko} ke ${gudangPusat.nama_toko}`,
			ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
			userAgent: request.headers.get('user-agent') || undefined
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

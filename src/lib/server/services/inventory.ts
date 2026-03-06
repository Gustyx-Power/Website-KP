import { prisma } from '$lib/server/prisma';
import type { Prisma } from '@prisma/client';

export type DistribusiItemInput = {
	id_kategori: number;
	jumlah: number;
};

/**
 * Mendistribusikan barang dari Gudang Pusat ke Toko Cabang secara ACID.
 * 1. Mengecek ketersediaan stok di gudang asal.
 * 2. Mengurangi stok gudang asal.
 * 3. Menambahkan stok ke toko tujuan (atau membuat record baru jika belum ada).
 * 4. Mencatat log mutasi Distribusi dan Item Distribusi.
 */
export async function distribusiBarang({
	id_toko_asal,
	id_toko_tujuan,
	items,
	keterangan,
	createdById
}: {
	id_toko_asal: number;
	id_toko_tujuan: number;
	items: DistribusiItemInput[];
	keterangan?: string;
	createdById: string;
}) {
	// Pastikan toko tujuan bukan pusat (ini asumsi bisnis, biasanya pusat ke cabang)
	const tokoTujuan = await prisma.toko.findUnique({ where: { id: id_toko_tujuan } });
	if (!tokoTujuan || !tokoTujuan.isActive) {
		throw new Error('Toko tujuan tidak valid atau tidak aktif.');
	}

	return await prisma.$transaction(async (tx) => {
		// 1. Validasi & Kurangi Stok Asal
		for (const item of items) {
			const stokAsal = await tx.stok.findUnique({
				where: {
					id_toko_id_kategori: {
						id_toko: id_toko_asal,
						id_kategori: item.id_kategori
					}
				}
			});

			if (!stokAsal || stokAsal.jumlah < item.jumlah) {
				throw new Error(`Stok kategori ID ${item.id_kategori} di gudang asal tidak mencukupi.`);
			}

			// Kurangi stok asal
			await tx.stok.update({
				where: { id: stokAsal.id },
				data: { jumlah: stokAsal.jumlah - item.jumlah }
			});

			// 2. Tambah Stok Tujuan (Upsert)
			await tx.stok.upsert({
				where: {
					id_toko_id_kategori: {
						id_toko: id_toko_tujuan,
						id_kategori: item.id_kategori
					}
				},
				create: {
					id_toko: id_toko_tujuan,
					id_kategori: item.id_kategori,
					jumlah: item.jumlah,
					harga_modal: stokAsal.harga_modal // bawa HPP yang sama 
				},
				update: {
					jumlah: { increment: item.jumlah }
				}
			});
		}

		// 3. Catat Riwayat Mutasi Distribusi (Terkirim otomatis karena ini dari Admin)
		const logDistribusi = await tx.distribusi.create({
			data: {
				id_toko_asal,
				id_toko_tujuan,
				status: 'DITERIMA', // Asumsi langsung aktif (bisa diubah sesuai bisnis flow)
				keterangan,
				createdById,
				items: {
					create: items.map((itm) => ({
						id_kategori: itm.id_kategori,
						jumlah: itm.jumlah
					}))
				}
			}
		});

		return logDistribusi;
	});
}

/**
 * Mencatat penjualan kasir.
 * 1. Validasi ketersediaan stok cabang.
 * 2. Kurangi stok cabang.
 * 3. Catat omzet penjualan.
 */
export async function catatPenjualanHarian({
	id_toko,
	items,
	createdById
}: {
	id_toko: number;
	items: { id_kategori: number; qty: number; harga_jual: number }[];
	createdById: string;
}) {
	return await prisma.$transaction(async (tx) => {
		const result = [];

		for (const item of items) {
			// Cek stok
			const stok = await tx.stok.findUnique({
				where: {
					id_toko_id_kategori: {
						id_toko,
						id_kategori: item.id_kategori
					}
				}
			});

			if (!stok || stok.jumlah < item.qty) {
				throw new Error(`Stok untuk kategori ID ${item.id_kategori} di toko ini tidak mencukupi.`);
			}

			// Kurangi
			await tx.stok.update({
				where: { id: stok.id },
				data: { jumlah: stok.jumlah - item.qty }
			});

			// Tambah Log Penjualan
			const logPenjualan = await tx.penjualan.create({
				data: {
					qty_terjual: item.qty,
					harga_jual: item.harga_jual,
					total_uang: item.qty * item.harga_jual,
					id_toko,
					id_kategori: item.id_kategori,
					createdById
				}
			});

			result.push(logPenjualan);
		}

		return result;
	});
}

/**
 * Mengajukan Retur oleh Kasir (HANYA PENCATATAN, BELUM MENGURANGI STOK)
 */
export async function ajukanRetur({
	id_toko,
	id_kategori,
	qty,
	keterangan,
	createdById
}: {
	id_toko: number;
	id_kategori: number;
	qty: number;
	keterangan?: string;
	createdById: string;
}) {
	// Cek apakah stok fisik mumpuni untuk diretur
	const stokFisik = await prisma.stok.findUnique({
		where: { id_toko_id_kategori: { id_toko, id_kategori } }
	});

	if (!stokFisik || stokFisik.jumlah < qty) {
		throw new Error('Stok fisik tidak mencukupi untuk melakukan retur jumlah ini.');
	}

	return await prisma.retur.create({
		data: {
			qty_retur: qty,
			keterangan,
			status: 'PENDING',
			id_toko,
			id_kategori,
			createdById
		}
	});
}

/**
 * Admin menyetujui retur. STOK Cabang dikurangi.
 * Optionally STOK Pusat ditambah (jika barang cacat, mungkin tidak ditambah ke stok jual lagi, namun dibuang. Anggap tambah ke gudang pusat untuk disortir).
 */
export async function setujuiRetur({
	id_retur,
	id_gudang_pusat
}: {
	id_retur: number;
	id_gudang_pusat: number;
}) {
	return await prisma.$transaction(async (tx) => {
		const retur = await tx.retur.findUnique({ where: { id: id_retur } });
		if (!retur) throw new Error('Data retur tidak ditemukan.');
		if (retur.status !== 'PENDING') throw new Error('Retur ini sudah diproses sebelumnya.');

		// 1. Kurangi stok toko cabang
		const stokCabang = await tx.stok.findUnique({
			where: {
				id_toko_id_kategori: {
					id_toko: retur.id_toko,
					id_kategori: retur.id_kategori
				}
			}
		});

		if (!stokCabang || stokCabang.jumlah < retur.qty_retur) {
			throw new Error('Stok cabang sudah kurang dari jumlah retur yang diminta (kemungkinan sudah terjual/terubah).');
		}

		await tx.stok.update({
			where: { id: stokCabang.id },
			data: { jumlah: stokCabang.jumlah - retur.qty_retur }
		});

		// 2. Tambahkan ke gudang pusat (Kembalikan ke HPP Gudang)
		await tx.stok.upsert({
			where: {
				id_toko_id_kategori: {
					id_toko: id_gudang_pusat,
					id_kategori: retur.id_kategori
				}
			},
			create: {
				id_toko: id_gudang_pusat,
				id_kategori: retur.id_kategori,
				jumlah: retur.qty_retur,
				harga_modal: stokCabang.harga_modal // Kembalikan nilai valuasi aset
			},
			update: {
				jumlah: { increment: retur.qty_retur }
			}
		});

		// 3. Mark As Approved
		return await tx.retur.update({
			where: { id: id_retur },
			data: { status: 'DISETUJUI' }
		});
	});
}

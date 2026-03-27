<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	
	export let data: PageData;
	export let form;

	let selectedToko = '';
	let selectedItems: Record<number, number> = {};
	let keterangan = '';
	let isSubmitting = false;

	function formatRupiah(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function toggleItem(kategoriId: number) {
		if (selectedItems[kategoriId]) {
			delete selectedItems[kategoriId];
		} else {
			selectedItems[kategoriId] = 1;
		}
		selectedItems = { ...selectedItems };
	}

	function updateQuantity(kategoriId: number, value: number, maxStock: number) {
		if (value > 0 && value <= maxStock) {
			selectedItems[kategoriId] = value;
		} else if (value > maxStock) {
			selectedItems[kategoriId] = maxStock;
		}
		selectedItems = { ...selectedItems };
	}

	$: totalItems = Object.keys(selectedItems).length;
	$: totalQuantity = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
	$: totalValue = Object.entries(selectedItems).reduce((sum, [kategoriId, qty]) => {
		const stok = data.stokPusat.find(s => s.id_kategori === Number(kategoriId));
		return sum + (stok ? stok.harga_modal * qty : 0);
	}, 0);
</script>

<svelte:head>
	<title>Buat Distribusi Baru - Inventory Hub</title>
</svelte:head>

<!-- Breadcrumb -->
<div class="mb-6">
	<div class="flex items-center gap-2 text-sm text-[#5f6b6f]" style="font-family: 'Inter', sans-serif;">
		<a href="/admin" class="hover:text-[#306677]">Halaman Utama</a>
		<span>›</span>
		<a href="/admin/distribusi" class="hover:text-[#306677]">Distribusi</a>
		<span>›</span>
		<span class="text-[#2c3437] font-medium">Buat Distribusi Baru</span>
	</div>
</div>

<!-- Header Section -->
<div class="mb-8">
	<h1 class="text-4xl font-bold text-[#2c3437] mb-2" style="font-family: 'Manrope', sans-serif;">
		Buat Distribusi Baru
	</h1>
	<p class="text-[#5f6b6f] text-base max-w-2xl">
		Distribusikan stok dari gudang pusat ke toko cabang. Pastikan jumlah yang didistribusikan sesuai dengan kebutuhan cabang.
	</p>
</div>

{#if form?.error}
	<div class="mb-6 p-4 bg-[#ffdad6] border-l-4 border-[#ba1a1a] rounded-lg">
		<p class="text-sm text-[#410002] font-medium">{form.error}</p>
	</div>
{/if}

<form method="POST" action="?/create" use:enhance={() => {
	isSubmitting = true;
	return async ({ update }) => {
		await update();
		isSubmitting = false;
	};
}}>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Left Column - Form -->
		<div class="lg:col-span-1 space-y-6">
			<!-- Warehouse Info -->
			<div class="bg-[#ffffff] rounded-xl p-6">
				<div class="flex items-center gap-3 mb-4">
					<div class="w-12 h-12 rounded-lg bg-[#d1e4ea] flex items-center justify-center">
						<svg class="w-6 h-6 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
						</svg>
					</div>
					<div>
						<h2 class="text-lg font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">Gudang Asal</h2>
					</div>
				</div>
				<div class="p-4 bg-[#f0f4f7] rounded-lg">
					<p class="text-sm font-semibold text-[#2c3437]">{data.gudangPusat.nama_toko}</p>
					<p class="text-xs text-[#5f6b6f] mt-1">{data.gudangPusat.alamat || '-'}</p>
					<span class="inline-block mt-2 px-2 py-1 bg-[#d1e4ea] text-[#306677] rounded text-xs font-semibold uppercase">Gudang Pusat</span>
				</div>
			</div>

			<!-- Destination Store -->
			<div class="bg-[#ffffff] rounded-xl p-6">
				<div class="flex items-center gap-3 mb-4">
					<div class="w-12 h-12 rounded-lg bg-[#d1e4ea] flex items-center justify-center">
						<svg class="w-6 h-6 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
						</svg>
					</div>
					<div>
						<h2 class="text-lg font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">Toko Tujuan</h2>
					</div>
				</div>

				<label class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">PILIH TOKO CABANG</label>
				<select
					name="id_toko_tujuan"
					bind:value={selectedToko}
					required
					class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
				>
					<option value="" disabled>-- Pilih Toko Cabang --</option>
					{#each data.tokoCabang as toko}
						<option value={toko.id}>{toko.nama_toko}</option>
					{/each}
				</select>

				<div class="mt-4">
					<label class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">KETERANGAN (OPSIONAL)</label>
					<textarea
						name="keterangan"
						bind:value={keterangan}
						rows="3"
						placeholder="Catatan tambahan untuk distribusi ini..."
						class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none resize-none"
					></textarea>
				</div>
			</div>

			<!-- Summary -->
			<div class="bg-[#ffffff] rounded-xl p-6">
				<h3 class="text-sm font-bold text-[#2c3437] mb-4 uppercase tracking-wider">Ringkasan</h3>
				<div class="space-y-3">
					<div class="flex justify-between items-center">
						<span class="text-sm text-[#5f6b6f]">Total Item</span>
						<span class="text-sm font-bold text-[#2c3437]">{totalItems}</span>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-sm text-[#5f6b6f]">Total Kuantitas</span>
						<span class="text-sm font-bold text-[#2c3437]">{totalQuantity} pcs</span>
					</div>
					<div class="h-px bg-[#e4e9ed]"></div>
					<div class="flex justify-between items-center">
						<span class="text-sm font-semibold text-[#2c3437]">Total Nilai Modal</span>
						<span class="text-lg font-bold text-[#306677]" style="font-family: 'Manrope', sans-serif;">
							{formatRupiah(totalValue)}
						</span>
					</div>
				</div>

				<button
					type="submit"
					disabled={isSubmitting || !selectedToko || totalItems === 0}
					class="w-full mt-6 py-3 bg-gradient-to-r from-[#306677] to-[#225a6a] text-white rounded-md text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{#if isSubmitting}
						<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Memproses...
					{:else}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
						</svg>
						Buat Distribusi
					{/if}
				</button>
			</div>
		</div>

		<!-- Right Column - Stock Selection -->
		<div class="lg:col-span-2">
			<div class="bg-[#ffffff] rounded-xl p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-lg font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">Pilih Produk untuk Didistribusikan</h2>
					<span class="text-sm text-[#5f6b6f]">{data.stokPusat.length} produk tersedia</span>
				</div>

				{#if data.stokPusat.length === 0}
					<div class="py-12 text-center">
						<svg class="w-16 h-16 mx-auto text-[#acb3b7] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
						</svg>
						<p class="text-[#5f6b6f]">Tidak ada stok tersedia di gudang pusat</p>
					</div>
				{:else}
					<div class="space-y-2">
						{#each data.stokPusat as stok}
							<div class="p-4 rounded-lg border-2 transition-all {selectedItems[stok.id_kategori] ? 'border-[#306677] bg-[#d1e4ea]/20' : 'border-[#e4e9ed] hover:border-[#acb3b7]'}">
								<div class="flex items-center gap-4">
									<input
										type="checkbox"
										checked={!!selectedItems[stok.id_kategori]}
										on:change={() => toggleItem(stok.id_kategori)}
										class="w-5 h-5 text-[#306677] rounded border-[#acb3b7] focus:ring-[#306677]"
									/>
									
									<div class="flex-1 min-w-0">
										<p class="text-sm font-semibold text-[#2c3437]">{stok.kategori.nama_kategori}</p>
										<div class="flex items-center gap-3 mt-1">
											<span class="text-xs text-[#5f6b6f]">Stok: <span class="font-semibold text-[#2c3437]">{stok.jumlah}</span> pcs</span>
											<span class="text-xs text-[#5f6b6f]">•</span>
											<span class="text-xs text-[#5f6b6f]">Modal: <span class="font-semibold text-[#2c3437]">{formatRupiah(stok.harga_modal)}</span>/pcs</span>
										</div>
									</div>

									{#if selectedItems[stok.id_kategori]}
										<div class="flex items-center gap-2">
											<button
												type="button"
												on:click={() => updateQuantity(stok.id_kategori, selectedItems[stok.id_kategori] - 1, stok.jumlah)}
												class="w-8 h-8 rounded-md bg-[#e4e9ed] hover:bg-[#d8dfe8] flex items-center justify-center transition-colors"
											>
												<svg class="w-4 h-4 text-[#2c3437]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
												</svg>
											</button>
											<input
												type="number"
												name="jumlah_{stok.id_kategori}"
												value={selectedItems[stok.id_kategori]}
												on:input={(e) => updateQuantity(stok.id_kategori, Number(e.currentTarget.value), stok.jumlah)}
												min="1"
												max={stok.jumlah}
												class="w-20 px-3 py-2 bg-[#e4e9ed] text-[#2c3437] text-center rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
											/>
											<button
												type="button"
												on:click={() => updateQuantity(stok.id_kategori, selectedItems[stok.id_kategori] + 1, stok.jumlah)}
												class="w-8 h-8 rounded-md bg-[#e4e9ed] hover:bg-[#d8dfe8] flex items-center justify-center transition-colors"
											>
												<svg class="w-4 h-4 text-[#2c3437]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
												</svg>
											</button>
										</div>
										<div class="text-right min-w-[120px]">
											<p class="text-sm font-bold text-[#306677]">
												{formatRupiah(stok.harga_modal * selectedItems[stok.id_kategori])}
											</p>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</form>

<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	function formatRupiah(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	// Calculate metrics
	$: totalStockValue = data.stok.reduce((sum, item) => sum + (item.harga_modal * item.jumlah), 0);
	$: criticalStock = data.stok.filter(item => item.jumlah < 10).length;
	$: totalItems = data.stok.length;
	
	// Calculate percentage change (simplified - comparing current vs average)
	$: averageItemValue = totalItems > 0 ? totalStockValue / totalItems : 0;
	$: stockGrowthPercentage = averageItemValue > 0 ? ((totalStockValue / (averageItemValue * Math.max(1, totalItems - 5))) * 100 - 100).toFixed(1) : 0;
</script>

<svelte:head>
	<title>Inbound Stok Pusat - Inventory Hub</title>
</svelte:head>

<!-- Breadcrumb -->
<div class="mb-6">
	<div class="flex items-center gap-2 text-sm text-[#5f6b6f]" style="font-family: 'Inter', sans-serif;">
		<span>Inventory</span>
		<span>›</span>
		<span class="text-[#2c3437] font-medium">Inbound Stock</span>
	</div>
</div>

<!-- Header Section -->
<div class="mb-8">
	<h1 class="text-4xl font-bold text-[#2c3437] mb-2" style="font-family: 'Manrope', sans-serif;">
		Inbound Stok Pusat
	</h1>
	<p class="text-[#5f6b6f] text-base max-w-2xl">
		Daftarkan dan validasi kedatangan inventaris baru di gudang pusat. Pastikan semua nilai modal diperbarui untuk perhitungan margin yang akurat.
	</p>
</div>

<!-- Action Buttons -->
<div class="flex gap-3 mb-8">
	<button class="px-5 py-2.5 bg-[#ffffff] text-[#2c3437] rounded-md text-sm font-semibold hover:bg-[#e4e9ed] transition-all flex items-center gap-2">
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
		</svg>
		Ekspor CSV
	</button>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
	<!-- Left Column - Form -->
	<div class="lg:col-span-1">
		<div class="bg-[#ffffff] rounded-xl p-6">
			<div class="flex items-center gap-3 mb-6">
				<div class="w-12 h-12 rounded-lg bg-[#d1e4ea] flex items-center justify-center">
					<svg class="w-6 h-6 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</div>
				<div>
					<h2 class="text-lg font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">Tambah Stok Masuk</h2>
				</div>
			</div>

			<form method="POST" action="?/create" class="space-y-4">
				<div>
					<label class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">PILIH GUDANG PUSAT</label>
					<select
						id="id_toko"
						name="id_toko"
						required
						class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
					>
						<option value="" disabled selected>-- Pilih Gudang --</option>
						{#each data.toko as t}
							<option value={t.id}>{t.nama_toko}</option>
						{/each}
					</select>
				</div>

				<div>
					<label class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">KATEGORI</label>
					<select
						id="id_kategori"
						name="id_kategori"
						required
						class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
					>
						<option value="" disabled selected>-- Pilih Kategori --</option>
						{#each data.kategori as k}
							<option value={k.id}>{k.nama_kategori}</option>
						{/each}
					</select>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">JUMLAH</label>
						<input
							type="number"
							id="jumlah"
							name="jumlah"
							min="0"
							required
							placeholder="0"
							class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
						/>
					</div>
					<div>
						<label class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">UNIT</label>
						<input
							type="text"
							value="pcs"
							readonly
							class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#5f6b6f] rounded-md text-sm border-none outline-none"
						/>
					</div>
				</div>

				<div>
					<label class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">HARGA MODAL (RP)</label>
					<div class="relative">
						<span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6b6f] text-sm">Rp</span>
						<input
							type="number"
							id="harga_modal"
							name="harga_modal"
							min="0"
							required
							placeholder="0"
							class="w-full pl-10 pr-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
						/>
					</div>
				</div>

				<button
					type="submit"
					class="w-full py-3 bg-[#306677] text-white rounded-md text-sm font-semibold hover:bg-[#225a6a] transition-colors flex items-center justify-center gap-2"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
					</svg>
					Simpan Ke Gudang
				</button>
			</form>

			<!-- Pro Tip -->
			<div class="mt-6 p-4 bg-[#d1e4ea]/30 rounded-lg">
				<div class="flex gap-3">
					<div class="w-6 h-6 rounded-full bg-[#306677] flex items-center justify-center shrink-0">
						<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<p class="text-sm font-semibold text-[#2c3437] mb-1">Pro Tip</p>
						<p class="text-xs text-[#5f6b6f] leading-relaxed">
							Pastikan Anda telah mengecek ulang harga modal. Setelah disimpan, nilai stok akan langsung mempengaruhi neraca keuangan Anda.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Right Column - Logs -->
	<div class="lg:col-span-2">
		<div class="bg-[#ffffff] rounded-xl p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">Recent Inventory Logs</h2>
				<div class="flex items-center gap-2">
					<button class="w-8 h-8 rounded-lg hover:bg-[#e4e9ed] flex items-center justify-center transition-colors">
						<svg class="w-5 h-5 text-[#5f6b6f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
						</svg>
					</button>
					<button class="w-8 h-8 rounded-lg hover:bg-[#e4e9ed] flex items-center justify-center transition-colors">
						<svg class="w-5 h-5 text-[#5f6b6f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
						</svg>
					</button>
				</div>
			</div>

			<!-- Table Header -->
			<div class="grid grid-cols-12 gap-4 px-4 py-3 bg-[#f0f4f7] rounded-lg mb-2 text-xs font-semibold text-[#5f6b6f] uppercase tracking-wider">
				<div class="col-span-2">ID Log</div>
				<div class="col-span-3">Cabang/Gudang</div>
				<div class="col-span-3">Kategori Produk</div>
				<div class="col-span-2">Sisa Fisik Stok</div>
				<div class="col-span-2">Harga Modal</div>
			</div>

			<!-- Table Rows -->
			<div class="space-y-2">
				{#each data.stok as item}
					<div class="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-[#f0f4f7] rounded-lg transition-colors items-center">
						<div class="col-span-2">
							<p class="text-sm text-[#5f6b6f] font-mono">#{item.id.toString().padStart(4, '0')}</p>
						</div>
						<div class="col-span-3">
							<div class="flex items-center gap-2">
								<span class="px-2 py-1 bg-{item.toko.is_pusat ? '[#d1e4ea]' : '[#d8dfe8]'} text-{item.toko.is_pusat ? '[#306677]' : '[#506076]'} rounded text-xs font-semibold uppercase">
									{item.toko.is_pusat ? 'PUSAT' : 'CABANG'}
								</span>
								<span class="text-sm font-semibold text-[#2c3437] truncate">
									{item.toko.nama_toko}
								</span>
							</div>
						</div>
						<div class="col-span-3">
							<p class="text-sm font-semibold text-[#2c3437]">{item.kategori.nama_kategori}</p>
						</div>
						<div class="col-span-2">
							<p class="text-sm font-bold text-[#2c3437]">{item.jumlah}</p>
							<p class="text-xs text-[#5f6b6f]">pcs</p>
						</div>
						<div class="col-span-2">
							<p class="text-sm font-bold text-[#2c3437]">{formatRupiah(item.harga_modal)}</p>
						</div>
					</div>
				{:else}
					<div class="py-12 text-center">
						<svg class="w-16 h-16 mx-auto text-[#acb3b7] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
						</svg>
						<p class="text-[#5f6b6f]">Belum ada data stok</p>
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if data.stok.length > 0}
				<div class="flex items-center justify-between mt-6 pt-4 border-t border-[#e4e9ed]">
					<p class="text-sm text-[#5f6b6f]">Showing 1 to {data.stok.length} of {data.stok.length} entries</p>
					<div class="flex gap-2">
						<button class="w-8 h-8 rounded-lg bg-[#306677] text-white flex items-center justify-center text-sm font-semibold">1</button>
						<button class="w-8 h-8 rounded-lg hover:bg-[#e4e9ed] text-[#5f6b6f] flex items-center justify-center text-sm font-semibold transition-colors">2</button>
						<button class="w-8 h-8 rounded-lg hover:bg-[#e4e9ed] text-[#5f6b6f] flex items-center justify-center text-sm font-semibold transition-colors">3</button>
						<button class="w-8 h-8 rounded-lg hover:bg-[#e4e9ed] text-[#5f6b6f] flex items-center justify-center transition-colors">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Metrics Cards -->
<div class="grid grid-cols-4 gap-6 mt-6">
	<div class="bg-[#ffffff] rounded-xl p-6">
		<p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-2">Total Nilai Stok</p>
		<p class="text-3xl font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">
			{formatRupiah(totalStockValue)}
		</p>
		<p class="text-xs text-[#3f6754]">
			{#if Number(stockGrowthPercentage) > 0}
				+{stockGrowthPercentage}% dari rata-rata
			{:else if Number(stockGrowthPercentage) < 0}
				{stockGrowthPercentage}% dari rata-rata
			{:else}
				Stabil
			{/if}
		</p>
	</div>

	<div class="bg-[#ffffff] rounded-xl p-6">
		<p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-2">Stok Kritis</p>
		<p class="text-3xl font-bold text-{criticalStock > 0 ? '[#ba1a1a]' : '[#3f6754]'} mb-1" style="font-family: 'Manrope', sans-serif;">
			{criticalStock}
		</p>
		<p class="text-xs text-[#5f6b6f]">
			{criticalStock > 0 ? 'Perlu restock segera' : 'Semua stok aman'}
		</p>
	</div>

	<div class="bg-[#ffffff] rounded-xl p-6">
		<p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-2">Total Item Stok</p>
		<p class="text-3xl font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">
			{data.itemsInboundToday.toLocaleString('id-ID')}
		</p>
		<p class="text-xs text-[#5f6b6f]">Dari {data.activeWarehouses} gudang aktif</p>
	</div>

	<div class="bg-[#ffffff] rounded-xl p-6">
		<p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-2">Tingkat Efisiensi</p>
		<p class="text-3xl font-bold text-[#306677] mb-1" style="font-family: 'Manrope', sans-serif;">
			{data.efficiencyRate}%
		</p>
		<p class="text-xs text-[#5f6b6f]">Akurasi validasi stok</p>
	</div>
</div>
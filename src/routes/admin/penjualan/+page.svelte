<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Manajemen Penjualan - Inventory Hub</title>
</svelte:head>

<!-- Breadcrumb -->
<div class="mb-6">
	<div class="flex items-center gap-2 text-sm text-[#5f6b6f]" style="font-family: 'Inter', sans-serif;">
		<span>Operasional</span>
		<span>›</span>
		<span class="text-[#2c3437] font-medium">Penjualan</span>
	</div>
</div>

<!-- Header -->
<div class="mb-6 lg:mb-8">
	<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2c3437] mb-2" style="font-family: 'Manrope', sans-serif;">
		Manajemen Penjualan
	</h1>
	<p class="text-[#5f6b6f] text-sm md:text-base">
		Catat transaksi penjualan dan kurangi stok otomatis.
	</p>
</div>

<div class="bg-[#ffffff] rounded-xl p-5 md:p-6 mb-6 lg:mb-8">
	<div class="flex items-center gap-3 mb-5 md:mb-6">
		<div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#d1e4ea] flex items-center justify-center">
			<svg class="w-5 h-5 md:w-6 md:h-6 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
		</div>
		<div>
			<h2 class="text-base md:text-lg font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">Input Penjualan Baru</h2>
		</div>
	</div>
	<form method="POST" action="?/create" class="space-y-4">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="id_toko" class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">Toko *</label>
				<select
					id="id_toko"
					name="id_toko"
					required
					class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
				>
					<option value="" disabled selected>-- Pilih Toko --</option>
					{#each data.toko as t}
						<option value={t.id}>{t.nama_toko}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="id_kategori" class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">Kategori Produk *</label>
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
			<div>
				<label for="qty_terjual" class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">Qty Terjual *</label>
				<input
					type="number"
					id="qty_terjual"
					name="qty_terjual"
					min="1"
					required
					placeholder="0"
					class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
				/>
			</div>
			<div>
				<label for="total_uang" class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">Total Uang (Rp) *</label>
				<div class="relative">
					<span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6b6f] text-sm">Rp</span>
					<input
						type="number"
						id="total_uang"
						name="total_uang"
						min="0"
						required
						placeholder="0"
						class="w-full pl-10 pr-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
					/>
				</div>
			</div>
		</div>
		<div class="flex justify-end mt-6">
			<button
				type="submit"
				class="w-full md:w-auto px-6 py-3 bg-[#306677] text-white font-semibold rounded-md hover:bg-[#225a6a] transition-colors text-sm"
			>
				Simpan Penjualan
			</button>
		</div>
	</form>
</div>

<div class="bg-[#ffffff] rounded-xl overflow-hidden">
	<!-- Desktop Table View -->
	<div class="hidden md:block overflow-x-auto">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-[#f0f4f7]">
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider">ID</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider">Toko</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider">Kategori</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider text-right">Qty Terjual</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider text-right">Total Uang</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[#e4e9ed]">
				{#each data.penjualan as item}
					<tr class="hover:bg-[#f0f4f7] transition-colors">
						<td class="py-4 px-6 text-sm text-[#5f6b6f] font-mono">#{item.id}</td>
						<td class="py-4 px-6 font-semibold text-[#2c3437]">{item.toko.nama_toko}</td>
						<td class="py-4 px-6 text-sm text-[#5f6b6f]">{item.kategori.nama_kategori}</td>
						<td class="py-4 px-6 text-right font-semibold text-[#2c3437]">{item.qty_terjual} <span class="text-xs text-[#5f6b6f] font-normal">pcs</span></td>
						<td class="py-4 px-6 text-right font-semibold text-[#2c3437]">Rp {item.total_uang.toLocaleString('id-ID')}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="py-12 text-center text-[#5f6b6f]">Belum ada data penjualan.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Mobile Card View -->
	<div class="md:hidden p-4 space-y-4">
		{#each data.penjualan as item}
			<div class="bg-[#f0f4f7] rounded-lg p-4">
				<div class="flex items-start justify-between mb-3">
					<div class="flex-1">
						<p class="text-xs text-[#5f6b6f] font-mono mb-1">#{item.id}</p>
						<h3 class="font-bold text-[#2c3437] text-base mb-1">{item.toko.nama_toko}</h3>
						<p class="text-sm text-[#5f6b6f]">{item.kategori.nama_kategori}</p>
					</div>
				</div>
				
				<div class="grid grid-cols-2 gap-3 pt-3 border-t border-[#e4e9ed]">
					<div>
						<p class="text-xs text-[#5f6b6f] uppercase tracking-wider font-semibold mb-1">Qty Terjual</p>
						<p class="text-base font-bold text-[#2c3437]">{item.qty_terjual} <span class="text-xs font-normal text-[#5f6b6f]">pcs</span></p>
					</div>
					<div>
						<p class="text-xs text-[#5f6b6f] uppercase tracking-wider font-semibold mb-1">Total Uang</p>
						<p class="text-base font-bold text-[#2c3437]">Rp {item.total_uang.toLocaleString('id-ID')}</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="py-12 text-center text-[#5f6b6f]">
				<svg class="w-16 h-16 mx-auto text-[#acb3b7] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<p>Belum ada data penjualan.</p>
			</div>
		{/each}
	</div>
</div>

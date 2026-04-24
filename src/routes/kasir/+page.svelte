<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	
	// Quick calc
	$: totalItems = data.stoks.reduce((acc, curr) => acc + curr.jumlah, 0);
</script>

<svelte:head>
	<title>Sisa Stok Cabang - IMD Clothes</title>
</svelte:head>

<div class="mb-6 md:mb-8">
	<h1 class="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight" style="font-family: 'Manrope', sans-serif;">
		Sisa Stok Fisik
	</h1>
	<p class="text-slate-500 text-sm md:text-base mt-1 md:mt-2">Status stok aktual di toko Anda saat ini.</p>
</div>

<!-- Total Stock Card -->
<div class="bg-[#ffffff] rounded-xl p-5 md:p-6 mb-6">
	<div class="w-10 h-10 rounded-lg bg-[#d1e4ea] flex items-center justify-center mb-3">
		<svg class="w-5 h-5 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
		</svg>
	</div>
	<p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-1">TOTAL STOK BAJU KESELURUHAN</p>
	<p class="text-3xl md:text-4xl font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">
		{totalItems.toLocaleString('id-ID')}
	</p>
	<p class="text-xs text-[#5f6b6f]">Unit Tersedia</p>
</div>

<h3 class="text-base font-bold text-[#2c3437] mb-4" style="font-family: 'Manrope', sans-serif;">Rincian Per Kategori</h3>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
	{#each data.stoks as stok}
		<div class="bg-[#ffffff] rounded-xl p-5">
			<div class="w-10 h-10 rounded-lg bg-[#d1e4ea] flex items-center justify-center mb-3">
				<svg class="w-5 h-5 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
				</svg>
			</div>
			<p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-1 truncate">{stok.kategori.nama_kategori}</p>
			<p class="text-2xl md:text-3xl font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">
				{stok.jumlah.toLocaleString('id-ID')}
			</p>
			<p class="text-xs text-[#5f6b6f]">Unit</p>
		</div>
	{:else}
		{#if data.user.tokoId}
			<div class="col-span-full bg-white rounded-xl p-8 text-center border border-slate-200">
				<svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
				</svg>
				<p class="text-[#5f6b6f]">Belum ada stok yang dialokasikan ke toko ini.</p>
			</div>
		{/if}
	{/each}
</div>

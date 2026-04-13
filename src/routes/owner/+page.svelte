<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
    
    // Deconstruct for easier access
    const { totalOmzet, totalBarangTerjual, totalAsetModal, totalStokBarang, barangPalingLaku, lowStocks } = data.dashboard;
</script>

<svelte:head>
	<title>Executive Dashboard - Owner</title>
</svelte:head>

<div class="mb-6 md:mb-8">
	<h1 class="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Executive Dashboard</h1>
	<p class="text-slate-500 mt-1 md:mt-2 text-sm md:text-base">Ringkasan performa finansial dan operasional terkini.</p>
</div>

<!-- Key Performance Indicators (KPIs) -->
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
    <!-- Card Omzet -->
    <div class="bg-[#ffffff] rounded-xl p-5">
        <div class="w-10 h-10 rounded-lg bg-[#d1e4ea] flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-1">TOTAL OMZET</p>
        <p class="text-2xl md:text-3xl font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">
            Rp {(totalOmzet || 0).toLocaleString('id-ID')}
        </p>
        <p class="text-xs text-[#5f6b6f]">Kas Masuk Bruto</p>
    </div>
    
    <!-- Card Barang Terjual -->
    <div class="bg-[#ffffff] rounded-xl p-5">
        <div class="w-10 h-10 rounded-lg bg-[#d1e4ea] flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        </div>
        <p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-1">BARANG TERJUAL</p>
        <p class="text-2xl md:text-3xl font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">
            {(totalBarangTerjual || 0).toLocaleString('id-ID')}
        </p>
        <p class="text-xs text-[#5f6b6f]">Unit Terjual</p>
    </div>

    <!-- Card Modal Terkunci -->
    <div class="bg-[#ffffff] rounded-xl p-5">
        <div class="w-10 h-10 rounded-lg bg-[#d1e4ea] flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        </div>
        <p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-1">ASET MODAL</p>
        <p class="text-2xl md:text-3xl font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">
            Rp {(totalAsetModal || 0).toLocaleString('id-ID')}
        </p>
        <p class="text-xs text-[#5f6b6f]">Modal Terkunci</p>
    </div>

    <!-- Card Sisa Fisik -->
    <div class="bg-[#ffffff] rounded-xl p-5">
        <div class="w-10 h-10 rounded-lg bg-[#d1e4ea] flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        </div>
        <p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-1">STOK FISIK</p>
        <p class="text-2xl md:text-3xl font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">
            {(totalStokBarang || 0).toLocaleString('id-ID')}
        </p>
        <p class="text-xs text-[#5f6b6f]">Unit Tersedia</p>
    </div>
</div>

<!-- Secondary Sections -->
<div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <!-- Top Selling Categories -->
    <div class="bg-[#ffffff] rounded-xl p-5 md:p-6 flex flex-col">
        <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">
                <span class="hidden sm:inline">Produk Paling Laku</span>
                <span class="sm:hidden">Top Produk</span>
            </h3>
            <span class="text-xs text-[#5f6b6f] uppercase tracking-wider font-semibold">Top 5</span>
        </div>
        
        {#if barangPalingLaku.length === 0}
            <div class="flex-1 flex flex-col items-center justify-center text-[#5f6b6f] py-8 md:py-10">
                <svg class="w-10 h-10 md:w-12 md:h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                <p class="text-sm md:text-base">Belum ada data penjualan tersedia.</p>
            </div>
        {:else}
            <div class="space-y-4">
                {#each barangPalingLaku as bl, i}
                    <div class="flex items-center gap-3">
                        <div class="relative">
                            <div class="w-10 h-10 rounded-lg bg-[#d1e4ea] flex items-center justify-center text-[#306677] font-bold text-sm">
                                {bl.nama.substring(0, 1)}
                            </div>
                            <div class="absolute -top-1 -right-1 w-5 h-5 bg-[#306677] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {i + 1}
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-[#2c3437] truncate">{bl.nama}</p>
                            <p class="text-xs text-[#5f6b6f]">{bl.qty} pcs terjual</p>
                        </div>
                        <p class="text-sm font-bold text-[#2c3437]">Rp {bl.omzet.toLocaleString('id-ID')}</p>
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Low Stock Alert -->
    <div class="bg-[#ffffff] rounded-xl p-5 md:p-6 flex flex-col">
        <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">
                <span class="hidden sm:inline">Peringatan Stok Menipis</span>
                <span class="sm:hidden">Stok Menipis</span>
            </h3>
            <span class="text-xs text-red-600 uppercase tracking-wider font-semibold">&lt; 15 Unit</span>
        </div>
        
        <div class="flex-1 overflow-x-auto">
            <!-- Desktop Table -->
            <table class="w-full text-left hidden md:table">
                <thead>
                    <tr class="text-xs font-semibold text-[#5f6b6f] uppercase tracking-wider border-b border-[#e4e9ed]">
                        <th class="pb-3 px-2">Kategori Barang</th>
                        <th class="pb-3 px-2">Lokasi Toko</th>
                        <th class="pb-3 px-2 text-right">Sisa Fisik</th>
                        <th class="pb-3 px-2 text-center">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-[#f0f4f7]">
                    {#each lowStocks as ls}
                        <tr class="hover:bg-[#f0f4f7] transition-colors">
                            <td class="py-3 px-2 text-sm font-medium text-[#2c3437]">{ls.kategori.nama_kategori}</td>
                            <td class="py-3 px-2 text-sm text-[#5f6b6f]">
                                <div class="flex flex-col">
                                    <span>{ls.toko.nama_toko}</span>
                                    {#if ls.toko.is_pusat}
                                        <span class="text-[9px] font-bold text-[#306677] uppercase">Gudang Pusat</span>
                                    {/if}
                                </div>
                            </td>
                            <td class="py-3 px-2 text-sm font-bold text-right {ls.jumlah <= 5 ? 'text-red-600' : 'text-amber-600'}">{ls.jumlah}</td>
                            <td class="py-3 px-2 text-center">
                                {#if ls.jumlah === 0}
                                    <span class="px-2 py-1 text-[10px] font-bold bg-[#e4e9ed] text-[#5f6b6f] rounded-md">Habis</span>
                                {:else if ls.jumlah <= 5}
                                    <span class="px-2 py-1 text-[10px] font-bold bg-red-100 text-red-700 rounded-md">Kritis!</span>
                                {:else}
                                    <span class="px-2 py-1 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-md">Menipis</span>
                                {/if}
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="4" class="py-12 text-center text-[#5f6b6f]">
                                <span class="block bg-[#c8e6d7] text-[#3f6754] p-3 rounded-xl mx-auto max-w-xs font-medium text-sm">
                                    ✓ Aman! Tidak ada stok yang menipis.
                                </span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>

            <!-- Mobile Cards -->
            <div class="md:hidden space-y-3">
                {#each lowStocks as ls}
                    <div class="bg-[#f0f4f7] rounded-lg p-3 hover:bg-[#e4e9ed] transition-colors">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-[#2c3437] text-sm mb-1 truncate">{ls.kategori.nama_kategori}</h4>
                                <p class="text-xs text-[#5f6b6f]">{ls.toko.nama_toko}</p>
                                {#if ls.toko.is_pusat}
                                    <span class="text-[9px] font-bold text-[#306677] uppercase">Gudang Pusat</span>
                                {/if}
                            </div>
                            <div class="text-right ml-2 shrink-0">
                                <p class="text-lg font-bold {ls.jumlah <= 5 ? 'text-red-600' : 'text-amber-600'}">{ls.jumlah}</p>
                                <p class="text-[9px] text-[#5f6b6f] uppercase">Sisa</p>
                            </div>
                        </div>
                        <div class="flex justify-end">
                            {#if ls.jumlah === 0}
                                <span class="px-2 py-1 text-[10px] font-bold bg-[#e4e9ed] text-[#5f6b6f] rounded-md">Habis</span>
                            {:else if ls.jumlah <= 5}
                                <span class="px-2 py-1 text-[10px] font-bold bg-red-100 text-red-700 rounded-md">Kritis!</span>
                            {:else}
                                <span class="px-2 py-1 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-md">Menipis</span>
                            {/if}
                        </div>
                    </div>
                {:else}
                    <div class="py-12 text-center text-[#5f6b6f]">
                        <span class="block bg-[#c8e6d7] text-[#3f6754] p-3 rounded-xl font-medium text-sm">
                            ✓ Aman! Tidak ada stok yang menipis.
                        </span>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

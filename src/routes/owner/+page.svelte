<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
    
    // Deconstruct for easier access
    const { totalOmzet, totalBarangTerjual, totalAsetModal, totalStokBarang, barangPalingLaku, lowStocks } = data.dashboard;
</script>

<svelte:head>
	<title>Executive Dashboard - Owner</title>
</svelte:head>

<div class="mb-8">
	<h1 class="text-3xl font-bold text-slate-800 tracking-tight">Executive Dashboard</h1>
	<p class="text-slate-500 mt-2 text-lg">Ringkasan performa finansial dan operasional terkini.</p>
</div>

<!-- Key Performance Indicators (KPIs) -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
    <!-- Card Omzet -->
    <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-sm text-white p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-emerald-100 font-medium">Total Omzet Penjualan</h3>
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
        </div>
        <div class="text-3xl font-extrabold tracking-tight mb-1">
            Rp {(totalOmzet || 0).toLocaleString('id-ID')}
        </div>
        <div class="text-sm text-emerald-100 flex items-center gap-1">
            <span>Kas Masuk Bruto</span>
        </div>
    </div>
    
    <!-- Card Barang Terjual -->
    <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-sm text-white p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-blue-100 font-medium">Total Barang Terjual</h3>
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
        </div>
        <div class="text-3xl font-extrabold tracking-tight mb-1">
            {(totalBarangTerjual || 0).toLocaleString('id-ID')} <span class="text-xl font-medium opacity-80">pcs</span>
        </div>
        <div class="text-sm text-blue-100 flex items-center gap-1">
            <span>Volume Transaksi</span>
        </div>
    </div>

    <!-- Card Modal Terkunci -->
    <div class="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl shadow-sm text-white p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-purple-100 font-medium">Aset Modal (Terkunci)</h3>
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
        </div>
        <div class="text-3xl font-extrabold tracking-tight mb-1">
            Rp {(totalAsetModal || 0).toLocaleString('id-ID')}
        </div>
        <div class="text-sm text-purple-100 flex items-center gap-1">
            <span>Sisa modal di gudang & toko</span>
        </div>
    </div>

    <!-- Card Sisa Fisik -->
    <div class="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl shadow-sm text-white p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-slate-300 font-medium">Sisa Fisik Stok All-in</h3>
            <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
        </div>
        <div class="text-3xl font-extrabold tracking-tight mb-1">
            {(totalStokBarang || 0).toLocaleString('id-ID')} <span class="text-xl font-medium opacity-60">pcs</span>
        </div>
        <div class="text-sm text-slate-300 flex items-center gap-1">
            <span>Barang siap jual</span>
        </div>
    </div>
</div>

<!-- Secondary Sections -->
<div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
    <!-- Top Selling Categories -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            Produk Paling Laku (Top 5)
        </h3>
        
        {#if barangPalingLaku.length === 0}
            <div class="flex-1 flex flex-col items-center justify-center text-slate-400 py-10">
                <svg class="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                <p>Belum ada data penjualan tersedia.</p>
            </div>
        {:else}
            <div class="flex flex-col gap-4">
                {#each barangPalingLaku as bl (bl.nama)}
                    <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                {bl.nama.charAt(0)}
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-800">{bl.nama}</h4>
                                <p class="text-xs text-slate-500">{bl.qty} Item Terjual</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-slate-800">Rp {bl.omzet.toLocaleString('id-ID')}</p>
                            <p class="text-[10px] text-emerald-600 font-semibold uppercase">Omzet</p>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Low Stock Alert -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Peringatan Stok Menipis (Di Bawah 15)
        </h3>
        
        <div class="flex-1 overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <th class="pb-3 px-2">Kategori Barang</th>
                        <th class="pb-3 px-2">Lokasi Toko</th>
                        <th class="pb-3 px-2 text-right">Sisa Fisik</th>
                        <th class="pb-3 px-2 text-center">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                    {#each lowStocks as ls}
                        <tr class="hover:bg-red-50/50 transition-colors">
                            <td class="py-3 px-2 text-sm font-medium text-slate-800">{ls.kategori.nama_kategori}</td>
                            <td class="py-3 px-2 text-sm text-slate-600 flex flex-col">
                                <span>{ls.toko.nama_toko}</span>
                                {#if ls.toko.is_pusat}
                                    <span class="text-[9px] font-bold text-blue-600 uppercase">Gudang Pusat</span>
                                {/if}
                            </td>
                            <td class="py-3 px-2 text-sm font-bold text-right {ls.jumlah <= 5 ? 'text-red-600' : 'text-amber-600'}">{ls.jumlah}</td>
                            <td class="py-3 px-2 text-center">
                                {#if ls.jumlah === 0}
                                    <span class="px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-500 rounded-md">Habis</span>
                                {:else if ls.jumlah <= 5}
                                    <span class="px-2 py-1 text-[10px] font-bold bg-red-100 text-red-700 rounded-md animate-pulse">Kritis!</span>
                                {:else}
                                    <span class="px-2 py-1 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-md">Menipis</span>
                                {/if}
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="4" class="py-12 text-center text-slate-400">
                                <span class="block bg-emerald-50 text-emerald-600 p-3 rounded-xl mx-auto max-w-xs font-medium border border-emerald-100">
                                    Aman! Tidak ada stok yang menipis.
                                </span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

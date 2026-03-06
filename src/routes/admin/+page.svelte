<script lang="ts">
	import { page } from '$app/stores';
	export let data;
</script>

<svelte:head>
	<title>Admin Dashboard - Control Center</title>
</svelte:head>

<div class="mb-8">
	<h1 class="text-2xl font-bold text-slate-800 tracking-tight">Control Center</h1>
	<p class="text-slate-500 mt-1">
		Halo <span class="font-medium text-slate-700">{$page.data.user?.name}</span>, selamat datang di panel kendali Gudang Pusat.
	</p>
</div>

<!-- Operational KPIs -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
    <!-- Stok Pusat -->
    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        </div>
        <div>
            <p class="text-sm font-medium text-slate-500">Stok Gudang Pusat</p>
            <p class="text-2xl font-bold text-slate-800">{data.totalStokPusat} <span class="text-sm font-medium text-slate-500">pcs</span></p>
        </div>
    </div>
    
    <!-- Toko Cabang -->
    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <div>
            <p class="text-sm font-medium text-slate-500">Cabang Aktif</p>
            <p class="text-2xl font-bold text-slate-800">{data.totalTokoCabang} <span class="text-sm font-medium text-slate-500">toko</span></p>
        </div>
    </div>

    <!-- Retur Pending -->
    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-14 h-14 rounded-full {data.pendingRetur > 0 ? 'bg-orange-100 text-orange-600 animate-pulse' : 'bg-slate-100 text-slate-600'} flex items-center justify-center shrink-0">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
        </div>
        <div>
            <p class="text-sm font-medium text-slate-500">Retur Menunggu Aksi</p>
            <p class="text-2xl font-bold {data.pendingRetur > 0 ? 'text-orange-600' : 'text-slate-800'}">{data.pendingRetur} <span class="text-sm font-medium text-slate-500">request</span></p>
        </div>
    </div>

    <!-- Total Trx Kasir -->
    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <div>
            <p class="text-sm font-medium text-slate-500">Riwayat Setoran</p>
            <p class="text-2xl font-bold text-slate-800">{data.totalPenjualan} <span class="text-sm font-medium text-slate-500">resi</span></p>
        </div>
    </div>
</div>

<!-- Quick Shortcuts -->
<h3 class="text-lg font-bold text-slate-800 mb-4">Jalan Pintas Operasional</h3>
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <a href="/admin/stok" class="group bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        </div>
        <h4 class="font-bold text-lg">Inbound Baru</h4>
        <p class="text-emerald-100 text-sm mt-1">Tambah modal stok masuk langsung ke Gudang Pusat.</p>
    </a>
    
    <a href="/admin/penjualan" class="group bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        </div>
        <h4 class="font-bold text-lg">Distribusi ke Toko</h4>
        <p class="text-blue-100 text-sm mt-1">Mutasi barang dari Gudang Pusat untuk di-drop ke cabang (Dev Progress).</p>
    </a>

     <a href="/admin/retur" class="group bg-gradient-to-br from-slate-700 to-slate-800 p-6 rounded-2xl text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
        {#if data.pendingRetur > 0}
            <div class="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                Pending!
            </div>
        {/if}
        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        </div>
        <h4 class="font-bold text-lg">Kelola Retur Barang</h4>
        <p class="text-slate-300 text-sm mt-1">Konfirmasi atau tolak permintaan barang kembali dari cabang.</p>
    </a>
</div>

<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	
	// Quick calc
	$: totalItems = data.stoks.reduce((acc, curr) => acc + curr.jumlah, 0);
</script>

<svelte:head>
	<title>Sisa Stok Cabang</title>
</svelte:head>

<div class="mb-4">
	<h1 class="text-xl font-bold text-slate-800">Sisa Stok Fisik</h1>
	<p class="text-slate-500 text-sm mt-1">Status stok aktual di toko Anda saat ini.</p>
</div>

<div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-sm text-white p-5 mb-6">
    <div class="text-emerald-100 text-sm font-medium mb-1">Total Stok Baju Keseluruhan</div>
    <div class="text-4xl font-extrabold">{totalItems} <span class="text-lg font-medium opacity-80">pcs</span></div>
</div>

<h3 class="font-semibold text-slate-800 mb-3 ml-1">Rincian Per Kategori</h3>

<div class="grid grid-cols-2 gap-3 mb-6">
    {#each data.stoks as stok}
        <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            </div>
            <h4 class="text-sm text-slate-500 font-medium mb-1 truncate">{stok.kategori.nama_kategori}</h4>
            <div class="text-2xl font-bold text-slate-800">{stok.jumlah} <span class="text-xs font-medium text-slate-400">pcs</span></div>
        </div>
    {:else}
        {#if data.user.tokoId}
             <div class="col-span-2 text-center p-8 bg-white rounded-xl border border-slate-100">
                <p class="text-slate-500">Belum ada stok yang dialokasikan ke toko ini.</p>
             </div>
        {/if}
    {/each}
</div>

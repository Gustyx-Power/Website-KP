<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	export let data: LayoutData;

	// Simple active route checker
	$: isSisaStok = $page.url.pathname === '/kasir';
	$: isPermintaan = $page.url.pathname.startsWith('/kasir/permintaan');
	$: isDistribusi = $page.url.pathname.startsWith('/kasir/distribusi');
	$: isPenjualan = $page.url.pathname.startsWith('/kasir/penjualan');
	$: isRetur = $page.url.pathname === '/kasir/retur';
	$: isReturStatus = $page.url.pathname.startsWith('/kasir/retur/status');
</script>

<div class="min-h-screen bg-slate-50 flex flex-col font-sans pb-20">
	<!-- Top App Bar -->
	<header class="bg-emerald-600 text-white shadow-md sticky top-0 z-40">
		<div class="px-4 py-3 flex items-center justify-between">
			<div class="flex flex-col">
				<h1 class="text-xs font-medium text-emerald-200 uppercase tracking-wide">POS Cabang</h1>
				<h2 class="text-lg font-bold leading-tight">
					{data.toko ? data.toko.nama_toko : 'Toko Belum Diatur'}
				</h2>
			</div>
			<div class="flex items-center gap-3">
				<div class="text-right hidden sm:block">
					<p class="text-sm font-medium">{data.user.name}</p>
					<p class="text-xs text-emerald-200">Kasir</p>
				</div>
				<div class="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-lg border-2 border-emerald-500">
					{data.user.name.charAt(0).toUpperCase()}
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content Area -->
	<main class="flex-1 p-4 lg:max-w-3xl lg:mx-auto lg:w-full">
		{#if !data.toko}
			<div class="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 mb-4 shadow-sm">
				<div class="flex items-start gap-3">
					<svg class="w-6 h-6 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					<div>
						<h3 class="font-bold">Perhatian</h3>
						<p class="text-sm mt-1">Akun Anda belum ditugaskan ke Toko manapun. Hubungi Admin Pusat untuk pengaturan.</p>
					</div>
				</div>
			</div>
		{/if}

		<slot />
	</main>

	<!-- Bottom Navigation (Mobile Friendly) -->
	<nav class="fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center pb-safe pt-2 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-40 lg:hidden">
		<a
			href="/kasir"
			class="flex flex-col items-center justify-center p-2 min-w-[3rem] transition-colors {isSisaStok ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}"
		>
			<svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width={isSisaStok ? "2.5" : "2"} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
			</svg>
			<span class="text-[9px] font-medium">Stok</span>
		</a>
		<a
			href="/kasir/permintaan"
			class="flex flex-col items-center justify-center p-2 min-w-[3rem] transition-colors {isPermintaan ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}"
		>
			<svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width={isPermintaan ? "2.5" : "2"} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
			<span class="text-[9px] font-medium">Minta</span>
		</a>
		<a
			href="/kasir/distribusi"
			class="flex flex-col items-center justify-center p-2 min-w-[3rem] transition-colors {isDistribusi ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}"
		>
			<svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width={isDistribusi ? "2.5" : "2"} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
			</svg>
			<span class="text-[9px] font-medium">Status</span>
		</a>
		<a
			href="/kasir/penjualan"
			class="flex flex-col items-center justify-center p-2 min-w-[3rem] transition-colors {isPenjualan ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}"
		>
			<svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width={isPenjualan ? "2.5" : "2"} d="M12 4v16m8-8H4" />
			</svg>
			<span class="text-[9px] font-medium">Jual</span>
		</a>
		<a
			href="/kasir/retur"
			class="flex flex-col items-center justify-center p-2 min-w-[3rem] transition-colors {isRetur ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}"
		>
			<svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width={isRetur ? "2.5" : "2"} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
			</svg>
			<span class="text-[9px] font-medium">Retur</span>
		</a>
	</nav>
	
	<!-- Desktop Sidebar for Navigation (Hidden on Mobile) -->
	<aside class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:bg-white lg:border-r lg:border-slate-200 lg:z-30 lg:pt-8 lg:px-4 gap-2 shadow-sm">
	    <a
			href="/kasir"
			class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {isSisaStok ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}"
		>
			<svg class="w-5 h-5 {isSisaStok ? 'text-emerald-500' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
			</svg>
			Sisa Stok Fisik
		</a>
		<a
			href="/kasir/permintaan"
			class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {isPermintaan ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}"
		>
			<svg class="w-5 h-5 {isPermintaan ? 'text-emerald-500' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
			Permintaan Stok
		</a>
		<a
			href="/kasir/distribusi"
			class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {isDistribusi ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}"
		>
			<svg class="w-5 h-5 {isDistribusi ? 'text-emerald-500' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
			</svg>
			Status Distribusi
		</a>
		<a
			href="/kasir/penjualan"
			class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {isPenjualan ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}"
		>
			<svg class="w-5 h-5 {isPenjualan ? 'text-emerald-500' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Laporan Laku / Setoran
		</a>
		<a
			href="/kasir/retur"
			class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {isRetur ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}"
		>
			<svg class="w-5 h-5 {isRetur ? 'text-emerald-500' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
			</svg>
			Ajukan Retur Barang
		</a>
		<a
			href="/kasir/retur/status"
			class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {isReturStatus ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}"
		>
			<svg class="w-5 h-5 {isReturStatus ? 'text-emerald-500' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
			</svg>
			Status Retur
		</a>
		
		<div class="mt-auto mb-6">
		    <form method="POST" action="/logout">
                <button
                    type="submit"
                    class="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout Akun
                </button>
            </form>
		</div>
	</aside>
</div>

<style>
	/* Safe area for mobile devices like iPhone */
	.pb-safe {
		padding-bottom: env(safe-area-inset-bottom, 1rem);
	}
</style>

<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	let { data }: { data: LayoutData } = $props();

	let sidebarOpen = $state(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		sidebarOpen = false;
	}

	// Simple active route checker using $derived
	let isSisaStok = $derived($page.url.pathname === '/kasir');
	let isPermintaan = $derived($page.url.pathname.startsWith('/kasir/permintaan'));
	let isDistribusi = $derived($page.url.pathname.startsWith('/kasir/distribusi'));
	let isPenjualan = $derived($page.url.pathname.startsWith('/kasir/penjualan'));
	let isRetur = $derived($page.url.pathname === '/kasir/retur');
	let isReturStatus = $derived($page.url.pathname.startsWith('/kasir/retur/status'));
</script>

<div class="min-h-screen bg-[#f7f9fb] flex">
	<!-- Mobile Sidebar Overlay -->
	{#if sidebarOpen}
		<div
			class="fixed inset-0 bg-black/50 z-40 lg:hidden"
			on:click={closeSidebar}
			on:keydown={(e) => e.key === 'Escape' && closeSidebar()}
			role="button"
			tabindex="0"
			aria-label="Close sidebar"
		></div>
	{/if}

	<!-- Sidebar -->
	<aside
		class="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50 transform transition-transform duration-300 lg:translate-x-0 {sidebarOpen
			? 'translate-x-0'
			: '-translate-x-full'}"
	>
		<div class="h-16 flex items-center justify-between px-6 border-b border-slate-200">
			<h1 class="text-xl font-bold tracking-tight text-slate-800">
				IMD<span class="text-[#306677]">Clothes</span>
			</h1>
			<button class="lg:hidden text-slate-500 hover:text-slate-700" on:click={closeSidebar}>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<div class="px-4 py-3 bg-[#306677]/5 border-b border-slate-200">
			<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">POS Cabang</p>
			<p class="text-sm font-bold text-[#306677] mt-0.5">
				{data.toko ? data.toko.nama_toko : 'Toko Belum Diatur'}
			</p>
		</div>

		<nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
			<a
				href="/kasir"
				on:click={closeSidebar}
				class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 {isSisaStok
					? 'bg-[#306677] text-white font-semibold shadow-sm'
					: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
				</svg>
				Sisa Stok Fisik
			</a>
			<a
				href="/kasir/permintaan"
				on:click={closeSidebar}
				class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 {isPermintaan
					? 'bg-[#306677] text-white font-semibold shadow-sm'
					: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
				Permintaan Stok
			</a>
			<a
				href="/kasir/distribusi"
				on:click={closeSidebar}
				class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 {isDistribusi
					? 'bg-[#306677] text-white font-semibold shadow-sm'
					: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
				</svg>
				Status Distribusi
			</a>
			<a
				href="/kasir/penjualan"
				on:click={closeSidebar}
				class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 {isPenjualan
					? 'bg-[#306677] text-white font-semibold shadow-sm'
					: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				Laporan Laku / Setoran
			</a>
			<a
				href="/kasir/retur"
				on:click={closeSidebar}
				class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 {isRetur
					? 'bg-[#306677] text-white font-semibold shadow-sm'
					: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
				</svg>
				Ajukan Retur Barang
			</a>
			<a
				href="/kasir/retur/status"
				on:click={closeSidebar}
				class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 {isReturStatus
					? 'bg-[#306677] text-white font-semibold shadow-sm'
					: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
				</svg>
				Status Retur
			</a>
		</nav>

		<div class="p-4 border-t border-slate-200">
			<div class="flex items-center gap-3 px-2 py-2 mb-3">
				<div class="w-10 h-10 rounded-full bg-[#306677] flex items-center justify-center font-bold text-white text-sm">
					{data.user.name.charAt(0).toUpperCase()}
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-semibold text-slate-800 truncate">{data.user.name}</p>
					<p class="text-xs text-slate-500">Kasir</p>
				</div>
			</div>
			<form method="POST" action="/logout">
				<button
					class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
					Logout
				</button>
			</form>
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex-1 lg:pl-64 flex flex-col min-h-screen">
		<header
			class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-30"
		>
			<button class="lg:hidden text-slate-600 hover:text-slate-900" on:click={toggleSidebar}>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
			<h2 class="text-base md:text-lg font-bold text-slate-800 tracking-tight lg:hidden">
				IMD<span class="text-[#306677]">Clothes</span>
			</h2>
			<div class="flex-1 lg:block"></div>
		</header>
		<main class="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
			{#if !data.toko}
				<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
					<div class="flex items-start gap-3">
						<svg class="w-6 h-6 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						<div>
							<h3 class="font-bold text-amber-900">Perhatian</h3>
							<p class="text-sm mt-1 text-amber-800">Akun Anda belum ditugaskan ke Toko manapun. Hubungi Admin Pusat untuk pengaturan.</p>
						</div>
					</div>
				</div>
			{/if}

			<slot />
		</main>
	</div>
</div>

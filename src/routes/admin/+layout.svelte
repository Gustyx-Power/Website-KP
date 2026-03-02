<script lang="ts">
	import { page } from '$app/stores';
</script>

<div
	class="font-sans min-h-screen bg-slate-50 flex text-slate-800 selection:bg-emerald-100 selection:text-emerald-900"
>
	<!-- Sidebar -->
	<aside
		class="w-72 bg-white border-r border-slate-100 min-h-screen hidden lg:flex flex-col fixed inset-y-0 left-0 z-10"
	>
		<!-- Logo Area -->
		<div class="h-20 flex items-center px-8 border-b border-slate-50">
			<div class="flex items-center gap-3">
				<div
					class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm"
				>
					<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						></path></svg
					>
				</div>
				<h1 class="text-xl font-bold tracking-tight text-slate-900">
					IMD<span class="text-emerald-500">Clothes</span>
				</h1>
			</div>
		</div>

		<!-- Navigation -->
		<div class="flex-1 overflow-y-auto px-4 py-6 space-y-1">
			<p class="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-2">
				Main Menu
			</p>

			<a
				href="/admin"
				class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {$page.url
					.pathname === '/admin'
					? 'bg-emerald-50 text-emerald-600 font-semibold'
					: 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'}"
			>
				<svg
					class="w-5 h-5 {$page.url.pathname === '/admin' ? 'text-emerald-500' : 'text-slate-400'}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					></path></svg
				>
				Dashboard
			</a>
			<a
				href="/admin/toko"
				class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {$page.url.pathname.startsWith(
					'/admin/toko'
				)
					? 'bg-emerald-50 text-emerald-600 font-semibold'
					: 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'}"
			>
				<svg
					class="w-5 h-5 {$page.url.pathname.startsWith('/admin/toko')
						? 'text-emerald-500'
						: 'text-slate-400'}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
					></path></svg
				>
				Cabang Toko
			</a>
			<a
				href="/admin/kategori"
				class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {$page.url.pathname.startsWith(
					'/admin/kategori'
				)
					? 'bg-emerald-50 text-emerald-600 font-semibold'
					: 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'}"
			>
				<svg
					class="w-5 h-5 {$page.url.pathname.startsWith('/admin/kategori')
						? 'text-emerald-500'
						: 'text-slate-400'}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
					></path></svg
				>
				Kategori Produk
			</a>
			<a
				href="/admin/stok"
				class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {$page.url.pathname.startsWith(
					'/admin/stok'
				)
					? 'bg-emerald-50 text-emerald-600 font-semibold'
					: 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'}"
			>
				<svg
					class="w-5 h-5 {$page.url.pathname.startsWith('/admin/stok')
						? 'text-emerald-500'
						: 'text-slate-400'}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
					></path></svg
				>
				Manajemen Stok
			</a>
			<a
				href="/admin/penjualan"
				class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {$page.url.pathname.startsWith(
					'/admin/penjualan'
				)
					? 'bg-emerald-50 text-emerald-600 font-semibold'
					: 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'}"
			>
				<svg
					class="w-5 h-5 {$page.url.pathname.startsWith('/admin/penjualan')
						? 'text-emerald-500'
						: 'text-slate-400'}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					></path></svg
				>
				Data Penjualan
			</a>
			<a
				href="/admin/retur"
				class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {$page.url.pathname.startsWith(
					'/admin/retur'
				)
					? 'bg-emerald-50 text-emerald-600 font-semibold'
					: 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'}"
			>
				<svg
					class="w-5 h-5 {$page.url.pathname.startsWith('/admin/retur')
						? 'text-emerald-500'
						: 'text-slate-400'}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path></svg
				>
				Data Retur
			</a>
		</div>

		<!-- Bottom User Mini Box -->
		<div class="p-4 border-t border-slate-50">
			<div class="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl">
				<div
					class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm"
				>
					AD
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-semibold text-slate-800 truncate">Adminstrator</p>
					<p class="text-xs text-slate-500 truncate">admin@imdclothes.com</p>
				</div>
			</div>
		</div>
	</aside>

	<!-- Main ContentWrapper -->
	<main class="flex-1 ml-0 lg:ml-72 flex flex-col min-h-screen">
		<!-- Top Navigation Header -->
		<header
			class="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 flex items-center justify-between px-6 lg:px-10"
		>
			<!-- Mobile Menu Toggle -->
			<button class="lg:hidden text-slate-500 hover:text-slate-800 p-2 rounded-lg bg-slate-50">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					></path></svg
				>
			</button>

			<!-- Global Search Bar Placeholder -->
			<div class="hidden sm:flex items-center relative w-96 ml-4 lg:ml-0">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path></svg
					>
				</div>
				<input
					type="text"
					placeholder="Search anything..."
					class="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border-transparent rounded-xl text-sm placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-slate-700"
				/>
			</div>

			<!-- Header Right Actions -->
			<div class="flex items-center gap-4">
				<button
					class="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors relative"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
						></path></svg
					>
					<span class="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"
					></span>
				</button>
				<div class="hidden sm:block h-6 w-px bg-slate-200"></div>
				<div class="flex items-center gap-3 cursor-pointer">
					<img
						src="https://ui-avatars.com/api/?name=Admin+User&background=10b981&color=fff&rounded=true"
						alt="Profile"
						class="w-9 h-9 border-2 border-slate-100 rounded-full shadow-sm"
					/>
				</div>
			</div>
		</header>

		<!-- Route Content Slot -->
		<div class="p-6 md:p-10 flex-1 max-w-7xl w-full mx-auto animate-fade-in">
			<slot />
		</div>
	</main>
</div>

<style>
	/* Small custom utility just for layout fade in */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in {
		animation: fadeIn 0.3s ease-out forwards;
	}
</style>

<script lang="ts">
	import { page } from '$app/stores';
	import { scale, fade } from 'svelte/transition';
	
	let isProfileOpen = false;
	
	function toggleProfile() {
		isProfileOpen = !isProfileOpen;
	}
	
	function closeProfile() {
		isProfileOpen = false;
	}
</script>

<svelte:window on:click={() => { if(isProfileOpen) isProfileOpen = false; }} />

<div
	class="font-sans min-h-screen bg-[#f7f9fb] flex text-[#2c3437] selection:bg-[#d1e4ea] selection:text-[#1a3d47]"
	style="font-family: 'Inter', sans-serif;"
>
	<!-- Sidebar -->
	<aside
		class="w-72 bg-[#f0f4f7] min-h-screen hidden lg:flex flex-col fixed inset-y-0 left-0 z-10"
	>
		<!-- Logo Area -->
		<div class="h-20 flex items-center px-8">
			<div class="flex items-center gap-3">
				<div
					class="w-10 h-10 rounded-lg bg-gradient-to-br from-[#306677] to-[#225a6a] flex items-center justify-center shadow-sm"
				>
					<div class="grid grid-cols-2 gap-0.5">
						<div class="w-2 h-2 bg-white rounded-sm"></div>
						<div class="w-2 h-2 bg-white/40 rounded-sm"></div>
						<div class="w-2 h-2 bg-white/40 rounded-sm"></div>
						<div class="w-2 h-2 bg-white rounded-sm"></div>
					</div>
				</div>
				<div>
					<h1 class="text-base font-bold tracking-tight text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">
						Inventory Hub
					</h1>
					<p class="text-[10px] uppercase tracking-wider text-[#5f6b6f] font-medium">Warehouse Management</p>
				</div>
			</div>
		</div>

		<!-- Navigation -->
		<div class="flex-1 overflow-y-auto px-4 py-6 space-y-1">
			<a
				href="/admin"
				class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 {$page.url
					.pathname === '/admin'
					? 'bg-[#d1e4ea] text-[#1a3d47] font-semibold'
					: 'text-[#5f6b6f] hover:bg-[#e4e9ed] hover:text-[#2c3437] font-medium'}"
			>
				<svg
					class="w-5 h-5"
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
				href="/admin/stok"
				class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 {$page.url.pathname.startsWith(
					'/admin/stok'
				)
					? 'bg-[#d1e4ea] text-[#1a3d47] font-semibold'
					: 'text-[#5f6b6f] hover:bg-[#e4e9ed] hover:text-[#2c3437] font-medium'}"
			>
				<svg
					class="w-5 h-5"
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
				Produk
			</a>
			<a
				href="/admin/pegawai"
				class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 {$page.url.pathname.startsWith(
					'/admin/pegawai'
				)
					? 'bg-[#d1e4ea] text-[#1a3d47] font-semibold'
					: 'text-[#5f6b6f] hover:bg-[#e4e9ed] hover:text-[#2c3437] font-medium'}"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
					></path></svg
				>
				Pelanggan
			</a>
			<a
				href="/admin/toko"
				class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 {$page.url.pathname.startsWith(
					'/admin/toko'
				)
					? 'bg-[#d1e4ea] text-[#1a3d47] font-semibold'
					: 'text-[#5f6b6f] hover:bg-[#e4e9ed] hover:text-[#2c3437] font-medium'}"
			>
				<svg
					class="w-5 h-5"
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
				Toko
			</a>
			<a
				href="/admin/distribusi"
				class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 {$page.url.pathname.startsWith(
					'/admin/distribusi'
				)
					? 'bg-[#d1e4ea] text-[#1a3d47] font-semibold'
					: 'text-[#5f6b6f] hover:bg-[#e4e9ed] hover:text-[#2c3437] font-medium'}"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
					></path></svg
				>
				Distribusi
			</a>
			<a
				href="/admin/penjualan"
				class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 {$page.url.pathname.startsWith(
					'/admin/penjualan'
				)
					? 'bg-[#d1e4ea] text-[#1a3d47] font-semibold'
					: 'text-[#5f6b6f] hover:bg-[#e4e9ed] hover:text-[#2c3437] font-medium'}"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					></path></svg
				>
				Pendapatan
			</a>
			<a
				href="/admin/kategori"
				class="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 {$page.url.pathname.startsWith(
					'/admin/kategori'
				)
					? 'bg-[#d1e4ea] text-[#1a3d47] font-semibold'
					: 'text-[#5f6b6f] hover:bg-[#e4e9ed] hover:text-[#2c3437] font-medium'}"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
					></path></svg
				>
				Promosi
			</a>
		</div>

		<!-- Bottom User Mini Box -->
		<div class="p-4 space-y-3">
			<div class="flex items-center gap-3 px-4 py-3 bg-[#e4e9ed] rounded-xl">
				<div
					class="w-9 h-9 rounded-full bg-gradient-to-br from-[#306677] to-[#225a6a] flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm"
				>
					{$page.data.user?.name ? $page.data.user.name.substring(0, 2) : 'AP'}
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-semibold text-[#2c3437] truncate">{$page.data.user?.name || 'Admin Pusat'}</p>
					<p class="text-xs text-[#5f6b6f] truncate uppercase tracking-wide">Master Access</p>
				</div>
			</div>
		</div>
	</aside>

	<!-- Main ContentWrapper -->
	<main class="flex-1 ml-0 lg:ml-72 flex flex-col min-h-screen">
		<!-- Top Navigation Header -->
		<header
			class="h-20 bg-[#ffffff]/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-6 lg:px-10"
		>
			<!-- Mobile Menu Toggle -->
			<button aria-label="Toggle Menu" class="lg:hidden text-stone-500 hover:text-stone-800 p-2 rounded-xl bg-stone-100/50">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					></path></svg
				>
			</button>

			<!-- Global Search Bar -->
			<div class="hidden sm:flex items-center relative flex-1 max-w-md ml-4 lg:ml-0">
				<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
					<svg class="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
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
					placeholder="Cari data operasional..."
					class="block w-full pl-11 pr-4 py-2.5 bg-[#e4e9ed] border-none rounded-md text-sm placeholder-[#5f6b6f] focus:bg-[#ffffff] focus:ring-2 focus:ring-[#306677]/20 transition-all outline-none text-[#2c3437]"
				/>
			</div>

			<!-- Header Right Actions -->
			<div class="flex items-center gap-3">
				<a
					href="/admin/distribusi"
					aria-label="Distribusi pending"
					class="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-colors {$page.data.pendingDistribusi > 0 ? 'text-amber-500 hover:bg-amber-50' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100/50'}"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
						/>
					</svg>
					{#if $page.data.pendingDistribusi > 0}
						<span class="absolute -top-1 -right-1 flex h-5 w-5">
							<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
							<span class="relative inline-flex rounded-full h-5 w-5 bg-amber-500 text-[10px] font-bold text-white items-center justify-center">{$page.data.pendingDistribusi}</span>
						</span>
					{/if}
				</a>

				<a
					href="/admin/retur"
					aria-label="Retur pending"
					class="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-colors {$page.data.pendingRetur > 0 ? 'text-orange-500 hover:bg-orange-50' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100/50'}"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
						/>
					</svg>
					{#if $page.data.pendingRetur > 0}
						<span class="absolute -top-1 -right-1 flex h-5 w-5">
							<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
							<span class="relative inline-flex rounded-full h-5 w-5 bg-orange-500 text-[10px] font-bold text-white items-center justify-center">{$page.data.pendingRetur}</span>
						</span>
					{/if}
				</a>
				
				<button
					aria-label="Notifications"
					class="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors text-stone-400 hover:text-stone-600 hover:bg-stone-100/50"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
						></path></svg
					>
				</button>

				<button
					aria-label="Messages"
					class="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors text-stone-400 hover:text-stone-600 hover:bg-stone-100/50"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						></path></svg
					>
				</button>

				<div class="relative">
					<button 
						class="flex items-center gap-3 cursor-pointer p-1 rounded-2xl hover:bg-stone-100/50 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2"
						on:click|stopPropagation={toggleProfile}
						aria-label="User menu"
						aria-expanded={isProfileOpen}
						aria-haspopup="true"
					>
						<img
							src={`https://ui-avatars.com/api/?name=${$page.data.user?.name || 'Admin+User'}&background=10b981&color=fff&rounded=true`}
							alt="Profile"
							class="w-9 h-9 border-2 border-stone-100 rounded-full shadow-sm"
						/>
					</button>

					{#if isProfileOpen}
						<!-- Dropdown Menu -->
						<div 
							transition:scale={{ duration: 150, start: 0.95 }}
							class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 origin-top-right focus:outline-none"
							role="menu"
							tabindex="-1"
							aria-orientation="vertical"
							aria-labelledby="user-menu-button"
							on:click|stopPropagation
							on:keydown={(e) => {
								if (e.key === 'Escape') closeProfile();
							}}
						>
							<div class="p-4 border-b border-slate-50 bg-slate-50/50">
								<p class="text-sm font-bold text-slate-800 truncate" role="none">
									{$page.data.user?.name}
								</p>
								<p class="text-xs text-slate-500 truncate mt-0.5" role="none">
									{$page.data.user?.email}
								</p>
								<div class="mt-2 inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
									{$page.data.user?.role}
								</div>
							</div>
							<div class="py-2" role="none">
								<a
									href="/admin/pegawai"
									class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors w-full text-left"
									role="menuitem"
									on:click={closeProfile}
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
									Update Profile
								</a>
								
								<form method="POST" action="/logout" class="w-full">
									<button
										type="submit"
										class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left"
										role="menuitem"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
										Sign out
									</button>
								</form>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</header>

		<!-- Route Content Slot -->
		<div class="p-6 md:p-10 flex-1 max-w-[1400px] w-full mx-auto animate-fade-in">
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

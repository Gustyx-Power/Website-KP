<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	export let data: LayoutData;

	let sidebarOpen = false;

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		sidebarOpen = false;
	}
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
			<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Owner Dashboard</p>
		</div>

		<nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
			<a
				href="/owner"
				on:click={closeSidebar}
				class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 {$page.url.pathname === '/owner' || $page.url.pathname === '/owner/'
					? 'bg-[#306677] text-white font-semibold shadow-sm'
					: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
					/>
				</svg>
				Executive Dashboard
			</a>
			<a
				href="/owner/audit"
				on:click={closeSidebar}
				class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 {$page.url.pathname.startsWith('/owner/audit')
					? 'bg-[#306677] text-white font-semibold shadow-sm'
					: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				Audit Log
			</a>
		</nav>

		<div class="p-4 border-t border-slate-200">
			<div class="flex items-center gap-3 px-2 py-2 mb-3">
				<div
					class="w-10 h-10 rounded-full bg-[#306677] flex items-center justify-center font-bold text-white text-sm"
				>
					{data.user?.name.charAt(0).toUpperCase()}
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-semibold text-slate-800 truncate">{data.user?.name}</p>
					<p class="text-xs text-slate-500">Business Owner</p>
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
			<slot />
		</main>
	</div>
</div>

<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	export let data: LayoutData;
</script>

<div class="min-h-screen bg-slate-50 flex">
	<!-- Sidebar -->
	<aside class="w-64 bg-slate-900 text-slate-300 flex flex-col hidden lg:flex fixed inset-y-0">
		<div class="h-16 flex items-center px-6 border-b border-slate-800">
			<h1 class="text-xl font-bold tracking-tight text-white">
				IMD<span class="text-purple-400">Clothes</span> <span class="text-slate-400 font-medium text-sm ml-1">Owner</span>
			</h1>
		</div>
		
		<nav class="flex-1 py-6 px-3 space-y-1">
			<a
				href="/owner"
				class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {$page.url.pathname === '/owner' || $page.url.pathname === '/owner/'
					? 'bg-purple-500/10 text-purple-400 font-semibold'
					: 'hover:bg-slate-800 hover:text-white'}"
			>
				<svg class="w-5 h-5 {$page.url.pathname === '/owner' ? 'text-purple-400' : 'text-slate-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
				Executive Analytics
			</a>
		</nav>

		<div class="p-4 border-t border-slate-800">
			<div class="flex items-center gap-3 px-2 py-2 mb-4">
				<div class="w-10 h-10 rounded-full bg-slate-800 border-2 border-purple-500 flex items-center justify-center font-bold text-white">
					{data.user?.name.charAt(0).toUpperCase()}
				</div>
				<div>
					<p class="text-sm font-medium text-white">{data.user?.name}</p>
					<p class="text-xs text-slate-500">Business Owner</p>
				</div>
			</div>
			<form method="POST" action="/logout">
				<button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
					Logout
				</button>
			</form>
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex-1 lg:pl-64 flex flex-col min-h-screen">
		<header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
			<h2 class="text-lg font-bold text-slate-800 tracking-tight lg:hidden">IMD<span class="text-purple-600">Clothes</span> Owner</h2>
			<div class="flex-1"></div>
			<div class="text-sm text-slate-500">Status Laporan: <span class="text-emerald-600 font-medium">Real-Time</span></div>
		</header>
		<main class="flex-1 p-4 lg:p-8 overflow-y-auto">
			<slot />
		</main>
	</div>
</div>

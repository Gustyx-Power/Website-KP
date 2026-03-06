<script lang="ts">
	import { page } from '$app/stores';

	// Determine the correct home path based on user role
	$: homePath = (() => {
		if (!$page.data.user) return '/login';
		switch ($page.data.user.role) {
			case 'OWNER': return '/owner';
			case 'ADMIN': return '/admin';
			case 'KASIR': return '/kasir';
			default: return '/';
		}
	})();
</script>

<svelte:head>
	<title>403 - Akses Ditolak</title>
</svelte:head>

<div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-100 selection:text-indigo-900">
	
	<!-- Floating Background Elements -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none mb-10">
		<div class="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-50 rounded-full blur-3xl opacity-70"></div>
		<div class="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-emerald-50 rounded-full blur-3xl opacity-70"></div>
	</div>

	<div class="max-w-md w-full relative z-10">
		<div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-100 p-8 text-center sm:p-12 overflow-hidden relative">
			
			<!-- Decorative Top Accent -->
			<div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-400 via-rose-500 to-orange-400"></div>

			<!-- Lock Icon Graphic -->
			<div class="mx-auto w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-8 relative">
				<div class="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
				<svg class="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
				</svg>
			</div>

			<!-- Typography -->
			<h1 class="text-7xl font-black text-slate-800 tracking-tighter mix-blend-multiply">403</h1>
			<h2 class="mt-4 text-2xl font-bold text-slate-800 tracking-tight">Zona Terlarang</h2>
			<p class="mt-3 text-sm text-slate-500 leading-relaxed font-medium">
				Maaf, sistem menolak otorisasi Anda. Kredensial akun Anda tidak memiliki jangkauan privilese untuk memasuki area ini.
			</p>
			
			<!-- User Badge Info -->
			{#if $page.data.user}
				<div class="mt-6 flex justify-center">
					<div class="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-4 py-2">
						<div class="w-2 h-2 rounded-full bg-emerald-500"></div>
						<div class="text-xs text-left">
							<p class="font-semibold text-slate-700">{$page.data.user.email}</p>
							<p class="text-slate-400 tracking-wider font-mono text-[10px] uppercase">ROLE: {$page.data.user.role}</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Action Button -->
			<div class="mt-8">
				<a
					href={homePath}
					class="w-full inline-flex justify-center items-center gap-2 px-6 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
					Kembali ke Area Anda
				</a>
			</div>
			
			<div class="mt-6">
				<form method="POST" action="/logout">
					<button type="submit" class="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors underline-offset-4 hover:underline">
						Bukan akun Anda? Sign out
					</button>
				</form>
			</div>
		</div>
	</div>
	
	<!-- Footer Branding -->
	<div class="mt-8 text-center">
		<p class="text-sm font-bold tracking-tight text-slate-400">IMD<span class="text-indigo-400">Clothes</span> <span class="text-slate-300 font-medium">System Core</span></p>
	</div>
</div>

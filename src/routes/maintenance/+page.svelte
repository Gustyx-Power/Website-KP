<script lang="ts">
	// This page will be shown to ALL users (Owner, Admin, Kasir, Guests) 
	// whenever the Super Admin toggles Maintenance Mode to ON.
</script>

<svelte:head>
	<title>503 - Under Maintenance</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 selection:bg-rose-500/30 selection:text-rose-200">
	
	<!-- Background Effects -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/10 rounded-full blur-[120px]"></div>
	</div>

	<div class="max-w-xl w-full text-center relative z-10 space-y-8">
		<!-- Animated Maintenance Icon -->
		<div class="mx-auto w-32 h-32 relative">
			<div class="absolute inset-0 bg-rose-500/20 rounded-3xl rotate-12 animate-pulse"></div>
			<div class="absolute inset-0 bg-slate-800 rounded-3xl border border-slate-700/50 flex items-center justify-center rotate-0 backdrop-blur-xl shadow-2xl">
				<svg class="w-16 h-16 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			</div>
		</div>

		<div>
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold mb-6">
				<span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
				SISTEM UTAMA DIBEKUKAN
			</div>
			<h1 class="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
				Pembaruan Server <br/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Sedang Berlangsung</span>
			</h1>
			<p class="mt-6 text-lg text-slate-400 leading-relaxed max-w-lg mx-auto font-medium">
				IMDClothes System Core sedang menjalani eskalasi pemeliharaan rutin oleh Super Admin. Seluruh akses operasional untuk sementara ditutup guna menjaga integritas data Anda.
			</p>
		</div>

		<div class="pt-8 border-t border-slate-800/60">
			<p class="text-sm text-slate-500">
				Harap tunggu arahan lebih lanjut atau hubungi <span class="text-slate-300 font-semibold">IT Infrastruktur (Port 5000)</span>.
			</p>
			
			<!-- Auto-Refresh Try -->
			<button 
				on:click={() => window.location.reload()}
				class="mt-6 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-all focus:ring-2 focus:ring-slate-500 outline-none"
			>
				Cek Status Sistem
			</button>
		</div>
	</div>
</div>

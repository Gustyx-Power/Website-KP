<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	
	export let data;

	// Animated counters
	const totalTokoCabang = tweened(0, { duration: 1500, easing: cubicOut });
	const totalBalance = tweened(0, { duration: 2000, easing: cubicOut });
	const totalStokPusat = tweened(0, { duration: 1800, easing: cubicOut });
	const balanceChange = tweened(0, { duration: 1200, easing: cubicOut });
	const totalSalesRevenue = tweened(0, { duration: 2200, easing: cubicOut });
	const avgDailySales = tweened(0, { duration: 1800, easing: cubicOut });

	// Start animations on mount
	onMount(() => {
		totalTokoCabang.set(data.totalTokoCabang);
		totalBalance.set(data.totalBalance);
		totalStokPusat.set(data.totalStokPusat);
		balanceChange.set(data.balanceChange);
		
		const totalRevenue = data.salesByDay.reduce((sum, d) => sum + (d._sum.total_uang || 0), 0);
		totalSalesRevenue.set(totalRevenue);
		avgDailySales.set(totalRevenue / data.salesByDay.length);
	});

	// Format currency to Indonesian Rupiah
	function formatRupiah(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	// Calculate max value for chart scaling
	$: maxSales = Math.max(...data.salesByDay.map((d) => d._sum.total_uang || 0), 1);

	// Get day labels for chart
	function getDayLabel(date: Date): string {
		const days = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
		return days[new Date(date).getDay()];
	}

	// Format time ago
	function timeAgo(date: Date): string {
		const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
		if (seconds < 60) return 'Baru saja';
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes} menit lalu`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours} jam lalu`;
		const days = Math.floor(hours / 24);
		return `${days} hari lalu`;
	}
</script>

<svelte:head>
	<title>Ringkasan Dashboard - Inventory Hub</title>
</svelte:head>

<!-- Breadcrumb -->
<div class="mb-6">
	<div class="flex items-center gap-2 text-sm text-[#5f6b6f]" style="font-family: 'Inter', sans-serif;">
		<span>Halaman Utama</span>
		<span>/</span>
		<span class="text-[#2c3437] font-medium">Ringkasan Dashboard</span>
	</div>
</div>

<!-- Header Section -->
<div class="mb-6 lg:mb-8">
	<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">
		Selamat datang kembali, Admin Pusat
	</h1>
</div>

<!-- Action Buttons -->
<div class="flex flex-col sm:flex-row gap-3 mb-6 lg:mb-8">
	<button class="px-4 md:px-5 py-2.5 bg-[#ffffff] text-[#2c3437] rounded-md text-sm font-semibold hover:bg-[#e4e9ed] transition-all flex items-center justify-center gap-2">
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
		</svg>
		Ekspor Laporan
	</button>
	<a href="/admin/distribusi/buat" class="px-4 md:px-5 py-2.5 bg-gradient-to-r from-[#306677] to-[#225a6a] text-white rounded-md text-sm font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
		</svg>
		Distribusi Baru
	</a>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
	<!-- Left Column - Main Content -->
	<div class="lg:col-span-2 space-y-6">
		<!-- Stok Gudang Pusat Card -->
		<div class="bg-[#ffffff] rounded-xl p-5 md:p-6">
			<div class="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
				<div class="flex-1">
					<h2 class="text-xs md:text-sm uppercase tracking-wider text-[#5f6b6f] font-semibold mb-2">STOK GUDANG PUSAT</h2>
					<div class="flex items-baseline gap-2">
						<span class="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">
							{Math.round($totalStokPusat).toLocaleString('id-ID')}
						</span>
						<span class="text-base md:text-lg text-[#5f6b6f]">Unit</span>
					</div>
					<div class="flex items-center gap-2 mt-2">
						<span class="px-2 py-1 bg-[#c8e6d7] text-[#1f3329] rounded-full text-xs font-semibold">+12% Efisiensi</span>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<img src="https://ui-avatars.com/api/?name=User+1&background=306677&color=fff&size=32" alt="" class="w-8 h-8 rounded-full border-2 border-white -mr-2" />
					<img src="https://ui-avatars.com/api/?name=User+2&background=225a6a&color=fff&size=32" alt="" class="w-8 h-8 rounded-full border-2 border-white -mr-2" />
					<span class="w-8 h-8 rounded-full bg-[#e4e9ed] flex items-center justify-center text-xs font-semibold text-[#5f6b6f]">+4</span>
				</div>
			</div>
			<div class="flex flex-col sm:flex-row gap-3">
				<button class="px-4 py-2 bg-[#306677] text-white rounded-md text-sm font-semibold hover:bg-[#225a6a] transition-colors">
					Kelola Stok
				</button>
				<button class="px-4 py-2 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm font-semibold hover:bg-[#d8dfe8] transition-colors">
					Lihat Audit
				</button>
			</div>
		</div>

		<!-- Metrics Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<!-- Cabang Toko -->
			<div class="bg-[#ffffff] rounded-xl p-5">
				<div class="w-10 h-10 rounded-lg bg-[#d1e4ea] flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
					</svg>
				</div>
				<p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-1">CABANG TOKO</p>
				<p class="text-3xl font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">
					{Math.round($totalTokoCabang)}
				</p>
				<p class="text-xs text-[#5f6b6f]">Aktif</p>
			</div>

			<!-- Total Pendapatan -->
			<div class="bg-[#ffffff] rounded-xl p-5">
				<div class="w-10 h-10 rounded-lg bg-[#d1e4ea] flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-1">TOTAL PENDAPATAN</p>
				<p class="text-2xl font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">
					{formatRupiah($totalBalance)}
				</p>
				<p class="text-xs text-[#3f6754]">+4.5% Indikator</p>
			</div>

			<!-- Active Shipments -->
			<div class="bg-[#ffffff] rounded-xl p-5">
				<div class="w-10 h-10 rounded-lg bg-[#d1e4ea] flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
					</svg>
				</div>
				<p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-1">PENGIRIMAN AKTIF</p>
				<p class="text-3xl font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">
					{data.pendingDistribusi}
				</p>
				<p class="text-xs text-[#5f6b6f]">Dalam Perjalanan</p>
			</div>
		</div>

		<!-- Tren Penjualan Chart -->
		<div class="bg-[#ffffff] rounded-xl p-5 md:p-6">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
				<div>
					<h3 class="text-base font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">Tren Penjualan</h3>
					<p class="text-xs md:text-sm text-[#5f6b6f]">Performance over the last 7 days</p>
				</div>
				<select class="w-full sm:w-auto px-3 py-2 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none">
					<option>Last 7 Days</option>
					<option>Last 30 Days</option>
					<option>Last 90 Days</option>
				</select>
			</div>

			<!-- Chart -->
			<div class="relative h-48 md:h-64 mb-4">
				<div class="absolute inset-0 flex items-end justify-between gap-3 px-2">
					{#each data.salesByDay as day, i}
						{@const height = ((day._sum.total_uang || 0) / maxSales) * 100}
						{@const isHighest = (day._sum.total_uang || 0) === maxSales}
						<div class="flex-1 flex flex-col items-center gap-2">
							<div class="relative w-full group">
								{#if isHighest}
									<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2c3437] text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
										Puncak
									</div>
								{/if}
								<div
									class="w-full rounded-t-lg transition-all duration-300 {isHighest
										? 'bg-[#306677]'
										: 'bg-[#d8dfe8]'} hover:opacity-80 cursor-pointer"
									style="height: {Math.max(height, 5)}%"
								></div>
								<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#2c3437] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
									{formatRupiah(day._sum.total_uang || 0)}
								</div>
							</div>
							<p class="text-xs text-[#5f6b6f] font-medium uppercase hidden sm:block">{getDayLabel(day.tanggal)}</p>
							<p class="text-[10px] text-[#5f6b6f] font-medium uppercase sm:hidden">{getDayLabel(day.tanggal).substring(0, 1)}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Right Column - Sidebar -->
	<div class="space-y-6">
		<!-- Produk Terlaris -->
		<div class="bg-[#ffffff] rounded-xl p-6">
			<div class="flex items-center justify-between mb-5">
				<h3 class="text-base font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">Produk Terlaris</h3>
				<span class="text-xs text-[#5f6b6f] uppercase tracking-wider font-semibold">Top 5</span>
			</div>

			<div class="space-y-4">
				{#each data.popularProducts.slice(0, 3) as product, i}
					<div class="flex items-center gap-3">
						<div class="relative">
							<div class="w-10 h-10 rounded-lg bg-[#d1e4ea] flex items-center justify-center text-[#306677] font-bold text-sm">
								{product.name.substring(0, 1)}
							</div>
							<div class="absolute -top-1 -right-1 w-5 h-5 bg-[#306677] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
								{i + 1}
							</div>
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-semibold text-[#2c3437] truncate">{product.name}</p>
							<p class="text-xs text-[#5f6b6f]">{product.quantity} pcs terjual</p>
						</div>
						<p class="text-sm font-bold text-[#2c3437]">{formatRupiah(product.revenue)}</p>
					</div>
				{/each}
			</div>

			<a href="/admin/stok" class="block w-full mt-5 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm font-semibold hover:bg-[#d8dfe8] transition-colors text-center">
				Lihat Semua Produk
			</a>
		</div>

		<!-- Kasir Baru Bergabung -->
		<div class="bg-[#ffffff] rounded-xl p-6">
			<div class="mb-4">
				<h3 class="text-base font-bold text-[#2c3437] mb-1" style="font-family: 'Manrope', sans-serif;">Kasir Baru Bergabung</h3>
			</div>

			<div class="space-y-3">
				{#each data.recentCustomers.slice(0, 2) as customer}
					<div class="flex items-center gap-3 p-3 bg-[#f0f4f7] rounded-lg">
						<img
							src={`https://ui-avatars.com/api/?name=${customer.name}&background=306677&color=fff&size=40`}
							alt={customer.name}
							class="w-10 h-10 rounded-full"
						/>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-semibold text-[#2c3437] truncate">{customer.name}</p>
							<p class="text-xs text-[#5f6b6f] uppercase tracking-wide">Terverifikasi</p>
						</div>
						<button class="text-[#5f6b6f] hover:text-[#2c3437]">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
							</svg>
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Aktivitas Terbaru -->
		<div class="bg-[#ffffff] rounded-xl p-6">
			<div class="flex items-center justify-between mb-5">
				<h3 class="text-base font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">Aktivitas Terbaru</h3>
			</div>

			<div class="space-y-4">
				{#each data.recentTransactions.slice(0, 3) as transaction}
					<div class="flex gap-3">
						<div class="w-8 h-8 rounded-lg bg-[#c8e6d7] flex items-center justify-center shrink-0">
							<svg class="w-4 h-4 text-[#3f6754]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm text-[#2c3437]">
								<span class="font-semibold">{transaction.createdBy.name.split(' ')[0]}</span> menyelesaikan penjualan
							</p>
							<div class="flex items-center gap-2 mt-1">
								<p class="text-xs text-[#5f6b6f]">{timeAgo(transaction.tanggal)}</p>
								<span class="text-[#acb3b7]">•</span>
								<p class="text-xs font-semibold text-[#3f6754]">{formatRupiah(transaction.total_uang)}</p>
							</div>
						</div>
					</div>
				{/each}

				<button class="w-full py-2 text-sm text-[#306677] font-semibold hover:text-[#225a6a] transition-colors flex items-center justify-center gap-1">
					<span>Lihat Semua Aktivitas</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>

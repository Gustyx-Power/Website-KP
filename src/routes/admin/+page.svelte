<script lang="ts">
	import { page } from '$app/stores';
	export let data;

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
		const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
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
	<title>Dashboard - Gudang Pusat</title>
</svelte:head>

<div class="flex flex-col lg:flex-row gap-6">
	<!-- Main Content -->
	<div class="flex-1 space-y-6">
		<!-- Header -->
		<div>
			<h1 class="text-3xl font-bold text-slate-900">Dashboard</h1>
		</div>

		<!-- Overview Cards -->
		<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-semibold text-slate-900">Overview</h2>
				<select
					class="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
				>
					<option>Bulan lalu</option>
					<option>Bulan ini</option>
					<option>Tahun ini</option>
				</select>
			</div>

			<!-- Pending Distribution Alert -->
			{#if data.pendingDistribusi > 0}
				<a
					href="/admin/distribusi"
					class="block mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors"
				>
					<div class="flex items-start gap-3">
						<div class="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0 animate-pulse">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
								/>
							</svg>
						</div>
						<div class="flex-1">
							<h3 class="font-bold text-amber-800">
								{data.pendingDistribusi} Permintaan Distribusi Menunggu Persetujuan!
							</h3>
							<p class="text-sm text-amber-700 mt-1">
								Ada permintaan stok dari cabang toko yang perlu Anda tinjau dan setujui.
							</p>
							<p class="text-xs text-amber-600 font-medium mt-2">
								Klik untuk melihat detail →
							</p>
						</div>
					</div>
				</a>
			{/if}

			<!-- Pending Return Alert -->
			{#if data.pendingRetur > 0}
				<a
					href="/admin/retur"
					class="block mb-4 bg-orange-50 border border-orange-200 rounded-xl p-4 hover:bg-orange-100 transition-colors"
				>
					<div class="flex items-start gap-3">
						<div class="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0 animate-pulse">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
								/>
							</svg>
						</div>
						<div class="flex-1">
							<h3 class="font-bold text-orange-800">
								{data.pendingRetur} Permintaan Retur Menunggu Persetujuan!
							</h3>
							<p class="text-sm text-orange-700 mt-1">
								Ada permintaan retur barang dari cabang toko yang perlu Anda tinjau dan setujui.
							</p>
							<p class="text-xs text-orange-600 font-medium mt-2">
								Klik untuk melihat detail →
							</p>
						</div>
					</div>
				</a>
			{/if}

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Customers Card -->
				<div class="flex items-center gap-4">
					<div
						class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0"
					>
						<svg
							class="w-6 h-6 text-slate-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<div class="flex-1">
						<p class="text-sm text-slate-500 mb-1">Pelanggan</p>
						<p class="text-3xl font-bold text-slate-900">{data.totalTokoCabang}</p>
						<p class="text-sm text-red-500 mt-1">
							<span class="font-semibold">↓ 36.8%</span> vs bulan lalu
						</p>
					</div>
				</div>

				<!-- Balance Card -->
				<div class="flex items-center gap-4">
					<div
						class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0"
					>
						<svg
							class="w-6 h-6 text-slate-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
							/>
						</svg>
					</div>
					<div class="flex-1">
						<p class="text-sm text-slate-500 mb-1">Saldo</p>
						<p class="text-3xl font-bold text-slate-900">
							{(data.totalBalance / 1000).toFixed(0)}k
						</p>
						<p class="text-sm text-emerald-500 mt-1">
							<span class="font-semibold">↑ {data.balanceChange.toFixed(1)}%</span> vs bulan lalu
						</p>
					</div>
				</div>
			</div>

			<!-- New Customers Section -->
			<div class="mt-8 pt-6 border-t border-slate-100">
				<p class="text-sm font-semibold text-slate-900 mb-3">
					{data.recentCustomers.length} kasir baru hari ini!
				</p>
				<p class="text-xs text-slate-500 mb-4">
					Kirim pesan selamat datang ke semua kasir baru.
				</p>

				<div class="flex items-center gap-3">
					{#each data.recentCustomers as customer}
						<div class="flex flex-col items-center gap-2">
							<img
								src={`https://ui-avatars.com/api/?name=${customer.name}&background=random&size=64`}
								alt={customer.name}
								class="w-12 h-12 rounded-full border-2 border-white shadow-sm"
							/>
							<p class="text-xs text-slate-600 font-medium">{customer.name.split(' ')[0]}</p>
						</div>
					{/each}
					<a
						href="/admin/pegawai"
						class="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</a>
					<a
						href="/admin/pegawai"
						class="text-sm text-slate-600 hover:text-emerald-600 font-medium ml-2"
					>
						Lihat semua
					</a>
				</div>
			</div>
		</div>

		<!-- Product View Chart -->
		<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-semibold text-slate-900">Tampilan Produk</h2>
				<select
					class="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
				>
					<option>7 hari terakhir</option>
					<option>30 hari terakhir</option>
					<option>90 hari terakhir</option>
				</select>
			</div>

			<!-- Chart -->
			<div class="relative h-64">
				<div class="absolute inset-0 flex items-end justify-between gap-2 px-4">
					{#each data.salesByDay as day, i}
						{@const height = ((day._sum.total_uang || 0) / maxSales) * 100}
						{@const isHighest = (day._sum.total_uang || 0) === maxSales}
						<div class="flex-1 flex flex-col items-center gap-2">
							<div class="relative w-full group">
								{#if isHighest}
									<div
										class="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap"
									>
										{((day._sum.total_uang || 0) / 1000000).toFixed(1)}m
									</div>
									<div
										class="absolute -top-10 left-1/2 -translate-x-1/2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"
									>
										<svg
											class="w-4 h-4 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
								{/if}
								<div
									class="w-full rounded-t-lg transition-all duration-300 {isHighest
										? 'bg-emerald-500'
										: 'bg-slate-200'} hover:opacity-80 cursor-pointer"
									style="height: {height}%"
								></div>
								<!-- Tooltip on hover -->
								<div
									class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
								>
									{formatRupiah(day._sum.total_uang || 0)}
								</div>
							</div>
							<p class="text-xs text-slate-500 font-medium">{getDayLabel(day.tanggal)}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Total Revenue -->
			<div class="mt-8 pt-6 border-t border-slate-100">
				<p class="text-4xl font-bold text-slate-300">
					{formatRupiah(data.salesByDay.reduce((sum, d) => sum + (d._sum.total_uang || 0), 0))}
				</p>
			</div>
		</div>
	</div>

	<!-- Sidebar -->
	<div class="w-full lg:w-80 space-y-6">
		<!-- Popular Products -->
		<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
			<h2 class="text-lg font-semibold text-slate-900 mb-4">Produk Populer</h2>

			<div class="space-y-4">
				{#each data.popularProducts as product, i}
					<div class="flex items-center gap-3">
						<div
							class="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shrink-0"
						>
							{product.name.substring(0, 2).toUpperCase()}
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
							<p class="text-xs text-slate-500">UI Kit</p>
						</div>
						<div class="text-right">
							<p class="text-sm font-bold text-slate-900">{formatRupiah(product.revenue)}</p>
							<span
								class="inline-block px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded"
							>
								Aktif
							</span>
						</div>
					</div>
				{/each}
			</div>

			<a
				href="/admin/stok"
				class="block w-full mt-6 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors text-center"
			>
				Semua produk
			</a>
		</div>

		<!-- Comments/Recent Transactions -->
		<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
			<h2 class="text-lg font-semibold text-slate-900 mb-4">Komentar</h2>

			<div class="space-y-4">
				{#each data.recentTransactions as transaction}
					<div class="flex gap-3">
						<img
							src={`https://ui-avatars.com/api/?name=${transaction.createdBy.name}&background=random&size=40`}
							alt={transaction.createdBy.name}
							class="w-10 h-10 rounded-full shrink-0"
						/>
						<div class="flex-1 min-w-0">
							<p class="text-sm">
								<span class="font-semibold text-slate-900">{transaction.createdBy.name}</span>
								<span class="text-slate-600"> on </span>
								<span class="font-medium text-slate-900">{transaction.kategori.nama_kategori}</span>
							</p>
							<p class="text-xs text-slate-400 mt-0.5">{timeAgo(transaction.tanggal)}</p>
							<p class="text-sm text-slate-600 mt-2">
								Transaksi penjualan {transaction.qty_terjual} pcs senilai {formatRupiah(
									transaction.total_uang
								)}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	// Laporan categories
	const laporanCategories = [
		{
			id: 'ringkasan',
			title: 'Ringkasan Eksekutif',
			description: 'Laporan overview dashboard dengan KPI utama, grafik tren, dan analisis performa',
			icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
			color: 'from-[#306677] to-[#225a6a]',
			bgColor: 'bg-[#d1e4ea]',
			iconColor: 'text-[#306677]',
			filters: ['periode']
		},
		{
			id: 'stok-pusat',
			title: 'Stok Gudang Pusat',
			description: 'Laporan stok per kategori, nilai modal, dan kategori dengan stok menipis',
			icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
			color: 'from-emerald-500 to-emerald-600',
			bgColor: 'bg-emerald-100',
			iconColor: 'text-emerald-600',
			filters: []
		},
		{
			id: 'penjualan',
			title: 'Laporan Penjualan',
			description: 'Riwayat penjualan dengan filter per toko, periode, dan produk terlaris',
			icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
			color: 'from-blue-500 to-blue-600',
			bgColor: 'bg-blue-100',
			iconColor: 'text-blue-600',
			filters: ['periode', 'toko']
		},
		{
			id: 'distribusi',
			title: 'Laporan Distribusi',
			description: 'Riwayat distribusi stok ke cabang dengan status dan nilai modal',
			icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
			color: 'from-amber-500 to-amber-600',
			bgColor: 'bg-amber-100',
			iconColor: 'text-amber-600',
			filters: ['periode', 'toko', 'status']
		},
		{
			id: 'retur',
			title: 'Laporan Retur',
			description: 'Riwayat retur barang dari cabang dengan analisis kategori yang sering diretur',
			icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
			color: 'from-red-500 to-red-600',
			bgColor: 'bg-red-100',
			iconColor: 'text-red-600',
			filters: ['periode', 'toko', 'status']
		},
		{
			id: 'stok-toko',
			title: 'Stok per Toko',
			description: 'Laporan stok di setiap cabang toko dengan detail per kategori',
			icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
			color: 'from-purple-500 to-purple-600',
			bgColor: 'bg-purple-100',
			iconColor: 'text-purple-600',
			filters: ['toko']
		},
		{
			id: 'pegawai',
			title: 'Laporan Pegawai',
			description: 'Data pegawai per role, status aktif, dan penugasan per toko',
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
			color: 'from-indigo-500 to-indigo-600',
			bgColor: 'bg-indigo-100',
			iconColor: 'text-indigo-600',
			filters: ['role', 'status']
		},
		{
			id: 'performance',
			title: 'Performance Toko',
			description: 'Ranking dan analisis performa setiap cabang toko',
			icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
			color: 'from-pink-500 to-pink-600',
			bgColor: 'bg-pink-100',
			iconColor: 'text-pink-600',
			filters: ['periode']
		},
		{
			id: 'invoice',
			title: 'Invoice & Surat Jalan',
			description: 'Generate invoice distribusi dan surat jalan untuk dokumentasi',
			icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
			color: 'from-teal-500 to-teal-600',
			bgColor: 'bg-teal-100',
			iconColor: 'text-teal-600',
			filters: ['distribusi']
		}
	];

	let selectedLaporan: string | null = null;
	let showFilterModal = false;
	let isExporting = false;

	// Filter states
	let filterPeriode = '7';
	let filterToko = 'semua';
	let filterStatus = 'semua';
	let filterRole = 'semua';
	let filterStatusPegawai = 'semua';
	let customStartDate = '';
	let customEndDate = '';

	function openFilterModal(laporanId: string) {
		selectedLaporan = laporanId;
		showFilterModal = true;
	}

	function closeFilterModal() {
		showFilterModal = false;
		selectedLaporan = null;
	}

	function formatRupiah(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function getFilterLabel(laporanId: string): string {
		const laporan = laporanCategories.find((l) => l.id === laporanId);
		if (!laporan) return '';

		const filters = laporan.filters;
		if (filters.length === 0) return 'Tanpa filter';

		return filters
			.map((f) => {
				if (f === 'periode') return 'Periode';
				if (f === 'toko') return 'Toko';
				if (f === 'status') return 'Status';
				if (f === 'role') return 'Role';
				return f;
			})
			.join(', ');
	}

	async function exportPDF() {
		// Handle Ringkasan Eksekutif
		if (selectedLaporan === 'ringkasan') {
			isExporting = true;
			try {
				const formData = new FormData();
				formData.append('periode', filterPeriode);
				if (filterPeriode === 'custom') {
					formData.append('customStartDate', customStartDate);
					formData.append('customEndDate', customEndDate);
				}

				const response = await fetch('?/getRingkasanData', {
					method: 'POST',
					body: formData
				});

				const result = await response.json();
				
				if (result.type === 'success') {
					const { parse } = await import('devalue');
					const deserializedData = parse(result.data);
					const reportData = Array.isArray(deserializedData) ? deserializedData[0] : deserializedData;
					
					if (!reportData || !reportData.data) {
						throw new Error('Data laporan tidak valid');
					}
					
					const { exportRingkasanPDF } = await import('$lib/exportUtils');
					await exportRingkasanPDF(reportData, filterPeriode, customStartDate, customEndDate);
				} else {
					throw new Error(result.errors?.[0]?.message || 'Gagal mengambil data laporan');
				}
			} catch (error) {
				console.error('Error exporting PDF:', error);
				alert(`Gagal mengekspor PDF: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`);
			} finally {
				isExporting = false;
				closeFilterModal();
			}
			return;
		}

		// Handle Stok Gudang Pusat
		if (selectedLaporan === 'stok-pusat') {
			isExporting = true;
			try {
				const response = await fetch('?/getStokPusatData', {
					method: 'POST',
					body: new FormData()
				});

				const result = await response.json();
				
				if (result.type === 'success') {
					const { parse } = await import('devalue');
					const deserializedData = parse(result.data);
					const reportData = Array.isArray(deserializedData) ? deserializedData[0] : deserializedData;
					
					if (!reportData || !reportData.data) {
						throw new Error('Data laporan tidak valid');
					}
					
					const { exportStokPusatPDF } = await import('$lib/exportUtils');
					await exportStokPusatPDF(reportData);
				} else {
					throw new Error(result.errors?.[0]?.message || 'Gagal mengambil data laporan');
				}
			} catch (error) {
				console.error('Error exporting PDF:', error);
				alert(`Gagal mengekspor PDF: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`);
			} finally {
				isExporting = false;
				closeFilterModal();
			}
			return;
		}

		// Handle Laporan Penjualan
		if (selectedLaporan === 'penjualan') {
			isExporting = true;
			try {
				const formData = new FormData();
				formData.append('periode', filterPeriode);
				if (filterPeriode === 'custom') {
					formData.append('customStartDate', customStartDate);
					formData.append('customEndDate', customEndDate);
				}
				formData.append('tokoId', filterToko);

				const response = await fetch('?/getPenjualanData', {
					method: 'POST',
					body: formData
				});

				const result = await response.json();
				
				if (result.type === 'success') {
					const { parse } = await import('devalue');
					const deserializedData = parse(result.data);
					const reportData = Array.isArray(deserializedData) ? deserializedData[0] : deserializedData;
					
					if (!reportData || !reportData.data) {
						throw new Error('Data laporan tidak valid');
					}
					
					const { exportPenjualanPDF } = await import('$lib/exportUtils');
					await exportPenjualanPDF(reportData);
				} else {
					throw new Error(result.errors?.[0]?.message || 'Gagal mengambil data laporan');
				}
			} catch (error) {
				console.error('Error exporting PDF:', error);
				alert(`Gagal mengekspor PDF: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`);
			} finally {
				isExporting = false;
				closeFilterModal();
			}
			return;
		}

		// Other reports
		alert(`Ekspor PDF untuk ${selectedLaporan} akan segera diimplementasikan`);
		closeFilterModal();
	}

	async function exportExcel() {
		// Handle Ringkasan Eksekutif
		if (selectedLaporan === 'ringkasan') {
			isExporting = true;
			try {
				const formData = new FormData();
				formData.append('periode', filterPeriode);
				if (filterPeriode === 'custom') {
					formData.append('customStartDate', customStartDate);
					formData.append('customEndDate', customEndDate);
				}

				const response = await fetch('?/getRingkasanData', {
					method: 'POST',
					body: formData
				});

				const result = await response.json();
				
				if (result.type === 'success') {
					const { parse } = await import('devalue');
					const deserializedData = parse(result.data);
					const reportData = Array.isArray(deserializedData) ? deserializedData[0] : deserializedData;
					
					if (!reportData || !reportData.data) {
						throw new Error('Data laporan tidak valid');
					}
					
					const { exportRingkasanExcel } = await import('$lib/exportUtils');
					await exportRingkasanExcel(reportData);
				} else {
					throw new Error(result.errors?.[0]?.message || 'Gagal mengambil data laporan');
				}
			} catch (error) {
				console.error('Error exporting Excel:', error);
				alert(`Gagal mengekspor Excel: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`);
			} finally {
				isExporting = false;
				closeFilterModal();
			}
			return;
		}

		// Handle Stok Gudang Pusat
		if (selectedLaporan === 'stok-pusat') {
			isExporting = true;
			try {
				const response = await fetch('?/getStokPusatData', {
					method: 'POST',
					body: new FormData()
				});

				const result = await response.json();
				
				if (result.type === 'success') {
					const { parse } = await import('devalue');
					const deserializedData = parse(result.data);
					const reportData = Array.isArray(deserializedData) ? deserializedData[0] : deserializedData;
					
					if (!reportData || !reportData.data) {
						throw new Error('Data laporan tidak valid');
					}
					
					const { exportStokPusatExcel } = await import('$lib/exportUtils');
					await exportStokPusatExcel(reportData);
				} else {
					throw new Error(result.errors?.[0]?.message || 'Gagal mengambil data laporan');
				}
			} catch (error) {
				console.error('Error exporting Excel:', error);
				alert(`Gagal mengekspor Excel: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`);
			} finally {
				isExporting = false;
				closeFilterModal();
			}
			return;
		}

		// Handle Laporan Penjualan
		if (selectedLaporan === 'penjualan') {
			isExporting = true;
			try {
				const formData = new FormData();
				formData.append('periode', filterPeriode);
				if (filterPeriode === 'custom') {
					formData.append('customStartDate', customStartDate);
					formData.append('customEndDate', customEndDate);
				}
				formData.append('tokoId', filterToko);

				const response = await fetch('?/getPenjualanData', {
					method: 'POST',
					body: formData
				});

				const result = await response.json();
				
				if (result.type === 'success') {
					const { parse } = await import('devalue');
					const deserializedData = parse(result.data);
					const reportData = Array.isArray(deserializedData) ? deserializedData[0] : deserializedData;
					
					if (!reportData || !reportData.data) {
						throw new Error('Data laporan tidak valid');
					}
					
					const { exportPenjualanExcel } = await import('$lib/exportUtils');
					await exportPenjualanExcel(reportData);
				} else {
					throw new Error(result.errors?.[0]?.message || 'Gagal mengambil data laporan');
				}
			} catch (error) {
				console.error('Error exporting Excel:', error);
				alert(`Gagal mengekspor Excel: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`);
			} finally {
				isExporting = false;
				closeFilterModal();
			}
			return;
		}

		// Other reports
		alert(`Ekspor Excel untuk ${selectedLaporan} akan segera diimplementasikan`);
		closeFilterModal();
	}
</script>

<svelte:head>
	<title>Ekspor Laporan - Admin</title>
</svelte:head>

<!-- Breadcrumb -->
<div class="mb-6">
	<div
		class="flex items-center gap-2 text-sm text-[#5f6b6f]"
		style="font-family: 'Inter', sans-serif;"
	>
		<span>Utilitas</span>
		<span>›</span>
		<span class="text-[#2c3437] font-medium">Ekspor Laporan</span>
	</div>
</div>

<!-- Header -->
<div class="mb-6 lg:mb-8">
	<h1
		class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2c3437] mb-2"
		style="font-family: 'Manrope', sans-serif;"
	>
		Ekspor Laporan
	</h1>
	<p class="text-[#5f6b6f] text-sm md:text-base">
		Pilih jenis laporan yang ingin diekspor ke format PDF atau Excel
	</p>
</div>

<!-- Info Banner -->
<div class="bg-[#d1e4ea] border-l-4 border-[#306677] rounded-lg p-4 mb-6">
	<div class="flex items-start gap-3">
		<svg
			class="w-5 h-5 text-[#306677] shrink-0 mt-0.5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<div>
			<p class="text-sm font-semibold text-[#2c3437] mb-1">Informasi Ekspor Laporan</p>
			<p class="text-sm text-[#5f6b6f]">
				Setiap laporan dapat diekspor secara terpisah dengan filter yang sesuai. Laporan akan
				mencakup data sesuai periode dan filter yang Anda pilih.
			</p>
		</div>
	</div>
</div>

<!-- Laporan Cards Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
	{#each laporanCategories as laporan}
		<div class="bg-[#ffffff] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
			<!-- Card Header with Gradient -->
			<div class="bg-gradient-to-r {laporan.color} p-5 text-white">
				<div class="flex items-start justify-between mb-3">
					<div class="w-12 h-12 rounded-lg {laporan.bgColor} flex items-center justify-center">
						<svg class="w-6 h-6 {laporan.iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={laporan.icon} />
						</svg>
					</div>
					<span class="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold">
						{laporan.filters.length === 0 ? 'Tanpa Filter' : `${laporan.filters.length} Filter`}
					</span>
				</div>
				<h3 class="text-lg font-bold mb-1" style="font-family: 'Manrope', sans-serif;">
					{laporan.title}
				</h3>
			</div>

			<!-- Card Body -->
			<div class="p-5">
				<p class="text-sm text-[#5f6b6f] mb-4 min-h-[3rem]">
					{laporan.description}
				</p>

				{#if laporan.filters.length > 0}
					<div class="flex items-center gap-2 mb-4 text-xs text-[#5f6b6f]">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
							/>
						</svg>
						<span>Filter: {getFilterLabel(laporan.id)}</span>
					</div>
				{/if}

				<!-- Export Buttons -->
				<div class="flex gap-2">
					<button
						on:click={() => openFilterModal(laporan.id)}
						class="flex-1 px-4 py-2.5 bg-[#306677] text-white rounded-md text-sm font-semibold hover:bg-[#225a6a] transition-colors flex items-center justify-center gap-2"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
						PDF
					</button>
					<button
						on:click={() => openFilterModal(laporan.id)}
						class="flex-1 px-4 py-2.5 bg-[#3f6754] text-white rounded-md text-sm font-semibold hover:bg-[#2d4a3c] transition-colors flex items-center justify-center gap-2"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						Excel
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>

<!-- Filter Modal -->
{#if showFilterModal && selectedLaporan}
	{@const laporan = laporanCategories.find((l) => l.id === selectedLaporan)}
	<div
		class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
		on:click={closeFilterModal}
		on:keydown={(e) => e.key === 'Escape' && closeFilterModal()}
		role="button"
		tabindex="0"
	>
		<div
			class="bg-[#ffffff] rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			tabindex="-1"
		>
			<div class="flex items-start justify-between mb-4">
				<div>
					<h3
						class="text-xl font-bold text-[#2c3437] mb-1"
						style="font-family: 'Manrope', sans-serif;"
					>
						{laporan?.title}
					</h3>
					<p class="text-sm text-[#5f6b6f]">Pilih filter dan format ekspor</p>
				</div>
				<button
					on:click={closeFilterModal}
					class="text-[#5f6b6f] hover:text-[#2c3437] transition-colors"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Filters -->
			<div class="space-y-4 mb-6">
				{#if laporan?.filters.includes('periode')}
					<div>
						<label class="block text-sm font-semibold text-[#2c3437] mb-2">Periode</label>
						<select
							bind:value={filterPeriode}
							class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
						>
							<option value="7">7 Hari Terakhir</option>
							<option value="30">30 Hari Terakhir</option>
							<option value="90">90 Hari Terakhir</option>
							<option value="custom">Custom Range</option>
						</select>

						{#if filterPeriode === 'custom'}
							<div class="grid grid-cols-2 gap-3 mt-3">
								<div>
									<label class="block text-xs text-[#5f6b6f] mb-1">Dari Tanggal</label>
									<input
										type="date"
										bind:value={customStartDate}
										class="w-full px-3 py-2 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
									/>
								</div>
								<div>
									<label class="block text-xs text-[#5f6b6f] mb-1">Sampai Tanggal</label>
									<input
										type="date"
										bind:value={customEndDate}
										class="w-full px-3 py-2 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
									/>
								</div>
							</div>
						{/if}
					</div>
				{/if}

				{#if laporan?.filters.includes('toko')}
					<div>
						<label class="block text-sm font-semibold text-[#2c3437] mb-2">Toko</label>
						<select
							bind:value={filterToko}
							class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
						>
							<option value="semua">Semua Toko</option>
							{#each data.tokoList as toko}
								<option value={toko.id}>{toko.nama_toko}</option>
							{/each}
						</select>
					</div>
				{/if}

				{#if laporan?.filters.includes('status')}
					<div>
						<label class="block text-sm font-semibold text-[#2c3437] mb-2">Status</label>
						<select
							bind:value={filterStatus}
							class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
						>
							<option value="semua">Semua Status</option>
							<option value="pending">Pending</option>
							<option value="disetujui">Disetujui</option>
							<option value="ditolak">Ditolak</option>
						</select>
					</div>
				{/if}

				{#if laporan?.filters.includes('role')}
					<div>
						<label class="block text-sm font-semibold text-[#2c3437] mb-2">Role</label>
						<select
							bind:value={filterRole}
							class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
						>
							<option value="semua">Semua Role</option>
							<option value="admin">Admin</option>
							<option value="kasir">Kasir</option>
						</select>
					</div>
				{/if}
			</div>

			<!-- Export Buttons -->
			<div class="flex flex-col sm:flex-row gap-3">
				<button
					on:click={exportPDF}
					disabled={isExporting}
					class="flex-1 px-5 py-3 bg-[#306677] text-white rounded-md text-sm font-semibold hover:bg-[#225a6a] transition-colors flex items-center justify-center gap-2 disabled:bg-[#acb3b7] disabled:cursor-not-allowed"
				>
					{#if isExporting}
						<svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						Memproses...
					{:else}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
						Ekspor PDF
					{/if}
				</button>
				<button
					on:click={exportExcel}
					disabled={isExporting}
					class="flex-1 px-5 py-3 bg-[#3f6754] text-white rounded-md text-sm font-semibold hover:bg-[#2d4a3c] transition-colors flex items-center justify-center gap-2 disabled:bg-[#acb3b7] disabled:cursor-not-allowed"
				>
					{#if isExporting}
						<svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						Memproses...
					{:else}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						Ekspor Excel
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

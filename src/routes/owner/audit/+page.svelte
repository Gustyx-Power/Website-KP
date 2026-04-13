<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getActionBadgeClass(action: string): string {
		const classes: Record<string, string> = {
			INBOUND: 'bg-blue-100 text-blue-800',
			PENJUALAN: 'bg-green-100 text-green-800',
			DISTRIBUSI_CREATE: 'bg-purple-100 text-purple-800',
			DISTRIBUSI_APPROVE: 'bg-emerald-100 text-emerald-800',
			DISTRIBUSI_REJECT: 'bg-red-100 text-red-800',
			RETUR_CREATE: 'bg-orange-100 text-orange-800',
			RETUR_APPROVE: 'bg-teal-100 text-teal-800',
			UPDATE_STOK: 'bg-indigo-100 text-indigo-800',
			DELETE_USER: 'bg-red-100 text-red-800',
			DELETE_TOKO: 'bg-red-100 text-red-800',
			DELETE_KATEGORI: 'bg-red-100 text-red-800'
		};
		return classes[action] || 'bg-slate-100 text-slate-800';
	}

	function getActionLabel(action: string): string {
		const labels: Record<string, string> = {
			INBOUND: 'Stok Masuk',
			PENJUALAN: 'Penjualan',
			DISTRIBUSI_CREATE: 'Buat Distribusi',
			DISTRIBUSI_APPROVE: 'Setujui Distribusi',
			DISTRIBUSI_REJECT: 'Tolak Distribusi',
			RETUR_CREATE: 'Buat Retur',
			RETUR_APPROVE: 'Setujui Retur',
			UPDATE_STOK: 'Update Stok',
			DELETE_USER: 'Hapus User',
			DELETE_TOKO: 'Hapus Toko',
			DELETE_KATEGORI: 'Hapus Kategori'
		};
		return labels[action] || action;
	}

	// Filter state
	let showFilters = false;

	// Build query string for pagination
	function buildQueryString(page: number): string {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		if (data.currentFilters.action && data.currentFilters.action !== 'ALL') {
			params.set('action', data.currentFilters.action);
		}
		if (data.currentFilters.userId && data.currentFilters.userId !== 'ALL') {
			params.set('userId', data.currentFilters.userId);
		}
		if (data.currentFilters.tokoId) {
			params.set('tokoId', data.currentFilters.tokoId.toString());
		}
		if (data.currentFilters.startDate) {
			params.set('startDate', data.currentFilters.startDate);
		}
		if (data.currentFilters.endDate) {
			params.set('endDate', data.currentFilters.endDate);
		}
		return '?' + params.toString();
	}
</script>

<svelte:head>
	<title>Audit Log - Owner Dashboard</title>
</svelte:head>

<!-- Header -->
<div class="mb-6 md:mb-8">
	<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
		<div>
			<h1 class="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Audit Log</h1>
			<p class="text-slate-500 mt-1 md:mt-2 text-sm md:text-base">Riwayat lengkap semua aktivitas sistem untuk transparansi dan kontrol.</p>
		</div>
		<button
			on:click={() => (showFilters = !showFilters)}
			class="px-4 py-2 bg-[#306677] text-white rounded-lg text-sm font-medium hover:bg-[#254f5d] transition-colors flex items-center justify-center gap-2 w-full md:w-auto"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
			</svg>
			{showFilters ? 'Sembunyikan' : 'Tampilkan'} Filter
		</button>
	</div>

	<!-- Filter Panel -->
	{#if showFilters}
		<div class="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 mb-4 md:mb-6">
			<form method="GET" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
				<div>
					<label for="action" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Aktivitas</label>
					<select
						id="action"
						name="action"
						class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#306677] focus:border-[#306677] outline-none"
					>
						<option value="ALL">Semua Aktivitas</option>
						{#each data.filters.actions as action}
							<option value={action} selected={data.currentFilters.action === action}>
								{getActionLabel(action)}
							</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="userId" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">User</label>
					<select
						id="userId"
						name="userId"
						class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#306677] focus:border-[#306677] outline-none"
					>
						<option value="ALL">Semua User</option>
						{#each data.filters.users as user}
							<option value={user.id} selected={data.currentFilters.userId === user.id}>
								{user.name} ({user.role})
							</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="tokoId" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Toko</label>
					<select
						id="tokoId"
						name="tokoId"
						class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#306677] focus:border-[#306677] outline-none"
					>
						<option value="">Semua Toko</option>
						{#each data.filters.tokos as toko}
							<option value={toko.id} selected={data.currentFilters.tokoId === toko.id}>
								{toko.nama_toko}
							</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="startDate" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Dari Tanggal</label>
					<input
						type="date"
						id="startDate"
						name="startDate"
						value={data.currentFilters.startDate || ''}
						class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#306677] focus:border-[#306677] outline-none"
					/>
				</div>

				<div>
					<label for="endDate" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Sampai Tanggal</label>
					<input
						type="date"
						id="endDate"
						name="endDate"
						value={data.currentFilters.endDate || ''}
						class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#306677] focus:border-[#306677] outline-none"
					/>
				</div>

				<div class="md:col-span-2 lg:col-span-5 flex flex-col md:flex-row gap-2 md:gap-3">
					<button
						type="submit"
						class="px-6 py-2 bg-[#306677] text-white rounded-lg text-sm font-medium hover:bg-[#254f5d] transition-colors"
					>
						Terapkan Filter
					</button>
					<a
						href="/owner/audit"
						class="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors text-center"
					>
						Reset
					</a>
				</div>
			</form>
		</div>
	{/if}

	<!-- Stats Summary -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
		<div class="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
			<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Records</p>
			<p class="text-xl md:text-2xl font-bold text-[#306677]">{data.pagination.totalCount.toLocaleString('id-ID')}</p>
		</div>
		<div class="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
			<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Halaman</p>
			<p class="text-xl md:text-2xl font-bold text-[#306677]">{data.pagination.currentPage} / {data.pagination.totalPages}</p>
		</div>
		<div class="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
			<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Per Halaman</p>
			<p class="text-xl md:text-2xl font-bold text-[#306677]">{data.pagination.limit}</p>
		</div>
	</div>
</div>

<!-- Audit Log Table/Cards -->
<div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
	<!-- Desktop Table View -->
	<div class="hidden lg:block overflow-x-auto">
		<table class="w-full">
			<thead class="bg-slate-50 border-b border-slate-200">
				<tr>
					<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Timestamp</th>
					<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
					<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Aktivitas</th>
					<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Deskripsi</th>
					<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Toko</th>
					<th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Kategori</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each data.logs as log}
					<tr class="hover:bg-slate-50 transition-colors">
						<td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
							{formatDate(log.timestamp)}
						</td>
						<td class="px-6 py-4 text-sm">
							<div class="font-medium text-slate-800">{log.userName}</div>
							<div class="text-xs text-slate-500">{log.userRole}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span class="px-2 py-1 text-xs font-semibold rounded-full {getActionBadgeClass(log.action)}">
								{getActionLabel(log.action)}
							</span>
						</td>
						<td class="px-6 py-4 text-sm text-slate-700 max-w-md">
							{log.description}
						</td>
						<td class="px-6 py-4 text-sm text-slate-600">
							{log.tokoName || '-'}
						</td>
						<td class="px-6 py-4 text-sm text-slate-600">
							{log.kategoriName || '-'}
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="px-6 py-12 text-center text-slate-500">
							<svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<p>Tidak ada data audit log yang ditemukan.</p>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Mobile Card View -->
	<div class="lg:hidden divide-y divide-slate-100">
		{#each data.logs as log}
			<div class="p-4 hover:bg-slate-50 transition-colors">
				<div class="flex items-start justify-between mb-3">
					<div class="flex-1">
						<div class="font-medium text-slate-800 text-sm mb-1">{log.userName}</div>
						<div class="text-xs text-slate-500">{log.userRole}</div>
					</div>
					<span class="px-2 py-1 text-xs font-semibold rounded-full {getActionBadgeClass(log.action)} whitespace-nowrap ml-2">
						{getActionLabel(log.action)}
					</span>
				</div>
				
				<div class="text-sm text-slate-700 mb-3 leading-relaxed">
					{log.description}
				</div>
				
				<div class="grid grid-cols-2 gap-2 text-xs mb-3">
					{#if log.tokoName}
						<div>
							<span class="text-slate-500">Toko:</span>
							<span class="text-slate-700 font-medium ml-1">{log.tokoName}</span>
						</div>
					{/if}
					{#if log.kategoriName}
						<div>
							<span class="text-slate-500">Kategori:</span>
							<span class="text-slate-700 font-medium ml-1">{log.kategoriName}</span>
						</div>
					{/if}
				</div>
				
				<div class="text-xs text-slate-500 flex items-center gap-1">
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					{formatDate(log.timestamp)}
				</div>
			</div>
		{:else}
			<div class="px-4 py-12 text-center text-slate-500">
				<svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<p class="text-sm">Tidak ada data audit log yang ditemukan.</p>
			</div>
		{/each}
	</div>

	<!-- Pagination -->
	{#if data.pagination.totalPages > 1}
		<div class="px-4 md:px-6 py-4 border-t border-slate-200">
			<!-- Mobile Pagination -->
			<div class="flex flex-col gap-3 md:hidden">
				<p class="text-xs text-slate-600 text-center">
					Menampilkan {((data.pagination.currentPage - 1) * data.pagination.limit) + 1} - 
					{Math.min(data.pagination.currentPage * data.pagination.limit, data.pagination.totalCount)} 
					dari {data.pagination.totalCount} records
				</p>
				<div class="flex items-center justify-center gap-2">
					{#if data.pagination.currentPage > 1}
						<a
							href="{buildQueryString(data.pagination.currentPage - 1)}"
							class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
						>
							← Prev
						</a>
					{/if}
					
					<span class="px-4 py-2 bg-[#306677] text-white rounded-lg text-sm font-medium">
						{data.pagination.currentPage}
					</span>
					
					{#if data.pagination.currentPage < data.pagination.totalPages}
						<a
							href="{buildQueryString(data.pagination.currentPage + 1)}"
							class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
						>
							Next →
						</a>
					{/if}
				</div>
			</div>

			<!-- Desktop Pagination -->
			<div class="hidden md:flex items-center justify-between">
				<p class="text-sm text-slate-600">
					Menampilkan {((data.pagination.currentPage - 1) * data.pagination.limit) + 1} - 
					{Math.min(data.pagination.currentPage * data.pagination.limit, data.pagination.totalCount)} 
					dari {data.pagination.totalCount} records
				</p>
				<div class="flex gap-2">
					{#if data.pagination.currentPage > 1}
						<a
							href="{buildQueryString(data.pagination.currentPage - 1)}"
							class="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
						>
							Previous
						</a>
					{/if}
					
					<span class="px-3 py-1 bg-[#306677] text-white rounded-lg text-sm font-medium">
						{data.pagination.currentPage}
					</span>
					
					{#if data.pagination.currentPage < data.pagination.totalPages}
						<a
							href="{buildQueryString(data.pagination.currentPage + 1)}"
							class="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
						>
							Next
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

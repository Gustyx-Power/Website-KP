<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	$: pendingCount = data.returList.filter((r) => r.status === 'PENDING').length;
	$: approvedCount = data.returList.filter((r) => r.status === 'DISETUJUI').length;
	$: rejectedCount = data.returList.filter((r) => r.status === 'DITOLAK').length;
</script>

<svelte:head>
	<title>Status Retur</title>
</svelte:head>

<div class="mb-4">
	<h1 class="text-xl font-bold text-slate-800">Status Retur Barang</h1>
	<p class="text-slate-500 text-sm mt-1">Pantau status permintaan retur Anda</p>
</div>

<!-- Stats -->
<div class="grid grid-cols-3 gap-3 mb-6">
	<div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
		<div class="text-center">
			<div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
				<svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<p class="text-2xl font-bold text-slate-800">{pendingCount}</p>
			<p class="text-xs text-slate-500 mt-1">Pending</p>
		</div>
	</div>

	<div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
		<div class="text-center">
			<div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
				<svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>
			<p class="text-2xl font-bold text-slate-800">{approvedCount}</p>
			<p class="text-xs text-slate-500 mt-1">Disetujui</p>
		</div>
	</div>

	<div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
		<div class="text-center">
			<div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
				<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</div>
			<p class="text-2xl font-bold text-slate-800">{rejectedCount}</p>
			<p class="text-xs text-slate-500 mt-1">Ditolak</p>
		</div>
	</div>
</div>

<!-- Return List -->
<div class="space-y-3">
	{#each data.returList as retur}
		<div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
			<!-- Header -->
			<div class="flex items-start justify-between mb-3">
				<div class="flex-1">
					<div class="flex items-center gap-2 mb-1">
						<h3 class="font-semibold text-slate-800">Retur #{retur.id}</h3>
						{#if retur.status === 'PENDING'}
							<span
								class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
							>
								Menunggu Persetujuan
							</span>
						{:else if retur.status === 'DISETUJUI'}
							<span
								class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
							>
								Disetujui
							</span>
						{:else if retur.status === 'DITOLAK'}
							<span
								class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
							>
								Ditolak
							</span>
						{/if}
					</div>
					<p class="text-xs text-slate-500">{formatDate(retur.tanggal)}</p>
				</div>
			</div>

			<!-- Item Details -->
			<div class="bg-slate-50 rounded-lg p-3 mb-3">
				<div class="flex justify-between items-center mb-2">
					<span class="text-sm font-semibold text-slate-700">{retur.kategori.nama_kategori}</span>
					<span class="text-lg font-bold text-slate-800">{retur.qty_retur} pcs</span>
				</div>
				{#if retur.keterangan}
					<div class="mt-2 pt-2 border-t border-slate-200">
						<p class="text-xs text-slate-500 mb-1">Alasan Retur:</p>
						<p class="text-sm text-slate-700">{retur.keterangan}</p>
					</div>
				{/if}
			</div>

			<!-- Status Info -->
			{#if retur.status === 'PENDING'}
				<div class="bg-amber-50 border border-amber-200 rounded-lg p-3">
					<div class="flex items-start gap-2">
						<svg
							class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div class="flex-1">
							<p class="text-sm font-semibold text-amber-800">Menunggu Persetujuan Admin</p>
							<p class="text-xs text-amber-700 mt-1">
								Permintaan retur Anda sedang ditinjau oleh admin gudang pusat.
							</p>
						</div>
					</div>
				</div>
			{:else if retur.status === 'DISETUJUI'}
				<div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
					<div class="flex items-start gap-2">
						<svg
							class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div class="flex-1">
							<p class="text-sm font-semibold text-emerald-800">Retur Disetujui!</p>
							<p class="text-xs text-emerald-700 mt-1">
								Barang telah dikembalikan ke gudang pusat. Stok Anda telah dikurangi sebanyak {retur.qty_retur} pcs.
							</p>
						</div>
					</div>
				</div>
			{:else if retur.status === 'DITOLAK'}
				<div class="bg-red-50 border border-red-200 rounded-lg p-3">
					<div class="flex items-start gap-2">
						<svg
							class="w-5 h-5 text-red-600 shrink-0 mt-0.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
						<div class="flex-1">
							<p class="text-sm font-semibold text-red-800">Retur Ditolak</p>
							{#if retur.keterangan && retur.keterangan.includes('DITOLAK:')}
								<p class="text-xs text-red-700 mt-1">
									{retur.keterangan.split('DITOLAK:')[1]?.trim() || 'Tidak ada alasan'}
								</p>
							{:else}
								<p class="text-xs text-red-700 mt-1">
									Permintaan retur Anda ditolak oleh admin.
								</p>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-100">
			<svg
				class="w-16 h-16 text-slate-300 mx-auto mb-3"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
				/>
			</svg>
			<p class="text-slate-500">Belum ada riwayat retur</p>
			<a
				href="/kasir/retur"
				class="inline-block mt-3 text-sm text-emerald-600 font-medium hover:text-emerald-700"
			>
				Ajukan retur barang →
			</a>
		</div>
	{/each}
</div>

<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;

	let isProcessing = false;

	function formatRupiah(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	$: pendingCount = data.distribusiList.filter((d) => d.status === 'PENDING').length;
	$: dikirimCount = data.distribusiList.filter((d) => d.status === 'DIKIRIM').length;
	$: diterimaCount = data.distribusiList.filter(
		(d) => d.status === 'DITERIMA' && !d.keterangan?.startsWith('DITOLAK')
	).length;
</script>

<svelte:head>
	<title>Status Distribusi</title>
</svelte:head>

<div class="mb-4">
	<h1 class="text-xl font-bold text-slate-800">Status Distribusi</h1>
	<p class="text-slate-500 text-sm mt-1">Pantau status permintaan stok Anda</p>
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
			<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
				<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
					/>
				</svg>
			</div>
			<p class="text-2xl font-bold text-slate-800">{dikirimCount}</p>
			<p class="text-xs text-slate-500 mt-1">Dikirim</p>
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
			<p class="text-2xl font-bold text-slate-800">{diterimaCount}</p>
			<p class="text-xs text-slate-500 mt-1">Diterima</p>
		</div>
	</div>
</div>

<!-- Distribution List -->
<div class="space-y-3">
	{#each data.distribusiList as distribusi}
		<div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
			<!-- Header -->
			<div class="flex items-start justify-between mb-3">
				<div class="flex-1">
					<div class="flex items-center gap-2 mb-1">
						<h3 class="font-semibold text-slate-800">Distribusi #{distribusi.id}</h3>
						{#if distribusi.status === 'PENDING'}
							<span
								class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
							>
								Menunggu Persetujuan
							</span>
						{:else if distribusi.status === 'DIKIRIM'}
							<span
								class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-pulse"
							>
								Dalam Pengiriman
							</span>
						{:else if distribusi.status === 'DITERIMA'}
							{#if distribusi.keterangan?.startsWith('DITOLAK')}
								<span
									class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
								>
									Ditolak
								</span>
							{:else}
								<span
									class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
								>
									Diterima
								</span>
							{/if}
						{/if}
					</div>
					<p class="text-xs text-slate-500">{formatDate(distribusi.tanggal)}</p>
				</div>
			</div>

			<!-- Items -->
			<div class="bg-slate-50 rounded-lg p-3 mb-3">
				<p class="text-xs font-semibold text-slate-600 mb-2">Item yang Diminta:</p>
				<div class="space-y-1">
					{#each distribusi.items as item}
						<div class="flex justify-between text-sm">
							<span class="text-slate-700">{item.kategori.nama_kategori}</span>
							<span class="font-semibold text-slate-800">{item.jumlah} pcs</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Total -->
			<div class="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
				<span class="text-sm text-slate-600">Total Modal:</span>
				<span class="text-lg font-bold text-slate-800">{formatRupiah(distribusi.totalModal)}</span>
			</div>

			<!-- Actions -->
			{#if distribusi.status === 'DIKIRIM'}
				<div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
					<div class="flex items-start gap-2">
						<svg
							class="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
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
						<div class="flex-1">
							<p class="text-sm font-semibold text-blue-800">Barang Sudah Dikirim!</p>
							<p class="text-xs text-blue-700 mt-1">
								Konfirmasi penerimaan barang setelah Anda menerima fisik barang di toko.
							</p>
						</div>
					</div>
				</div>

				<form method="POST" action="?/confirmReceived" use:enhance={() => {
					isProcessing = true;
					return async ({ update }) => {
						await update();
						isProcessing = false;
					};
				}}>
					<input type="hidden" name="distribusiId" value={distribusi.id} />
					<button
						type="submit"
						disabled={isProcessing}
						class="w-full py-2.5 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
					>
						{isProcessing ? 'Memproses...' : '✓ Konfirmasi Barang Diterima'}
					</button>
				</form>
			{:else if distribusi.status === 'PENDING'}
				<div class="text-center py-2">
					<p class="text-sm text-slate-500">Menunggu persetujuan dari admin gudang pusat</p>
				</div>
			{:else if distribusi.status === 'DITERIMA'}
				{#if distribusi.keterangan?.startsWith('DITOLAK')}
					<div class="bg-red-50 border border-red-200 rounded-lg p-3">
						<p class="text-sm font-semibold text-red-800 mb-1">Alasan Penolakan:</p>
						<p class="text-xs text-red-700">
							{distribusi.keterangan.replace('DITOLAK: ', '')}
						</p>
					</div>
				{:else}
					<div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
						<div class="flex items-center gap-2">
							<svg
								class="w-5 h-5 text-emerald-600"
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
								<p class="text-sm font-semibold text-emerald-800">Barang Telah Diterima</p>
								{#if distribusi.keterangan}
									<p class="text-xs text-emerald-700 mt-1">{distribusi.keterangan}</p>
								{/if}
							</div>
						</div>
					</div>
				{/if}
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
					d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
				/>
			</svg>
			<p class="text-slate-500">Belum ada riwayat distribusi</p>
			<a
				href="/kasir/permintaan"
				class="inline-block mt-3 text-sm text-emerald-600 font-medium hover:text-emerald-700"
			>
				Buat permintaan stok →
			</a>
		</div>
	{/each}
</div>

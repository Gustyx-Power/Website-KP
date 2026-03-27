<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;

	let selectedDistribusi: any = null;
	let showRejectModal = false;
	let rejectReason = '';
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

	function openRejectModal(distribusi: any) {
		selectedDistribusi = distribusi;
		showRejectModal = true;
		rejectReason = '';
	}

	function closeRejectModal() {
		showRejectModal = false;
		selectedDistribusi = null;
		rejectReason = '';
	}

	$: pendingCount = data.distribusiList.filter((d) => d.status === 'PENDING').length;
	$: dikirimCount = data.distribusiList.filter((d) => d.status === 'DIKIRIM').length;
</script>

<svelte:head>
	<title>Kelola Distribusi - Admin</title>
</svelte:head>

<div class="mb-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Kelola Distribusi Stok</h1>
			<p class="text-slate-500 mt-1">Kelola permintaan stok dari cabang toko</p>
		</div>
		<a 
			href="/admin/distribusi/buat"
			class="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Buat Distribusi Baru
		</a>
	</div>
</div>

<!-- Stats -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
	<div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
		<div class="flex items-center gap-3">
			<div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
				<svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<div>
				<p class="text-sm text-slate-500">Menunggu Persetujuan</p>
				<p class="text-2xl font-bold text-slate-800">{pendingCount}</p>
			</div>
		</div>
	</div>

	<div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
		<div class="flex items-center gap-3">
			<div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
				<svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>
			<div>
				<p class="text-sm text-slate-500">Disetujui & Dikirim</p>
				<p class="text-2xl font-bold text-slate-800">{dikirimCount}</p>
			</div>
		</div>
	</div>

	<div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
		<div class="flex items-center gap-3">
			<div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
				<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					/>
				</svg>
			</div>
			<div>
				<p class="text-sm text-slate-500">Total Permintaan</p>
				<p class="text-2xl font-bold text-slate-800">{data.distribusiList.length}</p>
			</div>
		</div>
	</div>
</div>

<!-- Distribution List -->
<div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
	<div class="p-6 border-b border-slate-100">
		<h2 class="text-lg font-semibold text-slate-800">Daftar Permintaan Distribusi</h2>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-slate-50 border-b border-slate-100">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
						Tanggal
					</th>
					<th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
						Toko Tujuan
					</th>
					<th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
						Diminta Oleh
					</th>
					<th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
						Item
					</th>
					<th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
						Total Modal
					</th>
					<th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
						Status
					</th>
					<th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
						Aksi
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each data.distribusiList as distribusi}
					<tr class="hover:bg-slate-50 transition-colors">
						<td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
							{formatDate(distribusi.tanggal)}
						</td>
						<td class="px-6 py-4 text-sm">
							<p class="font-semibold text-slate-800">{distribusi.tokoTujuan.nama_toko}</p>
							<p class="text-xs text-slate-500">{distribusi.tokoTujuan.alamat || '-'}</p>
						</td>
						<td class="px-6 py-4 text-sm text-slate-600">
							{distribusi.createdBy.name}
						</td>
						<td class="px-6 py-4 text-sm">
							<details class="cursor-pointer">
								<summary class="text-emerald-600 font-medium hover:text-emerald-700">
									{distribusi.items.length} item ({distribusi.items.reduce(
										(sum, item) => sum + item.jumlah,
										0
									)} pcs)
								</summary>
								<ul class="mt-2 space-y-1 text-xs text-slate-600">
									{#each distribusi.items as item}
										<li>• {item.kategori.nama_kategori}: {item.jumlah} pcs</li>
									{/each}
								</ul>
							</details>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
							{formatRupiah(distribusi.totalModal)}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							{#if distribusi.status === 'PENDING'}
								<span
									class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
								>
									Pending
								</span>
							{:else if distribusi.status === 'DIKIRIM'}
								<span
									class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
								>
									Disetujui
								</span>
							{:else if distribusi.status === 'DITERIMA'}
								{#if distribusi.keterangan?.startsWith('DITOLAK')}
									<span
										class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
									>
										Ditolak
									</span>
								{:else}
									<span
										class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
									>
										Diterima
									</span>
								{/if}
							{/if}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm">
							{#if distribusi.status === 'PENDING'}
								<div class="flex gap-2">
									<form method="POST" action="?/approve" use:enhance={() => {
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
											class="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors disabled:bg-slate-300"
										>
											Setujui
										</button>
									</form>
									<button
										on:click={() => openRejectModal(distribusi)}
										class="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
									>
										Tolak
									</button>
								</div>
							{:else}
								<span class="text-slate-400 text-xs">-</span>
							{/if}
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="7" class="px-6 py-12 text-center text-slate-500">
							Belum ada permintaan distribusi
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<!-- Reject Modal -->
{#if showRejectModal && selectedDistribusi}
	<div
		class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
		on:click={closeRejectModal}
		on:keydown={(e) => e.key === 'Escape' && closeRejectModal()}
		role="button"
		tabindex="0"
	>
		<div
			class="bg-white rounded-2xl p-6 max-w-md w-full"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			tabindex="-1"
		>
			<h3 class="text-lg font-bold text-slate-800 mb-4">Tolak Permintaan Distribusi</h3>
			<p class="text-sm text-slate-600 mb-4">
				Anda akan menolak permintaan dari <span class="font-semibold"
					>{selectedDistribusi.tokoTujuan.nama_toko}</span
				>. Berikan alasan penolakan:
			</p>

			<form method="POST" action="?/reject" use:enhance={() => {
				isProcessing = true;
				return async ({ update }) => {
					await update();
					isProcessing = false;
					closeRejectModal();
				};
			}}>
				<input type="hidden" name="distribusiId" value={selectedDistribusi.id} />
				<textarea
					name="alasan"
					bind:value={rejectReason}
					rows="4"
					required
					class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
					placeholder="Contoh: Stok tidak mencukupi, permintaan terlalu besar, dll."
				></textarea>

				<div class="flex gap-3">
					<button
						type="button"
						on:click={closeRejectModal}
						class="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isProcessing || !rejectReason.trim()}
						class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:bg-slate-300"
					>
						{isProcessing ? 'Memproses...' : 'Tolak Permintaan'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

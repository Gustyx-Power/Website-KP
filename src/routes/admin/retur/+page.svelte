<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;

	let selectedRetur: any = null;
	let showRejectModal = false;
	let rejectReason = '';
	let isProcessing = false;
	let showCreateForm = false;

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function openRejectModal(retur: any) {
		selectedRetur = retur;
		showRejectModal = true;
		rejectReason = '';
	}

	function closeRejectModal() {
		showRejectModal = false;
		selectedRetur = null;
		rejectReason = '';
	}

	$: pendingCount = data.returList.filter((r) => r.status === 'PENDING').length;
	$: approvedCount = data.returList.filter((r) => r.status === 'DISETUJUI').length;
	$: rejectedCount = data.returList.filter((r) => r.status === 'DITOLAK').length;
</script>

<svelte:head>
	<title>Manajemen Retur - Admin</title>
</svelte:head>

<div class="mb-6">
	<h2 class="text-2xl font-bold text-slate-800">Manajemen Retur Barang</h2>
	<p class="text-slate-500 mt-1">Kelola permintaan retur dari cabang toko</p>
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
				<p class="text-sm text-slate-500">Disetujui</p>
				<p class="text-2xl font-bold text-slate-800">{approvedCount}</p>
			</div>
		</div>
	</div>

	<div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
		<div class="flex items-center gap-3">
			<div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
				<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</div>
			<div>
				<p class="text-sm text-slate-500">Ditolak</p>
				<p class="text-2xl font-bold text-slate-800">{rejectedCount}</p>
			</div>
		</div>
	</div>
</div>

<!-- Create Form Toggle -->
<div class="mb-6">
	<button
		on:click={() => (showCreateForm = !showCreateForm)}
		class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 4v16m8-8H4"
			/>
		</svg>
		{showCreateForm ? 'Sembunyikan Form' : 'Buat Retur Manual'}
	</button>
</div>

<!-- Create Form -->
{#if showCreateForm}
	<div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
		<h3 class="text-lg font-semibold text-slate-800 mb-4">Input Retur Baru (Manual)</h3>
		<p class="text-sm text-slate-500 mb-4">
			Gunakan form ini untuk mencatat retur yang sudah disetujui secara langsung
		</p>
		<form method="POST" action="?/create" use:enhance class="space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label for="id_toko" class="block text-sm font-medium text-slate-700 mb-1"
						>Toko *</label
					>
					<select
						id="id_toko"
						name="id_toko"
						required
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
					>
						<option value="" disabled selected>-- Pilih Toko --</option>
						{#each data.toko as t}
							<option value={t.id}>{t.nama_toko}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="id_kategori" class="block text-sm font-medium text-slate-700 mb-1"
						>Kategori Produk *</label
					>
					<select
						id="id_kategori"
						name="id_kategori"
						required
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
					>
						<option value="" disabled selected>-- Pilih Kategori --</option>
						{#each data.kategori as k}
							<option value={k.id}>{k.nama_kategori}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="qty_retur" class="block text-sm font-medium text-slate-700 mb-1"
						>Qty Retur *</label
					>
					<input
						type="number"
						id="qty_retur"
						name="qty_retur"
						min="1"
						required
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
					/>
				</div>
				<div>
					<label for="keterangan" class="block text-sm font-medium text-slate-700 mb-1"
						>Keterangan</label
					>
					<input
						type="text"
						id="keterangan"
						name="keterangan"
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
					/>
				</div>
			</div>
			<div class="flex justify-end mt-4">
				<button
					type="submit"
					class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
				>
					Simpan Retur
				</button>
			</div>
		</form>
	</div>
{/if}

<!-- Return Requests List -->
<div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
	<div class="p-6 border-b border-slate-100">
		<h3 class="text-lg font-semibold text-slate-800">Daftar Permintaan Retur</h3>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-slate-50 border-b border-slate-100">
				<tr>
					<th
						class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
					>
						Tanggal
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
					>
						Toko
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
					>
						Diminta Oleh
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
					>
						Kategori
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
					>
						Qty
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
					>
						Keterangan
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
					>
						Status
					</th>
					<th
						class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
					>
						Aksi
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each data.returList as retur}
					<tr class="hover:bg-slate-50 transition-colors">
						<td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
							{formatDate(retur.tanggal)}
						</td>
						<td class="px-6 py-4 text-sm">
							<p class="font-semibold text-slate-800">{retur.toko.nama_toko}</p>
							<p class="text-xs text-slate-500">{retur.toko.alamat || '-'}</p>
						</td>
						<td class="px-6 py-4 text-sm text-slate-600">
							{retur.createdBy.name}
						</td>
						<td class="px-6 py-4 text-sm font-medium text-slate-800">
							{retur.kategori.nama_kategori}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
							{retur.qty_retur} pcs
						</td>
						<td class="px-6 py-4 text-sm text-slate-600 max-w-xs">
							<div class="line-clamp-2">{retur.keterangan || '-'}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							{#if retur.status === 'PENDING'}
								<span
									class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
								>
									Pending
								</span>
							{:else if retur.status === 'DISETUJUI'}
								<span
									class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
								>
									Disetujui
								</span>
							{:else if retur.status === 'DITOLAK'}
								<span
									class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
								>
									Ditolak
								</span>
							{/if}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm">
							{#if retur.status === 'PENDING'}
								<div class="flex gap-2">
									<form method="POST" action="?/approve" use:enhance={() => {
										isProcessing = true;
										return async ({ update }) => {
											await update();
											isProcessing = false;
										};
									}}>
										<input type="hidden" name="returId" value={retur.id} />
										<button
											type="submit"
											disabled={isProcessing}
											class="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors disabled:bg-slate-300"
										>
											Setujui
										</button>
									</form>
									<button
										on:click={() => openRejectModal(retur)}
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
						<td colspan="8" class="px-6 py-12 text-center text-slate-500">
							Belum ada permintaan retur
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<!-- Reject Modal -->
{#if showRejectModal && selectedRetur}
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
			<h3 class="text-lg font-bold text-slate-800 mb-4">Tolak Permintaan Retur</h3>
			<p class="text-sm text-slate-600 mb-4">
				Anda akan menolak permintaan retur dari <span class="font-semibold"
					>{selectedRetur.toko.nama_toko}</span
				>
				untuk <span class="font-semibold"
					>{selectedRetur.qty_retur} pcs {selectedRetur.kategori.nama_kategori}</span
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
				<input type="hidden" name="returId" value={selectedRetur.id} />
				<textarea
					name="alasan"
					bind:value={rejectReason}
					rows="4"
					required
					class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
					placeholder="Contoh: Barang masih dalam kondisi baik, tidak ada cacat yang terlihat"
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

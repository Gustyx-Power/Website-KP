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
	<title>Kelola Distribusi - Inventory Hub</title>
</svelte:head>

<!-- Breadcrumb -->
<div class="mb-6">
	<div class="flex items-center gap-2 text-sm text-[#5f6b6f]" style="font-family: 'Inter', sans-serif;">
		<span>Operasional</span>
		<span>›</span>
		<span class="text-[#2c3437] font-medium">Distribusi Stok</span>
	</div>
</div>

<!-- Header -->
<div class="mb-6 lg:mb-8">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2c3437] mb-2" style="font-family: 'Manrope', sans-serif;">
				Kelola Distribusi Stok
			</h1>
			<p class="text-[#5f6b6f] text-sm md:text-base">Kelola permintaan stok dari cabang toko</p>
		</div>
		<a 
			href="/admin/distribusi/buat"
			class="px-4 md:px-5 py-2.5 bg-gradient-to-r from-[#306677] to-[#225a6a] text-white rounded-md text-sm font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			<span class="hidden sm:inline">Buat Distribusi Baru</span>
			<span class="sm:hidden">Distribusi Baru</span>
		</a>
	</div>
</div>

<!-- Stats -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 lg:mb-8">
	<div class="bg-[#ffffff] rounded-xl p-5 md:p-6">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-amber-100 flex items-center justify-center">
				<svg class="w-5 h-5 md:w-6 md:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<div>
				<p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-1">Menunggu</p>
				<p class="text-2xl md:text-3xl font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">{pendingCount}</p>
			</div>
		</div>
	</div>

	<div class="bg-[#ffffff] rounded-xl p-5 md:p-6">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#c8e6d7] flex items-center justify-center">
				<svg class="w-5 h-5 md:w-6 md:h-6 text-[#3f6754]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>
			<div>
				<p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-1">Disetujui</p>
				<p class="text-2xl md:text-3xl font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">{dikirimCount}</p>
			</div>
		</div>
	</div>

	<div class="bg-[#ffffff] rounded-xl p-5 md:p-6">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#d1e4ea] flex items-center justify-center">
				<svg class="w-5 h-5 md:w-6 md:h-6 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					/>
				</svg>
			</div>
			<div>
				<p class="text-xs uppercase tracking-wider text-[#5f6b6f] font-semibold mb-1">Total</p>
				<p class="text-2xl md:text-3xl font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">{data.distribusiList.length}</p>
			</div>
		</div>
	</div>
</div>

<!-- Distribution List -->
<div class="bg-[#ffffff] rounded-xl overflow-hidden">
	<div class="p-5 md:p-6 border-b border-[#e4e9ed]">
		<h2 class="text-base md:text-lg font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">Daftar Permintaan Distribusi</h2>
	</div>

	<!-- Desktop Table View -->
	<div class="hidden lg:block overflow-x-auto">
		<table class="w-full">
			<thead class="bg-[#f0f4f7]">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-semibold text-[#5f6b6f] uppercase tracking-wider">
						Tanggal
					</th>
					<th class="px-6 py-3 text-left text-xs font-semibold text-[#5f6b6f] uppercase tracking-wider">
						Toko Tujuan
					</th>
					<th class="px-6 py-3 text-left text-xs font-semibold text-[#5f6b6f] uppercase tracking-wider">
						Diminta Oleh
					</th>
					<th class="px-6 py-3 text-left text-xs font-semibold text-[#5f6b6f] uppercase tracking-wider">
						Item
					</th>
					<th class="px-6 py-3 text-left text-xs font-semibold text-[#5f6b6f] uppercase tracking-wider">
						Total Modal
					</th>
					<th class="px-6 py-3 text-left text-xs font-semibold text-[#5f6b6f] uppercase tracking-wider">
						Status
					</th>
					<th class="px-6 py-3 text-left text-xs font-semibold text-[#5f6b6f] uppercase tracking-wider">
						Aksi
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[#e4e9ed]">
				{#each data.distribusiList as distribusi}
					<tr class="hover:bg-[#f0f4f7] transition-colors">
						<td class="px-6 py-4 whitespace-nowrap text-sm text-[#5f6b6f]">
							{formatDate(distribusi.tanggal)}
						</td>
						<td class="px-6 py-4 text-sm">
							<p class="font-semibold text-[#2c3437]">{distribusi.tokoTujuan.nama_toko}</p>
							<p class="text-xs text-[#5f6b6f]">{distribusi.tokoTujuan.alamat || '-'}</p>
						</td>
						<td class="px-6 py-4 text-sm text-[#5f6b6f]">
							{distribusi.createdBy.name}
						</td>
						<td class="px-6 py-4 text-sm">
							<details class="cursor-pointer">
								<summary class="text-[#306677] font-semibold hover:text-[#225a6a]">
									{distribusi.items.length} item ({distribusi.items.reduce(
										(sum, item) => sum + item.jumlah,
										0
									)} pcs)
								</summary>
								<ul class="mt-2 space-y-1 text-xs text-[#5f6b6f]">
									{#each distribusi.items as item}
										<li>• {item.kategori.nama_kategori}: {item.jumlah} pcs</li>
									{/each}
								</ul>
							</details>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#2c3437]">
							{formatRupiah(distribusi.totalModal)}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							{#if distribusi.status === 'PENDING'}
								<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 uppercase tracking-wide">
									Pending
								</span>
							{:else if distribusi.status === 'DIKIRIM'}
								<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#c8e6d7] text-[#1f3329] uppercase tracking-wide">
									Disetujui
								</span>
							{:else if distribusi.status === 'DITERIMA'}
								{#if distribusi.keterangan?.startsWith('DITOLAK')}
									<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 uppercase tracking-wide">
										Ditolak
									</span>
								{:else}
									<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#d1e4ea] text-[#306677] uppercase tracking-wide">
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
											class="px-3 py-1.5 bg-[#306677] text-white rounded-md text-xs font-semibold hover:bg-[#225a6a] transition-colors disabled:bg-[#acb3b7] uppercase tracking-wide"
										>
											Setujui
										</button>
									</form>
									<button
										on:click={() => openRejectModal(distribusi)}
										class="px-3 py-1.5 bg-red-500 text-white rounded-md text-xs font-semibold hover:bg-red-600 transition-colors uppercase tracking-wide"
									>
										Tolak
									</button>
								</div>
							{:else}
								<span class="text-[#acb3b7] text-xs">-</span>
							{/if}
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="7" class="px-6 py-12 text-center text-[#5f6b6f]">
							Belum ada permintaan distribusi
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Mobile Card View -->
	<div class="lg:hidden p-4 space-y-4">
		{#each data.distribusiList as distribusi}
			<div class="bg-[#f0f4f7] rounded-lg p-4">
				<div class="flex items-start justify-between mb-3">
					<div class="flex-1">
						<h3 class="font-bold text-[#2c3437] mb-1">{distribusi.tokoTujuan.nama_toko}</h3>
						<p class="text-xs text-[#5f6b6f]">{formatDate(distribusi.tanggal)}</p>
					</div>
					<div>
						{#if distribusi.status === 'PENDING'}
							<span class="px-2 py-1 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-full uppercase tracking-wide">Pending</span>
						{:else if distribusi.status === 'DIKIRIM'}
							<span class="px-2 py-1 text-[10px] font-semibold bg-[#c8e6d7] text-[#1f3329] rounded-full uppercase tracking-wide">Disetujui</span>
						{:else if distribusi.status === 'DITERIMA'}
							{#if distribusi.keterangan?.startsWith('DITOLAK')}
								<span class="px-2 py-1 text-[10px] font-semibold bg-red-100 text-red-800 rounded-full uppercase tracking-wide">Ditolak</span>
							{:else}
								<span class="px-2 py-1 text-[10px] font-semibold bg-[#d1e4ea] text-[#306677] rounded-full uppercase tracking-wide">Diterima</span>
							{/if}
						{/if}
					</div>
				</div>

				<div class="space-y-2 mb-3">
					<div>
						<p class="text-xs text-[#5f6b6f] uppercase tracking-wider font-semibold mb-1">Diminta Oleh</p>
						<p class="text-sm font-semibold text-[#2c3437]">{distribusi.createdBy.name}</p>
					</div>
					<div>
						<p class="text-xs text-[#5f6b6f] uppercase tracking-wider font-semibold mb-1">Item</p>
						<details class="cursor-pointer">
							<summary class="text-sm text-[#306677] font-semibold">
								{distribusi.items.length} item ({distribusi.items.reduce((sum, item) => sum + item.jumlah, 0)} pcs)
							</summary>
							<ul class="mt-2 space-y-1 text-xs text-[#5f6b6f] ml-4">
								{#each distribusi.items as item}
									<li>• {item.kategori.nama_kategori}: {item.jumlah} pcs</li>
								{/each}
							</ul>
						</details>
					</div>
					<div>
						<p class="text-xs text-[#5f6b6f] uppercase tracking-wider font-semibold mb-1">Total Modal</p>
						<p class="text-base font-bold text-[#2c3437]">{formatRupiah(distribusi.totalModal)}</p>
					</div>
				</div>

				{#if distribusi.status === 'PENDING'}
					<div class="flex gap-2">
						<form method="POST" action="?/approve" use:enhance={() => {
							isProcessing = true;
							return async ({ update }) => {
								await update();
								isProcessing = false;
							};
						}} class="flex-1">
							<input type="hidden" name="distribusiId" value={distribusi.id} />
							<button
								type="submit"
								disabled={isProcessing}
								class="w-full px-3 py-2.5 bg-[#306677] text-white rounded-md text-xs font-semibold hover:bg-[#225a6a] transition-colors disabled:bg-[#acb3b7] uppercase tracking-wide"
							>
								Setujui
							</button>
						</form>
						<button
							on:click={() => openRejectModal(distribusi)}
							class="flex-1 px-3 py-2.5 bg-red-500 text-white rounded-md text-xs font-semibold hover:bg-red-600 transition-colors uppercase tracking-wide"
						>
							Tolak
						</button>
					</div>
				{/if}
			</div>
		{:else}
			<div class="py-12 text-center text-[#5f6b6f]">
				<svg class="w-16 h-16 mx-auto text-[#acb3b7] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
				</svg>
				<p>Belum ada permintaan distribusi</p>
			</div>
		{/each}
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
			class="bg-[#ffffff] rounded-xl p-5 md:p-6 max-w-md w-full"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			tabindex="-1"
		>
			<h3 class="text-base md:text-lg font-bold text-[#2c3437] mb-3 md:mb-4" style="font-family: 'Manrope', sans-serif;">Tolak Permintaan Distribusi</h3>
			<p class="text-sm text-[#5f6b6f] mb-4">
				Anda akan menolak permintaan dari <span class="font-semibold text-[#2c3437]">{selectedDistribusi.tokoTujuan.nama_toko}</span>. Berikan alasan penolakan:
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
					class="w-full px-4 py-3 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-red-500/20 outline-none mb-4"
					placeholder="Contoh: Stok tidak mencukupi, permintaan terlalu besar, dll."
				></textarea>

				<div class="flex flex-col sm:flex-row gap-3">
					<button
						type="button"
						on:click={closeRejectModal}
						class="flex-1 px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm font-semibold hover:bg-[#d8dfe8] transition-colors"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isProcessing || !rejectReason.trim()}
						class="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition-colors disabled:bg-[#acb3b7]"
					>
						{isProcessing ? 'Memproses...' : 'Tolak Permintaan'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	export let data: PageData;

	interface CartItem {
		id_kategori: number;
		nama_kategori: string;
		jumlah: number;
		harga_modal: number;
		available: number;
	}

	let cart: CartItem[] = [];
	let keterangan = '';
	let targetProfit = 30; // Default 30% profit margin
	let isSubmitting = false;

	// Add item to cart
	function addToCart(stok: any) {
		const existing = cart.find((item) => item.id_kategori === stok.id_kategori);
		if (existing) {
			if (existing.jumlah < stok.jumlah) {
				existing.jumlah++;
			}
		} else {
			cart.push({
				id_kategori: stok.id_kategori,
				nama_kategori: stok.kategori.nama_kategori,
				jumlah: 1,
				harga_modal: stok.harga_modal,
				available: stok.jumlah
			});
		}
		cart = cart;
	}

	// Remove item from cart
	function removeFromCart(id_kategori: number) {
		cart = cart.filter((item) => item.id_kategori !== id_kategori);
	}

	// Update quantity
	function updateQuantity(id_kategori: number, delta: number) {
		const item = cart.find((i) => i.id_kategori === id_kategori);
		if (item) {
			const newQty = item.jumlah + delta;
			if (newQty > 0 && newQty <= item.available) {
				item.jumlah = newQty;
				cart = cart;
			}
		}
	}

	// Calculate totals
	$: totalModal = cart.reduce((sum, item) => sum + item.harga_modal * item.jumlah, 0);
	$: totalItems = cart.reduce((sum, item) => sum + item.jumlah, 0);
	$: suggestedPrice = totalModal * (1 + targetProfit / 100);
	$: expectedProfit = suggestedPrice - totalModal;

	// Format currency
	function formatRupiah(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	// Check for success message
	$: showSuccess = $page.url.searchParams.get('success') === 'true';
</script>

<svelte:head>
	<title>Permintaan Stok</title>
</svelte:head>

{#if showSuccess}
	<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
		<div class="flex items-start gap-3">
			<svg
				class="w-6 h-6 text-emerald-600 shrink-0"
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
			<div>
				<h3 class="font-bold text-emerald-800">Permintaan Berhasil Dikirim!</h3>
				<p class="text-sm text-emerald-700 mt-1">
					Permintaan stok Anda telah dikirim ke gudang pusat. Tunggu persetujuan admin.
				</p>
			</div>
		</div>
	</div>
{/if}

<div class="mb-4">
	<h1 class="text-xl font-bold text-slate-800">Permintaan Stok</h1>
	<p class="text-slate-500 text-sm mt-1">Ajukan permintaan barang dari gudang pusat</p>
</div>

<!-- Pending Requests -->
{#if data.pendingRequests && data.pendingRequests.length > 0}
	<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
		<h3 class="font-semibold text-amber-800 mb-2">Permintaan Pending</h3>
		{#each data.pendingRequests as req}
			<div class="bg-white rounded-lg p-3 mb-2">
				<p class="text-sm text-slate-600">
					{new Date(req.tanggal).toLocaleDateString('id-ID')} - {req.items.length} item
				</p>
				<p class="text-xs text-amber-600 font-medium mt-1">Menunggu persetujuan admin</p>
			</div>
		{/each}
	</div>
{/if}

<div class="grid lg:grid-cols-2 gap-4">
	<!-- Available Stock -->
	<div>
		<h3 class="font-semibold text-slate-800 mb-3">Stok Tersedia di Gudang Pusat</h3>
		<div class="space-y-2">
			{#each data.stokPusat as stok}
				<div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<h4 class="font-semibold text-slate-800">{stok.kategori.nama_kategori}</h4>
							<p class="text-sm text-slate-500 mt-1">
								Tersedia: <span class="font-semibold text-emerald-600">{stok.jumlah} pcs</span>
							</p>
							<p class="text-xs text-slate-400 mt-1">
								Harga Modal: {formatRupiah(stok.harga_modal)}/pcs
							</p>
						</div>
						<button
							on:click={() => addToCart(stok)}
							class="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
						>
							+ Tambah
						</button>
					</div>
				</div>
			{:else}
				<div class="bg-slate-50 rounded-xl p-8 text-center">
					<p class="text-slate-500">Tidak ada stok tersedia di gudang pusat</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Cart -->
	<div class="lg:sticky lg:top-4 lg:self-start">
		<div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
			<h3 class="font-semibold text-slate-800 mb-3">Keranjang Permintaan</h3>

			{#if cart.length === 0}
				<div class="text-center py-8">
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
							d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
						/>
					</svg>
					<p class="text-slate-500 text-sm">Keranjang kosong</p>
				</div>
			{:else}
				<div class="space-y-3 mb-4">
					{#each cart as item}
						<div class="bg-slate-50 rounded-lg p-3">
							<div class="flex items-start justify-between mb-2">
								<h4 class="font-medium text-slate-800 text-sm">{item.nama_kategori}</h4>
								<button
									on:click={() => removeFromCart(item.id_kategori)}
									class="text-red-500 hover:text-red-700"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<button
										on:click={() => updateQuantity(item.id_kategori, -1)}
										class="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
									>
										-
									</button>
									<span class="w-12 text-center font-semibold text-slate-800"
										>{item.jumlah}</span
									>
									<button
										on:click={() => updateQuantity(item.id_kategori, 1)}
										class="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
									>
										+
									</button>
								</div>
								<p class="text-sm font-semibold text-slate-700">
									{formatRupiah(item.harga_modal * item.jumlah)}
								</p>
							</div>
						</div>
					{/each}
				</div>

				<!-- Profit Calculator -->
				<div class="bg-emerald-50 rounded-lg p-4 mb-4">
					<h4 class="font-semibold text-emerald-800 mb-3 text-sm">Kalkulator Target Profit</h4>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span class="text-slate-600">Total Modal:</span>
							<span class="font-semibold text-slate-800">{formatRupiah(totalModal)}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-slate-600">Target Profit:</span>
							<div class="flex items-center gap-2">
								<input
									type="number"
									bind:value={targetProfit}
									min="0"
									max="100"
									class="w-16 px-2 py-1 border border-emerald-200 rounded text-center"
								/>
								<span class="font-semibold text-slate-800">%</span>
							</div>
						</div>
						<div class="border-t border-emerald-200 pt-2 mt-2">
							<div class="flex justify-between">
								<span class="text-slate-600">Harga Jual Disarankan:</span>
								<span class="font-bold text-emerald-700">{formatRupiah(suggestedPrice)}</span>
							</div>
							<div class="flex justify-between mt-1">
								<span class="text-slate-600">Profit yang Diharapkan:</span>
								<span class="font-bold text-emerald-700">{formatRupiah(expectedProfit)}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Summary -->
				<div class="bg-slate-50 rounded-lg p-3 mb-4">
					<div class="flex justify-between text-sm mb-1">
						<span class="text-slate-600">Total Item:</span>
						<span class="font-semibold text-slate-800">{totalItems} pcs</span>
					</div>
					<div class="flex justify-between">
						<span class="text-slate-600">Total Modal:</span>
						<span class="font-bold text-slate-800">{formatRupiah(totalModal)}</span>
					</div>
				</div>

				<!-- Keterangan -->
				<div class="mb-4">
					<label for="keterangan" class="block text-sm font-medium text-slate-700 mb-2">
						Keterangan (Opsional)
					</label>
					<textarea
						id="keterangan"
						bind:value={keterangan}
						rows="3"
						class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
						placeholder="Tambahkan catatan untuk permintaan ini..."
					></textarea>
				</div>

				<!-- Submit -->
				<form method="POST" action="?/request" use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
						cart = [];
						keterangan = '';
					};
				}}>
					<input type="hidden" name="items" value={JSON.stringify(cart)} />
					<input type="hidden" name="keterangan" value={keterangan} />
					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Mengirim...' : 'Kirim Permintaan'}
					</button>
				</form>
			{/if}
		</div>
	</div>
</div>

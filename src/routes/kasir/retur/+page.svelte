<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	let isSubmitting = false;

	function submitEnhance() {
		isSubmitting = true;
		return async ({ update }: { update: any }) => {
			await update();
			isSubmitting = false;
		};
	}
</script>

<svelte:head>
	<title>Retur Barang</title>
</svelte:head>

<div class="mb-5">
	<h1 class="text-xl font-bold text-slate-800">Retur Barang</h1>
	<p class="text-slate-500 text-sm mt-1">Kembalikan produk cacat/tak laku ke Gudang Pusat.</p>
</div>

{#if form?.error}
	<div class="mb-5 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 shadow-sm flex items-start gap-3">
		<svg class="w-5 h-5 shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
		<span>{form.error}</span>
	</div>
{/if}

{#if form?.success}
	<div class="mb-5 p-4 bg-emerald-50 text-emerald-800 text-sm rounded-xl border border-emerald-200 shadow-sm flex items-start gap-3">
		<svg class="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
		<span>Berhasil! Permintaan retur telah dikirim. Menunggu persetujuan Admin/Gudang Utama untuk diproses lebih lanjut.</span>
	</div>
{/if}

<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-8">
	<form method="POST" action="?/retur" use:enhance={submitEnhance} class="space-y-4">
		<div>
			<label for="id_kategori" class="block text-sm font-medium text-slate-700 mb-1.5">Barang yang Diretur *</label>
			<select
				id="id_kategori"
				name="id_kategori"
				required
				class="w-full px-4 py-3 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 focus:bg-white transition-colors appearance-none"
			>
				<option value="" disabled selected>-- Pilih Kategori Pakaian --</option>
				{#each data.stokToko as s}
					<option value={s.id_kategori}>{s.kategori.nama_kategori} (Tersedia: {s.jumlah} pcs)</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="qty_retur" class="block text-sm font-medium text-slate-700 mb-1.5">Jumlah Retur (Pcs) *</label>
			<div class="relative">
				<input
					type="number"
					id="qty_retur"
					name="qty_retur"
					min="1"
					required
					placeholder="Cth: 1"
					class="w-full px-4 py-3 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 focus:bg-white transition-colors"
				/>
				<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-medium">
					pcs
				</div>
			</div>
		</div>

		<div>
			<label for="keterangan" class="block text-sm font-medium text-slate-700 mb-1.5">Keterangan / Alasan (Opsional)</label>
            <textarea
                id="keterangan"
                name="keterangan"
                rows="3"
                placeholder="Cth: Ada cacat sobek pada bagian lengan."
                class="w-full px-4 py-3 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 focus:bg-white transition-colors resize-none"
            ></textarea>
		</div>

		<div class="pt-4">
			<button
				type="submit"
				disabled={isSubmitting || data.stokToko.length === 0}
				class="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:text-slate-500 text-white font-semibold rounded-xl transition-colors shadow-sm focus:ring-4 focus:ring-orange-200 active:scale-[0.98] transform duration-150 flex items-center justify-center gap-2"
			>
				{#if isSubmitting}
					<svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Mengajukan...
				{:else}
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
					</svg>
					Ajukan Retur
				{/if}
			</button>
		</div>
	</form>
</div>

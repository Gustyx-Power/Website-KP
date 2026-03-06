<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Manajemen Stok - AdminPanel</title>
</svelte:head>

<div class="mb-6">
	<h2 class="text-2xl font-bold text-slate-800">Inbound Stok Pusat</h2>
	<p class="text-slate-500 mt-1">Input modal stok perdana khusus ke Gudang Pusat sebelum didistribusikan.</p>
</div>

<div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
	<h3 class="text-lg font-semibold text-slate-800 mb-4">Tambah Stok Masuk (Inbound)</h3>
	<form method="POST" action="?/create" class="space-y-4">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="id_toko" class="block text-sm font-medium text-slate-700 mb-1">Pilih Gudang Pusat *</label>
				<select
					id="id_toko"
					name="id_toko"
					required
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white max-h-48 overflow-y-auto"
				>
					<option value="" disabled selected>-- Pilih Gudang Pusat --</option>
					{#each data.toko as t}
						<option value={t.id}>{t.nama_toko}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="id_kategori" class="block text-sm font-medium text-slate-700 mb-1"
					>Kategori *</label
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
				<label for="jumlah" class="block text-sm font-medium text-slate-700 mb-1">Jumlah *</label>
				<input
					type="number"
					id="jumlah"
					name="jumlah"
					min="0"
					required
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
				/>
			</div>
			<div>
				<label for="harga_modal" class="block text-sm font-medium text-slate-700 mb-1"
					>Harga Modal (Rp) *</label
				>
				<input
					type="number"
					id="harga_modal"
					name="harga_modal"
					min="0"
					required
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
				/>
			</div>
		</div>
		<div class="flex justify-end mt-4">
			<button
				type="submit"
				class="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
			>
				Simpan Ke Gudang
			</button>
		</div>
	</form>
</div>

<div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
	<div class="overflow-x-auto">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-slate-50 border-b border-slate-100">
					<th class="py-4 px-6 font-medium text-slate-600">ID</th>
					<th class="py-4 px-6 font-medium text-slate-600">Cabang/Gudang</th>
					<th class="py-4 px-6 font-medium text-slate-600">Kategori Produk</th>
					<th class="py-4 px-6 font-medium text-slate-600 text-right">Sisa Fisik Stok</th>
					<th class="py-4 px-6 font-medium text-slate-600 text-right">Harga Modal/Pcs</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each data.stok as item}
					<tr class="hover:bg-slate-50 transition-colors">
						<td class="py-3 px-6 text-sm text-slate-500">{item.id}</td>
						<td class="py-3 px-6 font-medium text-slate-800">
							{item.toko.nama_toko}
							{#if item.toko.is_pusat}
								<span class="ml-2 px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-700 rounded-lg uppercase font-bold">Pusat</span>
							{/if}
						</td>
						<td class="py-3 px-6 text-slate-600">{item.kategori.nama_kategori}</td>
						<td class="py-3 px-6 text-right font-medium text-slate-800">
							<span class="px-2.5 py-1 bg-slate-100 rounded-md">{item.jumlah} pcs</span>
						</td>
						<td class="py-3 px-6 text-right text-slate-600"
							>Rp {item.harga_modal.toLocaleString('id-ID')}</td
						>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="py-8 text-center text-slate-500">Belum ada data stok.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

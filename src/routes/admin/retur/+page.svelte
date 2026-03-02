<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Manajemen Retur - AdminPanel</title>
</svelte:head>

<div class="mb-6">
	<h2 class="text-2xl font-bold text-slate-800">Manajemen Retur</h2>
	<p class="text-slate-500 mt-1">Catat retur barang dan tambah stok otomatis.</p>
</div>

<div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
	<h3 class="text-lg font-semibold text-slate-800 mb-4">Input Retur Baru</h3>
	<form method="POST" action="?/create" class="space-y-4">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="id_toko" class="block text-sm font-medium text-slate-700 mb-1">Toko *</label>
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

<div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
	<div class="overflow-x-auto">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-slate-50 border-b border-slate-100">
					<th class="py-4 px-6 font-medium text-slate-600">ID</th>
					<th class="py-4 px-6 font-medium text-slate-600">Toko</th>
					<th class="py-4 px-6 font-medium text-slate-600">Kategori</th>
					<th class="py-4 px-6 font-medium text-slate-600 text-right">Qty Retur</th>
					<th class="py-4 px-6 font-medium text-slate-600">Keterangan</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each data.retur as item}
					<tr class="hover:bg-slate-50 transition-colors">
						<td class="py-3 px-6 text-sm text-slate-500">{item.id}</td>
						<td class="py-3 px-6 font-medium text-slate-800">{item.toko.nama_toko}</td>
						<td class="py-3 px-6 text-slate-600">{item.kategori.nama_kategori}</td>
						<td class="py-3 px-6 text-right font-medium text-slate-800">{item.qty_retur}</td>
						<td class="py-3 px-6 text-sm text-slate-600">{item.keterangan || '-'}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="py-8 text-center text-slate-500">Belum ada data retur.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

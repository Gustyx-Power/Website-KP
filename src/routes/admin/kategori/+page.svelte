<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Manajemen Kategori - AdminPanel</title>
</svelte:head>

<div class="mb-6">
	<h2 class="text-2xl font-bold text-slate-800">Manajemen Kategori</h2>
	<p class="text-slate-500 mt-1">Kelola kategori produk.</p>
</div>

<div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
	<h3 class="text-lg font-semibold text-slate-800 mb-4">Tambah Kategori Baru</h3>
	<form method="POST" action="?/create" class="space-y-4">
		<div>
			<label for="nama_kategori" class="block text-sm font-medium text-slate-700 mb-1"
				>Nama Kategori *</label
			>
			<input
				type="text"
				id="nama_kategori"
				name="nama_kategori"
				required
				class="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
			/>
		</div>
		<div>
			<button
				type="submit"
				class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
			>
				Simpan Kategori
			</button>
		</div>
	</form>
</div>

<div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
	<div class="overflow-x-auto">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-slate-50 border-b border-slate-100">
					<th class="py-4 px-6 font-medium text-slate-600 w-24">ID</th>
					<th class="py-4 px-6 font-medium text-slate-600">Nama Kategori</th>
					<th class="py-4 px-6 font-medium text-slate-600 w-32 text-center">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each data.kategori as item}
					<tr class="hover:bg-slate-50 transition-colors">
						<td class="py-3 px-6 text-sm text-slate-500">{item.id}</td>
						<td class="py-3 px-6 font-medium text-slate-800">{item.nama_kategori}</td>
						<td class="py-3 px-6 text-center">
							<form method="POST" action="?/delete" class="inline">
								<input type="hidden" name="id" value={item.id} />
								<button
									type="submit"
									class="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
									onclick={(e) => {
										if (!confirm('Hapus data ini?')) e.preventDefault();
									}}
								>
									Hapus
								</button>
							</form>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="3" class="py-8 text-center text-slate-500">Belum ada data kategori.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

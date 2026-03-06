<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Manajemen Toko - AdminPanel</title>
</svelte:head>

<div class="mb-6">
	<h2 class="text-2xl font-bold text-slate-800">Manajemen Toko</h2>
	<p class="text-slate-500 mt-1">Kelola data toko cabang.</p>
</div>

<!-- Add Form -->
<div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
	<h3 class="text-lg font-semibold text-slate-800 mb-4">Tambah Toko Baru</h3>
	<form method="POST" action="?/create" class="space-y-4">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="nama_toko" class="block text-sm font-medium text-slate-700 mb-1"
					>Nama Toko *</label
				>
				<input
					type="text"
					id="nama_toko"
					name="nama_toko"
					required
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
				/>
			</div>
			<div>
				<label for="alamat" class="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
				<input
					type="text"
					id="alamat"
					name="alamat"
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
				/>
			</div>
		</div>
		<div class="flex items-center gap-2 mt-4 select-none">
			<input
				type="checkbox"
				id="is_pusat"
				name="is_pusat"
				class="w-4 h-4 text-emerald-600 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2"
			/>
			<label for="is_pusat" class="text-sm font-medium text-slate-700 cursor-pointer"
				>Tandai sebagai Gudang Pusat (Bukan Cabang)</label
			>
		</div>
		<div class="flex justify-end mt-4">
			<button
				type="submit"
				class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
			>
				Simpan Toko
			</button>
		</div>
	</form>
</div>

<!-- Table -->
<div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
	<div class="overflow-x-auto">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-slate-50 border-b border-slate-100">
					<th class="py-4 px-6 font-medium text-slate-600">ID</th>
					<th class="py-4 px-6 font-medium text-slate-600">Nama Toko</th>
					<th class="py-4 px-6 font-medium text-slate-600">Tipe</th>
					<th class="py-4 px-6 font-medium text-slate-600">Alamat</th>
					<th class="py-4 px-6 font-medium text-slate-600 text-center">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each data.toko as item}
					<tr class="hover:bg-slate-50 transition-colors">
						<td class="py-3 px-6 text-sm text-slate-500">{item.id}</td>
						<td class="py-3 px-6 font-medium text-slate-800">{item.nama_toko}</td>
						<td class="py-3 px-6">
							{#if item.is_pusat}
								<span class="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">Gudang Pusat</span>
							{:else}
								<span class="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-full">Cabang</span>
							{/if}
						</td>
						<td class="py-3 px-6 text-sm text-slate-600">{item.alamat || '-'}</td>
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
						<td colspan="4" class="py-8 text-center text-slate-500">Belum ada data toko.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

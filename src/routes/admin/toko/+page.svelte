<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Manajemen Toko - Inventory Hub</title>
</svelte:head>

<!-- Breadcrumb -->
<div class="mb-6">
	<div class="flex items-center gap-2 text-sm text-[#5f6b6f]" style="font-family: 'Inter', sans-serif;">
		<span>Manajemen</span>
		<span>›</span>
		<span class="text-[#2c3437] font-medium">Toko Cabang</span>
	</div>
</div>

<!-- Header -->
<div class="mb-6 lg:mb-8">
	<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2c3437] mb-2" style="font-family: 'Manrope', sans-serif;">
		Manajemen Toko
	</h1>
	<p class="text-[#5f6b6f] text-sm md:text-base">
		Kelola data toko cabang dan gudang pusat.
	</p>
</div>

<!-- Add Form -->
<div class="bg-[#ffffff] rounded-xl p-5 md:p-6 mb-6 lg:mb-8">
	<div class="flex items-center gap-3 mb-5 md:mb-6">
		<div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#d1e4ea] flex items-center justify-center">
			<svg class="w-5 h-5 md:w-6 md:h-6 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
			</svg>
		</div>
		<div>
			<h2 class="text-base md:text-lg font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">Tambah Toko Baru</h2>
		</div>
	</div>
	<form method="POST" action="?/create" class="space-y-4">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="nama_toko" class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">Nama Toko *</label>
				<input
					type="text"
					id="nama_toko"
					name="nama_toko"
					required
					class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
				/>
			</div>
			<div>
				<label for="alamat" class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">Alamat</label>
				<input
					type="text"
					id="alamat"
					name="alamat"
					class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
				/>
			</div>
		</div>
		<div class="flex items-center gap-3 mt-4 select-none p-4 bg-[#f0f4f7] rounded-lg">
			<input
				type="checkbox"
				id="is_pusat"
				name="is_pusat"
				class="w-4 h-4 text-[#306677] bg-[#e4e9ed] border-[#acb3b7] rounded focus:ring-[#306677] focus:ring-2"
			/>
			<label for="is_pusat" class="text-sm font-medium text-[#2c3437] cursor-pointer">
				Tandai sebagai Gudang Pusat (Bukan Cabang)
			</label>
		</div>
		<div class="flex justify-end mt-6">
			<button
				type="submit"
				class="w-full md:w-auto px-6 py-3 bg-[#306677] text-white font-semibold rounded-md hover:bg-[#225a6a] transition-colors text-sm"
			>
				Simpan Toko
			</button>
		</div>
	</form>
</div>

<!-- Table -->
<div class="bg-[#ffffff] rounded-xl overflow-hidden">
	<!-- Desktop Table View -->
	<div class="hidden md:block overflow-x-auto">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-[#f0f4f7]">
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider">ID</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider">Nama Toko</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider">Tipe</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider">Alamat</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider text-center">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[#e4e9ed]">
				{#each data.toko as item}
					<tr class="hover:bg-[#f0f4f7] transition-colors">
						<td class="py-4 px-6 text-sm text-[#5f6b6f] font-mono">#{item.id}</td>
						<td class="py-4 px-6 font-semibold text-[#2c3437]">{item.nama_toko}</td>
						<td class="py-4 px-6">
							{#if item.is_pusat}
								<span class="px-3 py-1 text-xs font-semibold text-[#306677] bg-[#d1e4ea] rounded-full uppercase tracking-wide">Gudang Pusat</span>
							{:else}
								<span class="px-3 py-1 text-xs font-semibold text-[#5f6b6f] bg-[#e4e9ed] rounded-full uppercase tracking-wide">Cabang</span>
							{/if}
						</td>
						<td class="py-4 px-6 text-sm text-[#5f6b6f]">{item.alamat || '-'}</td>
						<td class="py-4 px-6 text-center">
							<form method="POST" action="?/delete" class="inline">
								<input type="hidden" name="id" value={item.id} />
								<button
									type="submit"
									class="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md transition-colors uppercase tracking-wide"
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
						<td colspan="5" class="py-12 text-center text-[#5f6b6f]">Belum ada data toko.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Mobile Card View -->
	<div class="md:hidden p-4 space-y-4">
		{#each data.toko as item}
			<div class="bg-[#f0f4f7] rounded-lg p-4">
				<div class="flex items-start justify-between mb-3">
					<div class="flex-1">
						<div class="flex items-center gap-2 mb-2">
							<p class="text-xs text-[#5f6b6f] font-mono">#{item.id}</p>
							{#if item.is_pusat}
								<span class="px-2 py-1 text-[10px] font-semibold text-[#306677] bg-[#d1e4ea] rounded-full uppercase tracking-wide">Pusat</span>
							{:else}
								<span class="px-2 py-1 text-[10px] font-semibold text-[#5f6b6f] bg-[#e4e9ed] rounded-full uppercase tracking-wide">Cabang</span>
							{/if}
						</div>
						<h3 class="font-bold text-[#2c3437] text-base mb-1">{item.nama_toko}</h3>
						<p class="text-sm text-[#5f6b6f]">{item.alamat || 'Alamat tidak tersedia'}</p>
					</div>
				</div>

				<form method="POST" action="?/delete" class="w-full">
					<input type="hidden" name="id" value={item.id} />
					<button
						type="submit"
						class="w-full text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2.5 rounded-md transition-colors uppercase tracking-wide"
						onclick={(e) => {
							if (!confirm('Hapus data ini?')) e.preventDefault();
						}}
					>
						Hapus Toko
					</button>
				</form>
			</div>
		{:else}
			<div class="py-12 text-center text-[#5f6b6f]">
				<svg class="w-16 h-16 mx-auto text-[#acb3b7] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
				</svg>
				<p>Belum ada data toko.</p>
			</div>
		{/each}
	</div>
</div>

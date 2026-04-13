<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Manajemen Kategori - Inventory Hub</title>
</svelte:head>

<!-- Breadcrumb -->
<div class="mb-6">
	<div class="flex items-center gap-2 text-sm text-[#5f6b6f]" style="font-family: 'Inter', sans-serif;">
		<span>Manajemen</span>
		<span>›</span>
		<span class="text-[#2c3437] font-medium">Kategori Produk</span>
	</div>
</div>

<!-- Header -->
<div class="mb-6 lg:mb-8">
	<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2c3437] mb-2" style="font-family: 'Manrope', sans-serif;">
		Manajemen Kategori
	</h1>
	<p class="text-[#5f6b6f] text-sm md:text-base">
		Kelola kategori produk untuk sistem inventaris.
	</p>
</div>

<div class="bg-[#ffffff] rounded-xl p-5 md:p-6 mb-6 lg:mb-8">
	<div class="flex items-center gap-3 mb-5 md:mb-6">
		<div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#d1e4ea] flex items-center justify-center">
			<svg class="w-5 h-5 md:w-6 md:h-6 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
			</svg>
		</div>
		<div>
			<h2 class="text-base md:text-lg font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">Tambah Kategori Baru</h2>
		</div>
	</div>
	<form method="POST" action="?/create" class="space-y-4">
		<div>
			<label for="nama_kategori" class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">Nama Kategori *</label>
			<input
				type="text"
				id="nama_kategori"
				name="nama_kategori"
				required
				placeholder="Contoh: Kaos Dewasa, Celana Anak, dll."
				class="w-full md:w-2/3 lg:w-1/2 px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
			/>
		</div>
		<div>
			<button
				type="submit"
				class="w-full md:w-auto px-6 py-3 bg-[#306677] text-white font-semibold rounded-md hover:bg-[#225a6a] transition-colors text-sm"
			>
				Simpan Kategori
			</button>
		</div>
	</form>
</div>

<div class="bg-[#ffffff] rounded-xl overflow-hidden">
	<!-- Desktop Table View -->
	<div class="hidden md:block overflow-x-auto">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-[#f0f4f7]">
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider w-24">ID</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider">Nama Kategori</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider w-32 text-center">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[#e4e9ed]">
				{#each data.kategori as item}
					<tr class="hover:bg-[#f0f4f7] transition-colors">
						<td class="py-4 px-6 text-sm text-[#5f6b6f] font-mono">#{item.id}</td>
						<td class="py-4 px-6 font-semibold text-[#2c3437]">{item.nama_kategori}</td>
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
						<td colspan="3" class="py-12 text-center text-[#5f6b6f]">Belum ada data kategori.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Mobile Card View -->
	<div class="md:hidden p-4 space-y-4">
		{#each data.kategori as item}
			<div class="bg-[#f0f4f7] rounded-lg p-4">
				<div class="flex items-center justify-between mb-3">
					<div class="flex-1">
						<p class="text-xs text-[#5f6b6f] font-mono mb-1">#{item.id}</p>
						<h3 class="font-bold text-[#2c3437] text-base">{item.nama_kategori}</h3>
					</div>
					<div class="w-10 h-10 rounded-lg bg-[#d1e4ea] flex items-center justify-center">
						<svg class="w-5 h-5 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
						</svg>
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
						Hapus Kategori
					</button>
				</form>
			</div>
		{:else}
			<div class="py-12 text-center text-[#5f6b6f]">
				<svg class="w-16 h-16 mx-auto text-[#acb3b7] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
				</svg>
				<p>Belum ada data kategori.</p>
			</div>
		{/each}
	</div>
</div>

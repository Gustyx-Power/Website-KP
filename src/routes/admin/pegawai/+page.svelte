<script lang="ts">
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// Toggle for form
	let roleSelected = 'KASIR';
	
	// Confirmation function for delete
	function confirmDelete(e: Event) {
		if (!confirm('Apakah Anda yakin ingin menonaktifkan akun ini?')) {
			e.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Manajemen Pegawai - Inventory Hub</title>
</svelte:head>

<!-- Breadcrumb -->
<div class="mb-6">
	<div class="flex items-center gap-2 text-sm text-[#5f6b6f]" style="font-family: 'Inter', sans-serif;">
		<span>Manajemen</span>
		<span>›</span>
		<span class="text-[#2c3437] font-medium">Pegawai Kasir</span>
	</div>
</div>

<!-- Header -->
<div class="mb-6 lg:mb-8">
	<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2c3437] mb-2" style="font-family: 'Manrope', sans-serif;">
		Manajemen Pegawai Kasir
	</h1>
	<p class="text-[#5f6b6f] text-sm md:text-base max-w-3xl">
		Sistem Registrasi Role Terbatas. Form ini diotorisasi khusus untuk menambahkan akun level Staf/Kasir Cabang. Untuk pendaftaran Admin Pusat / Owner, silakan hubungi Infrastruktur IT (Server Panel).
	</p>
</div>

<!-- Alert Messages -->
{#if form?.error}
	<div class="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
		{form.error}
	</div>
{/if}

{#if form?.success}
	<div class="mb-6 p-4 bg-[#c8e6d7] text-[#1f3329] rounded-xl border border-[#a8d6c7] text-sm">
		Aksi berhasil diselesaikan.
	</div>
{/if}

<!-- Add Form -->
<div class="bg-[#ffffff] rounded-xl p-5 md:p-6 mb-6 lg:mb-8">
	<div class="flex items-center gap-3 mb-5 md:mb-6">
		<div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#d1e4ea] flex items-center justify-center">
			<svg class="w-5 h-5 md:w-6 md:h-6 text-[#306677]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
			</svg>
		</div>
		<div>
			<h2 class="text-base md:text-lg font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">Tambah Pegawai Baru</h2>
		</div>
	</div>
	<form method="POST" action="?/create" class="space-y-4">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<div>
				<label for="name" class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">Nama Lengkap *</label>
				<input
					type="text"
					id="name"
					name="name"
					required
					autocomplete="off"
					class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
				/>
			</div>
			<div>
				<label for="email" class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">Email *</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					autocomplete="off"
					class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
				/>
			</div>
			<div>
				<label for="password" class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">Password *</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					minlength="6"
					class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
				/>
			</div>
			<div>
				<label for="role" class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">Role Jabatan *</label>
				<select
					id="role"
					name="role"
					bind:value={roleSelected}
					class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#5f6b6f] rounded-md text-sm border-none outline-none cursor-not-allowed"
				>
					<option value="KASIR" selected>Kasir / Pegawai Cabang</option>
					<!-- ADMIN & OWNER Registration intentionally removed for Security -->
				</select>
			</div>
			
			<div class="md:col-span-2 lg:col-span-4">
				<label for="tokoId" class="block text-xs uppercase tracking-wider font-semibold text-[#5f6b6f] mb-2">Penugasan Toko (Wajib untuk Kasir)</label>
				<select
					id="tokoId"
					name="tokoId"
					required
					class="w-full px-4 py-2.5 bg-[#e4e9ed] text-[#2c3437] rounded-md text-sm border-none focus:ring-2 focus:ring-[#306677]/20 outline-none"
				>
					<option value="">-- Pilih Cabang Toko / Gudang --</option>
					{#each data.tokos as toko}
						<option value={toko.id}>{toko.nama_toko} {toko.is_pusat ? '(Gudang Pusat)' : ''}</option>
					{/each}
				</select>
			</div>
		</div>
		<div class="flex justify-end mt-6">
			<button
				type="submit"
				class="w-full md:w-auto px-6 py-3 bg-[#306677] text-white font-semibold rounded-md hover:bg-[#225a6a] transition-colors text-sm"
			>
				Simpan Pegawai
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
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider">Nama Lengkap</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider">Email</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider">Role</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider">Terdaftar di Toko</th>
					<th class="py-4 px-6 font-semibold text-[#5f6b6f] text-xs uppercase tracking-wider text-center">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[#e4e9ed]">
				{#each data.users as user}
					<tr class="hover:bg-[#f0f4f7] transition-colors">
						<td class="py-4 px-6 font-semibold text-[#2c3437]">{user.name}</td>
						<td class="py-4 px-6 text-sm text-[#5f6b6f]">{user.email}</td>
						<td class="py-4 px-6">
							<!-- Role Badge Styling -->
							{#if user.role === 'OWNER'}
								<span class="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full uppercase tracking-wide">Owner</span>
							{:else if user.role === 'ADMIN'}
								<span class="px-3 py-1 text-xs font-semibold text-[#306677] bg-[#d1e4ea] rounded-full uppercase tracking-wide">Admin Pusat</span>
							{:else}
								<span class="px-3 py-1 text-xs font-semibold text-[#3f6754] bg-[#c8e6d7] rounded-full uppercase tracking-wide">Kasir Cabang</span>
							{/if}
						</td>
						<td class="py-4 px-6 text-sm text-[#5f6b6f]">
							{#if user.toko}
								<div class="flex flex-col">
									<span class="font-semibold text-[#2c3437]">{user.toko.nama_toko}</span>
									{#if user.toko.is_pusat}
										<span class="text-[10px] text-[#3f6754] uppercase mt-0.5 tracking-wider font-semibold">Gudang Pusat</span>
									{/if}
								</div>
							{:else}
								<span class="text-[#acb3b7] italic">Tidak ditugaskan</span>
							{/if}
						</td>
						<td class="py-4 px-6 text-center">
							<form method="POST" action="?/delete" class="inline">
								<input type="hidden" name="id" value={user.id} />
								<button
									type="submit"
									class="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md transition-colors uppercase tracking-wide"
									onclick={confirmDelete}
								>
									Nonaktifkan
								</button>
							</form>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="py-12 text-center text-[#5f6b6f]">Belum ada data pegawai.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Mobile Card View -->
	<div class="md:hidden p-4 space-y-4">
		{#each data.users as user}
			<div class="bg-[#f0f4f7] rounded-lg p-4">
				<div class="flex items-start justify-between mb-3">
					<div class="flex-1">
						<h3 class="font-bold text-[#2c3437] mb-1">{user.name}</h3>
						<p class="text-sm text-[#5f6b6f]">{user.email}</p>
					</div>
					<div>
						{#if user.role === 'OWNER'}
							<span class="px-2 py-1 text-[10px] font-semibold text-purple-700 bg-purple-100 rounded-full uppercase tracking-wide">Owner</span>
						{:else if user.role === 'ADMIN'}
							<span class="px-2 py-1 text-[10px] font-semibold text-[#306677] bg-[#d1e4ea] rounded-full uppercase tracking-wide">Admin</span>
						{:else}
							<span class="px-2 py-1 text-[10px] font-semibold text-[#3f6754] bg-[#c8e6d7] rounded-full uppercase tracking-wide">Kasir</span>
						{/if}
					</div>
				</div>
				
				<div class="mb-3">
					<p class="text-xs text-[#5f6b6f] uppercase tracking-wider font-semibold mb-1">Terdaftar di Toko</p>
					{#if user.toko}
						<div>
							<span class="text-sm font-semibold text-[#2c3437]">{user.toko.nama_toko}</span>
							{#if user.toko.is_pusat}
								<span class="ml-2 text-[10px] text-[#3f6754] uppercase tracking-wider font-semibold">(Gudang Pusat)</span>
							{/if}
						</div>
					{:else}
						<span class="text-sm text-[#acb3b7] italic">Tidak ditugaskan</span>
					{/if}
				</div>

				<form method="POST" action="?/delete" class="w-full">
					<input type="hidden" name="id" value={user.id} />
					<button
						type="submit"
						class="w-full text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2.5 rounded-md transition-colors uppercase tracking-wide"
						onclick={confirmDelete}
					>
						Nonaktifkan Akun
					</button>
				</form>
			</div>
		{:else}
			<div class="py-12 text-center text-[#5f6b6f]">
				<svg class="w-16 h-16 mx-auto text-[#acb3b7] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
				<p>Belum ada data pegawai.</p>
			</div>
		{/each}
	</div>
</div>

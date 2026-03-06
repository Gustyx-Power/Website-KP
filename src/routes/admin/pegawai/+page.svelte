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
	<title>Manajemen Pegawai - AdminPanel</title>
</svelte:head>

<div class="mb-6">
	<h2 class="text-2xl font-bold text-slate-800">Manajemen Pegawai & Akun</h2>
	<p class="text-slate-500 mt-1">Kelola data user, role admin/kasir, dan penempatan toko cabang.</p>
</div>

<!-- Alert Messages -->
{#if form?.error}
	<div class="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
		{form.error}
	</div>
{/if}

{#if form?.success}
	<div class="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
		Aksi berhasil diselesaikan.
	</div>
{/if}

<!-- Add Form -->
<div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
	<h3 class="text-lg font-semibold text-slate-800 mb-4">Tambah Pegawai Baru</h3>
	<form method="POST" action="?/create" class="space-y-4">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<div>
				<label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap *</label>
				<input
					type="text"
					id="name"
					name="name"
					required
					autocomplete="off"
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
				/>
			</div>
			<div>
				<label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email *</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					autocomplete="off"
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
				/>
			</div>
			<div>
				<label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password *</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					minlength="6"
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
				/>
			</div>
			<div>
				<label for="role" class="block text-sm font-medium text-slate-700 mb-1">Role Jabatan *</label>
				<select
					id="role"
					name="role"
					bind:value={roleSelected}
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-colors"
				>
					<option value="KASIR">Kasir / Pegawai Cabang</option>
					<option value="ADMIN">Admin / Controller</option>
					<option value="OWNER">Owner / Eksekutif</option>
				</select>
			</div>
			
			<div class="md:col-span-2 lg:col-span-4">
				<label for="tokoId" class="block text-sm font-medium text-slate-700 mb-1">Penugasan Toko (Kosongkan jika bukan Kasir)</label>
				<select
					id="tokoId"
					name="tokoId"
					disabled={roleSelected === 'OWNER'}
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white disabled:bg-slate-100 disabled:text-slate-400 transition-colors"
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
				class="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
			>
				Simpan Pegawai
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
					<th class="py-4 px-6 font-medium text-slate-600">Nama Lengkap</th>
					<th class="py-4 px-6 font-medium text-slate-600">Email</th>
					<th class="py-4 px-6 font-medium text-slate-600">Role</th>
					<th class="py-4 px-6 font-medium text-slate-600">Terdaftar di Toko</th>
					<th class="py-4 px-6 font-medium text-slate-600 text-center">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each data.users as user}
					<tr class="hover:bg-slate-50 transition-colors">
						<td class="py-3 px-6 font-medium text-slate-800">{user.name}</td>
						<td class="py-3 px-6 text-sm text-slate-500">{user.email}</td>
						<td class="py-3 px-6">
							<!-- Role Badge Styling -->
							{#if user.role === 'OWNER'}
								<span class="px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">Owner</span>
							{:else if user.role === 'ADMIN'}
								<span class="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">Admin Pusat</span>
							{:else}
								<span class="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">Kasir Cabang</span>
							{/if}
						</td>
						<td class="py-3 px-6 text-sm text-slate-600">
							{#if user.toko}
								<div class="flex flex-col">
									<span class="font-medium text-slate-700">{user.toko.nama_toko}</span>
									{#if user.toko.is_pusat}
										<span class="text-[10px] text-emerald-600 uppercase mt-0.5">Gudang Pusat</span>
									{/if}
								</div>
							{:else}
								<span class="text-slate-400 italic">Tidak ditugaskan</span>
							{/if}
						</td>
						<td class="py-3 px-6 text-center">
							<form method="POST" action="?/delete" class="inline">
								<input type="hidden" name="id" value={user.id} />
								<button
									type="submit"
									class="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
									onclick={confirmDelete}
								>
									Nonaktifkan
								</button>
							</form>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="py-8 text-center text-slate-500">Belum ada data pegawai.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="mb-8">
	<h2 class="text-2xl font-bold text-slate-800">Dashboard</h2>
	<p class="text-slate-500 mt-1">Overview data sistem inventory</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
	<!-- Card: Total Toko -->
	<div
		class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4"
	>
		<div class="bg-blue-50 p-4 rounded-lg">
			<svg
				class="w-8 h-8 text-blue-600"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
				></path></svg
			>
		</div>
		<div>
			<p class="text-sm font-medium text-slate-500">Total Toko</p>
			<p class="text-3xl font-bold text-slate-800">{data.totalToko}</p>
		</div>
	</div>

	<!-- Card: Total Items in Stok -->
	<div
		class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4"
	>
		<div class="bg-emerald-50 p-4 rounded-lg">
			<svg
				class="w-8 h-8 text-emerald-600"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
				></path></svg
			>
		</div>
		<div>
			<p class="text-sm font-medium text-slate-500">Total Items in Stok</p>
			<p class="text-3xl font-bold text-slate-800">{data.totalItemsStok}</p>
		</div>
	</div>

	<!-- Card: Total Transaksi Penjualan -->
	<div
		class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4"
	>
		<div class="bg-indigo-50 p-4 rounded-lg">
			<svg
				class="w-8 h-8 text-indigo-600"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
				></path></svg
			>
		</div>
		<div>
			<p class="text-sm font-medium text-slate-500">Total Transaksi Penjualan</p>
			<p class="text-3xl font-bold text-slate-800">{data.totalPenjualan}</p>
		</div>
	</div>
</div>

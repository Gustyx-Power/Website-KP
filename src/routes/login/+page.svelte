<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();
	let rememberMe = $state(false);
</script>

<svelte:head>
	<title>Login - IMD Clothes</title>
</svelte:head>

<div class="min-h-screen flex bg-[#e8eef2]">
	<!-- Left Side - Branding -->
	<div class="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-[#d8e4ea] p-8 xl:p-12 flex-col justify-between">
		<div>
			<!-- Logo -->
			<div class="flex items-center gap-3 mb-12">
				<div class="w-10 h-10 bg-[#306677] rounded-lg flex items-center justify-center">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
					</svg>
				</div>
				<span class="text-2xl font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">
					IMD Clothes
				</span>
			</div>

			<!-- Tagline -->
			<div class="max-w-lg">
				<h1 class="text-2xl xl:text-3xl font-bold text-[#2c3437] mb-4" style="font-family: 'Manrope', sans-serif;">
					Kelola koleksi busana Anda dengan sistem administrasi yang terkurasi.
				</h1>
				<p class="text-[#5f6b6f] text-sm xl:text-base leading-relaxed">
					Masuk ke IMD Clothes untuk mengakses analitik inventaris, laporan penjualan, dan pelacakan aset secara real-time.
				</p>
			</div>
		</div>

		<!-- Active Users -->
		<div class="flex items-center gap-3">
			<div class="flex -space-x-2">
				{#each data.activeUsers as user}
					<img 
						src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=306677&color=fff&size=40`}
						alt={user.name}
						title={user.name}
						class="w-10 h-10 rounded-full border-2 border-white"
					/>
				{/each}
			</div>
			<span class="text-sm text-[#5f6b6f] font-medium">
				+{data.totalActiveUsers} Admin Aktif
			</span>
		</div>
	</div>

	<!-- Right Side - Login Form -->
	<div class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
		<div class="w-full max-w-md">
			<!-- Mobile Logo & Tagline -->
			<div class="lg:hidden mb-6 sm:mb-8">
				<div class="flex items-center justify-center gap-3 mb-4">
					<div class="w-10 h-10 bg-[#306677] rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
						</svg>
					</div>
					<span class="text-xl sm:text-2xl font-bold text-[#2c3437]" style="font-family: 'Manrope', sans-serif;">
						IMD Clothes
					</span>
				</div>
				<div class="text-center px-2">
					<h1 class="text-lg sm:text-xl font-bold text-[#2c3437] mb-2" style="font-family: 'Manrope', sans-serif;">
						Kelola koleksi busana Anda dengan sistem administrasi yang terkurasi.
					</h1>
					<p class="text-[#5f6b6f] text-xs sm:text-sm leading-relaxed">
						Masuk ke IMD Clothes untuk mengakses analitik inventaris, laporan penjualan, dan pelacakan aset secara real-time.
					</p>
				</div>
			</div>

			<!-- Login Card -->
			<div class="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8">
				<div class="mb-6 sm:mb-8">
					<h2 class="text-xl sm:text-2xl font-bold text-[#2c3437] mb-2" style="font-family: 'Manrope', sans-serif;">
						Selamat Datang
					</h2>
					<p class="text-[#5f6b6f] text-sm">
						Silakan masuk untuk melanjutkan ke dashboard.
					</p>
				</div>

				{#if form?.errors?.email}
					<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
						<p class="text-sm text-red-600">{form.errors.email[0]}</p>
					</div>
				{/if}

				<form method="POST" use:enhance class="space-y-4 sm:space-y-5">
					<!-- Email Field -->
					<div>
						<label for="email" class="block text-xs font-semibold text-[#5f6b6f] uppercase tracking-wider mb-2">
							Alamat Email
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="w-5 h-5 text-[#acb3b7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
								</svg>
							</div>
							<input
								id="email"
								name="email"
								type="email"
								autocomplete="email"
								required
								value={form?.email ?? ''}
								class="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#f0f4f7] border border-[#e4e9ed] rounded-lg text-sm sm:text-base text-[#2c3437] placeholder-[#acb3b7] focus:outline-none focus:ring-2 focus:ring-[#306677] focus:border-transparent transition-all"
								placeholder="nama@email.com"
							/>
						</div>
					</div>

					<!-- Password Field -->
					<div>
						<div class="flex items-center justify-between mb-2">
							<label for="password" class="block text-xs font-semibold text-[#5f6b6f] uppercase tracking-wider">
								Kata Sandi
							</label>
							<a href="/forgot-password" class="text-xs text-[#306677] hover:text-[#225a6a] font-medium">
								Lupa kata sandi?
							</a>
						</div>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="w-5 h-5 text-[#acb3b7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<input
								id="password"
								name="password"
								type="password"
								autocomplete="current-password"
								required
								class="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#f0f4f7] border border-[#e4e9ed] rounded-lg text-sm sm:text-base text-[#2c3437] placeholder-[#acb3b7] focus:outline-none focus:ring-2 focus:ring-[#306677] focus:border-transparent transition-all"
								placeholder="••••••••"
							/>
						</div>
					</div>

					<!-- Remember Me -->
					<div class="flex items-center">
						<input
							id="remember"
							name="remember"
							type="checkbox"
							bind:checked={rememberMe}
							class="w-4 h-4 text-[#306677] bg-[#f0f4f7] border-[#e4e9ed] rounded focus:ring-[#306677] focus:ring-2"
						/>
						<label for="remember" class="ml-2 text-sm text-[#5f6b6f]">
							Ingat saya untuk 30 hari
						</label>
					</div>

					<!-- Submit Button -->
					<button
						type="submit"
						class="w-full py-2.5 sm:py-3 px-4 bg-[#306677] hover:bg-[#225a6a] text-white text-sm sm:text-base font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
					>
						<span>Masuk</span>
						<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</button>
				</form>
			</div>

			<!-- Footer -->
			<div class="mt-6 sm:mt-8 text-center px-4">
				<p class="text-[10px] sm:text-xs text-[#acb3b7]">
					© 2026 Gusti Aditya Muzaky - CV. Inti Media Digital
				</p>
			</div>
		</div>
	</div>
</div>

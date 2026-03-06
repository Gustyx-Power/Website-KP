<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full text-center space-y-8">
		<div>
			<h1 class="text-6xl font-bold text-gray-900">403</h1>
			<h2 class="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h2>
			<p class="mt-2 text-sm text-gray-600">
				You don't have permission to access this page.
			</p>
		</div>
		<div class="mt-6">
			<a
				href="/"
				class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Go back home
			</a>
		</div>
		{#if $page.data.user}
			<p class="mt-4 text-xs text-gray-500">
				Logged in as: {$page.data.user.email} ({$page.data.user.role})
			</p>
		{/if}
	</div>
</div>

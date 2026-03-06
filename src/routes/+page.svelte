<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="bg-white shadow rounded-lg p-6">
			<h1 class="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
			<p class="text-gray-600 mb-6">
				Welcome, {$page.data.user?.name}!
			</p>
			
			<div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
				<h2 class="text-lg font-semibold text-blue-900 mb-2">User Information</h2>
				<dl class="space-y-1">
					<div>
						<dt class="inline font-medium text-blue-700">Email:</dt>
						<dd class="inline ml-2 text-blue-900">{$page.data.user?.email}</dd>
					</div>
					<div>
						<dt class="inline font-medium text-blue-700">Role:</dt>
						<dd class="inline ml-2 text-blue-900">{$page.data.user?.role}</dd>
					</div>
				</dl>
			</div>

			<div class="space-y-4">
				{#if $page.data.user?.role === 'ADMIN'}
					<a
						href="/admin"
						class="inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Go to Admin Dashboard
					</a>
				{/if}

				<form method="POST" action="/logout">
					<button
						type="submit"
						class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
					>
						Logout
					</button>
				</form>
			</div>
		</div>
	</div>
</div>

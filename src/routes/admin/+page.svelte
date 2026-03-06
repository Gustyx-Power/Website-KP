<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="bg-white shadow rounded-lg p-6">
			<h1 class="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
			<p class="text-gray-600 mb-6">
				Welcome, {$page.data.user?.name}! This page is only accessible to administrators.
			</p>
			
			<div class="bg-indigo-50 border border-indigo-200 rounded-md p-4">
				<h2 class="text-lg font-semibold text-indigo-900 mb-2">User Information</h2>
				<dl class="space-y-1">
					<div>
						<dt class="inline font-medium text-indigo-700">Email:</dt>
						<dd class="inline ml-2 text-indigo-900">{$page.data.user?.email}</dd>
					</div>
					<div>
						<dt class="inline font-medium text-indigo-700">Role:</dt>
						<dd class="inline ml-2 text-indigo-900">{$page.data.user?.role}</dd>
					</div>
				</dl>
			</div>

			<div class="mt-6">
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

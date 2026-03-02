<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 text-white min-h-screen hidden md:block">
        <div class="p-6">
            <h1 class="text-2xl font-bold tracking-tight">Admin<span class="text-blue-500">Panel</span></h1>
        </div>
        <nav class="mt-6 px-4 space-y-2">
            <a 
                href="/admin" 
                class="block px-4 py-3 rounded-lg transition-colors {$page.url.pathname === '/admin' ? 'bg-blue-600 font-medium' : 'hover:bg-slate-800'}"
            >
                Dashboard
            </a>
            <a 
                href="/admin/toko" 
                class="block px-4 py-3 rounded-lg transition-colors {$page.url.pathname.startsWith('/admin/toko') ? 'bg-blue-600 font-medium' : 'hover:bg-slate-800'}"
            >
                Toko
            </a>
            <a 
                href="/admin/kategori" 
                class="block px-4 py-3 rounded-lg transition-colors {$page.url.pathname.startsWith('/admin/kategori') ? 'bg-blue-600 font-medium' : 'hover:bg-slate-800'}"
            >
                Kategori
            </a>
            <a 
                href="/admin/stok" 
                class="block px-4 py-3 rounded-lg transition-colors {$page.url.pathname.startsWith('/admin/stok') ? 'bg-blue-600 font-medium' : 'hover:bg-slate-800'}"
            >
                Stok
            </a>
            <a 
                href="/admin/penjualan" 
                class="block px-4 py-3 rounded-lg transition-colors {$page.url.pathname.startsWith('/admin/penjualan') ? 'bg-blue-600 font-medium' : 'hover:bg-slate-800'}"
            >
                Penjualan
            </a>
            <a 
                href="/admin/retur" 
                class="block px-4 py-3 rounded-lg transition-colors {$page.url.pathname.startsWith('/admin/retur') ? 'bg-blue-600 font-medium' : 'hover:bg-slate-800'}"
            >
                Retur
            </a>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-x-hidden">
        <!-- Mobile Header -->
        <header class="bg-white shadow-sm md:hidden p-4 flex justify-between items-center">
            <h1 class="text-xl font-bold text-slate-800">AdminPanel</h1>
            <!-- Basic mobile menu button -->
            <button class="text-slate-500 hover:text-slate-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
        </header>

        <div class="p-6 md:p-8">
            <slot />
        </div>
    </main>
</div>

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		// Allow Cloudflare Tunnel and other external hosts
		allowedHosts: [
			'.trycloudflare.com', // Cloudflare Quick Tunnel
			'.ngrok.io',          // Ngrok (alternative)
			'.loca.lt',           // LocalTunnel (alternative)
			'localhost'           // Local development
		]
	}
});

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	let isUnderMaintenance = false;
	try {
		const res = await fetch('http://localhost:5000/api/maintenance/status', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		if (res.ok) {
			const data = await res.json();
			isUnderMaintenance = data.isMaintenance === true;
		}
	} catch (e) {
		// Ignore
	}

	// Double safety check: if maintenance mode was turned off 
	// while someone is still viewing the /maintenance page, redirect them home.
	if (!isUnderMaintenance) {
		throw redirect(303, '/login');
	}

	return {};
};

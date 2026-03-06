import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	// hooks.server.ts already ensures user is logged in and has KASIR role
	const user = locals.user!;

	if (!user.tokoId) {
		// Kasir without a store assigned, maybe show an error or redirect
		// For now, we'll try to fetch store info, if none, it's null
	}

	let toko = null;
    let kasirName = user.name;
    
	if (user.tokoId) {
		toko = await prisma.toko.findUnique({
			where: { id: user.tokoId }
		});
	}

	return {
		user: {
            name: kasirName,
            role: user.role,
            tokoId: user.tokoId
        },
		toko
	};
};

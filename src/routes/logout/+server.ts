import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { invalidateSession, deleteSessionCookie, getSessionCookie } from '$lib/server/auth';

export const POST: RequestHandler = async (event) => {
	const sessionId = getSessionCookie(event);

	if (sessionId) {
		await invalidateSession(sessionId);
		deleteSessionCookie(event);
	}

	throw redirect(303, '/login');
};

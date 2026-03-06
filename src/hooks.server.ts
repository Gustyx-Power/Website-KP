import { getSessionCookie, validateSession } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login'];

// Routes that require ADMIN role
const ADMIN_ROUTES = ['/admin'];

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = getSessionCookie(event);

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
	} else {
		const { session, user } = await validateSession(sessionId);
		event.locals.session = session;
		event.locals.user = user;
	}

	const path = event.url.pathname;

	// Allow public routes without authentication
	if (PUBLIC_ROUTES.some((route) => path.startsWith(route))) {
		return resolve(event);
	}

	// Redirect unauthenticated users to login (except for /unauthorized page)
	if (!event.locals.user) {
		// Allow access to /unauthorized page even without auth to prevent infinite loops
		if (path === '/unauthorized') {
			return resolve(event);
		}
		throw redirect(303, '/login');
	}

	// Check RBAC for admin-only routes
	if (ADMIN_ROUTES.some((route) => path.startsWith(route))) {
		if (event.locals.user.role !== 'ADMIN') {
			throw redirect(303, '/unauthorized');
		}
	}

	// All other routes are accessible to any authenticated user
	return resolve(event);
};

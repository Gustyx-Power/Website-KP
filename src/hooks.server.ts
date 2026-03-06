import { getSessionCookie, validateSession } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';

// Routes accessible without authentication or globally accessible (like logout)
const PUBLIC_ROUTES = ['/login', '/logout'];

// Route access control matrix keyed by role
const ROLE_ROUTES: Record<string, string[]> = {
	OWNER: ['/owner', '/api'],
	ADMIN: ['/admin', '/api'],
	KASIR: ['/kasir', '/api']
};

// Default landing pages per role after login
export const ROLE_HOME: Record<string, string> = {
	OWNER: '/owner',
	ADMIN: '/admin',
	KASIR: '/kasir'
};

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

	// Allow /unauthorized page to prevent redirect loops
	if (path === '/unauthorized') {
		return resolve(event);
	}

	// Redirect unauthenticated users to login
	if (!event.locals.user) {
		throw redirect(303, '/login');
	}

	// Root path "/" redirects to role-specific home
	if (path === '/') {
		const home = ROLE_HOME[event.locals.user.role] ?? '/login';
		throw redirect(303, home);
	}

	// RBAC enforcement: check if the user's role has access to the requested route
	const allowedRoutes = ROLE_ROUTES[event.locals.user.role] ?? [];
	const hasAccess = allowedRoutes.some((route) => path.startsWith(route));

	if (!hasAccess) {
		throw redirect(303, '/unauthorized');
	}

	return resolve(event);
};

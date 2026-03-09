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

	// Set up basic maintenance route check
	// We wrap in try/catch to ensure SvelteKit doesn't crash if the SuperAdmin server is completely offline
	let isUnderMaintenance = false;
	try {
        // Fetch maintenance status from Super Admin Server Panel (Port 5000)
		const res = await fetch('http://localhost:5000/api/maintenance/status', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		if (res.ok) {
			const data = await res.json();
			isUnderMaintenance = data.isMaintenance === true;
		}
	} catch (e) {
		// If port 5000 is unreachable, assume normal operations, OR fail open/closed based on strictness.
		// For now, we assume normal operation if the controller is totally offline.
		// console.log("Super Admin Server is offline. Running SvelteKit normally.");
	}

	const path = event.url.pathname;

    // -------------------------------------------------------------
	// 🛑 MAINTENANCE MODE INTERCEPTOR
    // -------------------------------------------------------------
	if (isUnderMaintenance && path !== '/maintenance') {
        // Forced redirect for everyone (Admin, Owner, Kasir, Guests) during Maintenance
		throw redirect(307, '/maintenance');
	}

	// Conversely, if we are NOT in maintenance, hitting /maintenance directly shouldn't be allowed
	if (!isUnderMaintenance && path === '/maintenance') {
		throw redirect(303, '/');
	}

	// Allow public routes without authentication (add /maintenance here just in case)
	if (PUBLIC_ROUTES.includes(path) || path === '/maintenance') {
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

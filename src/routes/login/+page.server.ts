import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { loginSchema } from '$lib/schemas/auth';
import { prisma } from '$lib/server/prisma';
import { verifyPassword, createSession, setSessionCookie } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect if already logged in
	if (locals.user) {
		throw redirect(303, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		// Validate input
		const result = loginSchema.safeParse({ email, password });

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return fail(400, {
				errors,
				email: email as string
			});
		}

		// Find user
		const user = await prisma.user.findUnique({
			where: { email: result.data.email }
		});

		if (!user) {
			return fail(400, {
				errors: { email: ['Invalid credentials'] },
				email: result.data.email
			});
		}

		// Verify password
		const validPassword = await verifyPassword(user.password, result.data.password);

		if (!validPassword) {
			return fail(400, {
				errors: { email: ['Invalid credentials'] },
				email: result.data.email
			});
		}

		// Create session
		const sessionId = await createSession(user.id);
		const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

		setSessionCookie(event, sessionId, expiresAt);

		throw redirect(303, '/');
	}
};

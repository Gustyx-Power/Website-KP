import { prisma } from './prisma';
import { hash, verify } from '@node-rs/argon2';
import type { RequestEvent } from '@sveltejs/kit';

const SESSION_COOKIE_NAME = 'session';
const SESSION_EXPIRY_DAYS = 30;

// Argon2 configuration for secure password hashing
const hashOptions = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

export async function hashPassword(password: string): Promise<string> {
	return await hash(password, hashOptions);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
	return await verify(hash, password, hashOptions);
}

export async function createSession(userId: string): Promise<string> {
	const sessionId = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

	await prisma.session.create({
		data: {
			id: sessionId,
			userId,
			expiresAt
		}
	});

	return sessionId;
}

export async function validateSession(sessionId: string) {
	const session = await prisma.session.findUnique({
		where: { id: sessionId },
		include: {
			user: {
				select: {
					id: true,
					email: true,
					name: true,
					role: true
				}
			}
		}
	});

	if (!session) {
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime()) {
		await prisma.session.delete({ where: { id: sessionId } });
		return { session: null, user: null };
	}

	// Extend session if it's close to expiring (less than 15 days remaining)
	if (Date.now() >= session.expiresAt.getTime() - 15 * 24 * 60 * 60 * 1000) {
		const newExpiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
		await prisma.session.update({
			where: { id: sessionId },
			data: { expiresAt: newExpiresAt }
		});
		session.expiresAt = newExpiresAt;
	}

	return {
		session: {
			id: session.id,
			expiresAt: session.expiresAt
		},
		user: session.user
	};
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await prisma.session.delete({ where: { id: sessionId } });
}

export function setSessionCookie(event: RequestEvent, sessionId: string, expiresAt: Date): void {
	event.cookies.set(SESSION_COOKIE_NAME, sessionId, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		expires: expiresAt
	});
}

export function deleteSessionCookie(event: RequestEvent): void {
	event.cookies.delete(SESSION_COOKIE_NAME, {
		path: '/'
	});
}

export function getSessionCookie(event: RequestEvent): string | undefined {
	return event.cookies.get(SESSION_COOKIE_NAME);
}

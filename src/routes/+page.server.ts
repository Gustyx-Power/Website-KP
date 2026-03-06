import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// User data is already available from +layout.server.ts
	// No need to redirect - let all authenticated users access this page
	return {};
};

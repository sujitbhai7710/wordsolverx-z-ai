import { redirect, type Handle } from '@sveltejs/kit';

const RETIRED_SOLVER_PATH = /^\/(leddle-solver)\/?$/;

export const handle: Handle = async ({ event, resolve }) => {
	if (RETIRED_SOLVER_PATH.test(event.url.pathname)) {
		redirect(301, '/');
	}

	const response = await resolve(event);
	const contentType = response.headers.get('content-type') ?? '';

	// Always revalidate HTML so clients/CDN edges do not keep stale documents that point
	// at removed hashed assets after a new deploy.
	if (contentType.includes('text/html')) {
		response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
	}

	return response;
};

import { redirect, type Handle } from '@sveltejs/kit';

const RETIRED_SOLVER_PATH = /^\/(leddle-solver)\/?$/;

export const handle: Handle = async ({ event, resolve }) => {
	if (RETIRED_SOLVER_PATH.test(event.url.pathname)) {
		redirect(301, '/');
	}

	return resolve(event);
};

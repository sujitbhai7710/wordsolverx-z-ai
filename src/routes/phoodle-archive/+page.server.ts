import type { PageServerLoad } from './$types';
import { getAllPhoodleDates } from '$lib/phoodle';

export const load: PageServerLoad = async () => {
	return {
		availableDateStrings: await getAllPhoodleDates()
	};
};

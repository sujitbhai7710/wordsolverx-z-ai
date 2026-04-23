import { getCanuckleTodayPageConfig } from '$lib/wordlebot-wasm/route-config';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		config: getCanuckleTodayPageConfig()
	};
};

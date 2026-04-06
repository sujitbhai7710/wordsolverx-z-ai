import { getCanuckleTodayPageConfig } from '$lib/wordlebot-wasm/route-config';

export const prerender = true;

export function load() {
	return {
		config: getCanuckleTodayPageConfig()
	};
}

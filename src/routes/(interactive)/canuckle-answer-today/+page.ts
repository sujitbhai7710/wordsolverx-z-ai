import { getCanuckleTodayPageConfig } from '$lib/wordlebot-wasm/route-config';

export function load() {
	return {
		config: getCanuckleTodayPageConfig()
	};
}

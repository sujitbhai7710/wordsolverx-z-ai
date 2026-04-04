import { getCanuckleArchivePageConfig } from '$lib/wordlebot-wasm/route-config';

export function load() {
	return {
		config: getCanuckleArchivePageConfig()
	};
}

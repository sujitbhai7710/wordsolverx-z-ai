import { WORDLEBOT_VARIANT_ROUTE_SLUGS } from '$lib/wordlebot-wasm/routes';

const VARIANTS = new Set<string>(WORDLEBOT_VARIANT_ROUTE_SLUGS);

export function match(param: string) {
	return VARIANTS.has(param);
}

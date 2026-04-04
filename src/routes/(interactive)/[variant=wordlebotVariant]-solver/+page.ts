import { getVariantSolverPageConfig } from '$lib/wordlebot-wasm/route-config';
import { WORDLEBOT_VARIANT_ROUTE_SLUGS, type WordlebotVariantRouteSlug } from '$lib/wordlebot-wasm/routes';

export function entries() {
	return WORDLEBOT_VARIANT_ROUTE_SLUGS.map((variant) => ({ variant }));
}

export function load({ params }) {
	return {
		config: getVariantSolverPageConfig(params.variant as WordlebotVariantRouteSlug)
	};
}

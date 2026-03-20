type FetchLike = typeof fetch;

const textCache = new Map<string, Promise<string>>();

async function fetchText(fetchFn: FetchLike, href: string): Promise<string> {
	const response = await fetchFn(href);
	if (!response.ok) {
		throw new Error(`Failed to load ${href}: ${response.status}`);
	}

	return response.text();
}

export function loadStaticText(
	fetchFn: FetchLike,
	origin: string,
	assetPath: string,
	options: { cache?: boolean } = {}
): Promise<string> {
	const href = new URL(assetPath, origin).toString();
	if (options.cache === false) {
		return fetchText(fetchFn, href);
	}

	let cached = textCache.get(href);
	if (!cached) {
		cached = fetchText(fetchFn, href);
		textCache.set(href, cached);
	}

	return cached;
}

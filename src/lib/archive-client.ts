export async function fetchArchivePayload<T>(game: string, dateKey: string | null): Promise<T> {
	const query = dateKey ? `?date=${encodeURIComponent(dateKey)}` : '';
	const response = await fetch(`/api/archive/${game}${query}`);
	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		const message =
			payload && typeof payload === 'object' && typeof payload.error === 'string'
				? payload.error
				: `Failed to load ${game} archive data.`;
		throw new Error(message);
	}

	return payload as T;
}

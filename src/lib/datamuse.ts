export interface DatamuseCluePayload {
  definition: string | null;
  rhymes: string[];
  synonyms: string[];
}

async function safeFetchJson(url: string, fetchImpl: typeof fetch) {
  try {
    const response = await fetchImpl(url);
    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch {
    return [];
  }
}

export async function fetchDatamuseClues(
  word: string,
  fetchImpl: typeof fetch = fetch
): Promise<DatamuseCluePayload> {
  const lowerWord = word.toLowerCase();
  const [definitionData, rhymeData, synonymData] = await Promise.all([
    safeFetchJson(
      `https://api.datamuse.com/words?sp=${encodeURIComponent(lowerWord)}&md=d&max=1`,
      fetchImpl
    ),
    safeFetchJson(
      `https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(lowerWord)}&max=5`,
      fetchImpl
    ),
    safeFetchJson(
      `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(lowerWord)}&max=5`,
      fetchImpl
    )
  ]);

  const firstDefinition = Array.isArray(definitionData)
    ? definitionData[0]?.defs?.[0]
    : null;

  return {
    definition:
      typeof firstDefinition === 'string' ? firstDefinition.split('\t')[1] ?? null : null,
    rhymes: Array.isArray(rhymeData) ? rhymeData.slice(0, 5).map((item) => item.word).filter(Boolean) : [],
    synonyms: Array.isArray(synonymData)
      ? synonymData.slice(0, 5).map((item) => item.word).filter(Boolean)
      : []
  };
}

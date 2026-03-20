const CIPHER_ALPHABET = '5pyf0gcrl1a9oe3ui8d2htn67sqjkxbmw4vzPYFGCRLAOEUIDHTNSQJKXBMWVZ'.split('');

function rot12Decode(encoded: string): string {
  return Array.from(encoded)
    .map((char) => {
      const index = CIPHER_ALPHABET.indexOf(char);
      return index === -1
        ? char
        : CIPHER_ALPHABET[(index - 12 + CIPHER_ALPHABET.length) % CIPHER_ALPHABET.length];
    })
    .join('');
}

export function decodeWordList(encoded: string): string[] {
  if (!encoded || typeof encoded !== 'string') {
    return [];
  }

  try {
    const rot12Decoded = rot12Decode(encoded.trim());
    const base64Decoded = atob(rot12Decoded);
    return base64Decoded.split(',').filter((word) => word.length > 0);
  } catch (error) {
    console.error('Failed to decode Squaredle word list:', error);
    return [];
  }
}

export function parsePuzzleConfig(configText: string) {
  let dateStr = new Date().toISOString().split('T')[0];

  const todayMatch = configText.match(/gTodayDateStr\s*=\s*['"]([^'"]+)['"]/);
  if (todayMatch) {
    dateStr = todayMatch[1].replace(/\//g, '-');
  }

  const parsePuzzleData = (dateKey: string) => {
    const escapedDateKey = dateKey.replace(/\//g, '\\/');
    const blockStart = configText.indexOf(`"${escapedDateKey}"`);
    if (blockStart === -1) {
      return null;
    }

    const nextBlock = configText.indexOf('"20', blockStart + 10);
    const blockEnd = nextBlock > 0 ? nextBlock : configText.length;
    const block = configText.slice(blockStart, blockEnd);

    const boardMatch = block.match(/"board":\s*\[([^\]]+)\]/);
    let board: string[][] = [];
    if (boardMatch) {
      const rows = boardMatch[1].match(/"([a-zA-Z]+)"/g);
      if (rows) {
        board = rows.map((row) => row.replace(/"/g, '').toLowerCase().split(''));
      }
    }

    const wordScoresMatch = block.match(/"wordScores":\s*"([^"]+)"/);
    const optionalScoresMatch = block.match(/"optionalWordScores":\s*"([^"]+)"/);

    return {
      board,
      words: wordScoresMatch ? decodeWordList(wordScoresMatch[1]) : [],
      bonusWords: optionalScoresMatch ? decodeWordList(optionalScoresMatch[1]) : []
    };
  };

  const mainPuzzle = parsePuzzleData(dateStr.replace(/-/g, '/'));
  const expressPuzzle = parsePuzzleData(`${dateStr.replace(/-/g, '/')}-xp`);

  return { dateStr, mainPuzzle, expressPuzzle };
}

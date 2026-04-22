// Static imports of all per-length word data files
// Vite needs these to be statically analyzable for proper bundling
import len3Data from './word-data-len3.json';
import len4Data from './word-data-len4.json';
import len5Data from './word-data-len5.json';
import len6Data from './word-data-len6.json';
import len7Data from './word-data-len7.json';
import len8Data from './word-data-len8.json';
import len9Data from './word-data-len9.json';
import len10Data from './word-data-len10.json';
import len11Data from './word-data-len11.json';

import type { SolverDataset } from '../../types';

const dataMap: Record<string, SolverDataset> = {
    '3': len3Data as unknown as SolverDataset,
    '4': len4Data as unknown as SolverDataset,
    '5': len5Data as unknown as SolverDataset,
    '6': len6Data as unknown as SolverDataset,
    '7': len7Data as unknown as SolverDataset,
    '8': len8Data as unknown as SolverDataset,
    '9': len9Data as unknown as SolverDataset,
    '10': len10Data as unknown as SolverDataset,
    '11': len11Data as unknown as SolverDataset,
};

export function getWordDataForLength(length: number): SolverDataset {
    const key = String(length);
    const data = dataMap[key];
    if (!data) {
        throw new Error(`No word data for length ${length}`);
    }
    return data;
}

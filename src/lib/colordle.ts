
import { colornames } from 'color-name-list';
import space from 'color-space';
import DeltaE from 'delta-e';
import targetColorNames from './data/colordle-targets.json';

export interface ColorData {
    name: string;
    hex: string;
}

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export const getAllColors = (): ColorData[] => {
    return colornames;
};

export const getTargetColors = (): ColorData[] => {
    // We must preserve the order of targetColorNames.colors to match the daily sequence.
    // Create a lookup map for performance (O(1) access instead of O(N) scan per target)
    // Map key: normalized name -> ColorData object
    const colorMap = new Map<string, ColorData>();

    for (const c of colornames) {
        const normalized = c.name.toLowerCase().replace(/ /g, "");
        // If duplicates exist in library, first one wins (or doesn't matter much)
        if (!colorMap.has(normalized)) {
            colorMap.set(normalized, c);
        }
    }

    const targetsRaw = targetColorNames.colors;
    const orderedTargets: ColorData[] = [];

    for (const name of targetsRaw) {
        const normalizedName = name.toLowerCase().replace(/ /g, "");
        const match = colorMap.get(normalizedName);
        if (match) {
            orderedTargets.push(match);
        } else {
            console.warn(`Colordle Target Missing in Library: ${name}`);
            // Must push a placeholder to preserve index alignment with day numbers
            orderedTargets.push({
                name: name,
                hex: '#000000' // Default fallback (Black) to avoid crash, user will at least see the name
            });
        }
    }

    return orderedTargets;
};

export const getUniqueTargetColors = (): ColorData[] => {
    const targets = getTargetColors();
    const seen = new Set<string>();
    const unique: ColorData[] = [];

    for (const t of targets) {
        const key = t.name.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(t);
        }
    }

    return unique;
};

export const hexToRgb = (hex: string): RGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
};

export const colorDiff = (c1: RGB, c2: RGB): number => {
    try {
        const color1 = space.rgb.lab([c1.r, c1.g, c1.b]);
        const color2 = space.rgb.lab([c2.r, c2.g, c2.b]);
        const color1LAB = { L: color1[0], A: color1[1], B: color1[2] };
        const color2LAB = { L: color2[0], A: color2[1], B: color2[2] };

        const dE = DeltaE.getDeltaE00(color1LAB, color2LAB);
        // The game score is 100 - DeltaE
        return Math.max(0, 100 - dE);
    } catch (e) {
        console.error('Error calculating color difference:', e);
        return 0;
    }
};

export const findBestCandidates = (
    candidates: ColorData[],
    guesses: { guess: ColorData; percent: number }[]
): ColorData[] => {
    if (guesses.length === 0) return candidates;

    return candidates.filter((candidate) => {
        const candidateRgb = hexToRgb(candidate.hex);
        if (!candidateRgb) return false;

        // Check if this candidate is consistent with ALL guesses
        return guesses.every((g) => {
            const guessRgb = hexToRgb(g.guess.hex);
            if (!guessRgb) return false;

            const calculatedPercent = colorDiff(candidateRgb, guessRgb);

            // Tolerance for floating point/display rounding. 
            // The game displays 2 decimals (e.g., 19.69).
            // A tolerance of 0.01-0.05 is usually safe.
            // We use 0.02 to be reasonably strict but allow for small library differences.
            return Math.abs(calculatedPercent - g.percent) < 0.02;
        });
    });
};


declare module 'color-name-list' {
    export const colornames: { name: string; hex: string }[];
}

declare module 'color-space' {
    const space: {
        rgb: {
            lab: (rgb: [number, number, number]) => [number, number, number];
        }
    };
    export default space;
}

declare module 'delta-e' {
    const DeltaE: {
        getDeltaE00: (
            c1: { L: number; A: number; B: number },
            c2: { L: number; A: number; B: number }
        ) => number;
    };
    export default DeltaE;
}

declare module '/phoodle-wasm/phoodle_solver.js' {
    const init: (input?: string | URL | Request | Response | ArrayBuffer | Promise<any>) => Promise<any>;
    export class PhoodleSolver {
        get_starters(count: number): string[];
        solve(guesses: Array<{ word: string; result: string }>): any;
        word_count(): number;
        free(): void;
    }
    export default init;
}

declare module '*.css?raw' {
	const content: string;
	export default content;
}

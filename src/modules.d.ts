
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

declare module '/wasm/canuckle_solver_wasm.js' {
    export interface Suggestion {
        word: string;
        entropy: number;
        expected_remaining: number;
        is_possible_answer: boolean;
    }

    export interface CanuckleSolver {
        reset(): void;
        remaining_count(): number;
        get_possible_answers(): string[];
        add_guess(word: string, feedback: string[]): boolean;
        get_suggestions(max_count: number): Suggestion[];
        get_best_guess(): string;
        get_best_starting_word(): string;
        evaluate_guess(guess: string, target: string): string[];
        get_state(): object;
        is_valid_word(word: string): boolean;
        word_count(): number;
    }

    export const CanuckleSolver: {
        new(): CanuckleSolver;
    };

    const init: (input?: string | URL | Request | Response | ArrayBuffer | Promise<any>) => Promise<any>;
    export default init;
}

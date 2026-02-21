
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

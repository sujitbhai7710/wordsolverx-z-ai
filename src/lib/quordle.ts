
import { Q_DAT_D, Q_DAT_C, Q_DAT_E, Q_DAT_B, Q_DAT_W } from '$lib/data/QuordleObfuscatedData';
import { getJSTToday } from '$lib/utils';
import { subDays, format } from 'date-fns';

// Obfuscated RNG and Generation Logic
class _M {
    private N = 624; private M = 397; private A = 2567483615;
    private U = 2147483648; private L = 2147483647;
    private m: number[]; private i: number;
    constructor(s: any) { this.m = new Array(this.N); this.i = this.N + 1; if (Array.isArray(s)) this.ia(s, s.length); else this.is(s); }
    is(s: any) { this.m[0] = s >>> 0; for (this.i = 1; this.i < this.N; this.i++) { let x = this.m[this.i - 1] ^ this.m[this.i - 1] >>> 30; this.m[this.i] = (((x & 4294901760) >>> 16) * 1812433253 << 16) + (x & 65535) * 1812433253 + this.i; this.m[this.i] >>>= 0; } }
    ia(s: any, l: any) { this.is(19650218); let i = 1, j = 0, k = this.N > l ? this.N : l; for (; k; k--) { let x = this.m[i - 1] ^ this.m[i - 1] >>> 30; this.m[i] = (this.m[i] ^ (((x & 4294901760) >>> 16) * 1664525 << 16) + (x & 65535) * 1664525) + s[j] + j; this.m[i] >>>= 0; i++; j++; if (i >= this.N) { this.m[0] = this.m[this.N - 1]; i = 1; } if (j >= l) j = 0; } for (k = this.N - 1; k; k--) { let x = this.m[i - 1] ^ this.m[i - 1] >>> 30; this.m[i] = (this.m[i] ^ (((x & 4294901760) >>> 16) * 1566083941 << 16) + (x & 65535) * 1566083941) - i; this.m[i] >>>= 0; i++; if (i >= this.N) { this.m[0] = this.m[this.N - 1]; i = 1; } } this.m[0] = 2147483648; }
    r() { let y, m = new Array(0, this.A); if (this.i >= this.N) { let k; for (this.i == this.N + 1 && this.is(5489), k = 0; k < this.N - this.M; k++)y = this.m[k] & this.U | this.m[k + 1] & this.L, this.m[k] = this.m[k + this.M] ^ y >>> 1 ^ m[y & 1]; for (; k < this.N - 1; k++)y = this.m[k] & this.U | this.m[k + 1] & this.L, this.m[k] = this.m[k + (this.M - this.N)] ^ y >>> 1 ^ m[y & 1]; y = this.m[this.N - 1] & this.U | this.m[0] & this.L, this.m[this.N - 1] = this.m[this.M - 1] ^ y >>> 1 ^ m[y & 1], this.i = 0; } y = this.m[this.i++]; y ^= y >>> 11; y ^= y << 7 & 2636928640; y ^= y << 15 & 4022730752; y ^= y >>> 18; return y >>> 0; }
    r31() { return this.r() >>> 1; }
}

const _G = (seed: number, wb: string[], bl: Set<string>) => {
    let r: string[]; const rng = new _M(seed);
    rng.r31(); rng.r31(); rng.r31(); rng.r31();
    do r = [wb[rng.r31() % wb.length], wb[rng.r31() % wb.length], wb[rng.r31() % wb.length], wb[rng.r31() % wb.length]];
    while (r[0] === r[1] || r[0] === r[2] || r[0] === r[3] || r[1] === r[2] || r[1] === r[3] || r[2] === r[3] || bl.has(r[0]) || bl.has(r[1]) || bl.has(r[2]) || bl.has(r[3]));
    return r;
};

export interface QuordleData {
    d: string[]; // Daily Classic
    c: string[]; // Chill
    e: string[]; // Extreme
    s: string[]; // Sequence
    r: string[]; // Rescue
    w: string[]; // Weekly
    dN: number;
    cN: number;
    eN: number;
    sN: number;
    rN: number;
    wN: number;
    formattedDate: string;
}

export function getQuordleDataForDate(date: Date): QuordleData | null {
    try {
        const _wd = atob(Q_DAT_D).split(' ');
        const _wc = atob(Q_DAT_C).split(' ');
        const _we = atob(Q_DAT_E).split(' ');
        const _bl = new Set(atob(Q_DAT_B).split(' '));
        const _wl = JSON.parse(atob(Q_DAT_W));


        const e_d = new Date(2022, 0, 24, 12, 0, 0); // Daily & Sequence
        const e_c = new Date(2024, 6, 29, 12, 0, 0); // Chill & Extreme
        const e_r = new Date(2025, 10, 10, 12, 0, 0); // Rescue
        const e_w = new Date(2023, 5, 26, 12, 0, 0); // Weekly

        const sd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);

        const dN = Math.floor((sd.getTime() - e_d.getTime()) / 86400000);
        const cN = Math.floor((sd.getTime() - e_c.getTime()) / 86400000);
        const rN = Math.floor((sd.getTime() - e_r.getTime()) / 86400000);
        const wDays = Math.floor((sd.getTime() - e_w.getTime()) / 86400000);
        const wN = Math.ceil((1 + wDays) / 7);

        // Sequence uses Daily index but reversed word bank
        const _ws = [..._wd].reverse();

        // Weekly logic
        let weeklyAns: string[] = [];
        if (wN >= 0 && wN < _wl.length) weeklyAns = _wl[wN];
        else if (wN >= 0) { const rng = new _M(wN); weeklyAns = _wl[rng.r31() % _wl.length]; }

        return {
            d: dN >= 0 ? _G(dN, _wd, _bl) : [],
            s: dN >= 0 ? _G(dN, _ws, _bl) : [],
            c: cN >= 0 ? _G(cN, _wc, _bl) : [],
            e: cN >= 0 ? _G(cN, _we, _bl) : [],
            r: rN >= 0 ? _G(rN, _wd, _bl) : [],
            w: weeklyAns,
            dN,
            cN,
            eN: cN,
            sN: dN,
            rN,
            wN,
            formattedDate: format(date, 'MMMM d, yyyy')
        };
    } catch (err) {
        console.error("Error generating Quordle data", err);
        return null;
    }
}

export function getQuordleToday(): QuordleData | null {
    return getQuordleDataForDate(getJSTToday());
}

export function getQuordleYesterday(): QuordleData | null {
    return getQuordleDataForDate(subDays(getJSTToday(), 1));
}

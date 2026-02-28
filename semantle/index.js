var cr = Object.defineProperty;
var lr = (r, n, i) => n in r ? cr(r, n, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: i
}) : r[n] = i;
var fr = (r, n) => () => (n || r((n = {
    exports: {}
}).exports, n),
    n.exports);
var pe = (r, n, i) => (lr(r, typeof n != "symbol" ? n + "" : n, i),
    i);
var dn = fr((mn, Fe) => {
    (function () {
        const n = document.createElement("link").relList;
        if (n && n.supports && n.supports("modulepreload"))
            return;
        for (const f of document.querySelectorAll('link[rel="modulepreload"]'))
            a(f);
        new MutationObserver(f => {
            for (const c of f)
                if (c.type === "childList")
                    for (const _ of c.addedNodes)
                        _.tagName === "LINK" && _.rel === "modulepreload" && a(_)
        }
        ).observe(document, {
            childList: !0,
            subtree: !0
        });
        function i(f) {
            const c = {};
            return f.integrity && (c.integrity = f.integrity),
                f.referrerPolicy && (c.referrerPolicy = f.referrerPolicy),
                f.crossOrigin === "use-credentials" ? c.credentials = "include" : f.crossOrigin === "anonymous" ? c.credentials = "omit" : c.credentials = "same-origin",
                c
        }
        function a(f) {
            if (f.ep)
                return;
            f.ep = !0;
            const c = i(f);
            fetch(f.href, c)
        }
    }
    )();
    var hr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
    function dr(r) {
        return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r
    }
    var Tt = {}
        , ze = {};
    ze.byteLength = mr;
    ze.toByteArray = yr;
    ze.fromByteArray = vr;
    var me = []
        , le = []
        , pr = typeof Uint8Array < "u" ? Uint8Array : Array
        , Qe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (var Se = 0, _r = Qe.length; Se < _r; ++Se)
        me[Se] = Qe[Se],
            le[Qe.charCodeAt(Se)] = Se;
    le["-".charCodeAt(0)] = 62;
    le["_".charCodeAt(0)] = 63;
    function Dt(r) {
        var n = r.length;
        if (n % 4 > 0)
            throw new Error("Invalid string. Length must be a multiple of 4");
        var i = r.indexOf("=");
        i === -1 && (i = n);
        var a = i === n ? 0 : 4 - i % 4;
        return [i, a]
    }
    function mr(r) {
        var n = Dt(r)
            , i = n[0]
            , a = n[1];
        return (i + a) * 3 / 4 - a
    }
    function gr(r, n, i) {
        return (n + i) * 3 / 4 - i
    }
    function yr(r) {
        var n, i = Dt(r), a = i[0], f = i[1], c = new pr(gr(r, a, f)), _ = 0, u = f > 0 ? a - 4 : a, y;
        for (y = 0; y < u; y += 4)
            n = le[r.charCodeAt(y)] << 18 | le[r.charCodeAt(y + 1)] << 12 | le[r.charCodeAt(y + 2)] << 6 | le[r.charCodeAt(y + 3)],
                c[_++] = n >> 16 & 255,
                c[_++] = n >> 8 & 255,
                c[_++] = n & 255;
        return f === 2 && (n = le[r.charCodeAt(y)] << 2 | le[r.charCodeAt(y + 1)] >> 4,
            c[_++] = n & 255),
            f === 1 && (n = le[r.charCodeAt(y)] << 10 | le[r.charCodeAt(y + 1)] << 4 | le[r.charCodeAt(y + 2)] >> 2,
                c[_++] = n >> 8 & 255,
                c[_++] = n & 255),
            c
    }
    function wr(r) {
        return me[r >> 18 & 63] + me[r >> 12 & 63] + me[r >> 6 & 63] + me[r & 63]
    }
    function xr(r, n, i) {
        for (var a, f = [], c = n; c < i; c += 3)
            a = (r[c] << 16 & 16711680) + (r[c + 1] << 8 & 65280) + (r[c + 2] & 255),
                f.push(wr(a));
        return f.join("")
    }
    function vr(r) {
        for (var n, i = r.length, a = i % 3, f = [], c = 16383, _ = 0, u = i - a; _ < u; _ += c)
            f.push(xr(r, _, _ + c > u ? u : _ + c));
        return a === 1 ? (n = r[i - 1],
            f.push(me[n >> 2] + me[n << 4 & 63] + "==")) : a === 2 && (n = (r[i - 2] << 8) + r[i - 1],
                f.push(me[n >> 10] + me[n >> 4 & 63] + me[n << 2 & 63] + "=")),
            f.join("")
    }
    var ct = {};
    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
    ct.read = function (r, n, i, a, f) {
        var c, _, u = f * 8 - a - 1, y = (1 << u) - 1, S = y >> 1, p = -7, M = i ? f - 1 : 0, v = i ? -1 : 1, w = r[n + M];
        for (M += v,
            c = w & (1 << -p) - 1,
            w >>= -p,
            p += u; p > 0; c = c * 256 + r[n + M],
            M += v,
            p -= 8)
            ;
        for (_ = c & (1 << -p) - 1,
            c >>= -p,
            p += a; p > 0; _ = _ * 256 + r[n + M],
            M += v,
            p -= 8)
            ;
        if (c === 0)
            c = 1 - S;
        else {
            if (c === y)
                return _ ? NaN : (w ? -1 : 1) * (1 / 0);
            _ = _ + Math.pow(2, a),
                c = c - S
        }
        return (w ? -1 : 1) * _ * Math.pow(2, c - a)
    }
        ;
    ct.write = function (r, n, i, a, f, c) {
        var _, u, y, S = c * 8 - f - 1, p = (1 << S) - 1, M = p >> 1, v = f === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, w = a ? 0 : c - 1, N = a ? 1 : -1, j = n < 0 || n === 0 && 1 / n < 0 ? 1 : 0;
        for (n = Math.abs(n),
            isNaN(n) || n === 1 / 0 ? (u = isNaN(n) ? 1 : 0,
                _ = p) : (_ = Math.floor(Math.log(n) / Math.LN2),
                    n * (y = Math.pow(2, -_)) < 1 && (_--,
                        y *= 2),
                    _ + M >= 1 ? n += v / y : n += v * Math.pow(2, 1 - M),
                    n * y >= 2 && (_++,
                        y /= 2),
                    _ + M >= p ? (u = 0,
                        _ = p) : _ + M >= 1 ? (u = (n * y - 1) * Math.pow(2, f),
                            _ = _ + M) : (u = n * Math.pow(2, M - 1) * Math.pow(2, f),
                                _ = 0)); f >= 8; r[i + w] = u & 255,
                                w += N,
                                u /= 256,
            f -= 8)
            ;
        for (_ = _ << f | u,
            S += f; S > 0; r[i + w] = _ & 255,
            w += N,
            _ /= 256,
            S -= 8)
            ;
        r[i + w - N] |= j * 128
    }
        ;
    /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
    (function (r) {
        const n = ze
            , i = ct
            , a = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
        r.Buffer = u,
            r.SlowBuffer = R,
            r.INSPECT_MAX_BYTES = 50;
        const f = 2147483647;
        r.kMaxLength = f,
            u.TYPED_ARRAY_SUPPORT = c(),
            !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
        function c() {
            try {
                const o = new Uint8Array(1)
                    , e = {
                        foo: function () {
                            return 42
                        }
                    };
                return Object.setPrototypeOf(e, Uint8Array.prototype),
                    Object.setPrototypeOf(o, e),
                    o.foo() === 42
            } catch {
                return !1
            }
        }
        Object.defineProperty(u.prototype, "parent", {
            enumerable: !0,
            get: function () {
                if (u.isBuffer(this))
                    return this.buffer
            }
        }),
            Object.defineProperty(u.prototype, "offset", {
                enumerable: !0,
                get: function () {
                    if (u.isBuffer(this))
                        return this.byteOffset
                }
            });
        function _(o) {
            if (o > f)
                throw new RangeError('The value "' + o + '" is invalid for option "size"');
            const e = new Uint8Array(o);
            return Object.setPrototypeOf(e, u.prototype),
                e
        }
        function u(o, e, t) {
            if (typeof o == "number") {
                if (typeof e == "string")
                    throw new TypeError('The "string" argument must be of type string. Received type number');
                return M(o)
            }
            return y(o, e, t)
        }
        u.poolSize = 8192;
        function y(o, e, t) {
            if (typeof o == "string")
                return v(o, e);
            if (ArrayBuffer.isView(o))
                return N(o);
            if (o == null)
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof o);
            if (ue(o, ArrayBuffer) || o && ue(o.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (ue(o, SharedArrayBuffer) || o && ue(o.buffer, SharedArrayBuffer)))
                return j(o, e, t);
            if (typeof o == "number")
                throw new TypeError('The "value" argument must not be of type number. Received type number');
            const s = o.valueOf && o.valueOf();
            if (s != null && s !== o)
                return u.from(s, e, t);
            const h = O(o);
            if (h)
                return h;
            if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof o[Symbol.toPrimitive] == "function")
                return u.from(o[Symbol.toPrimitive]("string"), e, t);
            throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof o)
        }
        u.from = function (o, e, t) {
            return y(o, e, t)
        }
            ,
            Object.setPrototypeOf(u.prototype, Uint8Array.prototype),
            Object.setPrototypeOf(u, Uint8Array);
        function S(o) {
            if (typeof o != "number")
                throw new TypeError('"size" argument must be of type number');
            if (o < 0)
                throw new RangeError('The value "' + o + '" is invalid for option "size"')
        }
        function p(o, e, t) {
            return S(o),
                o <= 0 ? _(o) : e !== void 0 ? typeof t == "string" ? _(o).fill(e, t) : _(o).fill(e) : _(o)
        }
        u.alloc = function (o, e, t) {
            return p(o, e, t)
        }
            ;
        function M(o) {
            return S(o),
                _(o < 0 ? 0 : A(o) | 0)
        }
        u.allocUnsafe = function (o) {
            return M(o)
        }
            ,
            u.allocUnsafeSlow = function (o) {
                return M(o)
            }
            ;
        function v(o, e) {
            if ((typeof e != "string" || e === "") && (e = "utf8"),
                !u.isEncoding(e))
                throw new TypeError("Unknown encoding: " + e);
            const t = re(o, e) | 0;
            let s = _(t);
            const h = s.write(o, e);
            return h !== t && (s = s.slice(0, h)),
                s
        }
        function w(o) {
            const e = o.length < 0 ? 0 : A(o.length) | 0
                , t = _(e);
            for (let s = 0; s < e; s += 1)
                t[s] = o[s] & 255;
            return t
        }
        function N(o) {
            if (ue(o, Uint8Array)) {
                const e = new Uint8Array(o);
                return j(e.buffer, e.byteOffset, e.byteLength)
            }
            return w(o)
        }
        function j(o, e, t) {
            if (e < 0 || o.byteLength < e)
                throw new RangeError('"offset" is outside of buffer bounds');
            if (o.byteLength < e + (t || 0))
                throw new RangeError('"length" is outside of buffer bounds');
            let s;
            return e === void 0 && t === void 0 ? s = new Uint8Array(o) : t === void 0 ? s = new Uint8Array(o, e) : s = new Uint8Array(o, e, t),
                Object.setPrototypeOf(s, u.prototype),
                s
        }
        function O(o) {
            if (u.isBuffer(o)) {
                const e = A(o.length) | 0
                    , t = _(e);
                return t.length === 0 || o.copy(t, 0, 0, e),
                    t
            }
            if (o.length !== void 0)
                return typeof o.length != "number" || Ee(o.length) ? _(0) : w(o);
            if (o.type === "Buffer" && Array.isArray(o.data))
                return w(o.data)
        }
        function A(o) {
            if (o >= f)
                throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + f.toString(16) + " bytes");
            return o | 0
        }
        function R(o) {
            return +o != o && (o = 0),
                u.alloc(+o)
        }
        u.isBuffer = function (e) {
            return e != null && e._isBuffer === !0 && e !== u.prototype
        }
            ,
            u.compare = function (e, t) {
                if (ue(e, Uint8Array) && (e = u.from(e, e.offset, e.byteLength)),
                    ue(t, Uint8Array) && (t = u.from(t, t.offset, t.byteLength)),
                    !u.isBuffer(e) || !u.isBuffer(t))
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                if (e === t)
                    return 0;
                let s = e.length
                    , h = t.length;
                for (let m = 0, g = Math.min(s, h); m < g; ++m)
                    if (e[m] !== t[m]) {
                        s = e[m],
                            h = t[m];
                        break
                    }
                return s < h ? -1 : h < s ? 1 : 0
            }
            ,
            u.isEncoding = function (e) {
                switch (String(e).toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return !0;
                    default:
                        return !1
                }
            }
            ,
            u.concat = function (e, t) {
                if (!Array.isArray(e))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                if (e.length === 0)
                    return u.alloc(0);
                let s;
                if (t === void 0)
                    for (t = 0,
                        s = 0; s < e.length; ++s)
                        t += e[s].length;
                const h = u.allocUnsafe(t);
                let m = 0;
                for (s = 0; s < e.length; ++s) {
                    let g = e[s];
                    if (ue(g, Uint8Array))
                        m + g.length > h.length ? (u.isBuffer(g) || (g = u.from(g)),
                            g.copy(h, m)) : Uint8Array.prototype.set.call(h, g, m);
                    else if (u.isBuffer(g))
                        g.copy(h, m);
                    else
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    m += g.length
                }
                return h
            }
            ;
        function re(o, e) {
            if (u.isBuffer(o))
                return o.length;
            if (ArrayBuffer.isView(o) || ue(o, ArrayBuffer))
                return o.byteLength;
            if (typeof o != "string")
                throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof o);
            const t = o.length
                , s = arguments.length > 2 && arguments[2] === !0;
            if (!s && t === 0)
                return 0;
            let h = !1;
            for (; ;)
                switch (e) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return t;
                    case "utf8":
                    case "utf-8":
                        return Ie(o).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return t * 2;
                    case "hex":
                        return t >>> 1;
                    case "base64":
                        return Ae(o).length;
                    default:
                        if (h)
                            return s ? -1 : Ie(o).length;
                        e = ("" + e).toLowerCase(),
                            h = !0
                }
        }
        u.byteLength = re;
        function oe(o, e, t) {
            let s = !1;
            if ((e === void 0 || e < 0) && (e = 0),
                e > this.length || ((t === void 0 || t > this.length) && (t = this.length),
                    t <= 0) || (t >>>= 0,
                        e >>>= 0,
                        t <= e))
                return "";
            for (o || (o = "utf8"); ;)
                switch (o) {
                    case "hex":
                        return B(this, e, t);
                    case "utf8":
                    case "utf-8":
                        return d(this, e, t);
                    case "ascii":
                        return x(this, e, t);
                    case "latin1":
                    case "binary":
                        return C(this, e, t);
                    case "base64":
                        return U(this, e, t);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return $(this, e, t);
                    default:
                        if (s)
                            throw new TypeError("Unknown encoding: " + o);
                        o = (o + "").toLowerCase(),
                            s = !0
                }
        }
        u.prototype._isBuffer = !0;
        function q(o, e, t) {
            const s = o[e];
            o[e] = o[t],
                o[t] = s
        }
        u.prototype.swap16 = function () {
            const e = this.length;
            if (e % 2 !== 0)
                throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (let t = 0; t < e; t += 2)
                q(this, t, t + 1);
            return this
        }
            ,
            u.prototype.swap32 = function () {
                const e = this.length;
                if (e % 4 !== 0)
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (let t = 0; t < e; t += 4)
                    q(this, t, t + 3),
                        q(this, t + 1, t + 2);
                return this
            }
            ,
            u.prototype.swap64 = function () {
                const e = this.length;
                if (e % 8 !== 0)
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (let t = 0; t < e; t += 8)
                    q(this, t, t + 7),
                        q(this, t + 1, t + 6),
                        q(this, t + 2, t + 5),
                        q(this, t + 3, t + 4);
                return this
            }
            ,
            u.prototype.toString = function () {
                const e = this.length;
                return e === 0 ? "" : arguments.length === 0 ? d(this, 0, e) : oe.apply(this, arguments)
            }
            ,
            u.prototype.toLocaleString = u.prototype.toString,
            u.prototype.equals = function (e) {
                if (!u.isBuffer(e))
                    throw new TypeError("Argument must be a Buffer");
                return this === e ? !0 : u.compare(this, e) === 0
            }
            ,
            u.prototype.inspect = function () {
                let e = "";
                const t = r.INSPECT_MAX_BYTES;
                return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(),
                    this.length > t && (e += " ... "),
                    "<Buffer " + e + ">"
            }
            ,
            a && (u.prototype[a] = u.prototype.inspect),
            u.prototype.compare = function (e, t, s, h, m) {
                if (ue(e, Uint8Array) && (e = u.from(e, e.offset, e.byteLength)),
                    !u.isBuffer(e))
                    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
                if (t === void 0 && (t = 0),
                    s === void 0 && (s = e ? e.length : 0),
                    h === void 0 && (h = 0),
                    m === void 0 && (m = this.length),
                    t < 0 || s > e.length || h < 0 || m > this.length)
                    throw new RangeError("out of range index");
                if (h >= m && t >= s)
                    return 0;
                if (h >= m)
                    return -1;
                if (t >= s)
                    return 1;
                if (t >>>= 0,
                    s >>>= 0,
                    h >>>= 0,
                    m >>>= 0,
                    this === e)
                    return 0;
                let g = m - h
                    , P = s - t;
                const X = Math.min(g, P)
                    , V = this.slice(h, m)
                    , Q = e.slice(t, s);
                for (let z = 0; z < X; ++z)
                    if (V[z] !== Q[z]) {
                        g = V[z],
                            P = Q[z];
                        break
                    }
                return g < P ? -1 : P < g ? 1 : 0
            }
            ;
        function ee(o, e, t, s, h) {
            if (o.length === 0)
                return -1;
            if (typeof t == "string" ? (s = t,
                t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648),
                t = +t,
                Ee(t) && (t = h ? 0 : o.length - 1),
                t < 0 && (t = o.length + t),
                t >= o.length) {
                if (h)
                    return -1;
                t = o.length - 1
            } else if (t < 0)
                if (h)
                    t = 0;
                else
                    return -1;
            if (typeof e == "string" && (e = u.from(e, s)),
                u.isBuffer(e))
                return e.length === 0 ? -1 : Z(o, e, t, s, h);
            if (typeof e == "number")
                return e = e & 255,
                    typeof Uint8Array.prototype.indexOf == "function" ? h ? Uint8Array.prototype.indexOf.call(o, e, t) : Uint8Array.prototype.lastIndexOf.call(o, e, t) : Z(o, [e], t, s, h);
            throw new TypeError("val must be string, number or Buffer")
        }
        function Z(o, e, t, s, h) {
            let m = 1
                , g = o.length
                , P = e.length;
            if (s !== void 0 && (s = String(s).toLowerCase(),
                s === "ucs2" || s === "ucs-2" || s === "utf16le" || s === "utf-16le")) {
                if (o.length < 2 || e.length < 2)
                    return -1;
                m = 2,
                    g /= 2,
                    P /= 2,
                    t /= 2
            }
            function X(Q, z) {
                return m === 1 ? Q[z] : Q.readUInt16BE(z * m)
            }
            let V;
            if (h) {
                let Q = -1;
                for (V = t; V < g; V++)
                    if (X(o, V) === X(e, Q === -1 ? 0 : V - Q)) {
                        if (Q === -1 && (Q = V),
                            V - Q + 1 === P)
                            return Q * m
                    } else
                        Q !== -1 && (V -= V - Q),
                            Q = -1
            } else
                for (t + P > g && (t = g - P),
                    V = t; V >= 0; V--) {
                    let Q = !0;
                    for (let z = 0; z < P; z++)
                        if (X(o, V + z) !== X(e, z)) {
                            Q = !1;
                            break
                        }
                    if (Q)
                        return V
                }
            return -1
        }
        u.prototype.includes = function (e, t, s) {
            return this.indexOf(e, t, s) !== -1
        }
            ,
            u.prototype.indexOf = function (e, t, s) {
                return ee(this, e, t, s, !0)
            }
            ,
            u.prototype.lastIndexOf = function (e, t, s) {
                return ee(this, e, t, s, !1)
            }
            ;
        function D(o, e, t, s) {
            t = Number(t) || 0;
            const h = o.length - t;
            s ? (s = Number(s),
                s > h && (s = h)) : s = h;
            const m = e.length;
            s > m / 2 && (s = m / 2);
            let g;
            for (g = 0; g < s; ++g) {
                const P = parseInt(e.substr(g * 2, 2), 16);
                if (Ee(P))
                    return g;
                o[t + g] = P
            }
            return g
        }
        function T(o, e, t, s) {
            return be(Ie(e, o.length - t), o, t, s)
        }
        function W(o, e, t, s) {
            return be(Je(e), o, t, s)
        }
        function ge(o, e, t, s) {
            return be(Ae(e), o, t, s)
        }
        function ye(o, e, t, s) {
            return be(Ne(e, o.length - t), o, t, s)
        }
        u.prototype.write = function (e, t, s, h) {
            if (t === void 0)
                h = "utf8",
                    s = this.length,
                    t = 0;
            else if (s === void 0 && typeof t == "string")
                h = t,
                    s = this.length,
                    t = 0;
            else if (isFinite(t))
                t = t >>> 0,
                    isFinite(s) ? (s = s >>> 0,
                        h === void 0 && (h = "utf8")) : (h = s,
                            s = void 0);
            else
                throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
            const m = this.length - t;
            if ((s === void 0 || s > m) && (s = m),
                e.length > 0 && (s < 0 || t < 0) || t > this.length)
                throw new RangeError("Attempt to write outside buffer bounds");
            h || (h = "utf8");
            let g = !1;
            for (; ;)
                switch (h) {
                    case "hex":
                        return D(this, e, t, s);
                    case "utf8":
                    case "utf-8":
                        return T(this, e, t, s);
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return W(this, e, t, s);
                    case "base64":
                        return ge(this, e, t, s);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return ye(this, e, t, s);
                    default:
                        if (g)
                            throw new TypeError("Unknown encoding: " + h);
                        h = ("" + h).toLowerCase(),
                            g = !0
                }
        }
            ,
            u.prototype.toJSON = function () {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            }
            ;
        function U(o, e, t) {
            return e === 0 && t === o.length ? n.fromByteArray(o) : n.fromByteArray(o.slice(e, t))
        }
        function d(o, e, t) {
            t = Math.min(o.length, t);
            const s = [];
            let h = e;
            for (; h < t;) {
                const m = o[h];
                let g = null
                    , P = m > 239 ? 4 : m > 223 ? 3 : m > 191 ? 2 : 1;
                if (h + P <= t) {
                    let X, V, Q, z;
                    switch (P) {
                        case 1:
                            m < 128 && (g = m);
                            break;
                        case 2:
                            X = o[h + 1],
                                (X & 192) === 128 && (z = (m & 31) << 6 | X & 63,
                                    z > 127 && (g = z));
                            break;
                        case 3:
                            X = o[h + 1],
                                V = o[h + 2],
                                (X & 192) === 128 && (V & 192) === 128 && (z = (m & 15) << 12 | (X & 63) << 6 | V & 63,
                                    z > 2047 && (z < 55296 || z > 57343) && (g = z));
                            break;
                        case 4:
                            X = o[h + 1],
                                V = o[h + 2],
                                Q = o[h + 3],
                                (X & 192) === 128 && (V & 192) === 128 && (Q & 192) === 128 && (z = (m & 15) << 18 | (X & 63) << 12 | (V & 63) << 6 | Q & 63,
                                    z > 65535 && z < 1114112 && (g = z))
                    }
                }
                g === null ? (g = 65533,
                    P = 1) : g > 65535 && (g -= 65536,
                        s.push(g >>> 10 & 1023 | 55296),
                        g = 56320 | g & 1023),
                    s.push(g),
                    h += P
            }
            return E(s)
        }
        const l = 4096;
        function E(o) {
            const e = o.length;
            if (e <= l)
                return String.fromCharCode.apply(String, o);
            let t = ""
                , s = 0;
            for (; s < e;)
                t += String.fromCharCode.apply(String, o.slice(s, s += l));
            return t
        }
        function x(o, e, t) {
            let s = "";
            t = Math.min(o.length, t);
            for (let h = e; h < t; ++h)
                s += String.fromCharCode(o[h] & 127);
            return s
        }
        function C(o, e, t) {
            let s = "";
            t = Math.min(o.length, t);
            for (let h = e; h < t; ++h)
                s += String.fromCharCode(o[h]);
            return s
        }
        function B(o, e, t) {
            const s = o.length;
            (!e || e < 0) && (e = 0),
                (!t || t < 0 || t > s) && (t = s);
            let h = "";
            for (let m = e; m < t; ++m)
                h += Xe[o[m]];
            return h
        }
        function $(o, e, t) {
            const s = o.slice(e, t);
            let h = "";
            for (let m = 0; m < s.length - 1; m += 2)
                h += String.fromCharCode(s[m] + s[m + 1] * 256);
            return h
        }
        u.prototype.slice = function (e, t) {
            const s = this.length;
            e = ~~e,
                t = t === void 0 ? s : ~~t,
                e < 0 ? (e += s,
                    e < 0 && (e = 0)) : e > s && (e = s),
                t < 0 ? (t += s,
                    t < 0 && (t = 0)) : t > s && (t = s),
                t < e && (t = e);
            const h = this.subarray(e, t);
            return Object.setPrototypeOf(h, u.prototype),
                h
        }
            ;
        function I(o, e, t) {
            if (o % 1 !== 0 || o < 0)
                throw new RangeError("offset is not uint");
            if (o + e > t)
                throw new RangeError("Trying to access beyond buffer length")
        }
        u.prototype.readUintLE = u.prototype.readUIntLE = function (e, t, s) {
            e = e >>> 0,
                t = t >>> 0,
                s || I(e, t, this.length);
            let h = this[e]
                , m = 1
                , g = 0;
            for (; ++g < t && (m *= 256);)
                h += this[e + g] * m;
            return h
        }
            ,
            u.prototype.readUintBE = u.prototype.readUIntBE = function (e, t, s) {
                e = e >>> 0,
                    t = t >>> 0,
                    s || I(e, t, this.length);
                let h = this[e + --t]
                    , m = 1;
                for (; t > 0 && (m *= 256);)
                    h += this[e + --t] * m;
                return h
            }
            ,
            u.prototype.readUint8 = u.prototype.readUInt8 = function (e, t) {
                return e = e >>> 0,
                    t || I(e, 1, this.length),
                    this[e]
            }
            ,
            u.prototype.readUint16LE = u.prototype.readUInt16LE = function (e, t) {
                return e = e >>> 0,
                    t || I(e, 2, this.length),
                    this[e] | this[e + 1] << 8
            }
            ,
            u.prototype.readUint16BE = u.prototype.readUInt16BE = function (e, t) {
                return e = e >>> 0,
                    t || I(e, 2, this.length),
                    this[e] << 8 | this[e + 1]
            }
            ,
            u.prototype.readUint32LE = u.prototype.readUInt32LE = function (e, t) {
                return e = e >>> 0,
                    t || I(e, 4, this.length),
                    (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216
            }
            ,
            u.prototype.readUint32BE = u.prototype.readUInt32BE = function (e, t) {
                return e = e >>> 0,
                    t || I(e, 4, this.length),
                    this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
            }
            ,
            u.prototype.readBigUInt64LE = de(function (e) {
                e = e >>> 0,
                    ae(e, "offset");
                const t = this[e]
                    , s = this[e + 7];
                (t === void 0 || s === void 0) && ve(e, this.length - 8);
                const h = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24
                    , m = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + s * 2 ** 24;
                return BigInt(h) + (BigInt(m) << BigInt(32))
            }),
            u.prototype.readBigUInt64BE = de(function (e) {
                e = e >>> 0,
                    ae(e, "offset");
                const t = this[e]
                    , s = this[e + 7];
                (t === void 0 || s === void 0) && ve(e, this.length - 8);
                const h = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e]
                    , m = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + s;
                return (BigInt(h) << BigInt(32)) + BigInt(m)
            }),
            u.prototype.readIntLE = function (e, t, s) {
                e = e >>> 0,
                    t = t >>> 0,
                    s || I(e, t, this.length);
                let h = this[e]
                    , m = 1
                    , g = 0;
                for (; ++g < t && (m *= 256);)
                    h += this[e + g] * m;
                return m *= 128,
                    h >= m && (h -= Math.pow(2, 8 * t)),
                    h
            }
            ,
            u.prototype.readIntBE = function (e, t, s) {
                e = e >>> 0,
                    t = t >>> 0,
                    s || I(e, t, this.length);
                let h = t
                    , m = 1
                    , g = this[e + --h];
                for (; h > 0 && (m *= 256);)
                    g += this[e + --h] * m;
                return m *= 128,
                    g >= m && (g -= Math.pow(2, 8 * t)),
                    g
            }
            ,
            u.prototype.readInt8 = function (e, t) {
                return e = e >>> 0,
                    t || I(e, 1, this.length),
                    this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e]
            }
            ,
            u.prototype.readInt16LE = function (e, t) {
                e = e >>> 0,
                    t || I(e, 2, this.length);
                const s = this[e] | this[e + 1] << 8;
                return s & 32768 ? s | 4294901760 : s
            }
            ,
            u.prototype.readInt16BE = function (e, t) {
                e = e >>> 0,
                    t || I(e, 2, this.length);
                const s = this[e + 1] | this[e] << 8;
                return s & 32768 ? s | 4294901760 : s
            }
            ,
            u.prototype.readInt32LE = function (e, t) {
                return e = e >>> 0,
                    t || I(e, 4, this.length),
                    this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
            }
            ,
            u.prototype.readInt32BE = function (e, t) {
                return e = e >>> 0,
                    t || I(e, 4, this.length),
                    this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
            }
            ,
            u.prototype.readBigInt64LE = de(function (e) {
                e = e >>> 0,
                    ae(e, "offset");
                const t = this[e]
                    , s = this[e + 7];
                (t === void 0 || s === void 0) && ve(e, this.length - 8);
                const h = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (s << 24);
                return (BigInt(h) << BigInt(32)) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24)
            }),
            u.prototype.readBigInt64BE = de(function (e) {
                e = e >>> 0,
                    ae(e, "offset");
                const t = this[e]
                    , s = this[e + 7];
                (t === void 0 || s === void 0) && ve(e, this.length - 8);
                const h = (t << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
                return (BigInt(h) << BigInt(32)) + BigInt(this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + s)
            }),
            u.prototype.readFloatLE = function (e, t) {
                return e = e >>> 0,
                    t || I(e, 4, this.length),
                    i.read(this, e, !0, 23, 4)
            }
            ,
            u.prototype.readFloatBE = function (e, t) {
                return e = e >>> 0,
                    t || I(e, 4, this.length),
                    i.read(this, e, !1, 23, 4)
            }
            ,
            u.prototype.readDoubleLE = function (e, t) {
                return e = e >>> 0,
                    t || I(e, 8, this.length),
                    i.read(this, e, !0, 52, 8)
            }
            ,
            u.prototype.readDoubleBE = function (e, t) {
                return e = e >>> 0,
                    t || I(e, 8, this.length),
                    i.read(this, e, !1, 52, 8)
            }
            ;
        function k(o, e, t, s, h, m) {
            if (!u.isBuffer(o))
                throw new TypeError('"buffer" argument must be a Buffer instance');
            if (e > h || e < m)
                throw new RangeError('"value" argument is out of bounds');
            if (t + s > o.length)
                throw new RangeError("Index out of range")
        }
        u.prototype.writeUintLE = u.prototype.writeUIntLE = function (e, t, s, h) {
            if (e = +e,
                t = t >>> 0,
                s = s >>> 0,
                !h) {
                const P = Math.pow(2, 8 * s) - 1;
                k(this, e, t, s, P, 0)
            }
            let m = 1
                , g = 0;
            for (this[t] = e & 255; ++g < s && (m *= 256);)
                this[t + g] = e / m & 255;
            return t + s
        }
            ,
            u.prototype.writeUintBE = u.prototype.writeUIntBE = function (e, t, s, h) {
                if (e = +e,
                    t = t >>> 0,
                    s = s >>> 0,
                    !h) {
                    const P = Math.pow(2, 8 * s) - 1;
                    k(this, e, t, s, P, 0)
                }
                let m = s - 1
                    , g = 1;
                for (this[t + m] = e & 255; --m >= 0 && (g *= 256);)
                    this[t + m] = e / g & 255;
                return t + s
            }
            ,
            u.prototype.writeUint8 = u.prototype.writeUInt8 = function (e, t, s) {
                return e = +e,
                    t = t >>> 0,
                    s || k(this, e, t, 1, 255, 0),
                    this[t] = e & 255,
                    t + 1
            }
            ,
            u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function (e, t, s) {
                return e = +e,
                    t = t >>> 0,
                    s || k(this, e, t, 2, 65535, 0),
                    this[t] = e & 255,
                    this[t + 1] = e >>> 8,
                    t + 2
            }
            ,
            u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function (e, t, s) {
                return e = +e,
                    t = t >>> 0,
                    s || k(this, e, t, 2, 65535, 0),
                    this[t] = e >>> 8,
                    this[t + 1] = e & 255,
                    t + 2
            }
            ,
            u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function (e, t, s) {
                return e = +e,
                    t = t >>> 0,
                    s || k(this, e, t, 4, 4294967295, 0),
                    this[t + 3] = e >>> 24,
                    this[t + 2] = e >>> 16,
                    this[t + 1] = e >>> 8,
                    this[t] = e & 255,
                    t + 4
            }
            ,
            u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function (e, t, s) {
                return e = +e,
                    t = t >>> 0,
                    s || k(this, e, t, 4, 4294967295, 0),
                    this[t] = e >>> 24,
                    this[t + 1] = e >>> 16,
                    this[t + 2] = e >>> 8,
                    this[t + 3] = e & 255,
                    t + 4
            }
            ;
        function G(o, e, t, s, h) {
            ce(e, s, h, o, t, 7);
            let m = Number(e & BigInt(4294967295));
            o[t++] = m,
                m = m >> 8,
                o[t++] = m,
                m = m >> 8,
                o[t++] = m,
                m = m >> 8,
                o[t++] = m;
            let g = Number(e >> BigInt(32) & BigInt(4294967295));
            return o[t++] = g,
                g = g >> 8,
                o[t++] = g,
                g = g >> 8,
                o[t++] = g,
                g = g >> 8,
                o[t++] = g,
                t
        }
        function L(o, e, t, s, h) {
            ce(e, s, h, o, t, 7);
            let m = Number(e & BigInt(4294967295));
            o[t + 7] = m,
                m = m >> 8,
                o[t + 6] = m,
                m = m >> 8,
                o[t + 5] = m,
                m = m >> 8,
                o[t + 4] = m;
            let g = Number(e >> BigInt(32) & BigInt(4294967295));
            return o[t + 3] = g,
                g = g >> 8,
                o[t + 2] = g,
                g = g >> 8,
                o[t + 1] = g,
                g = g >> 8,
                o[t] = g,
                t + 8
        }
        u.prototype.writeBigUInt64LE = de(function (e, t = 0) {
            return G(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"))
        }),
            u.prototype.writeBigUInt64BE = de(function (e, t = 0) {
                return L(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"))
            }),
            u.prototype.writeIntLE = function (e, t, s, h) {
                if (e = +e,
                    t = t >>> 0,
                    !h) {
                    const X = Math.pow(2, 8 * s - 1);
                    k(this, e, t, s, X - 1, -X)
                }
                let m = 0
                    , g = 1
                    , P = 0;
                for (this[t] = e & 255; ++m < s && (g *= 256);)
                    e < 0 && P === 0 && this[t + m - 1] !== 0 && (P = 1),
                        this[t + m] = (e / g >> 0) - P & 255;
                return t + s
            }
            ,
            u.prototype.writeIntBE = function (e, t, s, h) {
                if (e = +e,
                    t = t >>> 0,
                    !h) {
                    const X = Math.pow(2, 8 * s - 1);
                    k(this, e, t, s, X - 1, -X)
                }
                let m = s - 1
                    , g = 1
                    , P = 0;
                for (this[t + m] = e & 255; --m >= 0 && (g *= 256);)
                    e < 0 && P === 0 && this[t + m + 1] !== 0 && (P = 1),
                        this[t + m] = (e / g >> 0) - P & 255;
                return t + s
            }
            ,
            u.prototype.writeInt8 = function (e, t, s) {
                return e = +e,
                    t = t >>> 0,
                    s || k(this, e, t, 1, 127, -128),
                    e < 0 && (e = 255 + e + 1),
                    this[t] = e & 255,
                    t + 1
            }
            ,
            u.prototype.writeInt16LE = function (e, t, s) {
                return e = +e,
                    t = t >>> 0,
                    s || k(this, e, t, 2, 32767, -32768),
                    this[t] = e & 255,
                    this[t + 1] = e >>> 8,
                    t + 2
            }
            ,
            u.prototype.writeInt16BE = function (e, t, s) {
                return e = +e,
                    t = t >>> 0,
                    s || k(this, e, t, 2, 32767, -32768),
                    this[t] = e >>> 8,
                    this[t + 1] = e & 255,
                    t + 2
            }
            ,
            u.prototype.writeInt32LE = function (e, t, s) {
                return e = +e,
                    t = t >>> 0,
                    s || k(this, e, t, 4, 2147483647, -2147483648),
                    this[t] = e & 255,
                    this[t + 1] = e >>> 8,
                    this[t + 2] = e >>> 16,
                    this[t + 3] = e >>> 24,
                    t + 4
            }
            ,
            u.prototype.writeInt32BE = function (e, t, s) {
                return e = +e,
                    t = t >>> 0,
                    s || k(this, e, t, 4, 2147483647, -2147483648),
                    e < 0 && (e = 4294967295 + e + 1),
                    this[t] = e >>> 24,
                    this[t + 1] = e >>> 16,
                    this[t + 2] = e >>> 8,
                    this[t + 3] = e & 255,
                    t + 4
            }
            ,
            u.prototype.writeBigInt64LE = de(function (e, t = 0) {
                return G(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
            }),
            u.prototype.writeBigInt64BE = de(function (e, t = 0) {
                return L(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
            });
        function Y(o, e, t, s, h, m) {
            if (t + s > o.length)
                throw new RangeError("Index out of range");
            if (t < 0)
                throw new RangeError("Index out of range")
        }
        function te(o, e, t, s, h) {
            return e = +e,
                t = t >>> 0,
                h || Y(o, e, t, 4),
                i.write(o, e, t, s, 23, 4),
                t + 4
        }
        u.prototype.writeFloatLE = function (e, t, s) {
            return te(this, e, t, !0, s)
        }
            ,
            u.prototype.writeFloatBE = function (e, t, s) {
                return te(this, e, t, !1, s)
            }
            ;
        function H(o, e, t, s, h) {
            return e = +e,
                t = t >>> 0,
                h || Y(o, e, t, 8),
                i.write(o, e, t, s, 52, 8),
                t + 8
        }
        u.prototype.writeDoubleLE = function (e, t, s) {
            return H(this, e, t, !0, s)
        }
            ,
            u.prototype.writeDoubleBE = function (e, t, s) {
                return H(this, e, t, !1, s)
            }
            ,
            u.prototype.copy = function (e, t, s, h) {
                if (!u.isBuffer(e))
                    throw new TypeError("argument should be a Buffer");
                if (s || (s = 0),
                    !h && h !== 0 && (h = this.length),
                    t >= e.length && (t = e.length),
                    t || (t = 0),
                    h > 0 && h < s && (h = s),
                    h === s || e.length === 0 || this.length === 0)
                    return 0;
                if (t < 0)
                    throw new RangeError("targetStart out of bounds");
                if (s < 0 || s >= this.length)
                    throw new RangeError("Index out of range");
                if (h < 0)
                    throw new RangeError("sourceEnd out of bounds");
                h > this.length && (h = this.length),
                    e.length - t < h - s && (h = e.length - t + s);
                const m = h - s;
                return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, s, h) : Uint8Array.prototype.set.call(e, this.subarray(s, h), t),
                    m
            }
            ,
            u.prototype.fill = function (e, t, s, h) {
                if (typeof e == "string") {
                    if (typeof t == "string" ? (h = t,
                        t = 0,
                        s = this.length) : typeof s == "string" && (h = s,
                            s = this.length),
                        h !== void 0 && typeof h != "string")
                        throw new TypeError("encoding must be a string");
                    if (typeof h == "string" && !u.isEncoding(h))
                        throw new TypeError("Unknown encoding: " + h);
                    if (e.length === 1) {
                        const g = e.charCodeAt(0);
                        (h === "utf8" && g < 128 || h === "latin1") && (e = g)
                    }
                } else
                    typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
                if (t < 0 || this.length < t || this.length < s)
                    throw new RangeError("Out of range index");
                if (s <= t)
                    return this;
                t = t >>> 0,
                    s = s === void 0 ? this.length : s >>> 0,
                    e || (e = 0);
                let m;
                if (typeof e == "number")
                    for (m = t; m < s; ++m)
                        this[m] = e;
                else {
                    const g = u.isBuffer(e) ? e : u.from(e, h)
                        , P = g.length;
                    if (P === 0)
                        throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                    for (m = 0; m < s - t; ++m)
                        this[m + t] = g[m % P]
                }
                return this
            }
            ;
        const se = {};
        function J(o, e, t) {
            se[o] = class extends t {
                constructor() {
                    super(),
                        Object.defineProperty(this, "message", {
                            value: e.apply(this, arguments),
                            writable: !0,
                            configurable: !0
                        }),
                        this.name = `${this.name} [${o}]`,
                        this.stack,
                        delete this.name
                }
                get code() {
                    return o
                }
                set code(h) {
                    Object.defineProperty(this, "code", {
                        configurable: !0,
                        enumerable: !0,
                        value: h,
                        writable: !0
                    })
                }
                toString() {
                    return `${this.name} [${o}]: ${this.message}`
                }
            }
        }
        J("ERR_BUFFER_OUT_OF_BOUNDS", function (o) {
            return o ? `${o} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds"
        }, RangeError),
            J("ERR_INVALID_ARG_TYPE", function (o, e) {
                return `The "${o}" argument must be of type number. Received type ${typeof e}`
            }, TypeError),
            J("ERR_OUT_OF_RANGE", function (o, e, t) {
                let s = `The value of "${o}" is out of range.`
                    , h = t;
                return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? h = ie(String(t)) : typeof t == "bigint" && (h = String(t),
                    (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (h = ie(h)),
                    h += "n"),
                    s += ` It must be ${e}. Received ${h}`,
                    s
            }, RangeError);
        function ie(o) {
            let e = ""
                , t = o.length;
            const s = o[0] === "-" ? 1 : 0;
            for (; t >= s + 4; t -= 3)
                e = `_${o.slice(t - 3, t)}${e}`;
            return `${o.slice(0, t)}${e}`
        }
        function he(o, e, t) {
            ae(e, "offset"),
                (o[e] === void 0 || o[e + t] === void 0) && ve(e, o.length - (t + 1))
        }
        function ce(o, e, t, s, h, m) {
            if (o > t || o < e) {
                const g = typeof e == "bigint" ? "n" : "";
                let P;
                throw m > 3 ? e === 0 || e === BigInt(0) ? P = `>= 0${g} and < 2${g} ** ${(m + 1) * 8}${g}` : P = `>= -(2${g} ** ${(m + 1) * 8 - 1}${g}) and < 2 ** ${(m + 1) * 8 - 1}${g}` : P = `>= ${e}${g} and <= ${t}${g}`,
                new se.ERR_OUT_OF_RANGE("value", P, o)
            }
            he(s, h, m)
        }
        function ae(o, e) {
            if (typeof o != "number")
                throw new se.ERR_INVALID_ARG_TYPE(e, "number", o)
        }
        function ve(o, e, t) {
            throw Math.floor(o) !== o ? (ae(o, t),
                new se.ERR_OUT_OF_RANGE(t || "offset", "an integer", o)) : e < 0 ? new se.ERR_BUFFER_OUT_OF_BOUNDS : new se.ERR_OUT_OF_RANGE(t || "offset", `>= ${t ? 1 : 0} and <= ${e}`, o)
        }
        const qe = /[^+/0-9A-Za-z-_]/g;
        function Ze(o) {
            if (o = o.split("=")[0],
                o = o.trim().replace(qe, ""),
                o.length < 2)
                return "";
            for (; o.length % 4 !== 0;)
                o = o + "=";
            return o
        }
        function Ie(o, e) {
            e = e || 1 / 0;
            let t;
            const s = o.length;
            let h = null;
            const m = [];
            for (let g = 0; g < s; ++g) {
                if (t = o.charCodeAt(g),
                    t > 55295 && t < 57344) {
                    if (!h) {
                        if (t > 56319) {
                            (e -= 3) > -1 && m.push(239, 191, 189);
                            continue
                        } else if (g + 1 === s) {
                            (e -= 3) > -1 && m.push(239, 191, 189);
                            continue
                        }
                        h = t;
                        continue
                    }
                    if (t < 56320) {
                        (e -= 3) > -1 && m.push(239, 191, 189),
                            h = t;
                        continue
                    }
                    t = (h - 55296 << 10 | t - 56320) + 65536
                } else
                    h && (e -= 3) > -1 && m.push(239, 191, 189);
                if (h = null,
                    t < 128) {
                    if ((e -= 1) < 0)
                        break;
                    m.push(t)
                } else if (t < 2048) {
                    if ((e -= 2) < 0)
                        break;
                    m.push(t >> 6 | 192, t & 63 | 128)
                } else if (t < 65536) {
                    if ((e -= 3) < 0)
                        break;
                    m.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128)
                } else if (t < 1114112) {
                    if ((e -= 4) < 0)
                        break;
                    m.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128)
                } else
                    throw new Error("Invalid code point")
            }
            return m
        }
        function Je(o) {
            const e = [];
            for (let t = 0; t < o.length; ++t)
                e.push(o.charCodeAt(t) & 255);
            return e
        }
        function Ne(o, e) {
            let t, s, h;
            const m = [];
            for (let g = 0; g < o.length && !((e -= 2) < 0); ++g)
                t = o.charCodeAt(g),
                    s = t >> 8,
                    h = t % 256,
                    m.push(h),
                    m.push(s);
            return m
        }
        function Ae(o) {
            return n.toByteArray(Ze(o))
        }
        function be(o, e, t, s) {
            let h;
            for (h = 0; h < s && !(h + t >= e.length || h >= o.length); ++h)
                e[h + t] = o[h];
            return h
        }
        function ue(o, e) {
            return o instanceof e || o != null && o.constructor != null && o.constructor.name != null && o.constructor.name === e.name
        }
        function Ee(o) {
            return o !== o
        }
        const Xe = function () {
            const o = "0123456789abcdef"
                , e = new Array(256);
            for (let t = 0; t < 16; ++t) {
                const s = t * 16;
                for (let h = 0; h < 16; ++h)
                    e[s + h] = o[t] + o[h]
            }
            return e
        }();
        function de(o) {
            return typeof BigInt > "u" ? ur : o
        }
        function ur() {
            throw new Error("BigInt not supported")
        }
    }
    )(Tt);
    var Ye, F, Pt, Be, pt, Rt, rt, Lt, Oe = {}, Ot = [], br = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
    function we(r, n) {
        for (var i in n)
            r[i] = n[i];
        return r
    }
    function Wt(r) {
        var n = r.parentNode;
        n && n.removeChild(r)
    }
    function nt(r, n, i) {
        var a, f, c, _ = {};
        for (c in n)
            c == "key" ? a = n[c] : c == "ref" ? f = n[c] : _[c] = n[c];
        if (arguments.length > 2 && (_.children = arguments.length > 3 ? Ye.call(arguments, 2) : i),
            typeof r == "function" && r.defaultProps != null)
            for (c in r.defaultProps)
                _[c] === void 0 && (_[c] = r.defaultProps[c]);
        return Pe(r, _, a, f, null)
    }
    function Pe(r, n, i, a, f) {
        var c = {
            type: r,
            props: n,
            key: i,
            ref: a,
            __k: null,
            __: null,
            __b: 0,
            __e: null,
            __d: void 0,
            __c: null,
            __h: null,
            constructor: void 0,
            __v: f ?? ++Pt
        };
        return f == null && F.vnode != null && F.vnode(c),
            c
    }
    function We() {
        return {
            current: null
        }
    }
    function ne(r) {
        return r.children
    }
    function fe(r, n) {
        this.props = r,
            this.context = n
    }
    function Me(r, n) {
        if (n == null)
            return r.__ ? Me(r.__, r.__.__k.indexOf(r) + 1) : null;
        for (var i; n < r.__k.length; n++)
            if ((i = r.__k[n]) != null && i.__e != null)
                return i.__e;
        return typeof r.type == "function" ? Me(r) : null
    }
    function Ht(r) {
        var n, i;
        if ((r = r.__) != null && r.__c != null) {
            for (r.__e = r.__c.base = null,
                n = 0; n < r.__k.length; n++)
                if ((i = r.__k[n]) != null && i.__e != null) {
                    r.__e = r.__c.base = i.__e;
                    break
                }
            return Ht(r)
        }
    }
    function it(r) {
        (!r.__d && (r.__d = !0) && Be.push(r) && !He.__r++ || pt !== F.debounceRendering) && ((pt = F.debounceRendering) || Rt)(He)
    }
    function He() {
        var r, n, i, a, f, c, _, u;
        for (Be.sort(rt); r = Be.shift();)
            r.__d && (n = Be.length,
                a = void 0,
                f = void 0,
                _ = (c = (i = r).__v).__e,
                (u = i.__P) && (a = [],
                    (f = we({}, c)).__v = c.__v + 1,
                    lt(u, c, f, i.__n, u.ownerSVGElement !== void 0, c.__h != null ? [_] : null, a, _ ?? Me(c), c.__h),
                    Vt(a, c),
                    c.__e != _ && Ht(c)),
                Be.length > n && Be.sort(rt));
        He.__r = 0
    }
    function Gt(r, n, i, a, f, c, _, u, y, S) {
        var p, M, v, w, N, j, O, A = a && a.__k || Ot, R = A.length;
        for (i.__k = [],
            p = 0; p < n.length; p++)
            if ((w = i.__k[p] = (w = n[p]) == null || typeof w == "boolean" || typeof w == "function" ? null : typeof w == "string" || typeof w == "number" || typeof w == "bigint" ? Pe(null, w, null, null, w) : Array.isArray(w) ? Pe(ne, {
                children: w
            }, null, null, null) : w.__b > 0 ? Pe(w.type, w.props, w.key, w.ref ? w.ref : null, w.__v) : w) != null) {
                if (w.__ = i,
                    w.__b = i.__b + 1,
                    (v = A[p]) === null || v && w.key == v.key && w.type === v.type)
                    A[p] = void 0;
                else
                    for (M = 0; M < R; M++) {
                        if ((v = A[M]) && w.key == v.key && w.type === v.type) {
                            A[M] = void 0;
                            break
                        }
                        v = null
                    }
                lt(r, w, v = v || Oe, f, c, _, u, y, S),
                    N = w.__e,
                    (M = w.ref) && v.ref != M && (O || (O = []),
                        v.ref && O.push(v.ref, null, w),
                        O.push(M, w.__c || N, w)),
                    N != null ? (j == null && (j = N),
                        typeof w.type == "function" && w.__k === v.__k ? w.__d = y = jt(w, y, r) : y = zt(r, w, v, A, N, y),
                        typeof i.type == "function" && (i.__d = y)) : y && v.__e == y && y.parentNode != r && (y = Me(v))
            }
        for (i.__e = j,
            p = R; p--;)
            A[p] != null && (typeof i.type == "function" && A[p].__e != null && A[p].__e == i.__d && (i.__d = Yt(a).nextSibling),
                Zt(A[p], A[p]));
        if (O)
            for (p = 0; p < O.length; p++)
                qt(O[p], O[++p], O[++p])
    }
    function jt(r, n, i) {
        for (var a, f = r.__k, c = 0; f && c < f.length; c++)
            (a = f[c]) && (a.__ = r,
                n = typeof a.type == "function" ? jt(a, n, i) : zt(i, a, a, f, a.__e, n));
        return n
    }
    function Ge(r, n) {
        return n = n || [],
            r == null || typeof r == "boolean" || (Array.isArray(r) ? r.some(function (i) {
                Ge(i, n)
            }) : n.push(r)),
            n
    }
    function zt(r, n, i, a, f, c) {
        var _, u, y;
        if (n.__d !== void 0)
            _ = n.__d,
                n.__d = void 0;
        else if (i == null || f != c || f.parentNode == null)
            e: if (c == null || c.parentNode !== r)
                r.appendChild(f),
                    _ = null;
            else {
                for (u = c,
                    y = 0; (u = u.nextSibling) && y < a.length; y += 1)
                    if (u == f)
                        break e;
                r.insertBefore(f, c),
                    _ = c
            }
        return _ !== void 0 ? _ : f.nextSibling
    }
    function Yt(r) {
        var n, i, a;
        if (r.type == null || typeof r.type == "string")
            return r.__e;
        if (r.__k) {
            for (n = r.__k.length - 1; n >= 0; n--)
                if ((i = r.__k[n]) && (a = Yt(i)))
                    return a
        }
        return null
    }
    function Er(r, n, i, a, f) {
        var c;
        for (c in i)
            c === "children" || c === "key" || c in n || je(r, c, null, i[c], a);
        for (c in n)
            f && typeof n[c] != "function" || c === "children" || c === "key" || c === "value" || c === "checked" || i[c] === n[c] || je(r, c, n[c], i[c], a)
    }
    function _t(r, n, i) {
        n[0] === "-" ? r.setProperty(n, i ?? "") : r[n] = i == null ? "" : typeof i != "number" || br.test(n) ? i : i + "px"
    }
    function je(r, n, i, a, f) {
        var c;
        e: if (n === "style")
            if (typeof i == "string")
                r.style.cssText = i;
            else {
                if (typeof a == "string" && (r.style.cssText = a = ""),
                    a)
                    for (n in a)
                        i && n in i || _t(r.style, n, "");
                if (i)
                    for (n in i)
                        a && i[n] === a[n] || _t(r.style, n, i[n])
            }
        else if (n[0] === "o" && n[1] === "n")
            c = n !== (n = n.replace(/Capture$/, "")),
                n = n.toLowerCase() in r ? n.toLowerCase().slice(2) : n.slice(2),
                r.l || (r.l = {}),
                r.l[n + c] = i,
                i ? a || r.addEventListener(n, c ? gt : mt, c) : r.removeEventListener(n, c ? gt : mt, c);
        else if (n !== "dangerouslySetInnerHTML") {
            if (f)
                n = n.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
            else if (n !== "width" && n !== "height" && n !== "href" && n !== "list" && n !== "form" && n !== "tabIndex" && n !== "download" && n in r)
                try {
                    r[n] = i ?? "";
                    break e
                } catch { }
            typeof i == "function" || (i == null || i === !1 && n[4] !== "-" ? r.removeAttribute(n) : r.setAttribute(n, i))
        }
    }
    function mt(r) {
        return this.l[r.type + !1](F.event ? F.event(r) : r)
    }
    function gt(r) {
        return this.l[r.type + !0](F.event ? F.event(r) : r)
    }
    function lt(r, n, i, a, f, c, _, u, y) {
        var S, p, M, v, w, N, j, O, A, R, re, oe, q, ee, Z, D = n.type;
        if (n.constructor !== void 0)
            return null;
        i.__h != null && (y = i.__h,
            u = n.__e = i.__e,
            n.__h = null,
            c = [u]),
            (S = F.__b) && S(n);
        try {
            e: if (typeof D == "function") {
                if (O = n.props,
                    A = (S = D.contextType) && a[S.__c],
                    R = S ? A ? A.props.value : S.__ : a,
                    i.__c ? j = (p = n.__c = i.__c).__ = p.__E : ("prototype" in D && D.prototype.render ? n.__c = p = new D(O, R) : (n.__c = p = new fe(O, R),
                        p.constructor = D,
                        p.render = Ir),
                        A && A.sub(p),
                        p.props = O,
                        p.state || (p.state = {}),
                        p.context = R,
                        p.__n = a,
                        M = p.__d = !0,
                        p.__h = [],
                        p._sb = []),
                    p.__s == null && (p.__s = p.state),
                    D.getDerivedStateFromProps != null && (p.__s == p.state && (p.__s = we({}, p.__s)),
                        we(p.__s, D.getDerivedStateFromProps(O, p.__s))),
                    v = p.props,
                    w = p.state,
                    p.__v = n,
                    M)
                    D.getDerivedStateFromProps == null && p.componentWillMount != null && p.componentWillMount(),
                        p.componentDidMount != null && p.__h.push(p.componentDidMount);
                else {
                    if (D.getDerivedStateFromProps == null && O !== v && p.componentWillReceiveProps != null && p.componentWillReceiveProps(O, R),
                        !p.__e && p.shouldComponentUpdate != null && p.shouldComponentUpdate(O, p.__s, R) === !1 || n.__v === i.__v) {
                        for (n.__v !== i.__v && (p.props = O,
                            p.state = p.__s,
                            p.__d = !1),
                            p.__e = !1,
                            n.__e = i.__e,
                            n.__k = i.__k,
                            n.__k.forEach(function (T) {
                                T && (T.__ = n)
                            }),
                            re = 0; re < p._sb.length; re++)
                            p.__h.push(p._sb[re]);
                        p._sb = [],
                            p.__h.length && _.push(p);
                        break e
                    }
                    p.componentWillUpdate != null && p.componentWillUpdate(O, p.__s, R),
                        p.componentDidUpdate != null && p.__h.push(function () {
                            p.componentDidUpdate(v, w, N)
                        })
                }
                if (p.context = R,
                    p.props = O,
                    p.__P = r,
                    oe = F.__r,
                    q = 0,
                    "prototype" in D && D.prototype.render) {
                    for (p.state = p.__s,
                        p.__d = !1,
                        oe && oe(n),
                        S = p.render(p.props, p.state, p.context),
                        ee = 0; ee < p._sb.length; ee++)
                        p.__h.push(p._sb[ee]);
                    p._sb = []
                } else
                    do
                        p.__d = !1,
                            oe && oe(n),
                            S = p.render(p.props, p.state, p.context),
                            p.state = p.__s;
                    while (p.__d && ++q < 25);
                p.state = p.__s,
                    p.getChildContext != null && (a = we(we({}, a), p.getChildContext())),
                    M || p.getSnapshotBeforeUpdate == null || (N = p.getSnapshotBeforeUpdate(v, w)),
                    Z = S != null && S.type === ne && S.key == null ? S.props.children : S,
                    Gt(r, Array.isArray(Z) ? Z : [Z], n, i, a, f, c, _, u, y),
                    p.base = n.__e,
                    n.__h = null,
                    p.__h.length && _.push(p),
                    j && (p.__E = p.__ = null),
                    p.__e = !1
            } else
                c == null && n.__v === i.__v ? (n.__k = i.__k,
                    n.__e = i.__e) : n.__e = Br(i.__e, n, i, a, f, c, _, y);
            (S = F.diffed) && S(n)
        } catch (T) {
            n.__v = null,
                (y || c != null) && (n.__e = u,
                    n.__h = !!y,
                    c[c.indexOf(u)] = null),
                F.__e(T, n, i)
        }
    }
    function Vt(r, n) {
        F.__c && F.__c(n, r),
            r.some(function (i) {
                try {
                    r = i.__h,
                        i.__h = [],
                        r.some(function (a) {
                            a.call(i)
                        })
                } catch (a) {
                    F.__e(a, i.__v)
                }
            })
    }
    function Br(r, n, i, a, f, c, _, u) {
        var y, S, p, M = i.props, v = n.props, w = n.type, N = 0;
        if (w === "svg" && (f = !0),
            c != null) {
            for (; N < c.length; N++)
                if ((y = c[N]) && "setAttribute" in y == !!w && (w ? y.localName === w : y.nodeType === 3)) {
                    r = y,
                        c[N] = null;
                    break
                }
        }
        if (r == null) {
            if (w === null)
                return document.createTextNode(v);
            r = f ? document.createElementNS("http://www.w3.org/2000/svg", w) : document.createElement(w, v.is && v),
                c = null,
                u = !1
        }
        if (w === null)
            M === v || u && r.data === v || (r.data = v);
        else {
            if (c = c && Ye.call(r.childNodes),
                S = (M = i.props || Oe).dangerouslySetInnerHTML,
                p = v.dangerouslySetInnerHTML,
                !u) {
                if (c != null)
                    for (M = {},
                        N = 0; N < r.attributes.length; N++)
                        M[r.attributes[N].name] = r.attributes[N].value;
                (p || S) && (p && (S && p.__html == S.__html || p.__html === r.innerHTML) || (r.innerHTML = p && p.__html || ""))
            }
            if (Er(r, v, M, f, u),
                p)
                n.__k = [];
            else if (N = n.props.children,
                Gt(r, Array.isArray(N) ? N : [N], n, i, a, f && w !== "foreignObject", c, _, c ? c[0] : i.__k && Me(i, 0), u),
                c != null)
                for (N = c.length; N--;)
                    c[N] != null && Wt(c[N]);
            u || ("value" in v && (N = v.value) !== void 0 && (N !== r.value || w === "progress" && !N || w === "option" && N !== M.value) && je(r, "value", N, M.value, !1),
                "checked" in v && (N = v.checked) !== void 0 && N !== r.checked && je(r, "checked", N, M.checked, !1))
        }
        return r
    }
    function qt(r, n, i) {
        try {
            typeof r == "function" ? r(n) : r.current = n
        } catch (a) {
            F.__e(a, i)
        }
    }
    function Zt(r, n, i) {
        var a, f;
        if (F.unmount && F.unmount(r),
            (a = r.ref) && (a.current && a.current !== r.__e || qt(a, null, n)),
            (a = r.__c) != null) {
            if (a.componentWillUnmount)
                try {
                    a.componentWillUnmount()
                } catch (c) {
                    F.__e(c, n)
                }
            a.base = a.__P = null,
                r.__c = void 0
        }
        if (a = r.__k)
            for (f = 0; f < a.length; f++)
                a[f] && Zt(a[f], n, i || typeof r.type != "function");
        i || r.__e == null || Wt(r.__e),
            r.__ = r.__e = r.__d = void 0
    }
    function Ir(r, n, i) {
        return this.constructor(r, i)
    }
    function Sr(r, n, i) {
        var a, f, c;
        F.__ && F.__(r, n),
            f = (a = typeof i == "function") ? null : i && i.__k || n.__k,
            c = [],
            lt(n, r = (!a && i || n).__k = nt(ne, null, [r]), f || Oe, Oe, n.ownerSVGElement !== void 0, !a && i ? [i] : f ? null : n.firstChild ? Ye.call(n.childNodes) : null, c, !a && i ? i : f ? f.__e : n.firstChild, a),
            Vt(c, r)
    }
    function Cr(r, n) {
        var i = {
            __c: n = "__cC" + Lt++,
            __: r,
            Consumer: function (a, f) {
                return a.children(f)
            },
            Provider: function (a) {
                var f, c;
                return this.getChildContext || (f = [],
                    (c = {})[n] = this,
                    this.getChildContext = function () {
                        return c
                    }
                    ,
                    this.shouldComponentUpdate = function (_) {
                        this.props.value !== _.value && f.some(function (u) {
                            u.__e = !0,
                                it(u)
                        })
                    }
                    ,
                    this.sub = function (_) {
                        f.push(_);
                        var u = _.componentWillUnmount;
                        _.componentWillUnmount = function () {
                            f.splice(f.indexOf(_), 1),
                                u && u.call(_)
                        }
                    }
                ),
                    a.children
            }
        };
        return i.Provider.__ = i.Consumer.contextType = i
    }
    Ye = Ot.slice,
        F = {
            __e: function (r, n, i, a) {
                for (var f, c, _; n = n.__;)
                    if ((f = n.__c) && !f.__)
                        try {
                            if ((c = f.constructor) && c.getDerivedStateFromError != null && (f.setState(c.getDerivedStateFromError(r)),
                                _ = f.__d),
                                f.componentDidCatch != null && (f.componentDidCatch(r, a || {}),
                                    _ = f.__d),
                                _)
                                return f.__E = f
                        } catch (u) {
                            r = u
                        }
                throw r
            }
        },
        Pt = 0,
        fe.prototype.setState = function (r, n) {
            var i;
            i = this.__s != null && this.__s !== this.state ? this.__s : this.__s = we({}, this.state),
                typeof r == "function" && (r = r(we({}, i), this.props)),
                r && we(i, r),
                r != null && this.__v && (n && this._sb.push(n),
                    it(this))
        }
        ,
        fe.prototype.forceUpdate = function (r) {
            this.__v && (this.__e = !0,
                r && this.__h.push(r),
                it(this))
        }
        ,
        fe.prototype.render = ne,
        Be = [],
        Rt = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout,
        rt = function (r, n) {
            return r.__v.__b - n.__v.__b
        }
        ,
        He.__r = 0,
        Lt = 0;
    var ke, K, Ke, yt, $e = 0, Jt = [], Re = [], wt = F.__b, xt = F.__r, vt = F.diffed, bt = F.__c, Et = F.unmount;
    function Ve(r, n) {
        F.__h && F.__h(K, r, $e || n),
            $e = 0;
        var i = K.__H || (K.__H = {
            __: [],
            __h: []
        });
        return r >= i.__.length && i.__.push({
            __V: Re
        }),
            i.__[r]
    }
    function xe(r) {
        return $e = 1,
            Mr(Qt, r)
    }
    function Mr(r, n, i) {
        var a = Ve(ke++, 2);
        if (a.t = r,
            !a.__c && (a.__ = [i ? i(n) : Qt(void 0, n), function (u) {
                var y = a.__N ? a.__N[0] : a.__[0]
                    , S = a.t(y, u);
                y !== S && (a.__N = [S, a.__[1]],
                    a.__c.setState({}))
            }
            ],
                a.__c = K,
                !K.u)) {
            var f = function (u, y, S) {
                if (!a.__c.__H)
                    return !0;
                var p = a.__c.__H.__.filter(function (v) {
                    return v.__c
                });
                if (p.every(function (v) {
                    return !v.__N
                }))
                    return !c || c.call(this, u, y, S);
                var M = !1;
                return p.forEach(function (v) {
                    if (v.__N) {
                        var w = v.__[0];
                        v.__ = v.__N,
                            v.__N = void 0,
                            w !== v.__[0] && (M = !0)
                    }
                }),
                    !(!M && a.__c.props === u) && (!c || c.call(this, u, y, S))
            };
            K.u = !0;
            var c = K.shouldComponentUpdate
                , _ = K.componentWillUpdate;
            K.componentWillUpdate = function (u, y, S) {
                if (this.__e) {
                    var p = c;
                    c = void 0,
                        f(u, y, S),
                        c = p
                }
                _ && _.call(this, u, y, S)
            }
                ,
                K.shouldComponentUpdate = f
        }
        return a.__N || a.__
    }
    function Ce(r, n) {
        var i = Ve(ke++, 3);
        !F.__s && ht(i.__H, n) && (i.__ = r,
            i.i = n,
            K.__H.__h.push(i))
    }
    function $r(r, n) {
        var i = Ve(ke++, 4);
        !F.__s && ht(i.__H, n) && (i.__ = r,
            i.i = n,
            K.__h.push(i))
    }
    function ft(r) {
        return $e = 5,
            Xt(function () {
                return {
                    current: r
                }
            }, [])
    }
    function Xt(r, n) {
        var i = Ve(ke++, 7);
        return ht(i.__H, n) ? (i.__V = r(),
            i.i = n,
            i.__h = r,
            i.__V) : i.__
    }
    function ot(r, n) {
        return $e = 8,
            Xt(function () {
                return r
            }, n)
    }
    function kr() {
        for (var r; r = Jt.shift();)
            if (r.__P && r.__H)
                try {
                    r.__H.__h.forEach(Le),
                        r.__H.__h.forEach(st),
                        r.__H.__h = []
                } catch (n) {
                    r.__H.__h = [],
                        F.__e(n, r.__v)
                }
    }
    F.__b = function (r) {
        K = null,
            wt && wt(r)
    }
        ,
        F.__r = function (r) {
            xt && xt(r),
                ke = 0;
            var n = (K = r.__c).__H;
            n && (Ke === K ? (n.__h = [],
                K.__h = [],
                n.__.forEach(function (i) {
                    i.__N && (i.__ = i.__N),
                        i.__V = Re,
                        i.__N = i.i = void 0
                })) : (n.__h.forEach(Le),
                    n.__h.forEach(st),
                    n.__h = [])),
                Ke = K
        }
        ,
        F.diffed = function (r) {
            vt && vt(r);
            var n = r.__c;
            n && n.__H && (n.__H.__h.length && (Jt.push(n) !== 1 && yt === F.requestAnimationFrame || ((yt = F.requestAnimationFrame) || Fr)(kr)),
                n.__H.__.forEach(function (i) {
                    i.i && (i.__H = i.i),
                        i.__V !== Re && (i.__ = i.__V),
                        i.i = void 0,
                        i.__V = Re
                })),
                Ke = K = null
        }
        ,
        F.__c = function (r, n) {
            n.some(function (i) {
                try {
                    i.__h.forEach(Le),
                        i.__h = i.__h.filter(function (a) {
                            return !a.__ || st(a)
                        })
                } catch (a) {
                    n.some(function (f) {
                        f.__h && (f.__h = [])
                    }),
                        n = [],
                        F.__e(a, i.__v)
                }
            }),
                bt && bt(r, n)
        }
        ,
        F.unmount = function (r) {
            Et && Et(r);
            var n, i = r.__c;
            i && i.__H && (i.__H.__.forEach(function (a) {
                try {
                    Le(a)
                } catch (f) {
                    n = f
                }
            }),
                i.__H = void 0,
                n && F.__e(n, i.__v))
        }
        ;
    var Bt = typeof requestAnimationFrame == "function";
    function Fr(r) {
        var n, i = function () {
            clearTimeout(a),
                Bt && cancelAnimationFrame(n),
                setTimeout(r)
        }, a = setTimeout(i, 100);
        Bt && (n = requestAnimationFrame(i))
    }
    function Le(r) {
        var n = K
            , i = r.__c;
        typeof i == "function" && (r.__c = void 0,
            i()),
            K = n
    }
    function st(r) {
        var n = K;
        r.__c = r.__(),
            K = n
    }
    function ht(r, n) {
        return !r || r.length !== n.length || n.some(function (i, a) {
            return i !== r[a]
        })
    }
    function Qt(r, n) {
        return typeof n == "function" ? n(r) : n
    }
    function Nr(r, n) {
        for (var i in n)
            r[i] = n[i];
        return r
    }
    function It(r, n) {
        for (var i in r)
            if (i !== "__source" && !(i in n))
                return !0;
        for (var a in n)
            if (a !== "__source" && r[a] !== n[a])
                return !0;
        return !1
    }
    function St(r) {
        this.props = r
    }
    (St.prototype = new fe).isPureReactComponent = !0,
        St.prototype.shouldComponentUpdate = function (r, n) {
            return It(this.props, r) || It(this.state, n)
        }
        ;
    var Ct = F.__b;
    F.__b = function (r) {
        r.type && r.type.__f && r.ref && (r.props.ref = r.ref,
            r.ref = null),
            Ct && Ct(r)
    }
        ;
    var Ar = F.__e;
    F.__e = function (r, n, i, a) {
        if (r.then) {
            for (var f, c = n; c = c.__;)
                if ((f = c.__c) && f.__c)
                    return n.__e == null && (n.__e = i.__e,
                        n.__k = i.__k),
                        f.__c(r, n)
        }
        Ar(r, n, i, a)
    }
        ;
    var Mt = F.unmount;
    function Kt(r, n, i) {
        return r && (r.__c && r.__c.__H && (r.__c.__H.__.forEach(function (a) {
            typeof a.__c == "function" && a.__c()
        }),
            r.__c.__H = null),
            (r = Nr({}, r)).__c != null && (r.__c.__P === i && (r.__c.__P = n),
                r.__c = null),
            r.__k = r.__k && r.__k.map(function (a) {
                return Kt(a, n, i)
            })),
            r
    }
    function er(r, n, i) {
        return r && (r.__v = null,
            r.__k = r.__k && r.__k.map(function (a) {
                return er(a, n, i)
            }),
            r.__c && r.__c.__P === n && (r.__e && i.insertBefore(r.__e, r.__d),
                r.__c.__e = !0,
                r.__c.__P = i)),
            r
    }
    function et() {
        this.__u = 0,
            this.t = null,
            this.__b = null
    }
    function tr(r) {
        var n = r.__.__c;
        return n && n.__a && n.__a(r)
    }
    function Ue() {
        this.u = null,
            this.o = null
    }
    F.unmount = function (r) {
        var n = r.__c;
        n && n.__R && n.__R(),
            n && r.__h === !0 && (r.type = null),
            Mt && Mt(r)
    }
        ,
        (et.prototype = new fe).__c = function (r, n) {
            var i = n.__c
                , a = this;
            a.t == null && (a.t = []),
                a.t.push(i);
            var f = tr(a.__v)
                , c = !1
                , _ = function () {
                    c || (c = !0,
                        i.__R = null,
                        f ? f(u) : u())
                };
            i.__R = _;
            var u = function () {
                if (!--a.__u) {
                    if (a.state.__a) {
                        var S = a.state.__a;
                        a.__v.__k[0] = er(S, S.__c.__P, S.__c.__O)
                    }
                    var p;
                    for (a.setState({
                        __a: a.__b = null
                    }); p = a.t.pop();)
                        p.forceUpdate()
                }
            }
                , y = n.__h === !0;
            a.__u++ || y || a.setState({
                __a: a.__b = a.__v.__k[0]
            }),
                r.then(_, _)
        }
        ,
        et.prototype.componentWillUnmount = function () {
            this.t = []
        }
        ,
        et.prototype.render = function (r, n) {
            if (this.__b) {
                if (this.__v.__k) {
                    var i = document.createElement("div")
                        , a = this.__v.__k[0].__c;
                    this.__v.__k[0] = Kt(this.__b, i, a.__O = a.__P)
                }
                this.__b = null
            }
            var f = n.__a && nt(ne, null, r.fallback);
            return f && (f.__h = null),
                [nt(ne, null, n.__a ? null : r.children), f]
        }
        ;
    var $t = function (r, n, i) {
        if (++i[1] === i[0] && r.o.delete(n),
            r.props.revealOrder && (r.props.revealOrder[0] !== "t" || !r.o.size))
            for (i = r.u; i;) {
                for (; i.length > 3;)
                    i.pop()();
                if (i[1] < i[0])
                    break;
                r.u = i = i[2]
            }
    };
    (Ue.prototype = new fe).__a = function (r) {
        var n = this
            , i = tr(n.__v)
            , a = n.o.get(r);
        return a[0]++,
            function (f) {
                var c = function () {
                    n.props.revealOrder ? (a.push(f),
                        $t(n, r, a)) : f()
                };
                i ? i(c) : c()
            }
    }
        ,
        Ue.prototype.render = function (r) {
            this.u = null,
                this.o = new Map;
            var n = Ge(r.children);
            r.revealOrder && r.revealOrder[0] === "b" && n.reverse();
            for (var i = n.length; i--;)
                this.o.set(n[i], this.u = [1, 0, this.u]);
            return r.children
        }
        ,
        Ue.prototype.componentDidUpdate = Ue.prototype.componentDidMount = function () {
            var r = this;
            this.o.forEach(function (n, i) {
                $t(r, i, n)
            })
        }
        ;
    var Ur = typeof Symbol < "u" && Symbol.for && Symbol.for("react.element") || 60103
        , Tr = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/
        , Dr = /^on(Ani|Tra|Tou|BeforeInp|Compo)/
        , Pr = /[A-Z0-9]/g
        , Rr = typeof document < "u"
        , Lr = function (r) {
            return (typeof Symbol < "u" && typeof Symbol() == "symbol" ? /fil|che|rad/ : /fil|che|ra/).test(r)
        };
    fe.prototype.isReactComponent = {},
        ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function (r) {
            Object.defineProperty(fe.prototype, r, {
                configurable: !0,
                get: function () {
                    return this["UNSAFE_" + r]
                },
                set: function (n) {
                    Object.defineProperty(this, r, {
                        configurable: !0,
                        writable: !0,
                        value: n
                    })
                }
            })
        });
    var kt = F.event;
    function Or() { }
    function Wr() {
        return this.cancelBubble
    }
    function Hr() {
        return this.defaultPrevented
    }
    F.event = function (r) {
        return kt && (r = kt(r)),
            r.persist = Or,
            r.isPropagationStopped = Wr,
            r.isDefaultPrevented = Hr,
            r.nativeEvent = r
    }
        ;
    var Gr = {
        enumerable: !1,
        configurable: !0,
        get: function () {
            return this.class
        }
    }
        , Ft = F.vnode;
    F.vnode = function (r) {
        typeof r.type == "string" && function (n) {
            var i = n.props
                , a = n.type
                , f = {};
            for (var c in i) {
                var _ = i[c];
                if (!(c === "value" && "defaultValue" in i && _ == null || Rr && c === "children" && a === "noscript" || c === "class" || c === "className")) {
                    var u = c.toLowerCase();
                    c === "defaultValue" && "value" in i && i.value == null ? c = "value" : c === "download" && _ === !0 ? _ = "" : u === "ondoubleclick" ? c = "ondblclick" : u !== "onchange" || a !== "input" && a !== "textarea" || Lr(i.type) ? u === "onfocus" ? c = "onfocusin" : u === "onblur" ? c = "onfocusout" : Dr.test(c) ? c = u : a.indexOf("-") === -1 && Tr.test(c) ? c = c.replace(Pr, "-$&").toLowerCase() : _ === null && (_ = void 0) : u = c = "oninput",
                        u === "oninput" && f[c = u] && (c = "oninputCapture"),
                        f[c] = _
                }
            }
            a == "select" && f.multiple && Array.isArray(f.value) && (f.value = Ge(i.children).forEach(function (y) {
                y.props.selected = f.value.indexOf(y.props.value) != -1
            })),
                a == "select" && f.defaultValue != null && (f.value = Ge(i.children).forEach(function (y) {
                    y.props.selected = f.multiple ? f.defaultValue.indexOf(y.props.value) != -1 : f.defaultValue == y.props.value
                })),
                i.class && !i.className ? (f.class = i.class,
                    Object.defineProperty(f, "className", Gr)) : (i.className && !i.class || i.class && i.className) && (f.class = f.className = i.className),
                n.props = f
        }(r),
            r.$$typeof = Ur,
            Ft && Ft(r)
    }
        ;
    var Nt = F.__r;
    F.__r = function (r) {
        Nt && Nt(r),
            r.__c
    }
        ;
    var At = F.diffed;
    F.diffed = function (r) {
        At && At(r);
        var n = r.props
            , i = r.__e;
        i != null && r.type === "textarea" && "value" in n && n.value !== i.value && (i.value = n.value == null ? "" : n.value)
    }
        ;
    var jr = ne
        , Fe = {};
    (function r(n, i, a, f) {
        var c = !!(n.Worker && n.Blob && n.Promise && n.OffscreenCanvas && n.OffscreenCanvasRenderingContext2D && n.HTMLCanvasElement && n.HTMLCanvasElement.prototype.transferControlToOffscreen && n.URL && n.URL.createObjectURL);
        function _() { }
        function u(d) {
            var l = i.exports.Promise
                , E = l !== void 0 ? l : n.Promise;
            return typeof E == "function" ? new E(d) : (d(_, _),
                null)
        }
        var y = function () {
            var d = Math.floor(16.666666666666668), l, E, x = {}, C = 0;
            return typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function" ? (l = function (B) {
                var $ = Math.random();
                return x[$] = requestAnimationFrame(function I(k) {
                    C === k || C + d - 1 < k ? (C = k,
                        delete x[$],
                        B()) : x[$] = requestAnimationFrame(I)
                }),
                    $
            }
                ,
                E = function (B) {
                    x[B] && cancelAnimationFrame(x[B])
                }
            ) : (l = function (B) {
                return setTimeout(B, d)
            }
                ,
                E = function (B) {
                    return clearTimeout(B)
                }
            ),
            {
                frame: l,
                cancel: E
            }
        }()
            , S = function () {
                var d, l, E = {};
                function x(C) {
                    function B($, I) {
                        C.postMessage({
                            options: $ || {},
                            callback: I
                        })
                    }
                    C.init = function (I) {
                        var k = I.transferControlToOffscreen();
                        C.postMessage({
                            canvas: k
                        }, [k])
                    }
                        ,
                        C.fire = function (I, k, G) {
                            if (l)
                                return B(I, null),
                                    l;
                            var L = Math.random().toString(36).slice(2);
                            return l = u(function (Y) {
                                function te(H) {
                                    H.data.callback === L && (delete E[L],
                                        C.removeEventListener("message", te),
                                        l = null,
                                        G(),
                                        Y())
                                }
                                C.addEventListener("message", te),
                                    B(I, L),
                                    E[L] = te.bind(null, {
                                        data: {
                                            callback: L
                                        }
                                    })
                            }),
                                l
                        }
                        ,
                        C.reset = function () {
                            C.postMessage({
                                reset: !0
                            });
                            for (var I in E)
                                E[I](),
                                    delete E[I]
                        }
                }
                return function () {
                    if (d)
                        return d;
                    if (!a && c) {
                        var C = ["var CONFETTI, SIZE = {}, module = {};", "(" + r.toString() + ")(this, module, true, SIZE);", "onmessage = function(msg) {", "  if (msg.data.options) {", "    CONFETTI(msg.data.options).then(function () {", "      if (msg.data.callback) {", "        postMessage({ callback: msg.data.callback });", "      }", "    });", "  } else if (msg.data.reset) {", "    CONFETTI && CONFETTI.reset();", "  } else if (msg.data.resize) {", "    SIZE.width = msg.data.resize.width;", "    SIZE.height = msg.data.resize.height;", "  } else if (msg.data.canvas) {", "    SIZE.width = msg.data.canvas.width;", "    SIZE.height = msg.data.canvas.height;", "    CONFETTI = module.exports.create(msg.data.canvas);", "  }", "}"].join(`
`);
                        try {
                            d = new Worker(URL.createObjectURL(new Blob([C])))
                        } catch (B) {
                            return typeof console !== void 0 && typeof console.warn == "function" && console.warn("🎊 Could not load worker", B),
                                null
                        }
                        x(d)
                    }
                    return d
                }
            }()
            , p = {
                particleCount: 50,
                angle: 90,
                spread: 45,
                startVelocity: 45,
                decay: .9,
                gravity: 1,
                drift: 0,
                ticks: 200,
                x: .5,
                y: .5,
                shapes: ["square", "circle"],
                zIndex: 100,
                colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"],
                disableForReducedMotion: !1,
                scalar: 1
            };
        function M(d, l) {
            return l ? l(d) : d
        }
        function v(d) {
            return d != null
        }
        function w(d, l, E) {
            return M(d && v(d[l]) ? d[l] : p[l], E)
        }
        function N(d) {
            return d < 0 ? 0 : Math.floor(d)
        }
        function j(d, l) {
            return Math.floor(Math.random() * (l - d)) + d
        }
        function O(d) {
            return parseInt(d, 16)
        }
        function A(d) {
            return d.map(R)
        }
        function R(d) {
            var l = String(d).replace(/[^0-9a-f]/gi, "");
            return l.length < 6 && (l = l[0] + l[0] + l[1] + l[1] + l[2] + l[2]),
            {
                r: O(l.substring(0, 2)),
                g: O(l.substring(2, 4)),
                b: O(l.substring(4, 6))
            }
        }
        function re(d) {
            var l = w(d, "origin", Object);
            return l.x = w(l, "x", Number),
                l.y = w(l, "y", Number),
                l
        }
        function oe(d) {
            d.width = document.documentElement.clientWidth,
                d.height = document.documentElement.clientHeight
        }
        function q(d) {
            var l = d.getBoundingClientRect();
            d.width = l.width,
                d.height = l.height
        }
        function ee(d) {
            var l = document.createElement("canvas");
            return l.style.position = "fixed",
                l.style.top = "0px",
                l.style.left = "0px",
                l.style.pointerEvents = "none",
                l.style.zIndex = d,
                l
        }
        function Z(d, l, E, x, C, B, $, I, k) {
            d.save(),
                d.translate(l, E),
                d.rotate(B),
                d.scale(x, C),
                d.arc(0, 0, 1, $, I, k),
                d.restore()
        }
        function D(d) {
            var l = d.angle * (Math.PI / 180)
                , E = d.spread * (Math.PI / 180);
            return {
                x: d.x,
                y: d.y,
                wobble: Math.random() * 10,
                wobbleSpeed: Math.min(.11, Math.random() * .1 + .05),
                velocity: d.startVelocity * .5 + Math.random() * d.startVelocity,
                angle2D: -l + (.5 * E - Math.random() * E),
                tiltAngle: (Math.random() * (.75 - .25) + .25) * Math.PI,
                color: d.color,
                shape: d.shape,
                tick: 0,
                totalTicks: d.ticks,
                decay: d.decay,
                drift: d.drift,
                random: Math.random() + 2,
                tiltSin: 0,
                tiltCos: 0,
                wobbleX: 0,
                wobbleY: 0,
                gravity: d.gravity * 3,
                ovalScalar: .6,
                scalar: d.scalar
            }
        }
        function T(d, l) {
            l.x += Math.cos(l.angle2D) * l.velocity + l.drift,
                l.y += Math.sin(l.angle2D) * l.velocity + l.gravity,
                l.wobble += l.wobbleSpeed,
                l.velocity *= l.decay,
                l.tiltAngle += .1,
                l.tiltSin = Math.sin(l.tiltAngle),
                l.tiltCos = Math.cos(l.tiltAngle),
                l.random = Math.random() + 2,
                l.wobbleX = l.x + 10 * l.scalar * Math.cos(l.wobble),
                l.wobbleY = l.y + 10 * l.scalar * Math.sin(l.wobble);
            var E = l.tick++ / l.totalTicks
                , x = l.x + l.random * l.tiltCos
                , C = l.y + l.random * l.tiltSin
                , B = l.wobbleX + l.random * l.tiltCos
                , $ = l.wobbleY + l.random * l.tiltSin;
            if (d.fillStyle = "rgba(" + l.color.r + ", " + l.color.g + ", " + l.color.b + ", " + (1 - E) + ")",
                d.beginPath(),
                l.shape === "circle")
                d.ellipse ? d.ellipse(l.x, l.y, Math.abs(B - x) * l.ovalScalar, Math.abs($ - C) * l.ovalScalar, Math.PI / 10 * l.wobble, 0, 2 * Math.PI) : Z(d, l.x, l.y, Math.abs(B - x) * l.ovalScalar, Math.abs($ - C) * l.ovalScalar, Math.PI / 10 * l.wobble, 0, 2 * Math.PI);
            else if (l.shape === "star")
                for (var I = Math.PI / 2 * 3, k = 4 * l.scalar, G = 8 * l.scalar, L = l.x, Y = l.y, te = 5, H = Math.PI / te; te--;)
                    L = l.x + Math.cos(I) * G,
                        Y = l.y + Math.sin(I) * G,
                        d.lineTo(L, Y),
                        I += H,
                        L = l.x + Math.cos(I) * k,
                        Y = l.y + Math.sin(I) * k,
                        d.lineTo(L, Y),
                        I += H;
            else
                d.moveTo(Math.floor(l.x), Math.floor(l.y)),
                    d.lineTo(Math.floor(l.wobbleX), Math.floor(C)),
                    d.lineTo(Math.floor(B), Math.floor($)),
                    d.lineTo(Math.floor(x), Math.floor(l.wobbleY));
            return d.closePath(),
                d.fill(),
                l.tick < l.totalTicks
        }
        function W(d, l, E, x, C) {
            var B = l.slice(), $ = d.getContext("2d"), I, k, G = u(function (L) {
                function Y() {
                    I = k = null,
                        $.clearRect(0, 0, x.width, x.height),
                        C(),
                        L()
                }
                function te() {
                    a && !(x.width === f.width && x.height === f.height) && (x.width = d.width = f.width,
                        x.height = d.height = f.height),
                        !x.width && !x.height && (E(d),
                            x.width = d.width,
                            x.height = d.height),
                        $.clearRect(0, 0, x.width, x.height),
                        B = B.filter(function (H) {
                            return T($, H)
                        }),
                        B.length ? I = y.frame(te) : Y()
                }
                I = y.frame(te),
                    k = Y
            });
            return {
                addFettis: function (L) {
                    return B = B.concat(L),
                        G
                },
                canvas: d,
                promise: G,
                reset: function () {
                    I && y.cancel(I),
                        k && k()
                }
            }
        }
        function ge(d, l) {
            var E = !d, x = !!w(l || {}, "resize"), C = w(l, "disableForReducedMotion", Boolean), B = c && !!w(l || {}, "useWorker"), $ = B ? S() : null, I = E ? oe : q, k = d && $ ? !!d.__confetti_initialized : !1, G = typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion)").matches, L;
            function Y(H, se, J) {
                for (var ie = w(H, "particleCount", N), he = w(H, "angle", Number), ce = w(H, "spread", Number), ae = w(H, "startVelocity", Number), ve = w(H, "decay", Number), qe = w(H, "gravity", Number), Ze = w(H, "drift", Number), Ie = w(H, "colors", A), Je = w(H, "ticks", Number), Ne = w(H, "shapes"), Ae = w(H, "scalar"), be = re(H), ue = ie, Ee = [], Xe = d.width * be.x, de = d.height * be.y; ue--;)
                    Ee.push(D({
                        x: Xe,
                        y: de,
                        angle: he,
                        spread: ce,
                        startVelocity: ae,
                        color: Ie[ue % Ie.length],
                        shape: Ne[j(0, Ne.length)],
                        ticks: Je,
                        decay: ve,
                        gravity: qe,
                        drift: Ze,
                        scalar: Ae
                    }));
                return L ? L.addFettis(Ee) : (L = W(d, Ee, I, se, J),
                    L.promise)
            }
            function te(H) {
                var se = C || w(H, "disableForReducedMotion", Boolean)
                    , J = w(H, "zIndex", Number);
                if (se && G)
                    return u(function (ae) {
                        ae()
                    });
                E && L ? d = L.canvas : E && !d && (d = ee(J),
                    document.body.appendChild(d)),
                    x && !k && I(d);
                var ie = {
                    width: d.width,
                    height: d.height
                };
                $ && !k && $.init(d),
                    k = !0,
                    $ && (d.__confetti_initialized = !0);
                function he() {
                    if ($) {
                        var ae = {
                            getBoundingClientRect: function () {
                                if (!E)
                                    return d.getBoundingClientRect()
                            }
                        };
                        I(ae),
                            $.postMessage({
                                resize: {
                                    width: ae.width,
                                    height: ae.height
                                }
                            });
                        return
                    }
                    ie.width = ie.height = null
                }
                function ce() {
                    L = null,
                        x && n.removeEventListener("resize", he),
                        E && d && (document.body.removeChild(d),
                            d = null,
                            k = !1)
                }
                return x && n.addEventListener("resize", he, !1),
                    $ ? $.fire(H, ie, ce) : Y(H, ie, ce)
            }
            return te.reset = function () {
                $ && $.reset(),
                    L && L.reset()
            }
                ,
                te
        }
        var ye;
        function U() {
            return ye || (ye = ge(null, {
                useWorker: !0,
                resize: !0
            })),
                ye
        }
        i.exports = function () {
            return U().apply(this, arguments)
        }
            ,
            i.exports.reset = function () {
                U().reset()
            }
            ,
            i.exports.create = ge
    }
    )(function () {
        return typeof window < "u" ? window : typeof self < "u" ? self : this || {}
    }(), Fe, !1);
    const rr = Fe.exports;
    Fe.exports.create;
    function nr(r) {
        var n, i, a = "";
        if (typeof r == "string" || typeof r == "number")
            a += r;
        else if (typeof r == "object")
            if (Array.isArray(r))
                for (n = 0; n < r.length; n++)
                    r[n] && (i = nr(r[n])) && (a && (a += " "),
                        a += i);
            else
                for (n in r)
                    r[n] && (a && (a += " "),
                        a += n);
        return a
    }
    function zr() {
        for (var r, n, i = 0, a = ""; i < arguments.length;)
            (r = arguments[i++]) && (n = nr(r)) && (a && (a += " "),
                a += n);
        return a
    }
    const dt = typeof window < "u" ? $r : Ce;
    function Yr(r) {
        const n = ft(() => {
            throw new Error("Cannot call an event handler while rendering.")
        }
        );
        return dt(() => {
            n.current = r
        }
            , [r]),
            ot((...i) => n.current(...i), [n])
    }
    function Ut(r, n, i, a) {
        const f = ft(n);
        dt(() => {
            f.current = n
        }
            , [n]),
            Ce(() => {
                const c = (i == null ? void 0 : i.current) ?? window;
                if (!(c && c.addEventListener))
                    return;
                const _ = u => f.current(u);
                return c.addEventListener(r, _, a),
                    () => {
                        c.removeEventListener(r, _, a)
                    }
            }
                , [r, i, a])
    }
    function ir(r, n) {
        const i = ot(() => {
            if (typeof window > "u")
                return n;
            try {
                const u = window.localStorage.getItem(r);
                return u ? Vr(u) : n
            } catch (u) {
                return console.warn(`Error reading localStorage key “${r}”:`, u),
                    n
            }
        }
            , [n, r])
            , [a, f] = xe(i)
            , c = Yr(u => {
                typeof window > "u" && console.warn(`Tried setting localStorage key “${r}” even though environment is not a client`);
                try {
                    const y = u instanceof Function ? u(a) : u;
                    window.localStorage.setItem(r, JSON.stringify(y)),
                        f(y),
                        window.dispatchEvent(new Event("local-storage"))
                } catch (y) {
                    console.warn(`Error setting localStorage key “${r}”:`, y)
                }
            }
            );
        Ce(() => {
            f(i())
        }
            , []);
        const _ = ot(u => {
            u != null && u.key && u.key !== r || f(i())
        }
            , [r, i]);
        return Ut("storage", _),
            Ut("local-storage", _),
            [a, c]
    }
    function Vr(r) {
        try {
            return r === "undefined" ? void 0 : JSON.parse(r ?? "")
        } catch {
            console.log("parsing error on", {
                value: r
            });
            return
        }
    }
    var qr = 0;
    function b(r, n, i, a, f, c) {
        var _, u, y = {};
        for (u in n)
            u == "ref" ? _ = n[u] : y[u] = n[u];
        var S = {
            type: r,
            props: y,
            key: i,
            ref: _,
            __k: null,
            __: null,
            __b: 0,
            __e: null,
            __d: void 0,
            __c: null,
            __h: null,
            constructor: void 0,
            __v: --qr,
            __source: f,
            __self: c
        };
        if (typeof r == "function" && (_ = r.defaultProps))
            for (u in _)
                y[u] === void 0 && (y[u] = _[u]);
        return F.vnode && F.vnode(S),
            S
    }
    const Zr = ({ game: r, puzzleNumber: n, correctTotal: i, words: a, word: f }) => {
        const c = typeof window < "u" && "storagePrefix" in window ? window.storagePrefix : ""
            , _ = We()
            , u = We()
            , [y, S] = xe(!1)
            , [p, M] = xe(!1)
            , [v, w] = ir(c + "bonusGuesses", new Array)
            , N = A => {
                if (A.preventDefault(),
                    A.stopPropagation(),
                    _.current) {
                    _.current.classList.remove("animate-shake", "field-error");
                    const R = _.current.value.toUpperCase().replace(/[a-z]/gu, "")
                        , re = {
                            guess: R,
                            correct: a.indexOf(R) !== -1
                        }
                        , oe = localStorage.getItem(c + "guesses")
                        , q = oe ? JSON.parse(oe) : []
                        , ee = R.trim() === "" || R.indexOf(" ") !== -1
                        , Z = v && v.find(D => D.guess.toUpperCase() === re.guess.toUpperCase()) || q && q.find(D => D[1].toUpperCase() === R.toUpperCase());
                    ee ? _.current.classList.add("animate-shake", "field-error") : Z ? (_.current.classList.add("animate-shake", "field-error"),
                        window.vanillaToast.error("You have already guessed " + R, {
                            duration: 1400,
                            fadeDuration: 120
                        })) : ((async () => (setTimeout(() => {
                            if (re.correct && typeof window < "u" && "mplConfetti" in window) {
                                const D = document.createElement("canvas");
                                D.style.pointerEvents = "none",
                                    D.style.position = "fixed",
                                    D.style.left = "0",
                                    D.style.top = "0",
                                    D.style.right = "0",
                                    D.style.bottom = "0",
                                    D.style.width = "100%",
                                    D.style.height = "100%",
                                    D.style.zIndex = "1000",
                                    document.body.appendChild(D);
                                const T = rr.create(D, {
                                    resize: !0,
                                    useWorker: !0
                                });
                                setTimeout(() => {
                                    T({
                                        particleCount: 20,
                                        spread: 160
                                    })
                                }
                                    , 16)
                            }
                        }
                            , 30),
                            w(D => [re, ...D])))(),
                            _.current.value = "",
                            _.current.focus())
                }
            }
            , j = v && v.filter(A => A.correct).length;
        Ce(() => {
            const A = Number(j) / i * 100;
            S(j === i),
                u.current && (u.current.style.width = A + "%")
        }
            , [v]);
        function O() {
            M(A => !A)
        }
        return b("div", {
            className: "mb-6 flex w-full flex-col  items-center justify-center",
            children: [b("h3", {
                className: "m-0 !mb-4 space-x-1 text-center !text-xl",
                children: y ? b(ne, {
                    children: "Well Done!. You completed Anagram bonus round"
                }) : b(ne, {
                    children: [b("small", {
                        children: "Can you list"
                    }), b("span", {
                        children: i - Number(j)
                    }), b("small", {
                        children: [Number(j) > 0 && "more ", "anagrams of"]
                    }), b("strong", {
                        children: [" ", f.toUpperCase()]
                    })]
                })
            }), b("div", {
                className: "bonus-round-panel",
                style: {
                    borderWidth: "1px",
                    borderStyle: "solid"
                },
                children: [b("div", {
                    className: "mb-2 flex flex-col",
                    children: b("div", {
                        className: "bonus-round-progress",
                        children: [b("div", {
                            ref: u,
                            className: "dark:focus mb-2 mr-2 flex h-full w-0 flex-row items-center justify-start  rounded-md bg-gradient-to-br from-green-500 to-green-600 text-center text-sm font-medium text-white transition-all duration-300 ease-linear"
                        }), b("span", {
                            className: "progress-bar-thumb absolute inset-0 flex h-full w-full items-center justify-center text-lg font-bold text-white",
                            children: y ? b(ne, {
                                children: ["You guessed ", i, " anagrams with", " ", v && v.length, " guesses"]
                            }) : v && b(ne, {
                                children: [Number(j), " of", " ", i]
                            })
                        })]
                    })
                }), !y && b(ne, {
                    children: b("form", {
                        onSubmit: N,
                        className: "bonus-guess-form",
                        children: b("div", {
                            className: "flex w-full flex-row space-x-[8px] rounded-lg bg-[#999]  p-2",
                            children: [b("input", {
                                type: "text",
                                className: " ",
                                autoCorrect: "off",
                                ref: _,
                                placeholder: "Enter word"
                            }), b("button", {
                                className: "btn-default",
                                children: "Guess"
                            })]
                        })
                    })
                })]
            }), b("div", {
                className: zr("bonus-guesses-list  my-2 w-full ", y && (p ? "visible" : "hidden")),
                children: [v && v.length > 0 && b("div", {
                    className: "mb-3 text-center text-lg font-bold",
                    children: "Your Guesses"
                }), b("div", {
                    className: "!text-md  flex w-full flex-row flex-wrap items-center justify-center gap-2",
                    children: v && v.map(A => {
                        const R = A.correct ? "bg-gradient-to-br from-green-600 to-green-600 text-white" : "bg-[#e5e5e5] text-black dark:bg-[#444] dark:text-white";
                        return b("span", {
                            className: `inline-flex items-center justify-center rounded-md p-1 px-3 font-bold  shadow-md ${R}`,
                            children: [A.correct ? b("i", {
                                className: "fa fa-check  mr-2"
                            }) : b("i", {
                                className: "fa fa-xmark  mr-2"
                            }), A.guess]
                        })
                    }
                    )
                })]
            }), y && b("div", {
                className: "w-full text-center mt-3",
                children: b("a", {
                    href: "#",
                    className: "inline-flex items-center justify-center space-x-2 text-sm font-bold text-black no-underline dark:text-white",
                    onClick: O,
                    children: [b("i", {
                        className: `fa fa-chevron-down ${p ? "rotate-180" : ""}`
                    }), b("span", {
                        children: [p ? "Hide" : "Show", " your guesses"]
                    }), b("i", {
                        className: `fa fa-chevron-down ${p ? "rotate-180" : ""}`
                    })]
                })
            })]
        })
    }
        , Jr = ({ game: r, correctTotal: n, puzzleNumber: i, words: a, word: f }) => {
            const c = typeof window < "u" && "storagePrefix" in window ? window.storagePrefix : ""
                , _ = We()
                , u = We()
                , [y, S] = xe(!1)
                , [p, M] = xe(!1)
                , [v, w] = ir(c + "bonusGuesses", new Array)
                , N = A => {
                    if (A.preventDefault(),
                        A.stopPropagation(),
                        _.current) {
                        _.current.classList.remove("animate-shake");
                        const R = _.current.value.toUpperCase().replace(/[a-z]/gu, "")
                            , re = localStorage.getItem(c + "guesses")
                            , oe = re ? JSON.parse(re) : []
                            , q = R.trim() === "" || R.indexOf(" ") !== -1
                            , ee = v && v.find(Z => Z.guess.neighbor.toUpperCase() === R.toUpperCase()) || oe && oe.find(Z => Z[1].toUpperCase() === R.toUpperCase());
                        if (q)
                            _.current.classList.add("animate-shake", "field-error");
                        else if (ee)
                            _.current.classList.add("animate-shake", "field-error"),
                                window.vanillaToast.error("You have already guessed " + R, {
                                    duration: 1400,
                                    fadeDuration: 120
                                });
                        else {
                            const Z = a && a.find(T => T.neighbor.toUpperCase() === R)
                                , D = {
                                    guess: Z || {
                                        neighbor: R,
                                        similarity: 0,
                                        percentile: -1
                                    },
                                    correct: !!Z
                                };
                            (async () => (setTimeout(() => {
                                if (D.correct && typeof window < "u" && "mplConfetti" in window) {
                                    const T = document.createElement("canvas");
                                    T.style.pointerEvents = "none",
                                        T.style.position = "fixed",
                                        T.style.left = "0",
                                        T.style.top = "0",
                                        T.style.right = "0",
                                        T.style.bottom = "0",
                                        T.style.width = "100%",
                                        T.style.height = "100%",
                                        T.style.zIndex = "1000",
                                        document.body.appendChild(T);
                                    const W = rr.create(T, {
                                        resize: !0,
                                        useWorker: !0
                                    });
                                    setTimeout(() => {
                                        W({
                                            particleCount: 20,
                                            spread: 160
                                        })
                                    }
                                        , 16)
                                }
                            }
                                , 30),
                                w(T => [D, ...T])))(),
                                _.current.value = ""
                        }
                        _.current.focus()
                    }
                }
                , j = v && v.filter(A => A.correct).length;
            Ce(() => {
                const A = Number(j) / n * 100;
                S(j === n),
                    u.current && (u.current.style.width = A + "%")
            }
                , [v]);
            function O() {
                M(A => !A)
            }
            return b("div", {
                className: "flex w-full flex-col  items-center justify-center",
                children: [y ? b("h3", {
                    className: "m-0 mb-3 text-center ",
                    children: "Well Done! You completed the bonus round"
                }) : b("h3", {
                    className: "m-0 mb-3 text-center ",
                    children: ["Can you name ", n - Number(j), " more of the top 1000 words for", b("strong", {
                        children: [" ", f.toString().toUpperCase()]
                    })]
                }), b("div", {
                    className: "bonus-round-panel",
                    style: {
                        borderWidth: "1px",
                        borderStyle: "solid"
                    },
                    children: [b("div", {
                        className: "mb-3 flex flex-col",
                        children: b("div", {
                            className: "bonus-round-progress",
                            children: [b("div", {
                                ref: u,
                                className: "dark:focus mb-2 mr-2 flex h-full w-0 flex-row items-center justify-start  rounded-md bg-gradient-to-br from-green-500 to-green-600 text-center text-sm font-medium text-white transition-all duration-300 ease-linear"
                            }), b("span", {
                                className: "absolute inset-0 flex h-full w-full items-center justify-center text-lg font-bold text-white",
                                children: [!v || (v && v.length < 1 ? b("span", {
                                    className: "font-medium opacity-50",
                                    children: "Make your first guess"
                                }) : b(ne, {
                                    children: [Number(j), " of", " ", n]
                                })), y && b(ne, {})]
                            })]
                        })
                    }), !y && b(ne, {
                        children: b("form", {
                            onSubmit: N,
                            className: "bonus-guess-form",
                            children: b("div", {
                                className: "flex w-full flex-row space-x-[8px] rounded-lg   p-2",
                                children: [b("input", {
                                    type: "text",
                                    className: " ",
                                    autoComplete: "off",
                                    autoCorrect: "off",
                                    ref: _,
                                    placeholder: "Enter word"
                                }), b("button", {
                                    className: "btn-default",
                                    children: "Guess"
                                })]
                            })
                        })
                    })]
                }), (y && p || !y) && v && v.length > 0 && b("div", {
                    className: "my-2 w-full",
                    children: [b("div", {
                        className: "mb-3 text-center text-lg font-bold",
                        children: "Your Guesses"
                    }), b("div", {
                        className: "!text-md  flex w-full flex-row flex-wrap items-center justify-center gap-2",
                        children: v.map(A => {
                            const R = A.correct ? "bg-gradient-to-br from-green-600 to-green-600 text-white" : "bg-black/60 text-white";
                            return b("span", {
                                className: `inline-flex items-center justify-center rounded-md p-1 px-3 font-bold  shadow-md ${R}`,
                                children: A.correct ? b(ne, {
                                    children: [A.guess.neighbor.toUpperCase(), " ", b("sup", {
                                        className: "ml-2 bg-black/40 px-2 py-0.5",
                                        children: A.guess.percentile
                                    })]
                                }) : b(ne, {
                                    children: [b("i", {
                                        className: "fa fa-xmark  mr-2"
                                    }), A.guess.neighbor.toUpperCase()]
                                })
                            })
                        }
                        )
                    })]
                }), y && b("div", {
                    className: `w-full text-center ${p ? "mt-3" : ""}`,
                    children: b("a", {
                        href: "#",
                        className: "font-bold text-current",
                        onClick: O,
                        children: ["Click to ", p ? "hide" : "show", " your guesses"]
                    })
                })]
            })
        }
        ;
    function Xr({ title: r, desc: n, onClick: i, show: a }) {
        return a ? b("div", {
            className: "animate-pop my-3",
            children: b("div", {
                className: "animate-reveal flex w-full flex-col items-center justify-center  gap-2 rounded-sm p-2",
                children: b("div", {
                    className: "flex w-full flex-col rounded-lg bg-slate-500 bg-opacity-10 p-2 text-black dark:bg-white",
                    children: [b("div", {
                        className: "mb-2 mt-1 flex w-full items-center justify-center gap-1 font-bold",
                        children: [b("span", {
                            className: "inline-block text-orange-700",
                            children: b("i", {
                                className: "fa fa-star"
                            })
                        }), b("div", {
                            className: "inline-flex flex-row items-center justify-center gap-1",
                            children: b("span", {
                                className: "translate",
                                children: r
                            })
                        }), b("span", {
                            className: "inline-block text-orange-700",
                            children: b("i", {
                                className: "fa fa-star"
                            })
                        })]
                    }), b("button", {
                        className: "text-md translate my-0.5  flex w-full items-center justify-center gap-2 rounded-md border-transparent bg-green-600 p-1 text-lg font-bold uppercase text-white",
                        type: "button",
                        onClick: f => {
                            i && i()
                        }
                        ,
                        children: "PLAY BONUS ROUND"
                    })]
                })
            })
        }) : null
    }
    const _e = new Worker(new URL("/assets/DawgWorker-e4937e37.js", self.location))
        , Qr = {
            anagram(r, n = "", i = "", a = "", f = "combined") {
                return new Promise(function (c, _) {
                    _e.addEventListener("message", function (u) {
                        c(u.data)
                    }),
                        _e.postMessage({
                            action: "anagram",
                            rack: r,
                            starts: n,
                            contains: i,
                            ends: a,
                            dict: f
                        })
                }
                )
            },
            check(r, n = "combined") {
                return new Promise(function (i, a) {
                    _e.addEventListener("message", function (f) {
                        i(f.data)
                    }),
                        _e.postMessage({
                            action: "check",
                            rack: r
                        })
                }
                )
            },
            crossword(r, n = "", i = "", a = "", f = "combined") {
                return new Promise(function (c, _) {
                    _e.addEventListener("message", function (u) {
                        c(u.data)
                    }),
                        _e.postMessage({
                            action: "crossword",
                            pattern: r,
                            starts: n,
                            contains: i,
                            ends: a,
                            dict: f
                        })
                }
                )
            },
            search(r = "", n = "", i = "", a = "", f = "combined") {
                return new Promise(function (c, _) {
                    _e.addEventListener("message", function (u) {
                        c(u.data)
                    }),
                        _e.postMessage({
                            action: "anagram",
                            rack: r,
                            starts: n,
                            contains: i,
                            ends: a,
                            dict: f
                        })
                }
                )
            },
            starts(r, n = "combined") {
                return this.search("", r, "", "", n)
            },
            ends(r, n = "combined") {
                return this.search("", "", "", r, n)
            },
            contains(r, n = "combined") {
                return this.search("", "", r, "", n)
            },
            all(r = "combined") {
                return new Promise(function (n, i) {
                    _e.addEventListener("message", function (a) {
                        n(a.data)
                    }),
                        _e.postMessage({
                            action: "all",
                            dict: r
                        })
                }
                )
            }
        }
        , Kr = () => typeof window < "u" && "SemantleGame" in window && window.SemantleGame !== void 0 ? window.SemantleGame : void 0
        , Te = "AnagramProvider";
    class or extends fe {
        constructor(i) {
            super();
            pe(this, "state", {
                word: "",
                puzzleNumber: 0,
                show: !1,
                round: "",
                dailyGuesses: [],
                gameMode: "daily",
                anagrams: new Array,
                nearby: new Array
            });
            pe(this, "worker", null);
            pe(this, "semantleEvents");
            pe(this, "semantle", {});
            pe(this, "processStorageEvent", i => {
                if (i instanceof CustomEvent) {
                    const { method: a, key: f, value: c } = i.detail;
                    console.log(a, f),
                        a === "endGame" && f === "winState" && this.updateState({
                            show: !0
                        })
                }
            }
            );
            console.log(Te, "onWillMount"),
                console.log(Te, "Initialize Anagram Provider"),
                this.semantle = Kr(),
                window.storagePrefix = this.semantle.storagePrefix,
                this.precheck()
        }
        onGameEnd(i) {
            const a = {
                ...this.state,
                show: i >= 0
            };
            this.setState(a)
        }
        updateNearby(i) {
            const a = {
                ...this.state,
                nearby: i
            };
            this.setState(a)
        }
        updateAnagrams(i) {
            const a = {
                ...this.state,
                anagrams: i
            };
            this.setState(a)
        }
        updateState(i) {
            const a = {
                ...this.state,
                ...i
            };
            this.setState(a)
        }
        async loadNearby(i) {
            const a = Buffer.from(i).toString("base64")
                , f = await fetch(`/top_1k/${a}`).then(c => c.json());
            this.updateNearby(f)
        }
        async loadAnagrams(i) {
            Qr.anagram(i, "", "", "").then(a => {
                if (a) {
                    const f = a.data.results
                        , c = Object.values(f).reduce((_, u) => {
                            const y = u;
                            return [..._, ...y]
                        }
                            , new Array).map(_ => {
                                if ("word" in _ && typeof _.word == "string")
                                    return _.word.toUpperCase()
                            }
                            );
                    this.updateAnagrams(c)
                }
            }
            ).catch(a => {
                console.error(a)
            }
            )
        }
        checkQueryParams(i) {
            return new Proxy(new URLSearchParams(window.location.search), {
                get: (a, f) => a.get(f)
            }),
            {
                ...this.state
            }
        }
        loadPuzzle() {
            String(this.state.word).length > 7 ? this.loadAnagrams(this.state.word) : this.loadNearby(this.state.word)
        }
        precheck() {
            const i = this.semantle;
            this.semantleEvents = i.events;
            const a = i.getSemantleData()
                , f = a.word;
            if (f) {
                f.length;
                const c = localStorage.getItem(a.storagePrefix + "winState")
                    , _ = c !== null && Number(c) >= 0;
                this.updateState({
                    word: f,
                    show: _,
                    gameMode: i.gameMode
                }),
                    f.length > 7 ? this.loadAnagrams(f) : this.loadNearby(f)
            } else
                this.updateState({
                    round: "",
                    show: !1
                })
        }
        componentDidMount() {
            console.log(Te, "onDidMount"),
                this.semantleEvents && this.semantleEvents.addEventListener("storage-event", this.processStorageEvent)
        }
        componentWillUnmount() {
            console.log(Te, "onWillUnmount"),
                this.semantleEvents && this.semantleEvents.removeEventListener("storage-event", this.processStorageEvent)
        }
        render() {
            const i = this.semantle;
            this.props;
            const { show: a, round: f, gameMode: c, word: _, dailyGuesses: u, puzzleNumber: y } = this.state
                , S = localStorage.getItem(i.storagePrefix + "winState");
            if (!(S !== null && Number(S) >= 0))
                return null;
            switch (document.documentElement.classList.remove("anagrams_round", "bonus_game_round", "nearby_round"),
            f) {
                case "anagram":
                    return document.documentElement.classList.add("anagrams_round", "bonus_game_round"),
                        b(ne, {
                            children: [b(Zr, {
                                game: c,
                                correctTotal: 12,
                                puzzleNumber: y,
                                words: this.state.anagrams,
                                word: this.state.word
                            }), b("div", {
                                className: "flex w-full flex-col items-center justify-center",
                                children: b("button", {
                                    className: "btn-normal my-3",
                                    onClick: () => {
                                        this.setState({
                                            round: ""
                                        }),
                                            localStorage.setItem(i.storagePrefix + "gameRound", "")
                                    }
                                    ,
                                    children: "Back to Main"
                                })
                            })]
                        });
                case "nearby":
                    return document.documentElement.classList.add("nearby_round", "bonus_game_round"),
                        b(ne, {
                            children: [b(Jr, {
                                game: i.getSemantleData().game,
                                correctTotal: 12,
                                puzzleNumber: y,
                                words: this.state.nearby,
                                word: _
                            }), b("div", {
                                className: "flex w-full flex-col items-center justify-center",
                                children: b("button", {
                                    className: "btn-normal my-3",
                                    onClick: () => {
                                        this.setState({
                                            round: ""
                                        }),
                                            localStorage.setItem(i.storagePrefix + "gameRound", "")
                                    }
                                    ,
                                    children: "Back to Main"
                                })
                            })]
                        });
                default:
                    {
                        const M = this.state.word.toUpperCase()
                            , v = M.length > 7 ? `Can you list 12 anagram (partial) of ${M}` : `Can you name 12 more of the top 1000 words for ${M}`;
                        return b(Xr, {
                            show: this.state.show,
                            onClick: () => {
                                const w = this.state.word.length > 7 ? "anagram" : "nearby";
                                this.setState({
                                    round: w
                                }),
                                    localStorage.setItem(i.storagePrefix + "gameRound", w)
                            }
                            ,
                            desc: "",
                            title: v
                        })
                    }
            }
        }
    }
    pe(or, "displayName", "AnagramProvider");
    var sr = {
        exports: {}
    };
    (function (r, n) {
        (function (i, a) {
            r.exports = a()
        }
        )(hr, function () {
            var i = 1e3
                , a = 6e4
                , f = 36e5
                , c = "millisecond"
                , _ = "second"
                , u = "minute"
                , y = "hour"
                , S = "day"
                , p = "week"
                , M = "month"
                , v = "quarter"
                , w = "year"
                , N = "date"
                , j = "Invalid Date"
                , O = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/
                , A = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g
                , R = {
                    name: "en",
                    weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
                    months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
                    ordinal: function (U) {
                        var d = ["th", "st", "nd", "rd"]
                            , l = U % 100;
                        return "[" + U + (d[(l - 20) % 10] || d[l] || d[0]) + "]"
                    }
                }
                , re = function (U, d, l) {
                    var E = String(U);
                    return !E || E.length >= d ? U : "" + Array(d + 1 - E.length).join(l) + U
                }
                , oe = {
                    s: re,
                    z: function (U) {
                        var d = -U.utcOffset()
                            , l = Math.abs(d)
                            , E = Math.floor(l / 60)
                            , x = l % 60;
                        return (d <= 0 ? "+" : "-") + re(E, 2, "0") + ":" + re(x, 2, "0")
                    },
                    m: function U(d, l) {
                        if (d.date() < l.date())
                            return -U(l, d);
                        var E = 12 * (l.year() - d.year()) + (l.month() - d.month())
                            , x = d.clone().add(E, M)
                            , C = l - x < 0
                            , B = d.clone().add(E + (C ? -1 : 1), M);
                        return +(-(E + (l - x) / (C ? x - B : B - x)) || 0)
                    },
                    a: function (U) {
                        return U < 0 ? Math.ceil(U) || 0 : Math.floor(U)
                    },
                    p: function (U) {
                        return {
                            M,
                            y: w,
                            w: p,
                            d: S,
                            D: N,
                            h: y,
                            m: u,
                            s: _,
                            ms: c,
                            Q: v
                        }[U] || String(U || "").toLowerCase().replace(/s$/, "")
                    },
                    u: function (U) {
                        return U === void 0
                    }
                }
                , q = "en"
                , ee = {};
            ee[q] = R;
            var Z = function (U) {
                return U instanceof ge
            }
                , D = function U(d, l, E) {
                    var x;
                    if (!d)
                        return q;
                    if (typeof d == "string") {
                        var C = d.toLowerCase();
                        ee[C] && (x = C),
                            l && (ee[C] = l,
                                x = C);
                        var B = d.split("-");
                        if (!x && B.length > 1)
                            return U(B[0])
                    } else {
                        var $ = d.name;
                        ee[$] = d,
                            x = $
                    }
                    return !E && x && (q = x),
                        x || !E && q
                }
                , T = function (U, d) {
                    if (Z(U))
                        return U.clone();
                    var l = typeof d == "object" ? d : {};
                    return l.date = U,
                        l.args = arguments,
                        new ge(l)
                }
                , W = oe;
            W.l = D,
                W.i = Z,
                W.w = function (U, d) {
                    return T(U, {
                        locale: d.$L,
                        utc: d.$u,
                        x: d.$x,
                        $offset: d.$offset
                    })
                }
                ;
            var ge = function () {
                function U(l) {
                    this.$L = D(l.locale, null, !0),
                        this.parse(l)
                }
                var d = U.prototype;
                return d.parse = function (l) {
                    this.$d = function (E) {
                        var x = E.date
                            , C = E.utc;
                        if (x === null)
                            return new Date(NaN);
                        if (W.u(x))
                            return new Date;
                        if (x instanceof Date)
                            return new Date(x);
                        if (typeof x == "string" && !/Z$/i.test(x)) {
                            var B = x.match(O);
                            if (B) {
                                var $ = B[2] - 1 || 0
                                    , I = (B[7] || "0").substring(0, 3);
                                return C ? new Date(Date.UTC(B[1], $, B[3] || 1, B[4] || 0, B[5] || 0, B[6] || 0, I)) : new Date(B[1], $, B[3] || 1, B[4] || 0, B[5] || 0, B[6] || 0, I)
                            }
                        }
                        return new Date(x)
                    }(l),
                        this.$x = l.x || {},
                        this.init()
                }
                    ,
                    d.init = function () {
                        var l = this.$d;
                        this.$y = l.getFullYear(),
                            this.$M = l.getMonth(),
                            this.$D = l.getDate(),
                            this.$W = l.getDay(),
                            this.$H = l.getHours(),
                            this.$m = l.getMinutes(),
                            this.$s = l.getSeconds(),
                            this.$ms = l.getMilliseconds()
                    }
                    ,
                    d.$utils = function () {
                        return W
                    }
                    ,
                    d.isValid = function () {
                        return this.$d.toString() !== j
                    }
                    ,
                    d.isSame = function (l, E) {
                        var x = T(l);
                        return this.startOf(E) <= x && x <= this.endOf(E)
                    }
                    ,
                    d.isAfter = function (l, E) {
                        return T(l) < this.startOf(E)
                    }
                    ,
                    d.isBefore = function (l, E) {
                        return this.endOf(E) < T(l)
                    }
                    ,
                    d.$g = function (l, E, x) {
                        return W.u(l) ? this[E] : this.set(x, l)
                    }
                    ,
                    d.unix = function () {
                        return Math.floor(this.valueOf() / 1e3)
                    }
                    ,
                    d.valueOf = function () {
                        return this.$d.getTime()
                    }
                    ,
                    d.startOf = function (l, E) {
                        var x = this
                            , C = !!W.u(E) || E
                            , B = W.p(l)
                            , $ = function (se, J) {
                                var ie = W.w(x.$u ? Date.UTC(x.$y, J, se) : new Date(x.$y, J, se), x);
                                return C ? ie : ie.endOf(S)
                            }
                            , I = function (se, J) {
                                return W.w(x.toDate()[se].apply(x.toDate("s"), (C ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(J)), x)
                            }
                            , k = this.$W
                            , G = this.$M
                            , L = this.$D
                            , Y = "set" + (this.$u ? "UTC" : "");
                        switch (B) {
                            case w:
                                return C ? $(1, 0) : $(31, 11);
                            case M:
                                return C ? $(1, G) : $(0, G + 1);
                            case p:
                                var te = this.$locale().weekStart || 0
                                    , H = (k < te ? k + 7 : k) - te;
                                return $(C ? L - H : L + (6 - H), G);
                            case S:
                            case N:
                                return I(Y + "Hours", 0);
                            case y:
                                return I(Y + "Minutes", 1);
                            case u:
                                return I(Y + "Seconds", 2);
                            case _:
                                return I(Y + "Milliseconds", 3);
                            default:
                                return this.clone()
                        }
                    }
                    ,
                    d.endOf = function (l) {
                        return this.startOf(l, !1)
                    }
                    ,
                    d.$set = function (l, E) {
                        var x, C = W.p(l), B = "set" + (this.$u ? "UTC" : ""), $ = (x = {},
                            x[S] = B + "Date",
                            x[N] = B + "Date",
                            x[M] = B + "Month",
                            x[w] = B + "FullYear",
                            x[y] = B + "Hours",
                            x[u] = B + "Minutes",
                            x[_] = B + "Seconds",
                            x[c] = B + "Milliseconds",
                            x)[C], I = C === S ? this.$D + (E - this.$W) : E;
                        if (C === M || C === w) {
                            var k = this.clone().set(N, 1);
                            k.$d[$](I),
                                k.init(),
                                this.$d = k.set(N, Math.min(this.$D, k.daysInMonth())).$d
                        } else
                            $ && this.$d[$](I);
                        return this.init(),
                            this
                    }
                    ,
                    d.set = function (l, E) {
                        return this.clone().$set(l, E)
                    }
                    ,
                    d.get = function (l) {
                        return this[W.p(l)]()
                    }
                    ,
                    d.add = function (l, E) {
                        var x, C = this;
                        l = Number(l);
                        var B = W.p(E)
                            , $ = function (G) {
                                var L = T(C);
                                return W.w(L.date(L.date() + Math.round(G * l)), C)
                            };
                        if (B === M)
                            return this.set(M, this.$M + l);
                        if (B === w)
                            return this.set(w, this.$y + l);
                        if (B === S)
                            return $(1);
                        if (B === p)
                            return $(7);
                        var I = (x = {},
                            x[u] = a,
                            x[y] = f,
                            x[_] = i,
                            x)[B] || 1
                            , k = this.$d.getTime() + l * I;
                        return W.w(k, this)
                    }
                    ,
                    d.subtract = function (l, E) {
                        return this.add(-1 * l, E)
                    }
                    ,
                    d.format = function (l) {
                        var E = this
                            , x = this.$locale();
                        if (!this.isValid())
                            return x.invalidDate || j;
                        var C = l || "YYYY-MM-DDTHH:mm:ssZ"
                            , B = W.z(this)
                            , $ = this.$H
                            , I = this.$m
                            , k = this.$M
                            , G = x.weekdays
                            , L = x.months
                            , Y = function (J, ie, he, ce) {
                                return J && (J[ie] || J(E, C)) || he[ie].slice(0, ce)
                            }
                            , te = function (J) {
                                return W.s($ % 12 || 12, J, "0")
                            }
                            , H = x.meridiem || function (J, ie, he) {
                                var ce = J < 12 ? "AM" : "PM";
                                return he ? ce.toLowerCase() : ce
                            }
                            , se = {
                                YY: String(this.$y).slice(-2),
                                YYYY: this.$y,
                                M: k + 1,
                                MM: W.s(k + 1, 2, "0"),
                                MMM: Y(x.monthsShort, k, L, 3),
                                MMMM: Y(L, k),
                                D: this.$D,
                                DD: W.s(this.$D, 2, "0"),
                                d: String(this.$W),
                                dd: Y(x.weekdaysMin, this.$W, G, 2),
                                ddd: Y(x.weekdaysShort, this.$W, G, 3),
                                dddd: G[this.$W],
                                H: String($),
                                HH: W.s($, 2, "0"),
                                h: te(1),
                                hh: te(2),
                                a: H($, I, !0),
                                A: H($, I, !1),
                                m: String(I),
                                mm: W.s(I, 2, "0"),
                                s: String(this.$s),
                                ss: W.s(this.$s, 2, "0"),
                                SSS: W.s(this.$ms, 3, "0"),
                                Z: B
                            };
                        return C.replace(A, function (J, ie) {
                            return ie || se[J] || B.replace(":", "")
                        })
                    }
                    ,
                    d.utcOffset = function () {
                        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15)
                    }
                    ,
                    d.diff = function (l, E, x) {
                        var C, B = W.p(E), $ = T(l), I = ($.utcOffset() - this.utcOffset()) * a, k = this - $, G = W.m(this, $);
                        return G = (C = {},
                            C[w] = G / 12,
                            C[M] = G,
                            C[v] = G / 3,
                            C[p] = (k - I) / 6048e5,
                            C[S] = (k - I) / 864e5,
                            C[y] = k / f,
                            C[u] = k / a,
                            C[_] = k / i,
                            C)[B] || k,
                            x ? G : W.a(G)
                    }
                    ,
                    d.daysInMonth = function () {
                        return this.endOf(M).$D
                    }
                    ,
                    d.$locale = function () {
                        return ee[this.$L]
                    }
                    ,
                    d.locale = function (l, E) {
                        if (!l)
                            return this.$L;
                        var x = this.clone()
                            , C = D(l, E, !0);
                        return C && (x.$L = C),
                            x
                    }
                    ,
                    d.clone = function () {
                        return W.w(this.$d, this)
                    }
                    ,
                    d.toDate = function () {
                        return new Date(this.valueOf())
                    }
                    ,
                    d.toJSON = function () {
                        return this.isValid() ? this.toISOString() : null
                    }
                    ,
                    d.toISOString = function () {
                        return this.$d.toISOString()
                    }
                    ,
                    d.toString = function () {
                        return this.$d.toUTCString()
                    }
                    ,
                    U
            }()
                , ye = ge.prototype;
            return T.prototype = ye,
                [["$ms", c], ["$s", _], ["$m", u], ["$H", y], ["$W", S], ["$M", M], ["$y", w], ["$D", N]].forEach(function (U) {
                    ye[U[1]] = function (d) {
                        return this.$g(d, U[0], U[1])
                    }
                }),
                T.extend = function (U, d) {
                    return U.$i || (U(d, ge, T),
                        U.$i = !0),
                        T
                }
                ,
                T.locale = D,
                T.isDayjs = Z,
                T.unix = function (U) {
                    return T(1e3 * U)
                }
                ,
                T.en = ee[q],
                T.Ls = ee,
                T.p = {},
                T
        })
    }
    )(sr);
    var en = sr.exports;
    const tn = dr(en)
        , at = (...r) => { }
        ;
    at.noop = !0;
    const rn = "(prefers-color-scheme: dark)"
        , nn = window && window.matchMedia(rn).matches
        , on = {
            word: ""
        }
        , sn = {
            prefersDarkColorScheme: nn,
            lower: !1,
            shiftDayCount: 0,
            showAnswers: !1,
            readRules: !1,
            fontSize: 0
        }
        , ar = {
            settings: sn,
            game: on
        }
        , an = Cr({
            current: ar,
            update: at,
            set: at
        })
        , De = "[GAME_PROVIDER]";
    class ut extends fe {
        constructor(i) {
            super();
            pe(this, "state", ar);
            console.log(De, "onWillMount"),
                console.log(De, "Initialize Game Provider")
        }
        componentDidMount() {
            console.log(De, "onDidMount")
        }
        componentWillUnmount() {
            console.log(De, "onWillUnmount")
        }
        render() {
            const { children: i } = this.props;
            return b(an.Provider, {
                value: {
                    current: this.state,
                    update: a => {
                        console.log("Update")
                    }
                    ,
                    set: this.setState
                },
                children: i
            })
        }
    }
    pe(ut, "displayName", "GameProvider"),
        pe(ut, "defaultProps", {
            date: tn()
        });
    function un(r, n) {
        const i = ft(r);
        dt(() => {
            i.current = r
        }
            , [r]),
            Ce(() => {
                if (!n && n !== 0)
                    return;
                const a = setInterval(() => i.current(), n);
                return () => clearInterval(a)
            }
                , [n])
    }
    const tt = () => new Date().toISOString().split("T")[0]
        , cn = r => {
            const [n, i] = xe(tt())
                , [a, f] = xe(tt());
            return un(() => {
                const c = tt();
                console.log("Checking date ", a, n, c),
                    (n !== a || c !== a) && (f(c),
                        i(c),
                        r && r())
            }
                , 1e3),
                [1, 2]
        }
        , ln = () => {
            typeof window < "u" && window.location.reload()
        }
        , fn = typeof window < "u" && "SemantleGame" in window ? window.SemantleGame : null
        , hn = () => {
            const [r, n] = xe(!1);
            return cn(() => {
                fn.resetPuzzle(),
                    n(!0),
                    document.documentElement.classList.add("loading"),
                    setTimeout(() => {
                        ln(),
                            document.documentElement.classList.remove("loading")
                    }
                        , 150)
            }
            ),
                r ? null : b(ut, {
                    children: b(or, {})
                })
        }
        ;
    globalThis.Buffer = Tt.Buffer;
    Sr(b(jr, {
        children: b(hn, {})
    }), document.getElementById("root"))
}
);
export default dn();

// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// A minimal, independent secp256k1 point multiplication. Tests use it to derive public keys from the upstream secrets, so an
// expected key is never produced by the library under test.
const P = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn;
const N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
const GX = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n;
const GY = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n;

type Point = { x: bigint; y: bigint } | undefined;

function mod(a: bigint, m: bigint = P): bigint {
    const r = a % m;
    return r >= 0n ? r : r + m;
}

function invert(a: bigint): bigint {
    let [low, high] = [mod(a), P];
    let [lm, hm] = [1n, 0n];
    while (low > 1n) {
        const ratio = high / low;
        [lm, hm] = [hm - lm * ratio, lm];
        [low, high] = [high - low * ratio, low];
    }
    return mod(lm);
}

function add(a: Point, b: Point): Point {
    if (a === undefined) {
        return b;
    }
    if (b === undefined) {
        return a;
    }
    if (a.x === b.x && mod(a.y + b.y) === 0n) {
        return undefined;
    }
    const slope = a.x === b.x
        ? mod(3n * a.x * a.x * invert(2n * a.y))
        : mod((b.y - a.y) * invert(b.x - a.x));
    const x = mod(slope * slope - a.x - b.x);
    return { x, y: mod(slope * (a.x - x) - a.y) };
}

function multiply(k: bigint, point: Point): Point {
    let result: Point;
    let addend = point;
    for (let n = k; n > 0n; n >>= 1n) {
        if (n & 1n) {
            result = add(result, addend);
        }
        addend = add(addend, addend);
    }
    return result;
}

function toBytes(value: bigint): Uint8Array {
    const bytes = new Uint8Array(32);
    for (let i = 31; i >= 0; --i) {
        bytes[i] = Number(value & 0xffn);
        value >>= 8n;
    }
    return bytes;
}

export const curveOrder = N;

export function scalarMultiplyBase(k: bigint): { x: bigint; y: bigint } {
    return multiply(k, { x: GX, y: GY })!;
}

// Compressed (33 byte) public key of a 32 byte big-endian secret.
export function compressedPublicKey(secret: Uint8Array): Uint8Array {
    let k = 0n;
    for (const byte of secret) {
        k = (k << 8n) | BigInt(byte);
    }
    if (k <= 0n || k >= N) {
        throw new Error('secret out of range');
    }
    const point = multiply(k, { x: GX, y: GY })!;
    const out = new Uint8Array(33);
    out[0] = point.y & 1n ? 0x03 : 0x02;
    out.set(toBytes(point.x), 1);
    return out;
}

// Uncompressed (65 byte) public key of a 32 byte big-endian secret.
export function uncompressedPublicKey(secret: Uint8Array): Uint8Array {
    let k = 0n;
    for (const byte of secret) {
        k = (k << 8n) | BigInt(byte);
    }
    const point = multiply(k, { x: GX, y: GY })!;
    const out = new Uint8Array(65);
    out[0] = 0x04;
    out.set(toBytes(point.x), 1);
    out.set(toBytes(point.y), 33);
    return out;
}

// KTH parse_signature serializes libsecp256k1 signatures as compact big-endian r || s.
export function derToNativeSignature(der: Uint8Array): Uint8Array {
    return derToCompact(der);
}

export function derToCompact(der: Uint8Array): Uint8Array {
    if (der[0] !== 0x30 || der[1] !== der.length - 2 || der[2] !== 0x02) {
        throw new Error('not a strict DER signature');
    }
    const rLength = der[3];
    const r = der.slice(4, 4 + rLength);
    if (der[4 + rLength] !== 0x02) {
        throw new Error('not a strict DER signature');
    }
    const sLength = der[5 + rLength];
    const s = der.slice(6 + rLength, 6 + rLength + sLength);
    const strip = (v: Uint8Array) => v.length > 32 ? v.slice(v.length - 32) : v;
    const out = new Uint8Array(64);
    out.set(strip(r), 32 - strip(r).length);
    out.set(strip(s), 64 - strip(s).length);
    return out;
}

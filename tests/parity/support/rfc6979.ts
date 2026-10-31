// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Independent deterministic ECDSA (RFC 6979 with HMAC-SHA256 as libsecp256k1's secp256k1_nonce_function_rfc6979 without
// extra data, low-S normalised, strict DER) built on Node's crypto HMAC and the independent curve arithmetic of
// secp256k1.ts. Tests use it to say which deterministic signature a given (secret, digest) must produce, without the
// library under test.
import { curveOrder, scalarMultiplyBase } from './secp256k1';

declare const require: (id: string) => any;

function hmac(key: Uint8Array, ...parts: Array<Uint8Array>): Uint8Array {
    const h = require('crypto').createHmac('sha256', key);
    for (const part of parts) {
        h.update(part);
    }
    return new Uint8Array(h.digest());
}

const toBig = (bytes: Uint8Array) => bytes.reduce((n, b) => (n << 8n) | BigInt(b), 0n);

function toBytes32(value: bigint): Uint8Array {
    const out = new Uint8Array(32);
    for (let i = 31; i >= 0; --i) {
        out[i] = Number(value & 0xffn);
        value >>= 8n;
    }
    return out;
}

function modInverse(a: bigint, m: bigint): bigint {
    let [low, high] = [((a % m) + m) % m, m];
    let [lm, hm] = [1n, 0n];
    while (low > 1n) {
        const ratio = high / low;
        [lm, hm] = [hm - lm * ratio, lm];
        [low, high] = [high - low * ratio, low];
    }
    return ((lm % m) + m) % m;
}

function derInteger(value: bigint): Uint8Array {
    let bytes = Array.from(toBytes32(value));
    while (bytes.length > 1 && bytes[0] === 0) {
        bytes.shift();
    }
    if (bytes[0] & 0x80) {
        bytes = [0, ...bytes];
    }
    return Uint8Array.from([0x02, bytes.length, ...bytes]);
}

// The DER signature (without a sighash byte) libsecp256k1 produces for `digest` under `secret`.
export function signEcdsaDer(secret: Uint8Array, digest: Uint8Array): Uint8Array {
    const n = curveOrder;
    const d = toBig(secret);
    const z = toBig(digest) % n;
    let k = new Uint8Array(32).fill(0x00);
    let v = new Uint8Array(32).fill(0x01);
    const seed = Uint8Array.from([...secret, ...digest]);
    k = hmac(k, v, Uint8Array.of(0x00), seed);
    v = hmac(k, v);
    k = hmac(k, v, Uint8Array.of(0x01), seed);
    v = hmac(k, v);
    for (;;) {
        v = hmac(k, v);
        const nonce = toBig(v);
        if (nonce > 0n && nonce < n) {
            const point = scalarMultiplyBase(nonce);
            const r = point.x % n;
            const s0 = (modInverse(nonce, n) * (z + r * d)) % n;
            if (r !== 0n && s0 !== 0n) {
                const s = s0 > n / 2n ? n - s0 : s0;
                const body = Uint8Array.from([...derInteger(r), ...derInteger(s)]);
                return Uint8Array.from([0x30, body.length, ...body]);
            }
        }
        k = hmac(k, v, Uint8Array.of(0x00));
        v = hmac(k, v);
    }
}

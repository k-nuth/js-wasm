// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/domain/test/chain/point.cpp, src/domain/test/chain/output_point.cpp and the C-API point and output point cases
// that need the native serialization, comparison and checksum members. The native classes are the ones the public wrappers
// hand out (support/natives.ts). Cases that first populate the output point's validation metadata (height, coinbase,
// spent, confirmed) cannot be built through any public API and stay blocked in the inventory.
import { HashFunctions, bytesToHexStr, decodeHash, encodeHash, free, hexStrToBytes } from '../..';
import { namedHex, sourceHex } from './support/fixtures';
import { OutputPointNative, PointNative, outputPointClass, pointClass } from './support/natives';
import { describeSource, sourceCase } from './support/sourceCase';

const POINT = 'src/domain/test/chain/point.cpp';
const OUTPUT_POINT = 'src/domain/test/chain/output_point.cpp';
const CAPI_POINT = 'src/c-api/test/chain/point.cpp';
const CAPI_OUTPUT_POINT = 'src/c-api/test/chain/output_point.cpp';

const hashNative = (hash: Uint8Array) => HashFunctions.toNative(hash as any);
const NULL_HASH = new Uint8Array(32);

function makePoint(hash: Uint8Array, index: number): PointNative {
    const h = hashNative(hash);
    try {
        return new (pointClass())(h, index);
    } finally {
        free(h);
    }
}

function makeOutputPoint(hash: Uint8Array, index: number): OutputPointNative {
    const h = hashNative(hash);
    try {
        return new (outputPointClass())(h, index);
    } finally {
        free(h);
    }
}

function pointFromData(raw: Uint8Array): PointNative {
    return pointClass().fromData(raw, true);
}

function outputPointFromData(raw: Uint8Array): OutputPointNative {
    return outputPointClass().fromData(raw, true);
}

const hashOf = (native: { hash(): any }) => Array.from(HashFunctions.fromNative(native.hash(), true));

describeSource(POINT, () => {
    const HASH = () => decodeHash('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f');
    const validRaw = () => hexStrToBytes(namedHex(POINT, 'valid_raw_point'));
    const RAW_HASH = new Uint8Array([
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x01, 0x01, 0xab, 0x11, 0x11, 0xcd, 0x11, 0x11,
        0x01, 0x10, 0x11, 0xab, 0x11, 0x11, 0xcd, 0x11, 0x01, 0x11, 0x11, 0x11, 0xab, 0x11, 0x11, 0xcd]);

    for (const name of ['point constructor 2 valid input returns input initialized', 'point constructor 3 valid input returns input initialized']) {
        sourceCase(name, () => {
            const instance = makePoint(HASH(), 1234);
            expect(hashOf(instance)).toEqual(Array.from(HASH()));
            expect(instance.index()).toBe(1234);
        });
    }

    sourceCase('point constructor 4 valid input returns input initialized', () => {
        const expected = makePoint(HASH(), 524342);
        const instance = expected.copy();
        expect(expected.equals(instance)).toBe(true);
    });

    sourceCase('point constructor 5 valid input returns input initialized', () => {
        expect(makePoint(HASH(), 524342).copy()).toBeDefined();
    });

    sourceCase('point from data insufficient bytes failure', () => {
        expect(() => pointFromData(new Uint8Array(10))).toThrow();
    });

    sourceCase('point from data roundtrip success', () => {
        const initial = makePoint(RAW_HASH, 53213);
        expect(hashOf(initial)).toEqual(Array.from(RAW_HASH));
        expect(initial.index()).toBe(53213);
        const parsed = pointFromData(initial.toData(true));
        expect(parsed.equals(initial)).toBe(true);
    });

    sourceCase('point from data roundtrip success 2', () => {
        const raw = hexStrToBytes(sourceHex(POINT, 'point from data roundtrip success 2', 0));
        const parsed = pointFromData(raw);
        expect(encodeHash(HashFunctions.fromNative(parsed.hash(), true))).toBe('8ed5a0af151cdbc8c0c546cde29334f15b4472bba105394a1221a7f088246846');
        expect(parsed.index()).toBe(0);
        expect(bytesToHexStr(parsed.toData(true))).toBe(bytesToHexStr(raw));
    });

    sourceCase('point operator assign equals 1 always matches equivalent', () => {
        expect(pointFromData(validRaw()).equals(pointFromData(validRaw()))).toBe(true);
    });

    sourceCase('point operator assign equals 2 always matches equivalent', () => {
        const expected = pointFromData(validRaw());
        expect(expected.copy().equals(expected)).toBe(true);
    });

    sourceCase('point operator boolean equals duplicates returns true', () => {
        expect(pointFromData(validRaw()).equals(pointFromData(validRaw()))).toBe(true);
    });

    sourceCase('point operator boolean equals differs returns false', () => {
        expect(pointFromData(validRaw()).equals(makePoint(NULL_HASH, 0))).toBe(false);
    });

    sourceCase('point operator boolean not equals duplicates returns false', () => {
        expect(pointFromData(validRaw()).notEqual(pointFromData(validRaw()))).toBe(false);
    });

    sourceCase('point operator boolean not equals differs returns true', () => {
        expect(pointFromData(validRaw()).notEqual(makePoint(NULL_HASH, 0))).toBe(true);
    });

    const checksum = (name: string, hex: string, index: number, expected: bigint) => {
        sourceCase(name, () => {
            expect(makePoint(decodeHash(hex), index).checksum()).toBe(expected);
        });
    };
    checksum('point checksum all ones returns all ones', 'f'.repeat(64), 0xffffffff, 0xffffffffffffffffn);
    checksum('point checksum all zeroes returns all zeroes', '0'.repeat(64), 0, 0n);
    checksum('point checksum pattern one returns expected', '000000000000000000000000aaaaaaaaaaaaaaaa000000000000000000000000', 1, 0xaaaaaaaaaaaa8001n);
    checksum('point checksum pattern high returns expected', 'ffffffffffffffffffffffff01234567aaaaaaaaffffffffffffffffffffffff', 0x89abcdef, 0x1234567aaaacdefn);
});

describeSource(OUTPUT_POINT, () => {
    const HASH1 = () => decodeHash(namedHex(OUTPUT_POINT, 'hash1'));
    const validRaw = () => hexStrToBytes(namedHex(OUTPUT_POINT, 'valid_raw_output_point'));
    const RAW_HASH = new Uint8Array([
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x01, 0x01, 0xab, 0x11, 0x11, 0xcd, 0x11, 0x11,
        0x01, 0x10, 0x11, 0xab, 0x11, 0x11, 0xcd, 0x11, 0x01, 0x11, 0x11, 0x11, 0xab, 0x11, 0x11, 0xcd]);

    // output_point(point) copies the point's fields; the upstream expression `value == instance` compares them.
    sourceCase('output point constructor 2 valid input returns input initialized', () => {
        const value = makePoint(HASH1(), 1234);
        const instance = new (outputPointClass())(value);
        expect(hashOf(instance)).toEqual(hashOf(value));
        expect(hashOf(instance)).toEqual(Array.from(HASH1()));
        expect(instance.index()).toBe(1234);
    });

    sourceCase('output point constructor 3 valid input returns input initialized', () => {
        const instance = new (outputPointClass())(makePoint(HASH1(), 1234));
        expect(hashOf(instance)).toEqual(Array.from(HASH1()));
        expect(instance.index()).toBe(1234);
    });

    sourceCase('output point from data insufficient bytes failure', () => {
        expect(() => outputPointFromData(new Uint8Array(10))).toThrow();
    });

    sourceCase('output point from data roundtrip success', () => {
        const initial = makeOutputPoint(RAW_HASH, 53213);
        const parsed = outputPointFromData(initial.toData(true));
        expect(parsed.equals(initial)).toBe(true);
    });

    for (const name of ['output point from data roundtrip success 2', 'output point factory from data 2 roundtrip success', 'output point factory from data 3 roundtrip success']) {
        sourceCase(name, () => {
            const raw = hexStrToBytes(sourceHex(OUTPUT_POINT, name, 0));
            const parsed = outputPointFromData(raw);
            expect(encodeHash(HashFunctions.fromNative(parsed.hash(), true))).toBe('8ed5a0af151cdbc8c0c546cde29334f15b4472bba105394a1221a7f088246846');
            expect(parsed.index()).toBe(0);
            expect(bytesToHexStr(parsed.toData(true))).toBe(bytesToHexStr(raw));
        });
    }

    for (const name of ['output point operator assign equals 1 always matches equivalent', 'output point operator assign equals 3 always matches equivalent']) {
        sourceCase(name, () => {
            expect(outputPointFromData(validRaw()).equals(outputPointFromData(validRaw()))).toBe(true);
        });
    }
    for (const name of ['output point operator assign equals 2 always matches equivalent', 'output point operator assign equals 4 always matches equivalent']) {
        sourceCase(name, () => {
            const expected = outputPointFromData(validRaw());
            expect(expected.copy().equals(expected)).toBe(true);
        });
    }

    // Cross-type comparisons (point vs output_point) compare the shared fields: the point becomes an output point first.
    const asOutputPoint = (raw: Uint8Array) => new (outputPointClass())(pointFromData(raw));
    sourceCase('output point operator boolean equals 1 duplicates returns true', () => {
        expect(asOutputPoint(validRaw()).equals(outputPointFromData(validRaw()))).toBe(true);
    });
    sourceCase('output point operator boolean equals 1 differs returns false', () => {
        expect(outputPointFromData(validRaw()).equals(makeOutputPoint(NULL_HASH, 0))).toBe(false);
    });
    sourceCase('output point operator boolean equals 2 duplicates returns true', () => {
        expect(outputPointFromData(validRaw()).equals(outputPointFromData(validRaw()))).toBe(true);
    });
    sourceCase('output point operator boolean equals 2 differs returns false', () => {
        const beta = new (outputPointClass())(makePoint(NULL_HASH, 0));
        expect(outputPointFromData(validRaw()).equals(beta)).toBe(false);
    });
    sourceCase('output point operator boolean not equals 1 duplicates returns false', () => {
        expect(outputPointFromData(validRaw()).notEqual(outputPointFromData(validRaw()))).toBe(false);
    });
    sourceCase('output point operator boolean not equals 1 differs returns true', () => {
        expect(outputPointFromData(validRaw()).notEqual(makeOutputPoint(NULL_HASH, 0))).toBe(true);
    });
    sourceCase('output point operator boolean not equals 2 duplicates returns false', () => {
        expect(outputPointFromData(validRaw()).notEqual(outputPointFromData(validRaw()))).toBe(false);
    });
    sourceCase('output point operator boolean not equals 2 differs returns true', () => {
        const beta = new (outputPointClass())(makePoint(NULL_HASH, 0));
        expect(outputPointFromData(validRaw()).notEqual(beta)).toBe(true);
    });
});

describeSource(CAPI_POINT, () => {
    const HASH = new Uint8Array([
        0x6f, 0xe2, 0x8c, 0x0a, 0xb6, 0xf1, 0xb3, 0x72, 0xc1, 0xa6, 0xa2, 0x46, 0xae, 0x63, 0xf7, 0x4f,
        0x93, 0x1e, 0x83, 0x65, 0xe1, 0x5a, 0x08, 0x9c, 0x68, 0xd6, 0x19, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const ones = new Uint8Array(32).fill(0xff);

    sourceCase('C-API Point - null factory yields coinbase sentinel', () => {
        const point = pointClass().createNull();
        expect(point.index()).toBe(0xffffffff);
        expect(hashOf(point)).toEqual(Array.from(NULL_HASH));
    });

    sourceCase('C-API Point - field constructor preserves hash and index', () => {
        const point = makePoint(HASH, 1234);
        expect(point.index()).toBe(1234);
        expect(hashOf(point)).toEqual(Array.from(HASH));
    });

    sourceCase('C-API Point - from_data insufficient bytes fails', () => {
        expect(() => pointFromData(new Uint8Array(10))).toThrow();
    });

    sourceCase('C-API Point - to_data / from_data roundtrip', () => {
        const expected = makePoint(HASH, 53213);
        const raw = expected.toData(true);
        expect(raw).toHaveLength(36);
        const parsed = pointFromData(raw);
        expect(parsed.index()).toBe(53213);
        expect(hashOf(parsed)).toEqual(Array.from(HASH));
    });

    sourceCase('C-API Point - construct exposes hash', () => {
        expect(hashOf(makePoint(HASH, 0))).toEqual(Array.from(HASH));
    });

    sourceCase('C-API Point - construct exposes index', () => {
        expect(makePoint(HASH, 9999).index()).toBe(9999);
    });

    sourceCase('C-API Point - copy preserves fields', () => {
        const original = makePoint(HASH, 524342);
        const copy = original.copy();
        expect(original.equals(copy)).toBe(true);
        expect(copy.index()).toBe(524342);
    });

    sourceCase('C-API Point - equals duplicates', () => {
        const a = makePoint(HASH, 524342);
        expect(a.equals(makePoint(HASH, 524342))).toBe(true);
        expect(a.equals(makePoint(NULL_HASH, 0))).toBe(false);
    });

    sourceCase('C-API Point - checksum all ones returns all ones', () => {
        expect(makePoint(ones, 0xffffffff).checksum()).toBe(0xffffffffffffffffn);
    });

    sourceCase('C-API Point - checksum all zeros returns zero', () => {
        expect(makePoint(NULL_HASH, 0).checksum()).toBe(0n);
    });

    sourceCase('C-API Point - satoshi_fixed_size is 36', () => {
        expect(pointClass().satoshiFixedSize()).toBe(36);
    });

    sourceCase('C-API Point - null factory returns is_null', () => {
        expect(pointClass().createNull().isNull()).toBe(true);
    });

    sourceCase('C-API Point - construct_from_data NULL data with zero size returns error', () => {
        expect(() => pointFromData(new Uint8Array(0))).toThrow();
    });
});

describeSource(CAPI_OUTPUT_POINT, () => {
    const HASH = new Uint8Array([
        0x6f, 0xe2, 0x8c, 0x0a, 0xb6, 0xf1, 0xb3, 0x72, 0xc1, 0xa6, 0xa2, 0x46, 0xae, 0x63, 0xf7, 0x4f,
        0x93, 0x1e, 0x83, 0x65, 0xe1, 0x5a, 0x08, 0x9c, 0x68, 0xd6, 0x19, 0x00, 0x00, 0x00, 0x00, 0x00]);

    sourceCase('C-API OutputPoint - construct from point preserves fields', () => {
        const point = makePoint(HASH, 42);
        const instance = new (outputPointClass())(point);
        expect(instance.index()).toBe(42);
        expect(hashOf(instance)).toEqual(Array.from(HASH));
    });

    sourceCase('C-API OutputPoint - from_data insufficient bytes fails', () => {
        expect(() => outputPointFromData(new Uint8Array(10))).toThrow();
    });

    sourceCase('C-API OutputPoint - to_data / from_data roundtrip', () => {
        const expected = makeOutputPoint(HASH, 53213);
        const raw = expected.toData(true);
        expect(raw).toHaveLength(36);
        const parsed = outputPointFromData(raw);
        expect(parsed.index()).toBe(53213);
        expect(hashOf(parsed)).toEqual(Array.from(HASH));
    });

    sourceCase('C-API OutputPoint - construct_from_data NULL data with zero size returns error', () => {
        expect(() => outputPointFromData(new Uint8Array(0))).toThrow();
    });

    sourceCase('C-API OutputPoint - satoshi_fixed_size is 36', () => {
        expect(outputPointClass().satoshiFixedSize()).toBe(36);
    });

    sourceCase('C-API OutputPoint - null factory returns is_null', () => {
        const instance = outputPointClass().createNull();
        expect(instance.isNull()).toBe(true);
        expect(instance.index()).toBe(0xffffffff);
        expect(hashOf(instance)).toEqual(Array.from(NULL_HASH));
    });
});

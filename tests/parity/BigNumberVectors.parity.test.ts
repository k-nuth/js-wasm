// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the data-driven src/infrastructure/test/machine/big_number_generated_tests.cpp and big_number_openssl_tests.cpp
// cases whose operations the C API binds (add, subtract, multiply, pow, pow_mod, math_modulo, compare, equals, is_nonzero,
// serialize/deserialize). The vectors are the upstream rows (fixtures/bigint_vectors.json.gz) and are asserted exactly.
//
// Mapping of C++ operators with no separate binding: compound assignment (`a += b`) is the binary operation, `++`/`--`
// are +1/-1, `a << n` is multiplication by 2^n, and the relational operators follow compare(). Division, remainder,
// bitwise and/or/xor and right shift have no function in c-api/include/kth/capi/vm/big_number.h (math_modulo is the
// non-negative modulo, not C++ `%`), so those cases are blocked in the inventory.
import { loadFixture } from './support/fixtures';
import { BigNumberNative, bigNumberClass } from './support/natives';
import { describeSource, sourceCase } from './support/sourceCase';

type Rows = Record<string, { vectors: Array<Array<string | number | boolean> | string>; exceptionVectors: Array<unknown> }>;
const vectors = loadFixture<Rows>('bigint_vectors.json.gz');
const GEN = 'src/infrastructure/test/machine/big_number_generated_tests.cpp';
const OPENSSL = 'src/infrastructure/test/machine/big_number_openssl_tests.cpp';

const dec = (text: string): BigNumberNative => new (bigNumberClass())(text);
const hex = (text: string): BigNumberNative => bigNumberClass().fromHex(text);
const small = (value: bigint): BigNumberNative => new (bigNumberClass())(value);
const rows = (file: string, name: string) => vectors[file + '::' + name].vectors as Array<Array<any>>;
const twoPow = (exponent: number) => small(2n).pow(small(BigInt(exponent)));

function each(file: string, name: string, check: (row: Array<any>, index: number) => void): void {
    sourceCase(name, () => {
        const table = rows(file, name);
        expect(table.length).toBeGreaterThan(0);
        table.forEach((row, index) => {
            try {
                check(row, index);
            } catch (error) {
                throw new Error('vector ' + index + ': ' + (error as Error).message);
            }
        });
    }, 600000);
}

describeSource(GEN, () => {
    each(GEN, 'BigInt [gen]: addition', ([a, b, expected]) => expect(dec(a).add(dec(b)).toStr()).toBe(expected));
    each(GEN, 'BigInt [gen]: subtraction', ([a, b, expected]) => expect(dec(a).subtract(dec(b)).toStr()).toBe(expected));
    each(GEN, 'BigInt [gen]: multiplication', ([a, b, expected]) => expect(dec(a).multiply(dec(b)).toStr()).toBe(expected));

    each(GEN, 'BigInt [gen]: comparison', ([a, b, cmp]) => {
        const x = dec(a);
        const y = dec(b);
        expect(Math.sign(x.compare(y))).toBe(cmp);
        expect(x.equals(y)).toBe(cmp === 0);
        expect(x.notEqual(y)).toBe(cmp !== 0);
    });

    each(GEN, 'BigInt [gen]: left_shift', ([a, shift, expected]) => expect(dec(a).multiply(twoPow(shift)).toStr()).toBe(expected));
    each(GEN, 'BigInt [gen]: increment', ([input, expected]) => {
        expect(dec(input).toStr()).toBe(input);
        expect(dec(input).add(small(1n)).toStr()).toBe(expected);
    });
    each(GEN, 'BigInt [gen]: decrement', ([input, expected]) => {
        expect(dec(input).toStr()).toBe(input);
        expect(dec(input).subtract(small(1n)).toStr()).toBe(expected);
    });
    each(GEN, 'BigInt [gen]: logical_and', ([a, b, expected]) => expect(dec(a).isNonzero() && dec(b).isNonzero()).toBe(expected));
    each(GEN, 'BigInt [gen]: logical_or', ([a, b, expected]) => expect(dec(a).isNonzero() || dec(b).isNonzero()).toBe(expected));

    sourceCase('BigInt [gen]: serialization round-trip', () => {
        const table = vectors[GEN + '::BigInt [gen]: serialization round-trip'].vectors as unknown as Array<string>;
        expect(table.length).toBeGreaterThan(0);
        for (const text of table) {
            const a = dec(text);
            expect(a.toStr()).toBe(text);
            const b = new (bigNumberClass())();
            expect(b.deserialize(a.serialize())).toBe(true);
            expect(b.toStr()).toBe(text);
            expect(a.equals(b)).toBe(true);
        }
    }, 600000);
});

describeSource(OPENSSL, () => {
    each(OPENSSL, 'BigInt [gen]: OpenSSL sum tests', ([a, b, sum]) => {
        const x = hex(a);
        const y = hex(b);
        const expected = hex(sum);
        expect(x.add(y).equals(expected)).toBe(true);
        expect(expected.subtract(y).equals(x)).toBe(true);
        expect(expected.subtract(x).equals(y)).toBe(true);
    });
    each(OPENSSL, 'BigInt [gen]: OpenSSL square tests', ([a, expected]) => expect(hex(a).multiply(hex(a)).equals(hex(expected))).toBe(true));
    each(OPENSSL, 'BigInt [gen]: OpenSSL product tests', ([a, b, expected]) => expect(hex(a).multiply(hex(b)).equals(hex(expected))).toBe(true));
    each(OPENSSL, 'BigInt [gen]: OpenSSL exp tests', ([a, e, expected]) => expect(hex(a).pow(hex(e)).equals(hex(expected))).toBe(true));
    each(OPENSSL, 'BigInt [gen]: OpenSSL modmul tests', ([a, b, m, expected]) => {
        expect(hex(a).multiply(hex(b)).mathModulo(hex(m)).equals(hex(expected))).toBe(true);
    });
    each(OPENSSL, 'BigInt [gen]: OpenSSL modexp tests', ([a, e, m, expected]) => {
        expect(hex(a).powMod(hex(e), hex(m)).equals(hex(expected))).toBe(true);
    });
    each(OPENSSL, 'BigInt [gen]: OpenSSL lshift1 tests', ([a, expected]) => expect(hex(a).multiply(small(2n)).equals(hex(expected))).toBe(true));
    each(OPENSSL, 'BigInt [gen]: OpenSSL lshift tests', ([a, n, expected]) => expect(hex(a).multiply(twoPow(n)).equals(hex(expected))).toBe(true));
});

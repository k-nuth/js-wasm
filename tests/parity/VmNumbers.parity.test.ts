// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/c-api/test/vm/number.cpp and big_number.cpp. NumberNative and BigNumberNative are not exported by name; the
// classes are taken from the instances Program.popNumber / popBigNumber return (support/natives.ts).
import { BigNumberNative, NumberNative, bigNumberClass, numberClass } from './support/natives';
import { describeSource, sourceCase } from './support/sourceCase';

const num = (value: bigint): NumberNative => numberClass().fromInt(value);
const big = (value: bigint): BigNumberNative => new (bigNumberClass())(value);

describeSource('src/c-api/test/vm/number.cpp', () => {
    sourceCase('C-API Number - default construct yields a zero value', () => {
        const n = new (numberClass())();
        expect(n.int64()).toBe(0n);
        expect(n.int32()).toBe(0);
        expect(n.isFalse()).toBe(true);
        expect(n.isTrue()).toBe(false);
    });

    sourceCase('C-API Number - copy is independent of source', () => {
        const a = num(7n);
        const b = a.copy();
        expect(b.int64()).toBe(7n);
        b.safeAddInt64(10n);
        expect(b.int64()).toBe(17n);
        expect(a.int64()).toBe(7n);
    });

    sourceCase('C-API Number - from_int preserves the signed 64-bit value', () => {
        const n = num(-42n);
        expect(n.int64()).toBe(-42n);
        expect(n.int32()).toBe(-42);
        expect(n.isTrue()).toBe(true);
        expect(n.isFalse()).toBe(false);
    });

    sourceCase('C-API Number - int32 saturates at int32 boundary', () => {
        const n = num(2147483647n);
        expect(n.int32()).toBe(2147483647);
        expect(n.int64()).toBe(2147483647n);
    });

    sourceCase('C-API Number - comparison against int64', () => {
        const n = num(10n);
        expect(n.greater(5n)).toBe(true);
        expect(n.greater(10n)).toBe(false);
        expect(n.less(20n)).toBe(true);
        expect(n.lessOrEqual(10n)).toBe(true);
        expect(n.greaterOrEqual(10n)).toBe(true);
    });

    sourceCase('C-API Number - equals compares two handles', () => {
        expect(num(3n).equals(num(3n))).toBe(true);
        expect(num(3n).equals(num(4n))).toBe(false);
    });

    sourceCase('C-API Number - safe_add_int64 accumulates on the receiver', () => {
        const n = num(10n);
        expect(n.safeAddInt64(20n)).toBe(true);
        expect(n.int64()).toBe(30n);
    });

    sourceCase('C-API Number - safe_sub_number subtracts by handle', () => {
        const a = num(100n);
        expect(a.safeSubNumber(num(30n))).toBe(true);
        expect(a.int64()).toBe(70n);
    });

    sourceCase('C-API Number - add_number produces a new handle without mutating inputs', () => {
        const a = num(3n);
        const b = num(4n);
        expect(a.addNumber(b).int64()).toBe(7n);
        expect(a.int64()).toBe(3n);
        expect(b.int64()).toBe(4n);
    });

    sourceCase('C-API Number - add_int64 uses the int64 overload of operator+', () => {
        const a = num(10n);
        expect(a.addInt64(5n).int64()).toBe(15n);
        expect(a.int64()).toBe(10n);
    });

    sourceCase('C-API Number - subtract_number returns a new difference', () => {
        const a = num(100n);
        const b = num(30n);
        expect(a.subtractNumber(b).int64()).toBe(70n);
        expect(a.int64()).toBe(100n);
        expect(b.int64()).toBe(30n);
    });

    sourceCase('C-API Number - subtract_int64 uses the int64 overload of operator-', () => {
        const a = num(20n);
        expect(a.subtractInt64(7n).int64()).toBe(13n);
        expect(a.int64()).toBe(20n);
    });

    sourceCase('C-API Number - multiply returns the product as a new handle', () => {
        expect(num(6n).multiply(num(7n)).int64()).toBe(42n);
    });

    sourceCase('C-API Number - safe_add_number2 produces a new handle', () => {
        const a = num(3n);
        const b = num(4n);
        const sum = numberClass().safeAddNumber2(a, b);
        expect(sum.int64()).toBe(7n);
        expect(a.int64()).toBe(3n);
        expect(b.int64()).toBe(4n);
    });

    sourceCase('C-API Number - data() encodes the int64 as script bytes', () => {
        expect(Array.from(num(1n).data())).toEqual([0x01]);
    });

    sourceCase('C-API Number - set_data parses a script-encoded byte string', () => {
        const n = new (numberClass())();
        expect(n.setData(Uint8Array.of(0x0a), 4)).toBe(true);
        expect(n.int64()).toBe(10n);
    });

    // The C function re-encodes in place and returns the required size; the binding returns the minimal bytes.
    sourceCase('C-API Number - minimally_encode trims an over-padded encoding', () => {
        const minimal = numberClass().minimallyEncode(Uint8Array.of(0x05, 0x00));
        expect(minimal).toHaveLength(1);
        expect(minimal[0]).toBe(0x05);
    });

    sourceCase('C-API Number - minimally_encode leaves already-minimal input intact', () => {
        const minimal = numberClass().minimallyEncode(Uint8Array.of(0x05));
        expect(minimal).toHaveLength(1);
        expect(minimal[0]).toBe(0x05);
    });

    sourceCase('C-API Number - minimally_encode on empty input returns 0', () => {
        expect(numberClass().minimallyEncode(new Uint8Array(0))).toHaveLength(0);
    });
});

describeSource('src/c-api/test/vm/big_number.cpp', () => {
    sourceCase('C-API BigNumber - default construct yields zero', () => {
        const n = new (bigNumberClass())();
        expect(n.isZero()).toBe(true);
        expect(n.isNonzero()).toBe(false);
        expect(n.sign()).toBe(0);
    });

    sourceCase('C-API BigNumber - construct_from_value carries a signed int64', () => {
        const n = big(-12345n);
        expect(n.sign()).toBeLessThan(0);
        expect(n.isNegative()).toBe(true);
        expect(n.isNonzero()).toBe(true);
        expect(n.toInt32Saturating()).toBe(-12345);
    });

    sourceCase('C-API BigNumber - construct_from_decimal_str parses base-10', () => {
        const n = new (bigNumberClass())('99999999999999999999');
        expect(n.toStr()).toBe('99999999999999999999');
    });

    sourceCase('C-API BigNumber - copy is independent of source', () => {
        const a = big(1000n);
        const b = a.copy();
        b.negate();
        expect(a.toInt32Saturating()).toBe(1000);
        expect(b.toInt32Saturating()).toBe(-1000);
    });

    sourceCase('C-API BigNumber - to_string round-trips through decimal', () => {
        expect(big(42n).toStr()).toBe('42');
    });

    sourceCase('C-API BigNumber - from_hex / to_hex round-trip', () => {
        expect(bigNumberClass().fromHex('ff00').toHex()).toBe('ff00');
    });

    sourceCase('C-API BigNumber - compare orders two handles', () => {
        const a = big(5n);
        const b = big(5n);
        const c = big(10n);
        expect(a.equals(b)).toBe(true);
        expect(a.equals(c)).toBe(false);
        expect(a.compare(c)).toBeLessThan(0);
        expect(c.compare(a)).toBeGreaterThan(0);
        expect(a.compare(b)).toBe(0);
    });

    sourceCase('C-API BigNumber - pow produces a new handle with correct value', () => {
        const base = big(2n);
        const exponent = big(10n);
        expect(base.pow(exponent).toInt32Saturating()).toBe(1024);
        expect(base.toInt32Saturating()).toBe(2);
        expect(exponent.toInt32Saturating()).toBe(10);
    });

    sourceCase('C-API BigNumber - add / subtract / multiply operators produce new handles', () => {
        const a = big(12345n);
        const b = big(67n);
        expect(a.add(b).toInt32Saturating()).toBe(12345 + 67);
        expect(a.subtract(b).toInt32Saturating()).toBe(12345 - 67);
        expect(a.multiply(b).toInt32Saturating()).toBe(12345 * 67);
        expect(a.toInt32Saturating()).toBe(12345);
        expect(b.toInt32Saturating()).toBe(67);
    });

    sourceCase('C-API BigNumber - serialize → deserialize round-trip', () => {
        const source = big(123456n);
        const buffer = source.serialize();
        expect(buffer.length).toBeGreaterThan(0);
        const destination = new (bigNumberClass())();
        expect(destination.deserialize(buffer)).toBe(true);
        expect(source.equals(destination)).toBe(true);
    });
});

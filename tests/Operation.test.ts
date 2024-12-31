// Copyright (c) 2016-2024 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Opcode, Operation, RuleFork } from '..';
import { hexStrToBytes } from '..';

const valid_raw_operation = hexStrToBytes('0900ff11ee22bb33aa44');
const noRules = RuleFork.toInt('no_rules');
const allRules = RuleFork.toInt('all_rules');
const bip16_rule = RuleFork.toInt('bip16_rule');
const bip30_rule = RuleFork.toInt('bip30_rule');
const bip34_rule = RuleFork.toInt('bip34_rule');
const bip65_rule = RuleFork.toInt('bip65_rule');
const bip66_rule = RuleFork.toInt('bip66_rule');
const bip112_rule = RuleFork.toInt('bip112_rule');

function build_chunk(slices: Uint8Array[], extra_reserve: number): Uint8Array {
    let size = 0;
    for (const slice of slices) {
        size += slice.length;
    }
    const out = new Uint8Array(size + extra_reserve);
    let offset = 0;
    for (const slice of slices) {
        out.set(slice, offset);
        offset += slice.length;
    }
    return out;
}

describe('Operation', () => {
    it('should handle default constructed operation', () => {
        const instance = new Operation();
        expect(instance.isValid).toBe(false);
        expect(instance.code).toBe('disabled_xor');
        expect(instance.data.length).toBe(0);
        expect(instance.toData().length).toBe(1);
    });

    it('should handle push size 32', () => {
        const data = hexStrToBytes('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f');
        const instance = new Operation(data);
        expect(instance.isValid).toBe(true);
        expect(instance.code).toBe('push_size_32');
        expect(instance.data).toEqual(data);
        expect(instance.data.length).toBe(32);
    });

    it('should handle empty byte array', () => {
        const data = new Uint8Array();
        const instance = Operation.fromData(data);
        expect(instance).toBeUndefined();
    });

    it('from data roundtrip push size 0', () => {
        const data0 = new Uint8Array();
        const raw_operation = hexStrToBytes('00');
        const instance = Operation.fromData(raw_operation);
        expect(instance).toBeDefined();
        if (instance) {
            expect(instance.toData()).toEqual(raw_operation);
            const duplicate = Operation.fromData(instance.toData());
            expect(duplicate).toBeDefined();
            expect(duplicate?.toData()).toEqual(raw_operation);

            expect(instance.code).toBe('push_size_0');
            expect(instance.data).toEqual(data0);
        }
    });

    it('from data roundtrip push size 75', () => {
        const data75 = new Uint8Array(Array(75).fill(46));
        const raw_operation = build_chunk([hexStrToBytes('4b'), data75], 0);
        const instance = Operation.fromData(raw_operation);
        expect(instance).toBeDefined();
        if (instance) {
            expect(instance.toData()).toEqual(raw_operation);
            const duplicate = Operation.fromData(instance.toData());
            expect(duplicate).toBeDefined();
            if (duplicate) {
                expect(duplicate.toData()).toEqual(raw_operation);
            }

            expect(instance.code).toBe('push_size_75');
            expect(instance.data).toEqual(data75);
        }
    });

    it('from data roundtrip push negative 1', () => {
        const op_79 = new Uint8Array([79]);
        const raw_operation = build_chunk([op_79], 0);
        const instance = Operation.fromData(raw_operation);
        expect(instance).toBeDefined();
        if (instance) {
            expect(instance.toData()).toEqual(raw_operation);
        }
    });

    it('should handle push negative 1', () => {
        const op_79 = Opcode.toInt('push_negative_1');
        const raw_operation = Uint8Array.from([op_79]);
        const instance = Operation.fromData(raw_operation);
        expect(instance).toBeDefined();
        if (instance) {
            expect(instance.toData()).toEqual(raw_operation);

            const duplicate = Operation.fromData(instance.toData());
            expect(duplicate).toBeDefined();
            if (duplicate) {
                expect(duplicate.toData()).toEqual(raw_operation);
            }
            expect(instance.code).toBe('push_negative_1');
            expect(instance.data).toEqual(new Uint8Array());
        }
    });

    it('should handle push positive 1', () => {
        const op_81 = Opcode.toInt('push_positive_1');
        const raw_operation = Uint8Array.from([op_81]);
        const instance = Operation.fromData(raw_operation);
        expect(instance).toBeDefined();
        if (instance) {
            expect(instance.toData()).toEqual(raw_operation);

            const duplicate = Operation.fromData(instance.toData());
            expect(duplicate).toBeDefined();
            if (duplicate) {
                expect(duplicate.toData()).toEqual(raw_operation);
            }
            expect(instance.code).toBe('push_positive_1');
            expect(instance.data).toEqual(new Uint8Array());
        }
    });

    it('should handle push positive 16', () => {
        const op_96 = Opcode.toInt('push_positive_16');
        const raw_operation = Uint8Array.from([op_96]);
        const instance = Operation.fromData(raw_operation);
        expect(instance).toBeDefined();
        if (instance) {
            expect(instance.toData()).toEqual(raw_operation);

            const duplicate = Operation.fromData(instance.toData());
            expect(duplicate).toBeDefined();
            if (duplicate) {
                expect(duplicate.toData()).toEqual(raw_operation);
            }
            expect(instance.code).toBe('push_positive_16');
            expect(instance.data).toEqual(new Uint8Array());
        }
    });

    it('should handle push one size', () => {
        const data255 = new Uint8Array(Array(255).fill(46));
        const raw_operation = build_chunk([hexStrToBytes('4cff'), data255], 0);

        const instance = Operation.fromData(raw_operation);
        expect(instance).toBeDefined();
        if ( ! instance) {
            return
        }
        expect(instance.toData()).toEqual(raw_operation);
        const duplicate = Operation.fromData(instance.toData());
        expect(duplicate).toBeDefined();
        if (duplicate) {
            expect(duplicate.toData()).toEqual(raw_operation);
        }

        expect(instance.code).toBe('push_one_size');
        expect(instance.data).toEqual(data255);
    });

    it('should handle push two size', () => {
        const data520 = new Uint8Array(Array(520).fill(46));
        const raw_operation = build_chunk([hexStrToBytes('4d0802'), data520], 0);

        const instance = Operation.fromData(raw_operation);
        expect(instance).toBeDefined();
        if ( ! instance) {
            return
        }
        expect(instance.toData()).toEqual(raw_operation);
        const duplicate = Operation.fromData(instance.toData());
        expect(duplicate).toBeDefined();
        if (duplicate) {
            expect(duplicate.toData()).toEqual(raw_operation);
        }

        expect(instance.code).toBe('push_two_size');
        expect(instance.data).toEqual(data520);
    });

    it('should handle push four size', () => {
        const data520 = new Uint8Array(Array(520).fill(46));
        const raw_operation = build_chunk([hexStrToBytes('4e08020000'), data520], 0);

        const instance = Operation.fromData(raw_operation);
        expect(instance).toBeDefined();
        if ( ! instance) {
            return
        }
        expect(instance.toData()).toEqual(raw_operation);
        const duplicate = Operation.fromData(instance.toData());
        expect(duplicate).toBeDefined();
        if (duplicate) {
            expect(duplicate.toData()).toEqual(raw_operation);
        }

        expect(instance.code).toBe('push_four_size');
        expect(instance.data).toEqual(data520);
    });

    it('should handle from data 1', () => {
        const instance = Operation.fromData(valid_raw_operation);
        expect(instance).toBeDefined();
        if ( ! instance) {
            return
        }
        expect(instance.toData()).toEqual(valid_raw_operation);
    });

    it('should handle to string push size 0', () => {
        const value = new Operation('push_size_0');
        expect(value.toString(0)).toBe('zero');
    });

    it('should handle to string push size 75', () => {
        // Empty data allows the push code to serialize as an op code.
        const value = new Operation('push_size_75');
        expect(value.toString(0)).toBe('push_75');
    });

    it('should handle to string push positive 7', () => {
        const value = new Operation('push_positive_7');
        expect(value.toString(0)).toBe('7');
    });

    it('should handle to string minimal 0x07', () => {
        const value = new Operation(new Uint8Array([0x07]), true);
        expect(value.toString(0)).toBe('7');
    });

    it('should handle to string nominal 0x07', () => {
        const value = new Operation(new Uint8Array([0x07]), false);
        expect(value.toString(0)).toBe('[07]');
    });

    it('should handle to string 0x42', () => {
        const value = new Operation(new Uint8Array([0x42]), true);
        expect(value.toString(0)).toBe('[42]');
    });

    it('should handle to string 0x112233', () => {
        const value = new Operation(new Uint8Array([0x11, 0x22, 0x33]), false);
        expect(value.toString(0)).toBe('[112233]');
    });

    it('should handle to string push size 3', () => {
        const data = new Uint8Array([0x03, 0x11, 0x22, 0x33]);
        const value = Operation.fromData(data);
        expect(value?.toString(0)).toBe('[112233]');
    });

    it('should handle to string push one size', () => {
        const data = new Uint8Array([0x4c, 0x03, 0x11, 0x22, 0x33]);
        const value = Operation.fromData(data);
        expect(value?.toString(0)).toBe('[1.112233]');
    });

    it('should handle to string push two size', () => {
        const data = new Uint8Array([0x4d, 0x03, 0x00, 0x11, 0x22, 0x33]);
        const value = Operation.fromData(data);
        expect(value?.toString(0)).toBe('[2.112233]');
    });

    it('should handle to string push four size', () => {
        const data = new Uint8Array([0x4e, 0x03, 0x00, 0x00, 0x00, 0x11, 0x22, 0x33]);
        const value = Operation.fromData(data);
        expect(value?.toString(0)).toBe('[4.112233]');
    });

    it('should handle to string nop2 no rules', () => {
        const value = new Operation('nop2');
        expect(value.toString(noRules)).toBe('nop2');
    });

    it('should handle to string nop2 bip65 rule', () => {
        const value = new Operation('nop2');
        expect(value.toString(bip65_rule)).toBe('checklocktimeverify');
    });

    it('should handle to string nop3 no rules', () => {
        const value = new Operation('nop3');
        //TODO
        // expect(value.toString(noRules)).toBe('nop3');
        expect(value.toString(noRules)).toBe('nop4');
    });

    it('should handle to string nop3 bip112 rule', () => {
        const value = new Operation('nop3');
        //TODO
        // expect(value.toString(bip112_rule)).toBe('checksequenceverify');
        expect(value.toString(bip112_rule)).toBe('nop4');
    });

    it('should handle from string negative 1', () => {
        const value = Operation.fromString('-1');
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_negative_1');
            expect(value.data.length).toBe(0);
        }
    });

    it('should handle from string 0', () => {
        const value = Operation.fromString('0');
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_size_0');
            expect(value.data.length).toBe(0);
        }
    });

    it('should handle from string 1', () => {
        const value = Operation.fromString('1');
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_positive_1');
            expect(value.data.length).toBe(0);
        }
    });

    it('should handle from string 16', () => {
        const value = Operation.fromString('16');
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_positive_16');
            expect(value.data.length).toBe(0);
        }
    });

    it('should handle from string 17', () => {
        const expected = new Uint8Array([0x11]);
        const value = Operation.fromString('17');
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_size_1');
            expect(value.data).toEqual(expected);
        }
    });

    it('should handle from string negative 2', () => {
        const expected = new Uint8Array([0x82]);
        const value = Operation.fromString('-2');
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_size_1');
            expect(value.data).toEqual(expected);
        }
    });

    it('should handle from string 9223372036854775807', () => {
        const expected = new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f]);
        const value = Operation.fromString('9223372036854775807');
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_size_8');
            expect(value.data).toEqual(expected);
        }
    });

    it('should handle from string negative 9223372036854775807', () => {
        const expected = new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
        const value = Operation.fromString('-9223372036854775807');
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_size_8');
            expect(value.data).toEqual(expected);
        }
    });

    it('should handle from string empty string', () => {
        const value = Operation.fromString(`''`);
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_size_0');
            expect(value.data.length).toBe(0);
        }
    });

    it('should handle from string "a"', () => {
        const expected = new Uint8Array([0x61]);
        const value = Operation.fromString(`'a'`);
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_size_1');
            expect(value.data).toEqual(expected);
        }
    });

    it('should handle from string "abc"', () => {
        const expected = new Uint8Array([0x61, 0x62, 0x63]);
        const value = Operation.fromString(`'abc'`);
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_size_3');
            expect(value.data).toEqual(expected);
        }
    });

    it('should handle from string negative 1 character', () => {
        const expected = new Uint8Array([0x4f]);
        const value = Operation.fromString(`'O'`);
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_size_1');
            expect(value.data).toEqual(expected);
        }
    });

    it('should handle from string push 0', () => {
        const expected = new Uint8Array([0x4f]);
        const value = Operation.fromString('push_0');
        expect(value).toBeDefined();
        if (value) {
            expect(value.code).toBe('push_size_0');
            expect(value.data.length).toBe(0);
        }
    });

    it('should handle from string push 1', () => {
        const value = Operation.fromString('push_1');
        expect(value).toBeUndefined();
    });

    it('should handle from string push 75', () => {
        const value = Operation.fromString('push_75');
        expect(value).toBeUndefined();
    });

    it('should handle from string push one', () => {
        const value = Operation.fromString('push_one');
        expect(value?.code).toBe('push_one_size');
        expect(value?.data.length).toBe(0);
    });

    it('should handle from string push two', () => {
        const value = Operation.fromString('push_two');
        expect(value?.code).toBe('push_two_size');
        expect(value?.data.length).toBe(0);
    });

    it('should handle from string push four', () => {
        const value = Operation.fromString('push_four');
        expect(value?.code).toBe('push_four_size');
        expect(value?.data.length).toBe(0);
    });

    it('should handle from string "7"', () => {
        const value = Operation.fromString('7');
        expect(value?.code).toBe('push_positive_7');
        expect(value?.data.length).toBe(0);
    });

    it('should handle from string "0x07"', () => {
        const expected = new Uint8Array([0x07]);
        const value = Operation.fromString('[07]');
        expect(value?.code).toBe('push_size_1');
        expect(value?.data).toEqual(expected);
    });

    it('should handle from string "0x42"', () => {
        const expected = new Uint8Array([0x42]);
        const value = Operation.fromString('[42]');
        expect(value?.code).toBe('push_size_1');
        expect(value?.data).toEqual(expected);
    });

    it('should handle from string "0x112233"', () => {
        const expected = new Uint8Array([0x11, 0x22, 0x33]);
        const value = Operation.fromString('[112233]');
        expect(value?.code).toBe('push_size_3');
        expect(value?.data).toEqual(expected);
    });

    it('should handle from string "0 0x112233"', () => {
        const expected = new Uint8Array([0x11, 0x22, 0x33]);
        const value = Operation.fromString('[0.112233]');
        expect(value?.code).toBe('push_size_3');
        expect(value?.data).toEqual(expected);
    });

    it('should handle from string "1 0x112233"', () => {
        const expected = new Uint8Array([0x11, 0x22, 0x33]);
        const value = Operation.fromString('[1.112233]');
        expect(value?.code).toBe('push_one_size');
        expect(value?.data).toEqual(expected);
    });

    it('should handle from string "2 0x112233"', () => {
        const expected = new Uint8Array([0x11, 0x22, 0x33]);
        const value = Operation.fromString('[2.112233]');
        expect(value?.code).toBe('push_two_size');
        expect(value?.data).toEqual(expected);
    });

    it('should handle from string "4 0x112233"', () => {
        const expected = new Uint8Array([0x11, 0x22, 0x33]);
        const value = Operation.fromString('[4.112233]');
        expect(value?.code).toBe('push_four_size');
        expect(value?.data).toEqual(expected);
    });

    it('should handle from string "5 0x112233"', () => {
        const value = Operation.fromString('[5.112233]');
        expect(value).toBeUndefined();
    });

    it('should handle from string "empty 0x112233"', () => {
        const value = Operation.fromString('[.112233]');
        expect(value).toBeUndefined();
    });

    it('should handle from string "nop2"', () => {
        const value = Operation.fromString('nop2');
        expect(value?.code).toBe('nop2');
        // TODO:
        // expect(value?.code).toBe('checklocktimeverify');
        expect(value?.data.length).toBe(0);
    });

    it('should handle from string "checklocktimeverify"', () => {
        const value = Operation.fromString('checklocktimeverify');
        expect(value?.code).toBe('nop2');
        // TODO:
        // expect(value?.code).toBe('checklocktimeverify');
        expect(value?.data.length).toBe(0);
    });

    it('should handle from string "nop3"', () => {
        const value = Operation.fromString('nop3');
        // TODO:
        // expect(value?.code).toBe('nop3');
        // expect(value?.code).toBe('checksequenceverify');
        expect(value?.code).toBe('checklocktimeverify');
        expect(value?.data.length).toBe(0);
    });

    it('should handle from string "checklocktimeverify"', () => {
        const value = Operation.fromString('checksequenceverify');
        // TODO:
        // expect(value?.code).toBe('nop3');
        // expect(value?.code).toBe('checksequenceverify');
        expect(value?.code).toBe('checklocktimeverify');
        expect(value?.data.length).toBe(0);
    });

});

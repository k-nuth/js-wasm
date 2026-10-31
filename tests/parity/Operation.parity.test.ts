// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/domain/test/machine/operation.cpp through the Operation wrapper. Operation equality is the native equals()
// of the object returned by the public toNative().
import { Opcode, Operation, bytesToHexStr, free, hexStrToBytes } from '../..';
import { flag } from './support/flags';
import { namedHex } from './support/fixtures';
import { describeSource, sourceCase } from './support/sourceCase';

const FILE = 'src/domain/test/machine/operation.cpp';
const validRaw = () => hexStrToBytes(namedHex(FILE, 'valid_raw_operation'));
const bytes = (...values: Array<number>) => Uint8Array.from(values);
const filled = (length: number) => new Uint8Array(length).fill(0x2e);
const concat = (...parts: Array<Uint8Array>) => {
    const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
    let offset = 0;
    for (const part of parts) {
        out.set(part, offset);
        offset += part.length;
    }
    return out;
};

function equal(a: Operation, b: Operation): boolean {
    const x = a.toNative();
    const y = b.toNative();
    try {
        return x.equals(y);
    } finally {
        free(x);
        free(y);
    }
}

function decode(raw: Uint8Array): Operation {
    const operation = Operation.fromData(raw);
    expect(operation).toBeDefined();
    return operation!;
}

function parse(text: string): Operation {
    const operation = Operation.fromString(text);
    expect(operation).toBeDefined();
    return operation!;
}

// Enumerator aliases declared in the upstream opcode.hpp (checklocktimeverify = nop2, checksequenceverify = nop3,
// invalidopcode = reserved_255); the package names only the primary enumerators.
const UPSTREAM_ALIASES: Record<string, string> = {
    checklocktimeverify: 'nop2',
    checksequenceverify: 'nop3',
    invalidopcode: 'reserved_255',
};
const resolve = (name: string) => UPSTREAM_ALIASES[name] ?? name;
const sameCode = (actual: string, expected: string) => expect(Opcode.toInt(resolve(actual) as any)).toBe(Opcode.toInt(resolve(expected) as any));

describeSource(FILE, () => {
    sourceCase('operation constructor 1 always returns default initialized', () => {
        const instance = new Operation();
        expect(instance.isValid).toBe(false);
        expect(instance.data).toHaveLength(0);
        sameCode(instance.code, 'invalidopcode');
    });

    for (const name of ['operation constructor 2 valid input returns input initialized', 'operation constructor 3 valid input returns input initialized']) {
        sourceCase(name, () => {
            const data = hexStrToBytes('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f');
            const instance = new Operation(data.slice());
            expect(instance.isValid).toBe(true);
            sameCode(instance.code, 'push_size_32');
            expect(Array.from(instance.data)).toEqual(Array.from(data));
        });
    }

    sourceCase('operation constructor 4 valid input returns input initialized', () => {
        const expected = new Operation(hexStrToBytes('23156214'));
        const instance = Operation.fromNative(expected.toNative(), true);
        expect(instance.isValid).toBe(true);
        expect(equal(expected, instance)).toBe(true);
    });

    sourceCase('operation constructor 5 valid input returns input initialized', () => {
        expect(Operation.fromNative(new Operation(hexStrToBytes('23156214')).toNative(), true).isValid).toBe(true);
    });

    sourceCase('operation from data insufficient bytes failure', () => {
        expect(Operation.fromData(new Uint8Array(0))).toBeUndefined();
    });

    const roundtrip = (name: string, raw: Uint8Array, code: string, data: Uint8Array) => {
        sourceCase(name, () => {
            const instance = decode(raw);
            expect(instance.isValid).toBe(true);
            expect(bytesToHexStr(instance.toData())).toBe(bytesToHexStr(raw));
            const duplicate = decode(instance.toData());
            expect(equal(instance, duplicate)).toBe(true);
            sameCode(instance.code, code);
            expect(bytesToHexStr(instance.data)).toBe(bytesToHexStr(data));
        });
    };
    roundtrip('operation from data roundtrip push size 0 success', hexStrToBytes('00'), 'push_size_0', new Uint8Array(0));
    roundtrip('operation from data roundtrip push size 75 success', concat(hexStrToBytes('4b'), filled(75)), 'push_size_75', filled(75));
    roundtrip('operation from data roundtrip push negative 1 success', bytes(0x4f), 'push_negative_1', new Uint8Array(0));
    roundtrip('operation from data roundtrip push positive 1 success', bytes(0x51), 'push_positive_1', new Uint8Array(0));
    roundtrip('operation from data roundtrip push positive 16 success', bytes(0x60), 'push_positive_16', new Uint8Array(0));
    roundtrip('operation from data roundtrip push one size success', concat(hexStrToBytes('4cff'), filled(255)), 'push_one_size', filled(255));
    roundtrip('operation from data roundtrip push two size success', concat(hexStrToBytes('4d0802'), filled(520)), 'push_two_size', filled(520));
    roundtrip('operation from data roundtrip push four size success', concat(hexStrToBytes('4e08020000'), filled(520)), 'push_four_size', filled(520));

    sourceCase('operation from data roundtrip success', () => {
        const instance = decode(validRaw());
        expect(instance.isValid).toBe(true);
        expect(bytesToHexStr(instance.toData())).toBe(bytesToHexStr(validRaw()));
    });

    sourceCase('operation operator assign equals 1 always matches equivalent', () => {
        expect(equal(decode(validRaw()), decode(validRaw()))).toBe(true);
    });
    sourceCase('operation operator assign equals 2 always matches equivalent', () => {
        const expected = decode(validRaw());
        expect(equal(Operation.fromNative(expected.toNative(), true), expected)).toBe(true);
    });
    sourceCase('operation operator boolean equals duplicates returns true', () => {
        expect(equal(decode(validRaw()), decode(validRaw()))).toBe(true);
    });
    sourceCase('operation operator boolean equals differs returns false', () => {
        expect(equal(decode(validRaw()), new Operation())).toBe(false);
    });
    sourceCase('operation operator boolean not equals duplicates returns false', () => {
        expect(equal(decode(validRaw()), decode(validRaw()))).toBe(true);
    });
    sourceCase('operation operator boolean not equals differs returns true', () => {
        expect(equal(decode(validRaw()), new Operation())).toBe(false);
    });

    const toText = (name: string, operation: () => Operation, expected: string, flags: bigint = 0n) => {
        sourceCase(name, () => {
            expect(operation().toString(flags)).toBe(expected);
        });
    };
    toText('operation to string push size 0 zero', () => new Operation('push_size_0'), 'zero');
    toText('operation to string push size 75 push 75', () => new Operation('push_size_75'), 'push_75');
    toText('operation to string push positive 7 7', () => new Operation('push_positive_7'), '7');
    toText('operation to string minimal 0x07 7', () => new Operation(bytes(0x07), true), '7');
    toText('operation to string nominal 0x07 0x07', () => new Operation(bytes(0x07), false), '[07]');
    toText('operation to string 0x42 0x42', () => new Operation(bytes(0x42), true), '[42]');
    toText('operation to string 0x112233 0x112233', () => new Operation(bytes(0x11, 0x22, 0x33), true), '[112233]');
    toText('operation to string push size 3 0x112233 0x112233', () => decode(bytes(0x03, 0x11, 0x22, 0x33)), '[112233]');
    toText('operation to string push one size 0x112233 1 0x112233', () => decode(bytes(0x4c, 0x03, 0x11, 0x22, 0x33)), '[1.112233]');
    toText('operation to string push two size 0x112233 2 0x112233', () => decode(bytes(0x4d, 0x03, 0x00, 0x11, 0x22, 0x33)), '[2.112233]');
    toText('operation to string push four size 0x112233 4 0x112233', () => decode(bytes(0x4e, 0x03, 0x00, 0x00, 0x00, 0x11, 0x22, 0x33)), '[4.112233]');
    toText('operation to string nop2 no rules nop2', () => new Operation('nop2'), 'nop2', 0n);
    toText('operation to string nop2 bip65 rule checklocktimeverify', () => new Operation('nop2'), 'checklocktimeverify', flag('bip65_rule'));
    toText('operation to string nop3 no rules nop3', () => new Operation('nop3'), 'nop3', 0n);
    toText('operation to string nop3 bip112 rule checksequenceverify', () => new Operation('nop3'), 'checksequenceverify', flag('bip112_rule'));

    const fromText = (name: string, text: string, code: string, data: Uint8Array) => {
        sourceCase(name, () => {
            const value = parse(text);
            sameCode(value.code, code);
            expect(bytesToHexStr(value.data)).toBe(bytesToHexStr(data));
        });
    };
    const none = new Uint8Array(0);
    fromText('operation from string negative 1 push negative 1 empty', '-1', 'push_negative_1', none);
    fromText('operation from string 0 push size 0 empty', '0', 'push_size_0', none);
    fromText('operation from string 1 push positive 1 empty', '1', 'push_positive_1', none);
    fromText('operation from string 16 push positive 16 empty', '16', 'push_positive_16', none);
    fromText('operation from string 17 push size 1 expected', '17', 'push_size_1', bytes(0x11));
    fromText('operation from string negative 2 push size 1 expected', '-2', 'push_size_1', bytes(0x82));
    fromText('operation from string 9223372036854775807 push size 8 expected', '9223372036854775807', 'push_size_8', bytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f));
    fromText('operation from string negative 9223372036854775807 push size 8 expected', '-9223372036854775807', 'push_size_8', bytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff));
    fromText('operation from string string empty push size 0 empty', "''", 'push_size_0', none);
    fromText('operation from string string a push size 1 expected byte', "'a'", 'push_size_1', bytes(0x61));
    fromText('operation from string string abc push size 3 expected byte order', "'abc'", 'push_size_3', bytes(0x61, 0x62, 0x63));
    fromText('operation from string negative 1 character push size 1 nominal encoding', "'O'", 'push_size_1', bytes(0x4f));
    fromText('operation from string push 0 push size 0', 'push_0', 'push_size_0', none);
    fromText('operation from string push one push one size empty', 'push_one', 'push_one_size', none);
    fromText('operation from string push two push two size empty', 'push_two', 'push_two_size', none);
    fromText('operation from string push four push four size empty', 'push_four', 'push_four_size', none);
    fromText('operation from string 7 push positive 7', '7', 'push_positive_7', none);
    fromText('operation from string 0x07 push size 1', '[07]', 'push_size_1', bytes(0x07));
    fromText('operation from string 0x42 push size 1', '[42]', 'push_size_1', bytes(0x42));
    fromText('operation from string 0x112233 push size 3', '[112233]', 'push_size_3', bytes(0x11, 0x22, 0x33));
    fromText('operation from string 0 0x112233 push size 3', '[0.112233]', 'push_size_3', bytes(0x11, 0x22, 0x33));
    fromText('operation from string 1 0x112233 push one size', '[1.112233]', 'push_one_size', bytes(0x11, 0x22, 0x33));
    fromText('operation from string 2 0x112233 push two size', '[2.112233]', 'push_two_size', bytes(0x11, 0x22, 0x33));
    fromText('operation from string 4 0x112233 push four size', '[4.112233]', 'push_four_size', bytes(0x11, 0x22, 0x33));
    fromText('operation from string nop2 nop2 checklocktimeverify', 'nop2', 'checklocktimeverify', none);
    fromText('operation from string checklocktimeverify nop2 checklocktimeverify', 'checklocktimeverify', 'nop2', none);
    fromText('operation from string nop3 nop3 checksequenceverify', 'nop3', 'checksequenceverify', none);
    fromText('operation from string checklocktimeverify nop3 checksequenceverify', 'checksequenceverify', 'nop3', none);

    const rejected = (name: string, text: string) => {
        sourceCase(name, () => {
            expect(Operation.fromString(text)).toBeUndefined();
        });
    };
    rejected('operation from string push 1 false', 'push_1');
    rejected('operation from string push 75 false', 'push_75');
    rejected('operation from string 5 0x112233 false', '[5.112233]');
    rejected('operation from string empty 0x112233 false', '[.112233]');
});

// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/domain/test/chain/input.cpp and src/c-api/test/chain/input.cpp through the Input wrapper. is_final, is_locked,
// signature_operations, copy and equals are native members the wrapper does not expose; those cases are blocked in the
// inventory. Equality of two inputs is asserted on their wire serialization.
import { HashFunctions, Input, OutputPoint, bytesToHexStr, decodeHash, hexStrToBytes } from '../..';
import { emptyScript, hashOf, inputFromHex, sameBytes, scriptFromHex } from './support/chain';
import { namedHex } from './support/fixtures';
import { describeSource, sourceCase } from './support/sourceCase';

const DOMAIN = 'src/domain/test/chain/input.cpp';
const CAPI = 'src/c-api/test/chain/input.cpp';
const SCRIPT_BODY = 'ece424a6bb6ddf4db592c0faed60685047a361b1';
const validRawInput = () => namedHex(DOMAIN, 'valid_raw_input');

function roundTrip(input: Input): Input {
    return Input.fromNative(input.toNative(), true);
}

describeSource(DOMAIN, () => {
    for (const name of ['input constructor 2 valid input returns input initialized', 'input constructor 3 valid input returns input initialized']) {
        sourceCase(name, () => {
            const previousOutput = new OutputPoint(HashFunctions.nullHash, 5434);
            const script = scriptFromHex(SCRIPT_BODY);
            const instance = roundTrip(new Input(previousOutput, script, 4568656));
            expect(instance.previousOutput!.index).toBe(5434);
            expect(Array.from(instance.previousOutput!.hash!)).toEqual(Array.from(HashFunctions.nullHash));
            expect(bytesToHexStr(instance.script!.toData(false))).toBe(SCRIPT_BODY);
            expect(instance.seq).toBe(4568656);
        });
    }

    sourceCase('input constructor 4 valid input returns input initialized', () => {
        const expected = inputFromHex(validRawInput());
        expect(sameBytes(roundTrip(expected).toData(true), expected.toData(true))).toBe(true);
    });

    sourceCase('input constructor 5 valid input returns input initialized', () => {
        expect(roundTrip(inputFromHex(validRawInput())).hasComponents).toBe(true);
    });

    sourceCase('input from data insufficient data failure', () => {
        expect(Input.fromData(new Uint8Array(2))).toBeUndefined();
    });

    sourceCase('input from data valid data success', () => {
        const junk = '000000000000005739943a9c29a1955dfae2b3f37de547005bfb9535192e5fb0000000000000005739943a9c29a1955dfae2b3f37de547005bfb9535192e5fb0';
        expect(Input.fromData(hexStrToBytes(junk))).toBeDefined();
    });

    for (const name of ['input from data valid input success', 'input factory from data 2 valid input success', 'input factory from data 3 valid input success']) {
        sourceCase(name, () => {
            const raw = validRawInput();
            const instance = inputFromHex(raw);
            expect(instance.serializedSize(true)).toBe(raw.length / 2);
            const resave = instance.toData(true);
            expect(resave.length).toBe(raw.length / 2);
            expect(bytesToHexStr(resave)).toBe(raw);
        });
    }

    const previousOutputValue = new OutputPoint(decodeHash('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f'), 5434);

    for (const name of ['input previous output setter 1 roundtrip success', 'input previous output setter 2 roundtrip success']) {
        sourceCase(name, () => {
            const instance = new Input(new OutputPoint(HashFunctions.nullHash, 0), emptyScript(), 0);
            expect(instance.previousOutput!.index).not.toBe(5434);
            instance.previousOutput = previousOutputValue;
            const stored = roundTrip(instance);
            expect(stored.previousOutput!.index).toBe(5434);
            expect(Array.from(stored.previousOutput!.hash!)).toEqual(Array.from(previousOutputValue.hash!));
        });
    }

    for (const name of ['input script setter 1 roundtrip success', 'input script setter 2 roundtrip success']) {
        sourceCase(name, () => {
            const value = scriptFromHex(SCRIPT_BODY);
            const instance = new Input(new OutputPoint(HashFunctions.nullHash, 0), emptyScript(), 0);
            expect(bytesToHexStr(instance.script!.toData(false))).not.toBe(SCRIPT_BODY);
            instance.script = value;
            expect(bytesToHexStr(roundTrip(instance).script!.toData(false))).toBe(SCRIPT_BODY);
        });
    }

    sourceCase('input sequence roundtrip success', () => {
        const instance = new Input(new OutputPoint(HashFunctions.nullHash, 0), emptyScript(), 0);
        expect(instance.seq).not.toBe(1254);
        instance.seq = 1254;
        expect(roundTrip(instance).seq).toBe(1254);
    });

    const same = (a: Input, b: Input) => sameBytes(a.toData(true), b.toData(true));
    const empty = () => new Input(new OutputPoint(HashFunctions.nullHash, 0), emptyScript(), 0);

    sourceCase('input operator assign equals 1 always matches equivalent', () => {
        expect(same(inputFromHex(validRawInput()), inputFromHex(validRawInput()))).toBe(true);
    });
    sourceCase('input operator assign equals 2 always matches equivalent', () => {
        const expected = inputFromHex(validRawInput());
        expect(same(roundTrip(expected), expected)).toBe(true);
    });
    sourceCase('input operator boolean equals duplicates returns true', () => {
        expect(same(inputFromHex(validRawInput()), inputFromHex(validRawInput()))).toBe(true);
    });
    sourceCase('input operator boolean equals differs returns false', () => {
        expect(same(inputFromHex(validRawInput()), empty())).toBe(false);
    });
    sourceCase('input operator boolean not equals duplicates returns false', () => {
        expect(same(inputFromHex(validRawInput()), inputFromHex(validRawInput()))).toBe(true);
    });
    sourceCase('input operator boolean not equals differs returns true', () => {
        expect(same(inputFromHex(validRawInput()), empty())).toBe(false);
    });
});

describeSource(CAPI, () => {
    const SEQUENCE = 0xfffffffe;
    const PREV_HASH = Uint8Array.from({ length: 32 }, (_, i) => i + 1);
    const makeInput = (sequence: number = 0) => new Input(new OutputPoint(PREV_HASH as any, 7), scriptFromHex(SCRIPT_BODY), sequence);

    sourceCase('C-API Input - default construct returns handle', () => {
        expect(makeInput().toNative()).toBeDefined();
    });

    sourceCase('C-API Input - field constructor preserves fields', () => {
        expect(roundTrip(makeInput(SEQUENCE)).seq).toBe(SEQUENCE);
    });

    sourceCase('C-API Input - from_data insufficient bytes fails', () => {
        expect(Input.fromData(new Uint8Array(5))).toBeUndefined();
    });

    sourceCase('C-API Input - to_data / from_data roundtrip', () => {
        const expected = makeInput(SEQUENCE);
        const raw = expected.toData(true);
        expect(raw.length).toBeGreaterThan(0);
        const parsed = Input.fromData(raw)!;
        expect(parsed).toBeDefined();
        expect(parsed.seq).toBe(SEQUENCE);
        expect(sameBytes(parsed.toData(true), raw)).toBe(true);
    });

    sourceCase('C-API Input - sequence setter roundtrip', () => {
        const input = makeInput();
        expect(input.seq).not.toBe(SEQUENCE);
        input.seq = SEQUENCE;
        expect(roundTrip(input).seq).toBe(SEQUENCE);
    });

    sourceCase('C-API Input - script setter roundtrip', () => {
        const input = makeInput();
        input.script = scriptFromHex(SCRIPT_BODY);
        expect(bytesToHexStr(roundTrip(input).script!.toData(false))).toBe(SCRIPT_BODY);
    });

    sourceCase('C-API Input - previous_output setter roundtrip', () => {
        const input = makeInput();
        input.previousOutput = new OutputPoint(hashOf(0x44), 99);
        const stored = roundTrip(input);
        expect(stored.previousOutput!.index).toBe(99);
        expect(Array.from(stored.previousOutput!.hash!)).toEqual(Array.from(hashOf(0x44)));
    });

    sourceCase('C-API Input - equals different inputs', () => {
        const a = makeInput(SEQUENCE);
        const b = makeInput(SEQUENCE);
        const c = makeInput(0);
        expect(sameBytes(a.toData(true), b.toData(true))).toBe(true);
        expect(sameBytes(a.toData(true), c.toData(true))).toBe(false);
    });
});

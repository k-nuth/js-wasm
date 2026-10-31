// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Cases for Input, Output, OutputPoint and Utxo whose members live on the native object handed out by the wrapper's public
// toNative() (isFinal, signatureOperations, isDust, equals, copy, checksum, serializedSize, toData, height).
import { HashFunctions, Input, Output, OutputPoint, Script, TokenData, TokenDataFungible, Utxo, bytesToHexStr, free, hexStrToBytes } from '../..';
import { emptyScript, scriptFromHex } from './support/chain';
import { describeSource, sourceCase } from './support/sourceCase';

const SCRIPT_BODY = 'ece424a6bb6ddf4db592c0faed60685047a361b1';
const filled = (byte: number) => new Uint8Array(32).fill(byte) as any;

function using<N, T>(native: N, body: (native: N) => T): T {
    try {
        return body(native);
    } finally {
        free(native);
    }
}

const inputWith = (sequence: number) => new Input(new OutputPoint(filled(1), 7), scriptFromHex(SCRIPT_BODY), sequence);

describeSource('src/c-api/test/chain/input.cpp', () => {
    sourceCase('C-API Input - is_final on max sequence is true', () => {
        expect(using(inputWith(0xffffffff).toNative(), n => n.isFinal())).toBe(true);
    });
    sourceCase('C-API Input - is_final on non-max sequence is false', () => {
        expect(using(inputWith(0).toNative(), n => n.isFinal())).toBe(false);
    });
    sourceCase('C-API Input - signature_operations on default is zero', () => {
        expect(using(inputWith(0).toNative(), n => n.signatureOperations(false, false))).toBe(0);
    });
    sourceCase('C-API Input - copy preserves fields', () => {
        const original = inputWith(0xfffffffe).toNative();
        const copy = original.copy();
        try {
            expect(original.equals(copy)).toBe(true);
            expect(copy.sequenceValue()).toBe(0xfffffffe);
        } finally {
            free(copy);
            free(original);
        }
    });
});

describeSource('src/domain/test/chain/input.cpp', () => {
    sourceCase('input is final max input sequence true', () => {
        const instance = new Input(new OutputPoint(HashFunctions.nullHash, 0), emptyScript(), 0xffffffff);
        expect(using(instance.toNative(), n => n.isFinal())).toBe(true);
    });
    sourceCase('input is final sequence zero false', () => {
        const instance = new Input(new OutputPoint(HashFunctions.nullHash, 0), emptyScript(), 0);
        expect(using(instance.toNative(), n => n.isFinal())).toBe(false);
    });
    for (const [name, bip16] of [['input signature operations bip16 inactive returns script sigops', false], ['input signature operations bip16 active cache empty returns script sigops', true]] as const) {
        sourceCase(name, () => {
            const script = Script.fromData(hexStrToBytes('02acad'), true)!;
            expect(script).toBeDefined();
            const instance = new Input(new OutputPoint(HashFunctions.nullHash, 0), emptyScript(), 0);
            instance.script = script;
            expect(using(instance.toNative(), n => n.signatureOperations(bip16, false))).toBe(script.sigops);
        });
    }
});

describeSource('src/c-api/test/chain/output.cpp', () => {
    const output = (value: bigint) => new Output(value, emptyScript());
    sourceCase('C-API Output - is_dust below minimum is true', () => {
        expect(using(output(100n).toNative(), n => n.isDust(1000n))).toBe(true);
    });
    sourceCase('C-API Output - is_dust above minimum is false', () => {
        expect(using(output(100000n).toNative(), n => n.isDust(1000n))).toBe(false);
    });
    sourceCase('C-API Output - signature_operations on default is zero', () => {
        expect(using(new Output(0n, emptyScript()).toNative(), n => n.signatureOperations(false))).toBe(0);
    });
});

describeSource('src/domain/test/chain/output.cpp', () => {
    sourceCase('output signature operations always returns script sigops false', () => {
        const instance = new Output(0n, emptyScript());
        expect(using(instance.toNative(), n => n.signatureOperations(false))).toBe(instance.script!.sigops);
        expect(instance.tokenData).toBeUndefined();
    });
});

describeSource('src/c-api/test/chain/output_point.cpp', () => {
    const HASH = hexStrToBytes('6fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000') as any;
    const pointNative = (hash: Uint8Array, index: number) => new OutputPoint(hash as any, index).toNative();

    sourceCase('C-API OutputPoint - serialized_size is fixed 36', () => {
        expect(using(pointNative(HASH, 7), n => n.serializedSize(true))).toBe(36);
    });
    sourceCase('C-API OutputPoint - to_data fixed-size payload', () => {
        const raw = using(pointNative(HASH, 7), n => n.toData(true));
        expect(raw).toHaveLength(36);
        expect(Array.from(raw.slice(32))).toEqual([0x07, 0x00, 0x00, 0x00]);
        expect(bytesToHexStr(raw.slice(0, 32))).toBe(bytesToHexStr(HASH));
    });
    sourceCase('C-API OutputPoint - equals duplicates', () => {
        const a = pointNative(HASH, 524342);
        const b = pointNative(HASH, 524342);
        const c = new OutputPoint().toNative();
        try {
            expect(a.equals(b)).toBe(true);
            expect(a.equals(c)).toBe(false);
        } finally {
            free(a);
            free(b);
            free(c);
        }
    });
    sourceCase('C-API OutputPoint - checksum all ones', () => {
        expect(using(pointNative(filled(0xff), 0xffffffff), n => n.checksum())).toBe(0xffffffffffffffffn);
    });
    sourceCase('C-API OutputPoint - checksum all zeros', () => {
        expect(using(pointNative(new Uint8Array(32), 0), n => n.checksum())).toBe(0n);
    });
});

describeSource('src/c-api/test/chain/utxo.cpp', () => {
    const TXID = filled(0xaa);
    const CATEGORY = filled(0xbb);
    const utxoNative = (index: number, amount: bigint, token?: TokenData) => new Utxo(TXID, index, amount, token).toNative();

    sourceCase('C-API Utxo - construct_default builds a handle with zero fields', () => {
        const native = new Utxo().toNative();
        try {
            expect(native.height()).toBe(0);
            expect(native.amount()).toBe(0n);
            expect(native.tokenData()).toBeNull();
        } finally {
            free(native);
        }
    });
    sourceCase('C-API Utxo - differing amount is unequal', () => {
        const a = utxoNative(1, 10n);
        const b = utxoNative(1, 11n);
        try {
            expect(a.equals(b)).toBe(false);
        } finally {
            free(a);
            free(b);
        }
    });
    sourceCase('C-API Utxo - differing point is unequal', () => {
        const a = utxoNative(1, 10n);
        const b = utxoNative(99, 10n);
        try {
            expect(a.equals(b)).toBe(false);
        } finally {
            free(a);
            free(b);
        }
    });
    sourceCase('C-API Utxo - differing token_data is unequal', () => {
        const a = utxoNative(1, 10n);
        const b = utxoNative(1, 10n, new TokenData(CATEGORY, new TokenDataFungible(1n)));
        try {
            expect(a.equals(b)).toBe(false);
        } finally {
            free(a);
            free(b);
        }
    });
});

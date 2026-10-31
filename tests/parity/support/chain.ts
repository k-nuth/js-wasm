// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Hash, HashFunctions, Input, Output, OutputPoint, Script, Transaction, bytesToHexStr, free, hexStrToBytes } from '../../..';

export const NULL_INDEX = 0xffffffff;

export function emptyScript(): Script {
    return new Script(new Uint8Array(0), false);
}

export function scriptFromHex(hex: string, prefix: boolean = false): Script {
    const script = Script.fromData(hexStrToBytes(hex), prefix);
    expect(script).toBeDefined();
    return script!;
}

export function hashOf(byte: number): Hash {
    return new Uint8Array(32).fill(byte) as Hash;
}

export function inputFromHex(hex: string): Input {
    const input = Input.fromData(hexStrToBytes(hex));
    expect(input).toBeDefined();
    return input!;
}

export function outputFromHex(hex: string): Output {
    const output = Output.fromData(hexStrToBytes(hex));
    expect(output).toBeDefined();
    return output!;
}

export function transactionFromHex(hex: string): Transaction {
    const tx = Transaction.fromData(hexStrToBytes(hex));
    expect(tx).toBeDefined();
    return tx!;
}

// A transaction that went through the native object and back, so assertions see what the library stored.
export function throughNative(tx: Transaction): Transaction {
    const native = tx.toNative();
    return Transaction.fromNative(native, true);
}

export function nullPrevout(): OutputPoint {
    return new OutputPoint(HashFunctions.nullHash, NULL_INDEX);
}

// The wrappers expose no equals(), so value equality is asserted on the wire serialization together with the scalar
// fields, which is everything the native equality compares for objects without a validation cache.
export function wireHex(tx: Transaction): string {
    return bytesToHexStr(tx.toData(true));
}

export function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
    return bytesToHexStr(a) === bytesToHexStr(b);
}

export function freeAll(...natives: Array<unknown>): void {
    for (const native of natives) {
        free(native as any);
    }
}

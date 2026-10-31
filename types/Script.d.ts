// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { ShortHash } from './Hash';
import { Operation } from './Operation';
import { EcSecret } from './Secret';
import { Transaction } from './Transaction';
import { EndorsementType, ScriptNative, ScriptPattern } from './wasm/glue';
export type EndorsementResult = {
    success: true;
    errorCode: 0;
    data: Uint8Array;
} | {
    success: false;
    errorCode: number;
};
export declare class EndorsementError extends Error {
    readonly errorCode: number;
    constructor(errorCode: number);
}
export declare class Script {
    private encoded;
    private prefix;
    static fromNative(native: ScriptNative, destroy?: boolean): Script;
    constructor(encoded: Uint8Array, prefix: boolean);
    toNative(): ScriptNative;
    static fromData(encoded: Uint8Array, prefix: boolean): Script | undefined;
    static fromString(str: string): Script | undefined;
    static fromOperations(operations: Array<Operation>): Script | undefined;
    static isValid(encoded: Uint8Array, prefix: boolean): boolean;
    get valid(): boolean;
    get isValidOperations(): boolean;
    get serializedSize(): number;
    get operations(): Array<Operation>;
    toString(activeFlags: bigint): string;
    toData(prefix: boolean): Uint8Array;
    toBytes(): Uint8Array;
    static isPushOnly(ops: Array<Operation>): boolean;
    static isRelaxedPush(ops: Array<Operation>): boolean;
    static isCoinbasePattern(ops: Array<Operation>, height: number): boolean;
    static isNullDataPattern(ops: Array<Operation>): boolean;
    static isPayPublicKeyPattern(ops: Array<Operation>): boolean;
    static isPayPublicKeyHashPattern(ops: Array<Operation>): boolean;
    static isPayScriptHashPattern(ops: Array<Operation>): boolean;
    static isSignMultisigPattern(ops: Array<Operation>): boolean;
    static isSignPublicKeyPattern(ops: Array<Operation>): boolean;
    static isSignPublicKeyHashPattern(ops: Array<Operation>): boolean;
    static isSignScriptHashPattern(ops: Array<Operation>): boolean;
    static toNullDataPattern(data: Uint8Array): Array<Operation> | undefined;
    static toPayPublicKeyPattern(point: Uint8Array): Array<Operation> | undefined;
    static toPayPublicKeyHashPattern(hash: ShortHash): Array<Operation>;
    static toPayScriptHashPattern(hash: ShortHash): Array<Operation>;
    pattern(): ScriptPattern;
    outputPattern(): ScriptPattern;
    inputPattern(): ScriptPattern;
    get sigops(): number;
    get sigopsAccurate(): number;
    get isUnspendable(): boolean;
    reset(): void;
    static createEndorsementResult(secret: EcSecret, prevoutScript: Script, tx: Transaction, inputIndex: number, sighashType: number, activeFlags: bigint, value: bigint, endorsementType: EndorsementType): EndorsementResult;
    static createEndorsement(secret: EcSecret, prevoutScript: Script, tx: Transaction, inputIndex: number, sighashType: number, activeFlags: bigint, value: bigint, endorsementType: EndorsementType): Uint8Array;
    static verify(tx: Transaction, input: number, flags: bigint, inputScript: Script, prevoutScript: Script, value: bigint): number;
    static verifyTransaction(tx: Transaction, input: number, flags: bigint): number;
}
export default Script;

// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Hash } from './Hash';
import { Input } from './Input';
import { Output } from './Output';
import { TransactionNative } from './wasm/glue';
export declare class Transaction {
    version?: number;
    locktime?: number;
    inputs?: Array<Input>;
    outputs?: Array<Output>;
    static fromNative(native: TransactionNative, destroy?: boolean): Transaction;
    constructor(version?: number, locktime?: number, inputs?: Array<Input>, outputs?: Array<Output>);
    toNative(): TransactionNative;
    get valid(): boolean;
    serializedSize(wire?: boolean): number;
    toData(wire: boolean): Uint8Array;
    private static decode;
    static fromData(data: Uint8Array): Transaction | undefined;
    static isValid(data: Uint8Array): boolean;
    clone(): Transaction | undefined;
    static hasSameSigningStructure(template: Transaction, signed: Transaction): boolean;
    get hash(): Hash;
    get isCoinbase(): boolean;
    get totalInputValue(): bigint;
    get totalOutputValue(): bigint;
    get fees(): bigint;
    isMature(targetHeight: number): boolean;
}
export default Transaction;

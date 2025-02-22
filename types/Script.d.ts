import { ScriptNative } from './wasm/glue';
import { Operation } from './Operation';
import { Transaction } from './Transaction';
import { ShortHash } from './Hash';
export declare class Script {
    private encoded;
    private prefix;
    static fromNative(native: ScriptNative, destroy?: boolean): Script;
    static fromData(encoded: Uint8Array, prefix: boolean): Script | undefined;
    static fromString(str: string): Script | undefined;
    static fromOperations(operations: Array<Operation>): Script | undefined;
    static isValid(encoded: Uint8Array, prefix: boolean): boolean;
    constructor(encoded: Uint8Array, prefix: boolean);
    toNative(): ScriptNative;
    get valid(): boolean;
    get isValidOperations(): boolean;
    get satoshiContentSize(): number;
    get serializedSize(): number;
    get sigops(): number;
    get type(): string;
    get operations(): Operation[];
    toString(activeForks: number): string;
    toData(prefix: boolean): Uint8Array<ArrayBufferLike>;
    toBytes(): Uint8Array<ArrayBufferLike>;
    static isPushOnly(ops: Array<Operation>): boolean;
    static isRelaxedPush(ops: Array<Operation>): boolean;
    static isCoinbasePattern(ops: Array<Operation>, height: number): boolean;
    static isNullDataPattern(ops: Array<Operation>): boolean;
    static isPayPublicKeyPattern(ops: Array<Operation>): boolean;
    static isPayKeyHashPattern(ops: Array<Operation>): boolean;
    static isPayScriptHashPattern(ops: Array<Operation>): boolean;
    static isSignMultisigPattern(ops: Array<Operation>): boolean;
    static isSignPublicKeyPattern(ops: Array<Operation>): boolean;
    static isSignKeyHashPattern(ops: Array<Operation>): boolean;
    static isSignScriptHashPattern(ops: Array<Operation>): boolean;
    static toNullDataPattern(data: Uint8Array): Array<Operation>;
    static toPayPublicKeyPattern(point: Uint8Array): Array<Operation>;
    static toPayKeyHashPattern(hash: ShortHash): Array<Operation>;
    static toPayScriptHashPattern(hash: ShortHash): Array<Operation>;
    static verify(tx: Transaction, input: number, forks: number, inputScript: Script, prevoutScript: Script, value: bigint): number;
    static verifyTransaction(tx: Transaction, input: number, forks: number): number;
}
export default Script;

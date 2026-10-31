// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { OpcodeName } from './Opcode';
import { OpcodeEnumNative, OperationNative } from './wasm/glue';
export declare class Operation {
    private opcode?;
    private encoded?;
    private minimal?;
    private rawData?;
    static fromNative(native: OperationNative, destroy?: boolean): Operation;
    constructor();
    constructor(opcode: OpcodeName);
    constructor(encoded: Uint8Array, minimal?: boolean);
    toNative(): OperationNative;
    static fromData(encoded: Uint8Array): Operation | undefined;
    static fromString(str: string): Operation | undefined;
    static isValid(encoded: Uint8Array, minimal: boolean): boolean;
    toString(activeFlags: bigint): string;
    toData(): Uint8Array;
    get isValid(): boolean;
    get serializedSize(): number;
    get code(): OpcodeEnumNative;
    get data(): Uint8Array;
    get isPush(): boolean;
    get isCounted(): boolean;
    get isVersion(): boolean;
    get isPositive(): boolean;
    get isConditional(): boolean;
    get isRelaxedPush(): boolean;
    get isMinimalPush(): boolean;
    get isNominalPush(): boolean;
    isDisabled(activeFlags: bigint): boolean;
    isOversized(maxSize: number): boolean;
    static opcodeFromSize(size: number): OpcodeEnumNative;
    static minimalOpcodeFromData(data: Uint8Array): OpcodeEnumNative;
    static nominalOpcodeFromData(data: Uint8Array): OpcodeEnumNative;
    static opcodeFromPositive(value: number): OpcodeEnumNative;
    static opcodeToPositive(code: OpcodeName): number;
    static opcodeIsPush(code: OpcodeName): boolean;
    static opcodeIsPayload(code: OpcodeName): boolean;
    static opcodeIsCounted(code: OpcodeName): boolean;
    static opcodeIsVersion(code: OpcodeName): boolean;
    static opcodeIsNumeric(code: OpcodeName): boolean;
    static opcodeIsPositive(code: OpcodeName): boolean;
    static opcodeIsReserved(code: OpcodeName): boolean;
    static opcodeIsDisabled(code: OpcodeName, activeFlags: bigint): boolean;
    static opcodeIsConditional(code: OpcodeName): boolean;
    static opcodeIsRelaxedPush(code: OpcodeName): boolean;
}
export default Operation;

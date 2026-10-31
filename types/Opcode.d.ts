// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { OpcodeAlias } from './OpcodeAliases';
import { OpcodeEnumNative } from './wasm/glue';
export type OpcodeName = OpcodeEnumNative | OpcodeAlias;
export declare class Opcode {
    static resolve(name: OpcodeName): OpcodeEnumNative;
    static toInt(value: OpcodeName): number;
    static toString(value: OpcodeName, activeFlags: bigint): string;
    static fromString(value: string): OpcodeEnumNative | undefined;
    static toHexadecimal(code: OpcodeName): string;
    static fromHexadecimal(value: string): OpcodeEnumNative | undefined;
}
export default Opcode;

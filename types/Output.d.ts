// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Script } from './Script';
import { TokenData } from './TokenData';
import { OutputNative } from './wasm/glue';
export declare class Output {
    value?: bigint;
    script?: Script;
    tokenData?: TokenData;
    static fromNative(native: OutputNative, destroy?: boolean): Output;
    constructor(value?: bigint, script?: Script, tokenData?: TokenData);
    private static validU64;
    toNative(): OutputNative;
    static isValid(value: bigint, script: Script, tokenData?: TokenData): boolean;
    get valid(): boolean;
    static fromData(data: Uint8Array): Output | undefined;
    serializedSize(wire?: boolean): number;
    toData(wire: boolean): Uint8Array;
}
export default Output;

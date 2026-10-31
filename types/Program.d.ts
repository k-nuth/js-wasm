// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Script } from './Script';
import { Transaction } from './Transaction';
import { ProgramNative } from './wasm/glue';
export declare const UNKNOWN_SPENT_VALUE = 18446744073709551615n;
export declare class Program {
    private native;
    private ownsNative;
    private readonly lifetime;
    private disposed;
    constructor(script?: Script, programOrTransaction?: Program | Transaction, inputIndex?: number, flags?: bigint, value?: bigint);
    constructor(script?: Script, programOrTransaction?: Program | Transaction);
    constructor(native: ProgramNative);
    static adopt(native: ProgramNative, dependsOn?: Array<Program>): Program;
    private live;
    dispose(): void;
    toNative(): ProgramNative;
    copy(): Program;
    get valid(): boolean;
    evaluate(): number;
    stackResult(clean: boolean): boolean;
    get size(): number;
    item(index: number): Uint8Array;
}
export default Program;

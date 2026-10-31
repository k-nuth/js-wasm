// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { OutputPoint } from './OutputPoint';
import { Script } from './Script';
import { InputNative } from './wasm/glue';
export declare class Input {
    previousOutput?: OutputPoint;
    script?: Script;
    seq?: number;
    static fromNative(native: InputNative, destroy?: boolean): Input;
    constructor(previousOutput?: OutputPoint, script?: Script, seq?: number);
    toNative(): InputNative;
    get hasComponents(): boolean;
    static fromData(data: Uint8Array): Input | undefined;
    serializedSize(wire?: boolean): number;
    toData(wire: boolean): Uint8Array;
}
export default Input;

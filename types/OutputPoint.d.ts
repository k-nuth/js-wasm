// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Hash } from './Hash';
import { Output } from './Output';
import { OutputPointNative } from './wasm/glue';
export declare class OutputPoint {
    hash?: Hash;
    index?: number;
    cachedOutput?: Output;
    static fromNative(native: OutputPointNative, destroy?: boolean): OutputPoint;
    constructor(hash?: Hash, index?: number);
    toNative(): OutputPointNative;
    static isValid(hash: Hash, index: number): boolean;
    get valid(): boolean;
}
export default OutputPoint;

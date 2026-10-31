// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Hash } from './Hash';
import { Output } from './Output';
import { TokenData } from './TokenData';
import { UtxoNative } from './wasm/glue';
export declare class Utxo {
    hash?: Hash;
    index?: number;
    amount?: bigint;
    tokenData?: TokenData;
    cachedOutput?: Output;
    static fromNative(native: UtxoNative, destroy?: boolean): Utxo;
    constructor(hash?: Hash, index?: number, amount?: bigint, tokenData?: TokenData);
    toNative(): UtxoNative;
    static isValid(hash: Hash, index: number, amount: bigint): boolean;
    get valid(): boolean;
}
export default Utxo;

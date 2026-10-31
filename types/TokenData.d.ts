// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Hash } from './Hash';
import { TokenDataBothKinds } from './TokenDataBothKinds';
import { TokenDataFungible } from './TokenDataFungible';
import { TokenDataNonFungible } from './TokenDataNonFungible';
import { TokenDataNative } from './wasm/glue';
export type TokenDataInternal = TokenDataFungible | TokenDataNonFungible | TokenDataBothKinds;
export declare class TokenData {
    category?: Hash;
    data?: TokenDataInternal;
    static fromNative(native: TokenDataNative, destroy?: boolean): TokenData;
    constructor(category?: Hash, data?: TokenDataInternal);
    get valid(): boolean;
    get kind(): 'fungible' | 'non_fungible' | 'both' | undefined;
    private tryToNative;
    toNative(): TokenDataNative;
    serializedSize(): number;
    toData(): Uint8Array;
}
export default TokenData;

// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { EncryptedSeed } from './Hash';
import { HdPublic } from './HdPublic';
import { WalletDataNative } from './wasm/glue';
export declare class WalletData {
    mnemonics?: Array<string>;
    encryptedSeed?: EncryptedSeed;
    xpub?: HdPublic;
    static fromNative(native: WalletDataNative, destroy?: boolean): WalletData;
    constructor(mnemonics?: Array<string>, encryptedSeed?: EncryptedSeed, xpub?: HdPublic);
}
export default WalletData;

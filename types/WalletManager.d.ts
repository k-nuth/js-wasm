// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { EncryptedSeed, LongHash } from './Hash';
import { WalletData } from './WalletData';
export declare class WalletManager {
    static createSimple(password: string, normalizedPassphrase?: string): WalletData | undefined;
    static decryptSeed(password: string, encryptedSeed: EncryptedSeed): LongHash | undefined;
}
export default WalletManager;

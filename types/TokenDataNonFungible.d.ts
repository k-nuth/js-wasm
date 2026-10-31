// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { TokenCapability } from './wasm/glue';
export type TokenCapabilityName = 'none' | 'mutable' | 'minting';
export declare function capabilityToNative(value: TokenCapabilityName): TokenCapability;
export declare function capabilityFromNative(value: TokenCapability): TokenCapabilityName;
export declare class TokenDataNonFungible {
    capability: TokenCapabilityName;
    commitment: Uint8Array;
    constructor(capability: TokenCapabilityName, commitment: Uint8Array);
}
export default TokenDataNonFungible;

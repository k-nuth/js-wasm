// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { TokenDataFungible } from './TokenDataFungible';
import { TokenCapabilityName, TokenDataNonFungible } from './TokenDataNonFungible';
export declare class TokenDataBothKinds {
    fungible: TokenDataFungible;
    nonFungible: TokenDataNonFungible;
    constructor(amount: bigint, capability: TokenCapabilityName, commitment: Uint8Array);
}
export default TokenDataBothKinds;

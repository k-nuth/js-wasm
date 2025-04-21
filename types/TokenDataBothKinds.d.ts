import { TokenDataFungible } from './TokenDataFungible';
import { TokenDataNonFungible } from './TokenDataNonFungible';
import { TokenCapability } from './wasm/glue';
export declare class TokenDataBothKinds {
    fungible: TokenDataFungible;
    nonFungible: TokenDataNonFungible;
    constructor(amount: bigint, capability: TokenCapability, commitment: Uint8Array);
}
export default TokenDataBothKinds;

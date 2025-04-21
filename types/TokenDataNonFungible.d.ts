import { TokenCapability } from './wasm/glue';
export declare class TokenDataNonFungible {
    capability: TokenCapability;
    commitment: Uint8Array;
    constructor(capability: TokenCapability, commitment: Uint8Array);
}
export default TokenDataNonFungible;

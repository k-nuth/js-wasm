import { TokenDataNative } from './wasm/glue';
import { Hash } from './Hash';
import { TokenDataFungible } from './TokenDataFungible';
import { TokenDataNonFungible } from './TokenDataNonFungible';
import { TokenDataBothKinds } from './TokenDataBothKinds';
export type TokenDataInternal = TokenDataFungible | TokenDataNonFungible | TokenDataBothKinds;
export declare class TokenData {
    category?: Hash;
    data?: TokenDataInternal;
    static fromNative(native: TokenDataNative, destroy?: boolean): TokenData;
    constructor(category?: Hash, data?: TokenDataInternal);
    get valid(): boolean;
    get kind(): 'fungible' | 'non_fungible' | 'both' | undefined;
    toNative(): TokenDataNative;
    serializedSize(): number;
    toData(): Uint8Array<ArrayBufferLike>;
}
export default TokenData;

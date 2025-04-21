import { WalletDataNative } from './wasm/glue';
import { EncryptedSeed } from './Hash';
import { HdPublic } from './HdPublic';
export declare class WalletData {
    mnemonics?: Array<string>;
    encryptedSeed?: EncryptedSeed;
    xpub?: HdPublic;
    static fromNative(native: WalletDataNative, destroy?: boolean): WalletData;
    constructor(mnemonics?: Array<string>, encryptedSeed?: EncryptedSeed, xpub?: HdPublic);
}
export default WalletData;

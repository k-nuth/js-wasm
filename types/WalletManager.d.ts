import { LongHash } from './Hash';
import { WalletData } from './WalletData';
import { EncryptedSeed } from './Hash';
export declare class WalletManager {
    static createWallet(password: string, normalizedPassphrase?: string): WalletData | undefined;
    static decryptSeed(password: string, encryptedSeed: EncryptedSeed): LongHash | undefined;
}
export default WalletManager;

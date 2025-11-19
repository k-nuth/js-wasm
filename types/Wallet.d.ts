import { PaymentAddress } from './PaymentAddress';
import { EcSecret } from './Secret';
import { EcPublic } from './EcPublic';
import { LongHash } from './Hash';
export declare class Wallet {
    private mnemonic;
    private derivationPath;
    private network;
    private seed;
    private master;
    private lastDerived;
    /**
     * Create a Wallet from a BIP39 mnemonic phrase (recommended factory method)
     * @param mnemonic - Array of BIP39 words (12, 15, 18, 21, or 24 words)
     * @param derivationPath - BIP32/BIP44 derivation path (e.g., "m/44'/145'/0'/0")
     * @param network - Network type: 'MAINNET' or 'TESTNET'
     * @returns New Wallet instance
     * @example
     * const wallet = Wallet.fromMnemonic(
     *   ['word1', 'word2', ...],
     *   "m/44'/145'/0'/0",
     *   'MAINNET'
     * );
     */
    static fromMnemonic(mnemonic: string[], derivationPath: string, network?: string): Wallet;
    /**
     * Create a Wallet from a raw seed (advanced usage)
     * @param seed - 64-byte seed (LongHash/Uint8Array)
     * @param derivationPath - BIP32/BIP44 derivation path
     * @param network - Network type: 'MAINNET' or 'TESTNET'
     * @returns New Wallet instance
     * @example
     * const wallet = Wallet.fromSeed(
     *   new Uint8Array(64),
     *   "m/44'/145'/0'/0",
     *   'MAINNET'
     * );
     */
    static fromSeed(seed: LongHash, derivationPath: string, network?: string): Wallet;
    /**
     * Private constructor - use Wallet.fromMnemonic() or Wallet.fromSeed() factory methods instead
     */
    private constructor();
    private constructor();
    getSecret(index: number): EcSecret;
    getTripleOf(address: PaymentAddress, maxLoops?: number): {
        secret: EcSecret;
        publicKey: EcPublic;
        address: PaymentAddress;
    } | undefined;
    getPublicKey(index: number): EcPublic;
    getPublicKeys(count?: number, from?: number): EcPublic[];
    getAddress(index: number): PaymentAddress;
    getAddresses(count?: number, from?: number): PaymentAddress[];
    getTriple(index: number): {
        secret: EcSecret;
        publicKey: EcPublic;
        address: PaymentAddress;
    };
    deriveAccount(derivationPath: string): Wallet;
}
export default Wallet;

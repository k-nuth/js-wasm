import { LongHashNative } from './wasm/glue';
import { PaymentAddress } from './PaymentAddress';
export declare class Wallet {
    private mnemonic;
    private derivationPath;
    private network;
    seed: LongHashNative;
    private master;
    private lastDerived;
    constructor(mnemonic: string[], derivationPath: string, network?: string);
    get rootKey(): string;
    get extendedPrivateKey(): string;
    get extendedPublicKey(): string;
    getAddress(index: number): PaymentAddress;
    getAddresses(count?: number, from?: number): PaymentAddress[];
    deriveAccount(derivationPath: string): Wallet;
}
export default Wallet;

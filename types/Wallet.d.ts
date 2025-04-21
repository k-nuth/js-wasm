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
    constructor(seed: LongHash, derivationPath: string, network: string);
    constructor(mnemonic: string[], derivationPath: string, network: string);
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

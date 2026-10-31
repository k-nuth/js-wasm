// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { EcPublic } from './EcPublic';
import { LongHash } from './Hash';
import { PaymentAddress } from './PaymentAddress';
import { EcSecret } from './Secret';
export type WalletTriple = {
    secret: EcSecret;
    publicKey: EcPublic;
    address: PaymentAddress;
};
export declare class Wallet {
    private readonly mnemonic;
    private readonly derivationPath;
    private readonly network;
    private readonly seed;
    private master;
    private account;
    constructor(seed: LongHash, derivationPath: string, network: string);
    constructor(mnemonic: string[], derivationPath: string, network: string);
    private static prefixesOf;
    private static addressVersionOf;
    private accountKey;
    dispose(): void;
    getSecret(index: number): EcSecret;
    private publicKeyOf;
    getPublicKey(index: number): EcPublic;
    getPublicKeys(count?: number, from?: number): Array<EcPublic>;
    private addressOf;
    getAddress(index: number): PaymentAddress;
    getAddresses(count?: number, from?: number): Array<PaymentAddress>;
    getTriple(index: number): WalletTriple;
    getTripleOf(address: PaymentAddress, maxLoops?: number): WalletTriple | undefined;
    deriveAccount(derivationPath: string): Wallet;
}
export default Wallet;

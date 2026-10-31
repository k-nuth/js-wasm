// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Hash, ShortHash } from './Hash';
import { Script } from './Script';
import { PaymentAddressNative } from './wasm/glue';
export declare class PaymentAddress {
    private addressStr;
    private tokenAware;
    private legacy;
    static mainnetP2kh: number;
    static mainnetP2sh: number;
    static testnetP2kh: number;
    static testnetP2sh: number;
    static fromNative(native: PaymentAddressNative, destroy?: boolean): PaymentAddress;
    constructor(addressStr: string, tokenAware?: boolean, legacy?: boolean);
    toNative(): PaymentAddressNative;
    static fromHash(hash: Hash, version: number): PaymentAddress | undefined;
    static fromShortHash(hash: ShortHash, version: number): PaymentAddress | undefined;
    private static parse;
    static fromString(addressStr: string): PaymentAddress | undefined;
    static isValid(addressStr: string): boolean;
    static fromScript(script: Script, version: number): PaymentAddress;
    static fromPayPublicKeyHashScript(script: Script, version: number): PaymentAddress;
    get hash20(): ShortHash;
    get hash32(): Hash;
    get hash(): ShortHash;
    get version(): number;
    encoded(): string;
    encodedCashAddr(): string;
    encodedCashTokens(): string;
    encodedLegacy(): string;
    static extract(script: Script, p2khVersion: number, p2shVersion: number): Array<PaymentAddress>;
    static extractInput(script: Script, p2khVersion: number, p2shVersion: number): Array<PaymentAddress>;
    static extractOutput(script: Script, p2khVersion: number, p2shVersion: number): Array<PaymentAddress>;
}
export default PaymentAddress;

import { PaymentAddressNative } from './wasm/glue';
import { Hash, ShortHash } from './Hash';
import { Script } from './Script';
export declare class PaymentAddress {
    private addressStr;
    private tokenAware;
    private legacy;
    static fromNative(native: PaymentAddressNative, destroy?: boolean): PaymentAddress;
    static fromString(addressStr: string): PaymentAddress | undefined;
    static isValid(addressStr: string): boolean;
    constructor(addressStr: string, tokenAware?: boolean, legacy?: boolean);
    static fromScript(script: Script, version: number): PaymentAddress;
    static fromPayKeyHashScript(script: Script, version: number): PaymentAddress;
    toNative(): PaymentAddressNative;
    get hash20(): ShortHash;
    get hash32(): Hash;
    get hash(): ShortHash;
    get version(): number;
    encoded(): string;
    encodedCashAddr(): string;
    encodedCashTokens(): string;
    encodedLegacy(): string;
}
export default PaymentAddress;

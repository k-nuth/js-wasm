import { PaymentAddressNative } from './wasm/glue';
export declare class PaymentAddress {
    private addressStr;
    private tokenAware;
    private legacy;
    static fromNative(native: PaymentAddressNative, destroy?: boolean): PaymentAddress;
    static fromString(addressStr: string): PaymentAddress | undefined;
    static isValid(addressStr: string): boolean;
    constructor(addressStr: string, tokenAware?: boolean, legacy?: boolean);
    toNative(): PaymentAddressNative;
    get hash(): import("./wasm/glue").ShortHashNative;
    get version(): number;
    encoded(): string;
    encodedCashAddr(): string;
    encodedCashTokens(): string;
    encodedLegacy(): string;
}
export default PaymentAddress;

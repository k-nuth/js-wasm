import { EcPublicNative } from './wasm/glue';
import { PaymentAddress } from './PaymentAddress';
import { EcCompressed } from './EcCompressed';
export declare class EcPublic {
    private native;
    constructor(native: EcPublicNative);
    constructor(compressed: EcCompressed, compress: boolean);
    toNative(): EcPublicNative;
    toPaymentAddress(version: number): PaymentAddress;
    get encoded(): string;
    toData(): Uint8Array<ArrayBufferLike>;
}
export default EcPublic;

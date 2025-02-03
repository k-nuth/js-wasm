import { EcPublicNative } from './wasm/glue';
import { PaymentAddress } from './PaymentAddress';
import { EcCompressed } from './EcCompressed';
export declare class EcPublic {
    private native;
    constructor(compressed: EcCompressed, compress: boolean);
    toNative(): EcPublicNative;
    toPaymentAddress(version: number): PaymentAddress;
}
export default EcPublic;

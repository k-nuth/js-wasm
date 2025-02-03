import { PaymentAddressListNative } from './wasm/glue';
import { PaymentAddress } from './PaymentAddress';
export declare class PaymentAddressList {
    static fromNative(native: PaymentAddressListNative): Array<PaymentAddress>;
    static toNative(paymentAddresses: Array<PaymentAddress>): PaymentAddressListNative;
}
export default PaymentAddressList;

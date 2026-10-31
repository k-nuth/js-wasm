// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { PaymentAddress } from './PaymentAddress';
import { PaymentAddressListNative } from './wasm/glue';
export declare const PaymentAddressList: import("./ListHelper").ListAdapter<PaymentAddress, PaymentAddressListNative>;
export default PaymentAddressList;

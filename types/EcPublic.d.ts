// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { EcCompressed } from './EcCompressed';
import { PaymentAddress } from './PaymentAddress';
import { EcPublicNative } from './wasm/glue';
export declare class EcPublic {
    private native;
    constructor(compressed: EcCompressed, compress?: boolean);
    constructor(native: EcPublicNative);
    private live;
    dispose(): void;
    toNative(): EcPublicNative;
    toPaymentAddress(version: number): PaymentAddress;
    get encoded(): string;
    toData(): Uint8Array;
}
export default EcPublic;

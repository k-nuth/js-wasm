// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { EcSecretNative } from './wasm/glue';
import { EcSecret } from './Secret';
export declare class SecretFunctions {
    static nullSecret: EcSecret;
    static fromNative(native: EcSecretNative, destroy?: boolean): EcSecret;
    static toNative(secret: EcSecret): EcSecretNative;
}
export default SecretFunctions;

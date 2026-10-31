// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { EcCompressed } from './EcCompressed';
import { EcSecret } from './Secret';
import { EcSecretNative } from './wasm/glue';
export declare class EllipticCurve {
    static secretToPublic(secret: EcSecretNative | EcSecret): EcCompressed | undefined;
}
export default EllipticCurve;

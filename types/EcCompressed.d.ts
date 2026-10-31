// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { EcCompressedNative } from './wasm/glue';
export declare const EC_COMPRESSED_SIZE = 33;
export declare class EcCompressed {
    readonly bytes: Uint8Array;
    constructor(bytes: Uint8Array);
    static fromNative(native: EcCompressedNative): EcCompressed;
}
export default EcCompressed;

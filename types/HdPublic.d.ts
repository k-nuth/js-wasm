// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { EcCompressed } from './EcCompressed';
import { HdPublicNative } from './wasm/glue';
export declare class HdPublic {
    private native;
    constructor(native: HdPublicNative);
    private live;
    dispose(): void;
    toNative(): HdPublicNative;
    static fromString(encoded: string): HdPublic | undefined;
    static isValid(encoded: string): boolean;
    derivePublic(index: number): HdPublic;
    get encoded(): string;
    get point(): EcCompressed;
}
export default HdPublic;

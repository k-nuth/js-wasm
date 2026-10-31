// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { U64ListNative } from './wasm/glue';
export declare const U64List: import("./ListHelper").ListAdapter<bigint, U64ListNative>;
export default U64List;

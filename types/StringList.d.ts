// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { StringListNative } from './wasm/glue';
export declare const StringList: import("./ListHelper").ListAdapter<string, StringListNative>;
export default StringList;

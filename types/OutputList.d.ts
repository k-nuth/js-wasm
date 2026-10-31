// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Output } from './Output';
import { OutputListNative } from './wasm/glue';
export declare const OutputList: import("./ListHelper").ListAdapter<Output, OutputListNative>;
export default OutputList;

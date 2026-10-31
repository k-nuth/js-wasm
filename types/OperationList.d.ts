// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Operation } from './Operation';
import { OperationListNative } from './wasm/glue';
export declare const OperationList: import("./ListHelper").ListAdapter<Operation, OperationListNative>;
export default OperationList;

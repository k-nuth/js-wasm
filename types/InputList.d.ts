// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Input } from './Input';
import { InputListNative } from './wasm/glue';
export declare const InputList: import("./ListHelper").ListAdapter<Input, InputListNative>;
export default InputList;

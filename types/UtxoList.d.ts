// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Utxo } from './Utxo';
import { UtxoListNative } from './wasm/glue';
export declare const UtxoList: import("./ListHelper").ListAdapter<Utxo, UtxoListNative>;
export default UtxoList;

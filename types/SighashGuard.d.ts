// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import type { Transaction } from './Transaction';
export type SighashRefusal = {
    success: false;
    errorCode: number;
};
export declare function refuseSighashUtxos(tx: Transaction, sighashType: number, activeFlags: bigint): SighashRefusal | undefined;

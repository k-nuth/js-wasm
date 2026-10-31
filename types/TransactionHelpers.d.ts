// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Transaction } from './Transaction';
export declare function cloneTransaction(transaction: Transaction): Transaction | undefined;
/**
 * Validate that a wallet response only changed input unlocking scripts.
 *
 * Wallets are allowed to populate each input script while signing, but they
 * must not change the transaction version, locktime, input outpoints,
 * sequences, outputs, BCH amounts, locking bytecode, or token data.
 */
export declare function hasSameSigningStructure(template: Transaction, signed: Transaction): boolean;

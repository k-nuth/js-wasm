// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { Hash } from './Hash';
export declare function bytesToHexStr(bytes: Uint8Array): string;
export declare function hexStrToBytes(hex: string): Uint8Array;
export declare function encodeHash(bytes: Hash): string;
export declare function decodeHash(hex: string): Hash;

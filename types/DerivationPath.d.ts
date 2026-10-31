// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export declare const HARDENED_OFFSET = 2147483648;
export declare function parseDerivationPath(path: string): Array<number>;
export declare function indexRange(count: number, from: number): Array<number>;
export declare function findFirst<T>(limit: number, probe: (index: number) => T | undefined): T | undefined;

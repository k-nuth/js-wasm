// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export declare function clearStack(): void;
/** Reject anything that cannot be passed as a C string: non-strings and text with an embedded NUL (it would be truncated silently). */
export declare function checkCString(value: string, name?: string): void;
export declare function allocateUTF8String(value: string): number;

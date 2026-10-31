// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

export declare function UTF8ToString(ptr: number, size?: number): string;
/** Copy a malloc-owned C string into JavaScript and release the native buffer. */
export declare function consumeUTF8String(ptr: number, size?: number): string;
/**
 * Copy a native C string into JavaScript, then release it with the C function
 * the API documents for it (e.g. `kth_core_destruct_string`). A null pointer
 * yields an empty string and nothing is released. The release runs even when
 * decoding throws.
 */
export declare function takeUTF8String(ptr: number, release: (ptr: number) => void): string;
export declare function StringToUTF8(str: string, ptr: number, maxSize: number): number;

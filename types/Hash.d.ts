// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { HashNative, ShortHashNative, EncryptedSeedNative, LongHashNative } from './wasm/glue';
export type Hash = Uint8Array & {
    length: 32;
};
export type ShortHash = Uint8Array & {
    length: 20;
};
export type LongHash = Uint8Array & {
    length: 64;
};
export type EncryptedSeed = Uint8Array & {
    length: 96;
};
export declare class HashFunctions {
    static nullHash: Hash;
    static nullShortHash: ShortHash;
    static nullLongHash: LongHash;
    static nullEncryptedSeed: EncryptedSeed;
    static fromNative(native: HashNative, destroy: boolean): Hash;
    static fromNative(native: ShortHashNative, destroy: boolean): ShortHash;
    static fromNative(native: LongHashNative, destroy: boolean): LongHash;
    static fromNative(native: EncryptedSeedNative, destroy: boolean): EncryptedSeed;
    static toNative(hash: Hash): HashNative;
    static toNative(hash: ShortHash): ShortHashNative;
    static toNative(hash: LongHash): LongHashNative;
    static toNative(hash: EncryptedSeed): EncryptedSeedNative;
    static encryptedSeedtoNative(hash: Uint8Array): EncryptedSeedNative;
    static sha256(data: Uint8Array): Hash;
    static sha256Reversed(data: Uint8Array): Hash;
    static sha256ReversedStr(data: Uint8Array): string;
    static ripemd160(data: Uint8Array): ShortHash;
}
export default HashFunctions;

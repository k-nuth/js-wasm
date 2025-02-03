import { HashNative, ShortHashNative } from './wasm/glue';
export type Hash = Uint8Array & {
    length: 32;
};
export type ShortHash = Uint8Array & {
    length: 20;
};
export type LongHash = Uint8Array & {
    length: 64;
};
export declare class HashFunctions {
    static nullHash: Hash;
    static nullShortHash: ShortHash;
    static fromNative(native: HashNative, destroy: boolean): Hash;
    static fromNative(native: ShortHashNative, destroy: boolean): ShortHash;
    static toNative(hash: Hash): HashNative;
    static toNative(hash: ShortHash): ShortHashNative;
    static sha256(data: Uint8Array): Hash;
    static sha256Reversed(data: Uint8Array): Hash;
    static sha256ReversedStr(data: Uint8Array): string;
}
export default HashFunctions;

import { Hash } from './Hash';
export declare function bytesToHexStr(bytes: Uint8Array): string;
export declare function hexStrToBytes(hex: string): Uint8Array;
export declare function encodeHash(bytes: Hash): string;
export declare function decodeHash(hex: string): Hash;

// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

declare const custom_malloc_sym: unique symbol;
type AnyTypedArrayConstructor = Int8ArrayConstructor | Uint8ArrayConstructor | Uint8ClampedArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor;
interface CustomAllocatedArray {
    [custom_malloc_sym]: true;
    ptr: number;
}
declare function buffer(): ArrayBufferLike;
declare function malloc<T extends AnyTypedArrayConstructor>(arrayClass: T, len: number): InstanceType<T> & CustomAllocatedArray;
declare function free(objOrPtr: any): void;
declare function readUint32(ptr: number): number;
declare function setUint8Array(encoded: Uint8Array, encodedPtr: number): void;
declare function subarray(ptr: number, size: number): Uint8Array<ArrayBufferLike>;
/** Copy a malloc-owned native byte buffer and release it. */
declare function copyAndFreeByteArray(ptr: number, size: number): Uint8Array<ArrayBuffer>;
/** Allocate a zero-filled 4-byte slot for a native out parameter (size_t / pointer / status on wasm32). */
declare function allocZeroedSlot(): number;
/**
 * Copy an owned native byte buffer into a fresh Uint8Array and release it with
 * the C function the API documents for it (or only copy it when `release` is omitted). The size slot is read and freed and
 * the native buffer released on every path, including errors.
 */
declare function takeByteArray(ptr: number, sizePtr: number, release?: (ptr: number) => void): Uint8Array<ArrayBuffer>;
/** An input byte array must be a non-null Uint8Array (checked before any buffer is allocated). */
declare function checkBytes(value: Uint8Array, name: string): void;
/** A fixed-size value struct passed as bytes: exactly `size` bytes, because the C function takes no length. */
declare function checkFixedBytes(value: Uint8Array, name: string, size: number): void;
/** Copy `size` bytes out of native memory. */
declare function readBytes(ptr: number, size: number): Uint8Array;
/**
 * Allocate a native buffer for an input byte array. An empty array still gets a valid 1-byte buffer
 * (the C API receives a real pointer with length 0), and allocation failure throws here, before anything
 * is copied to address 0 or the FFI is entered.
 */
declare function allocBytesBuffer(length: number): number;
/** An 8/16/32-bit integer parameter wraps (or truncates a fraction) silently in the ABI: refuse values outside its range. */
declare function checkInt(value: number, name: string, min: number, max: number): void;
/** A wasm i64 parameter wraps modulo 2^64: reject anything outside the unsigned 64-bit range instead. */
declare function checkU64(value: bigint, name: string): void;
/** Signed counterpart of checkU64. */
declare function checkI64(value: bigint, name: string): void;
export { checkInt, checkBytes, checkFixedBytes, readBytes, allocBytesBuffer, checkU64, checkI64, malloc, free, buffer, copyAndFreeByteArray, readUint32, setUint8Array, subarray, allocZeroedSlot, takeByteArray };

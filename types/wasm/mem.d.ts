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
export { malloc, free, buffer, readUint32, setUint8Array, subarray };

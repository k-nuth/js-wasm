export type OnlyAttributes<T extends object> = WithoutValueType<WithoutKeyType<T, Symbol>, Function>;
export type WithoutKeyType<T extends object, KT> = {
    [P in keyof T as P extends KT ? never : P]: T[P];
};
export type WithoutValueType<T extends object, VT> = {
    [P in keyof T as T[P] extends VT ? never : P]: T[P];
};
type CommonKeysAndTypes<A, B> = {
    [K in keyof A & keyof B]: A[K] extends B[K] ? K : never;
}[keyof A & keyof B];
type NotCommonKeysAndTypes<A, B> = Exclude<keyof A, CommonKeysAndTypes<A, B>>;
export type AnyTypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export type ObjectCommonKeysAndTypes<A, B> = {
    [K in CommonKeysAndTypes<A, B>]: A[K];
};
export type ObjectNotCommonKeysAndTypes<A, B> = {
    [K in NotCommonKeysAndTypes<A, B>]: A[K];
};
export interface Segment {
    mode: 'VALUES' | 'RANGE' | 'EVERYTHING' | 'SELECTION';
    column?: string | null;
    values?: Array<number> | Array<string> | null;
    range?: [number, number] | [string, string] | null;
}
export {};

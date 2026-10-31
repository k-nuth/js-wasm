// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { ListNative } from './ListNative';
export declare function fromNative<T, N, L extends ListNative<N>>(nativeList: L, fromNativeFunc: (nativeItem: N) => T): Array<T>;
export declare function toNative<T, N, L extends ListNative<N>>(items: Array<T>, toNativeFunc: (item: T) => N, NativeConstructor: new () => L): L;
export declare function toNativeCopied<T, N, L extends ListNative<N>>(items: Array<T>, toNativeFunc: (item: T) => N, NativeConstructor: new () => L): L;
export declare function fromNativePrimitive<T, L extends ListNative<T>>(nativeList: L): Array<T>;
export declare function toNativePrimitive<T, L extends ListNative<T>>(items: Array<T>, NativeConstructor: new () => L): L;
export interface ListAdapter<T, L> {
    fromNative(native: L, destroy?: boolean): T[];
    toNative(items: T[]): L;
}
export declare function definePrimitiveList<T, L extends ListNative<T>>(NativeConstructor: new () => L): ListAdapter<T, L>;
export declare function defineCopiedList<T, N, L extends ListNative<N>>(NativeConstructor: new () => L, readElement: (native: N) => T, writeElement: (item: T) => N): ListAdapter<T, L>;
export declare function defineBorrowedList<T, N, L extends ListNative<N>>(NativeConstructor: new () => L, readElement: (native: N) => T, writeElement: (item: T) => N): ListAdapter<T, L>;

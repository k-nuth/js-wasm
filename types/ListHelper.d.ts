import { ListNative } from './ListNative';
export declare function fromNative<T, N, L extends ListNative<N>>(nativeList: L, fromNativeFunc: (nativeItem: N) => T): Array<T>;
export declare function toNative<T, N, L extends ListNative<N>>(items: Array<T>, toNativeFunc: (item: T) => N, NativeConstructor: new () => L): L;
export declare function fromNativePrimitive<T, L extends ListNative<T>>(nativeList: L): Array<T>;
export declare function toNativePrimitive<T, L extends ListNative<T>>(items: Array<T>, NativeConstructor: new () => L): L;

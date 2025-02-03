import { U32ListNative } from './wasm/glue';
export declare class U32List {
    static fromNative(native: U32ListNative): Array<number>;
    static toNative(numbers: Array<number>): U32ListNative;
}
export default U32List;

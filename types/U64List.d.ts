import { U64ListNative } from './wasm/glue';
export declare class U64List {
    static fromNative(native: U64ListNative): Array<bigint>;
    static toNative(numbers: Array<bigint>): U64ListNative;
}
export default U64List;

import { DoubleListNative } from './wasm/glue';
export declare class DoubleList {
    static fromNative(native: DoubleListNative): Array<number>;
    static toNative(numbers: Array<number>): DoubleListNative;
}
export default DoubleList;

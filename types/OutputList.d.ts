import { OutputListNative } from './wasm/glue';
import { Output } from './Output';
export declare class OutputList {
    static fromNative(native: OutputListNative): Array<Output>;
    static toNative(operations: Array<Output>): OutputListNative;
}
export default OutputList;

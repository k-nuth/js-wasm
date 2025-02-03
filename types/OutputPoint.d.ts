import { OutputPointNative } from './wasm/glue';
import { Hash } from './Hash';
import Output from './Output';
export declare class OutputPoint {
    hash?: Hash;
    index?: number;
    cachedOutput?: Output;
    static fromNative(native: OutputPointNative, destroy?: boolean): OutputPoint;
    static isValid(hash: Hash, index: number): boolean;
    constructor(hash?: Hash, index?: number);
    get valid(): boolean;
    toNative(): OutputPointNative;
}
export default OutputPoint;

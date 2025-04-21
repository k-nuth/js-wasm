import { StringListNative } from './wasm/glue';
export declare class StringList {
    static fromNative(native: StringListNative): Array<string>;
    static toNative(strings: Array<string>): StringListNative;
}
export default StringList;

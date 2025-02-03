import { InputListNative } from './wasm/glue';
import { Input } from './Input';
export declare class InputList {
    static fromNative(native: InputListNative): Array<Input>;
    static toNative(inputs: Array<Input>): InputListNative;
}
export default InputList;

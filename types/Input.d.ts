import { InputNative } from './wasm/glue';
import { Script } from './Script';
import { OutputPoint } from './OutputPoint';
export declare class Input {
    previousOutput?: OutputPoint;
    script?: Script;
    seq?: number;
    static fromNative(native: InputNative, destroy?: boolean): Input;
    static fromData(data: Uint8Array): Input | undefined;
    static isValid(previousOutput: OutputPoint, script: Script, seq: number): boolean;
    constructor(previousOutput?: OutputPoint, script?: Script, seq?: number);
    get valid(): boolean;
    toNative(): InputNative;
    serializedSize(wire: boolean): number;
    toData(wire: boolean): Uint8Array<ArrayBufferLike>;
}
export default Input;

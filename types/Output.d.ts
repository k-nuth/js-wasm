import { OutputNative } from './wasm/glue';
import { Script } from './Script';
export declare class Output {
    value?: bigint;
    script?: Script;
    static fromNative(native: OutputNative, destroy?: boolean): Output;
    static fromData(data: Uint8Array): Output | undefined;
    static isValid(value: bigint, script: Script): boolean;
    private static validU64Int;
    constructor(value?: bigint, script?: Script);
    get valid(): boolean;
    toNative(): OutputNative;
    serializedSize(wire: boolean): number;
    toData(wire: boolean): Uint8Array<ArrayBufferLike>;
}
export default Output;

import { ProgramNative } from './wasm/glue';
import { Script } from './Script';
import { Transaction } from './Transaction';
export declare class Program {
    private native;
    constructor(native: ProgramNative);
    constructor(script?: Script, programOrTransaction?: Program | Transaction, inputIndex?: number, forks?: number);
    toNative(): ProgramNative;
    get valid(): boolean;
    evaluate(): number;
    stackResult(clean: boolean): boolean;
    get size(): number;
    item(index: number): Uint8Array;
}
export default Program;

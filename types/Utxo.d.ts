import { UtxoNative } from './wasm/glue';
import { Hash } from './Hash';
import Output from './Output';
export declare class Utxo {
    hash?: Hash;
    index?: number;
    amount?: bigint;
    cachedOutput?: Output;
    static fromNative(native: UtxoNative, destroy?: boolean): Utxo;
    static isValid(hash: Hash, index: number, amount: bigint): boolean;
    constructor(hash?: Hash, index?: number, amount?: bigint);
    get valid(): boolean;
    toNative(): UtxoNative;
}
export default Utxo;

import { UtxoListNative } from './wasm/glue';
import { Utxo } from './Utxo';
export declare class UtxoList {
    static fromNative(native: UtxoListNative): Array<Utxo>;
    static toNative(utxos: Array<Utxo>): UtxoListNative;
}
export default UtxoList;

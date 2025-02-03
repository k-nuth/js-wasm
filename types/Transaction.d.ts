import { TransactionNative, CoinSelectionAlgorithm } from './wasm/glue';
import { Hash } from './Hash';
import { Input } from './Input';
import { Output } from './Output';
import { PaymentAddress } from './PaymentAddress';
import { Utxo } from './Utxo';
export declare class Transaction {
    version?: number;
    locktime?: number;
    inputs?: Array<Input>;
    outputs?: Array<Output>;
    static fromNative(native: TransactionNative, destroy?: boolean): Transaction;
    static fromData(version: number, data: Uint8Array): Transaction | undefined;
    static isValid(version: number, data: Uint8Array): boolean;
    constructor(version?: number, locktime?: number, inputs?: Array<Input>, outputs?: Array<Output>);
    get valid(): boolean;
    toNative(): TransactionNative;
    serializedSize(wire: boolean): number;
    toData(wire: boolean): Uint8Array<ArrayBufferLike>;
    get hash(): Hash;
    get isCoinbase(): boolean;
    get totalInputValue(): bigint;
    get totalOutputValue(): bigint;
    get fees(): bigint;
    isMature(targetHeight: number): boolean;
    static createTemplateWithChangeRatios(availableUtxos: Array<Utxo>, amountToSend: bigint, destinationAddress: PaymentAddress, changeAddresses: Array<PaymentAddress>, changeRatios: Array<number>, selectionAlgo: CoinSelectionAlgorithm): [number, Transaction | undefined, Array<number> | undefined, Array<PaymentAddress> | undefined, Array<bigint> | undefined];
    static createTemplate(availableUtxos: Array<Utxo>, amountToSend: bigint, destinationAddress: PaymentAddress, changeAddresses: Array<PaymentAddress>, selectionAlgo: CoinSelectionAlgorithm): [number, Transaction | undefined, Array<number> | undefined, Array<PaymentAddress> | undefined, Array<bigint> | undefined];
}
export default Transaction;

import { OperationListNative } from './wasm/glue';
import { Operation } from './Operation';
export declare class OperationList {
    static fromNative(native: OperationListNative): Array<Operation>;
    static toNative(operations: Array<Operation>): OperationListNative;
}
export default OperationList;

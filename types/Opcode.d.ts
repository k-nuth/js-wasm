import { OpcodeEnumNative } from './wasm/glue';
export declare class Opcode {
    static toInt(value: OpcodeEnumNative): number;
    static toString(value: OpcodeEnumNative, activeForks: number): string;
    static fromString(value: string): OpcodeEnumNative | undefined;
    static toHexadecimal(code: OpcodeEnumNative): string;
    static fromHexadecimal(value: string): OpcodeEnumNative | undefined;
}
export default Opcode;

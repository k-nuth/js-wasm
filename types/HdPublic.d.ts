import { HdPublicNative } from './wasm/glue';
import { EcCompressed } from './EcCompressed';
export declare class HdPublic {
    private native;
    static fromString(encoded: string): HdPublic | undefined;
    static isValid(encoded: string): boolean;
    constructor(native: HdPublicNative);
    toNative(): HdPublicNative;
    derivePublic(index: number): HdPublic;
    get encoded(): string;
    get point(): EcCompressed;
}
export default HdPublic;

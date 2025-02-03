import { EcCompressedNative } from './wasm/glue';
export declare class EcCompressed {
    private native;
    constructor(native: EcCompressedNative);
    toNative(): EcCompressedNative;
}
export default EcCompressed;

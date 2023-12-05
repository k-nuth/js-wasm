import { EcCompressedNative, EcSecretNative } from './wasm/glue';
export declare class EllipticCurve {
    static secretToPublic(secret: EcSecretNative): EcCompressedNative | undefined;
}
export default EllipticCurve;

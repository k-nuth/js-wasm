import { EcSecretNative } from './wasm/glue';
import { EcSecret } from './Secret';
export declare class SecretFunctions {
    static nullSecret: EcSecret;
    static fromNative(native: EcSecretNative, destroy?: boolean): EcSecret;
    static toNative(secret: EcSecret): EcSecretNative;
}
export default SecretFunctions;

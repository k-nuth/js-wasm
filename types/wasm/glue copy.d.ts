declare const ptrSym: unique symbol;
declare const _CurrencyIntToKey: readonly ["bitcoin", "bitcoin_cash", "litecoin"];
export declare type Currency = (typeof _CurrencyIntToKey)[number];
declare const _LogLibraryIntToKey: readonly ["boost", "spdlog", "binlog"];
export declare type LogLibrary = (typeof _LogLibraryIntToKey)[number];
export declare class LibConfigTypeSizes {
    private readonly [ptrSym];
    static _create(ptr: number): LibConfigTypeSizes;
    get size_int(): number;
    get size_long(): number;
    get size_pointer(): number;
    protected _destructor(): void;
}
export declare class LibConfig {
    private readonly [ptrSym];
    static _create(ptr: number): LibConfig;
    get log_library(): LogLibrary;
    get use_libmdbx(): boolean;
    get version(): string;
    get microarchitecture_id(): string;
    get currency(): Currency;
    get mempool(): boolean;
    get db_readonly(): boolean;
    get debug_mode(): boolean;
    get architecture(): string;
    get os_name(): string;
    get compiler_name(): string;
    get compiler_version(): string;
    get optimization_level(): string;
    get build_timestamp(): number;
    get endianness(): string;
    get type_sizes(): LibConfigTypeSizes;
    protected _destructor(): void;
    static getLibconfig(): LibConfig;
    static getEmscriptenVersionMajor(): number;
    static getEmscriptenVersionMinor(): number;
    static getEmscriptenVersionTiny(): number;
    static getBuildTimestamp(): number;
}
export declare class StringListNative {
    private readonly [ptrSym];
    static _create(ptr: number): StringListNative;
    protected _destructor(): void;
    constructor();
    pushBack(string: string): void;
}
export declare class ShortHashNative {
    private readonly [ptrSym];
    static _create(ptr: number): ShortHashNative;
    get hash(): number;
    protected _destructor(): void;
}
export declare class HashNative {
    private readonly [ptrSym];
    static _create(ptr: number): HashNative;
    get hash(): number;
    protected _destructor(): void;
}
export declare class LongHashNative {
    private readonly [ptrSym];
    static _create(ptr: number): LongHashNative;
    get hash(): number;
    protected _destructor(): void;
}
export declare class HdChainCodeNative {
    private readonly [ptrSym];
    static _create(ptr: number): HdChainCodeNative;
    get data(): number;
    protected _destructor(): void;
}
export declare class HdKeyNative {
    private readonly [ptrSym];
    static _create(ptr: number): HdKeyNative;
    get data(): number;
    protected _destructor(): void;
}
export declare class EcCompressedNative {
    private readonly [ptrSym];
    static _create(ptr: number): EcCompressedNative;
    get data(): number;
    protected _destructor(): void;
}
export declare class EcUncompressedNative {
    private readonly [ptrSym];
    static _create(ptr: number): EcUncompressedNative;
    get data(): number;
    protected _destructor(): void;
}
export declare class EcSecretNative {
    private readonly [ptrSym];
    static _create(ptr: number): EcSecretNative;
    get hash(): number;
    protected _destructor(): void;
}
export declare class WifUncompressedNative {
    private readonly [ptrSym];
    static _create(ptr: number): WifUncompressedNative;
    get data(): number;
    protected _destructor(): void;
}
export declare class WifCompressedNative {
    private readonly [ptrSym];
    static _create(ptr: number): WifCompressedNative;
    get data(): number;
    protected _destructor(): void;
}
export declare class HdLineageNative {
    private readonly [ptrSym];
    static _create(ptr: number): HdLineageNative;
    get prefixes(): bigint;
    get depth(): number;
    get parent_fingerprint(): number;
    get child_number(): number;
    protected _destructor(): void;
}
export declare class EllipticCurveNative {
    static secretToPublic(out: EcCompressedNative, secret: EcSecretNative): boolean;
}
export declare class HdPublicNative {
    private readonly [ptrSym];
    static _create(ptr: number): HdPublicNative;
    protected _destructor(): void;
    constructor();
    isValid(): boolean;
    encoded(): string;
    chainCode(): HdChainCodeNative;
    lineage(): HdLineageNative;
    point(): EcCompressedNative;
    toHdKey(): HdKeyNative;
    derivePublic(index: number): HdPublicNative;
}
export declare class HdPrivateNative {
    private readonly [ptrSym];
    static _create(ptr: number): HdPrivateNative;
    protected _destructor(): void;
    constructor();
    constructor(encoded: string);
    constructor(seed: number, size: number, prefixes: bigint);
    isValid(): boolean;
    encoded(): string;
    secret(): EcSecretNative;
    chainCode(): HdChainCodeNative;
    lineage(): HdLineageNative;
    point(): EcCompressedNative;
    toHdKeyNative(): HdKeyNative;
    toPublic(): HdPublicNative;
    derivePrivate(index: number): HdPrivateNative;
    derivePublic(index: number): HdPublicNative;
}
export declare class PaymentAddressNative {
    private readonly [ptrSym];
    static _create(ptr: number): PaymentAddressNative;
    protected _destructor(): void;
    constructor(address: string);
    constructor(hash: ShortHashNative, version: number);
    encodedLegacy(): string;
    encodedCashaddr(tokenAware: boolean): string;
    hash20(): ShortHashNative;
    hash32(): HashNative;
    version(): number;
    isValid(): boolean;
}
export declare class EcPrivateNative {
    private readonly [ptrSym];
    static _create(ptr: number): EcPrivateNative;
    protected _destructor(): void;
    constructor();
    constructor(wif: string, version: number);
    constructor(wif: WifCompressedNative, version: number);
    constructor(wif: WifUncompressedNative, version: number);
    constructor(secret: EcSecretNative, version: number, compress: boolean);
    isValid(): boolean;
    encoded(): string;
    secret(): EcSecretNative;
    version(): number;
    paymentVersion(): number;
    wifVersion(): number;
    compressed(): boolean;
    toPublic(): EcPublicNative;
    toPaymentAddress(): PaymentAddressNative;
}
export declare class EcPublicNative {
    private readonly [ptrSym];
    static _create(ptr: number): EcPublicNative;
    protected _destructor(): void;
    constructor();
    constructor(base16: string);
    constructor(secret: EcPrivateNative);
    constructor(point: EcCompressedNative, compress: boolean);
    isValid(): boolean;
    encoded(): string;
    point(): EcCompressedNative;
    compressed(): boolean;
    toUncompressed(outData: EcUncompressedNative): boolean;
    toPaymentAddress(version: number): PaymentAddressNative;
}
export declare class WalletNative {
    static mnemonicsToSeed(mnemonics: StringListNative): LongHashNative;
    static hdNew(seed: LongHashNative, version: number): HdPrivateNative;
    static hdPrivateToEc(key: HdPrivateNative): EcSecretNative;
    static ecToPublic(secret: EcSecretNative, uncompressed: boolean): EcPublicNative;
    static ecToAddress(point: EcPublicNative, version: number): PaymentAddressNative;
}
export declare class NodeInfoNative {
    static printThreadId(): void;
    static getThreadId(): bigint;
    static capiVersion(): string;
    static cppapiVersion(): string;
    static microarchitecture(): string;
    static marchNames(): string;
    static currencySymbol(): string;
    static currency(): string;
    static cppapiBuildTimestamp(): number;
}
export declare class ScriptNative {
    private readonly [ptrSym];
    static _create(ptr: number): ScriptNative;
    protected _destructor(): void;
    constructor();
    constructor(encoded: Uint8Array, prefix: boolean);
    isValid(): boolean;
    isValidOperations(): boolean;
    satoshiContentSize(): number;
    serializedSize(prefix: boolean): number;
    toStr(activeForks: number): string;
    type(): string;
    toData(prefix: boolean): Uint8Array;
    sigops(embedded: boolean): number;
}
export {};

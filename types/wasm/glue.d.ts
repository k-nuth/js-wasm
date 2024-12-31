declare const ptrSym: unique symbol;
declare const _CurrencyIntToKey: readonly ["bitcoin", "bitcoin_cash", "litecoin"];
export declare type Currency = (typeof _CurrencyIntToKey)[number];
export declare function CurrencyToInt(value: Currency): number;
declare const _LogLibraryIntToKey: readonly ["boost", "spdlog", "binlog"];
export declare type LogLibrary = (typeof _LogLibraryIntToKey)[number];
export declare function LogLibraryToInt(value: LogLibrary): number;
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
    get build_git_hash(): string;
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
declare const _OpcodeEnumNativeIntToKey: readonly ["push_size_0", "push_size_1", "push_size_2", "push_size_3", "push_size_4", "push_size_5", "push_size_6", "push_size_7", "push_size_8", "push_size_9", "push_size_10", "push_size_11", "push_size_12", "push_size_13", "push_size_14", "push_size_15", "push_size_16", "push_size_17", "push_size_18", "push_size_19", "push_size_20", "push_size_21", "push_size_22", "push_size_23", "push_size_24", "push_size_25", "push_size_26", "push_size_27", "push_size_28", "push_size_29", "push_size_30", "push_size_31", "push_size_32", "push_size_33", "push_size_34", "push_size_35", "push_size_36", "push_size_37", "push_size_38", "push_size_39", "push_size_40", "push_size_41", "push_size_42", "push_size_43", "push_size_44", "push_size_45", "push_size_46", "push_size_47", "push_size_48", "push_size_49", "push_size_50", "push_size_51", "push_size_52", "push_size_53", "push_size_54", "push_size_55", "push_size_56", "push_size_57", "push_size_58", "push_size_59", "push_size_60", "push_size_61", "push_size_62", "push_size_63", "push_size_64", "push_size_65", "push_size_66", "push_size_67", "push_size_68", "push_size_69", "push_size_70", "push_size_71", "push_size_72", "push_size_73", "push_size_74", "push_size_75", "push_one_size", "push_two_size", "push_four_size", "push_negative_1", "reserved_80", "push_positive_1", "push_positive_2", "push_positive_3", "push_positive_4", "push_positive_5", "push_positive_6", "push_positive_7", "push_positive_8", "push_positive_9", "push_positive_10", "push_positive_11", "push_positive_12", "push_positive_13", "push_positive_14", "push_positive_15", "push_positive_16", "nop", "reserved_98", "if_", "notif", "disabled_verif", "disabled_vernotif", "else_", "endif", "verify", "return_", "toaltstack", "fromaltstack", "drop2", "dup2", "dup3", "over2", "rot2", "swap2", "ifdup", "depth", "drop", "dup", "nip", "over", "pick", "roll", "rot", "swap", "tuck", "disabled_cat", "disabled_substr", "disabled_left", "disabled_right", "size", "disabled_invert", "disabled_and", "disabled_or", "disabled_xor", "equal", "equalverify", "reserved_137", "reserved_138", "add1", "sub1", "disabled_mul2", "disabled_div2", "negate", "abs", "not_", "nonzero", "add", "sub", "disabled_mul", "disabled_div", "disabled_mod", "disabled_lshift", "disabled_rshift", "booland", "boolor", "numequal", "numequalverify", "numnotequal", "lessthan", "greaterthan", "lessthanorequal", "greaterthanorequal", "min", "max", "within", "ripemd160", "sha1", "sha256", "hash160", "hash256", "codeseparator", "checksig", "checksigverify", "checkmultisig", "checkmultisigverify", "nop1", "nop2", "checklocktimeverify", "nop3", "checksequenceverify", "nop4", "nop5", "nop6", "nop7", "nop8", "nop9", "nop10", "checkdatasig", "checkdatasigverify", "reversebytes", "inputindex", "activebytecode", "txversion", "txinputcount", "txoutputcount", "txlocktime", "utxovalue", "utxobytecode", "outpointtxhash", "outpointindex", "inputbytecode", "inputsequencenumber", "outputvalue", "outputbytecode", "utxotokencategory", "utxotokencommitment", "utxotokenamount", "outputtokencategory", "outputtokencommitment", "outputtokenamount", "reserved3", "reserved4", "first_undefined_op_value", "special_token_prefix", "invalidopcode", "reserved_186", "reserved_187", "reserved_188", "reserved_189", "reserved_190", "reserved_191", "reserved_192", "reserved_193", "reserved_194", "reserved_195", "reserved_196", "reserved_197", "reserved_198", "reserved_199", "reserved_200", "reserved_201", "reserved_202", "reserved_203", "reserved_204", "reserved_205", "reserved_206", "reserved_207", "reserved_208", "reserved_209", "reserved_210", "reserved_211", "reserved_212", "reserved_213", "reserved_214", "reserved_215", "reserved_216", "reserved_217", "reserved_218", "reserved_219", "reserved_220", "reserved_221", "reserved_222", "reserved_223", "reserved_224", "reserved_225", "reserved_226", "reserved_227", "reserved_228", "reserved_229", "reserved_230", "reserved_231", "reserved_232", "reserved_233", "reserved_234", "reserved_235", "reserved_236", "reserved_237", "reserved_238", "reserved_239", "reserved_240", "reserved_241", "reserved_242", "reserved_243", "reserved_244", "reserved_245", "reserved_246", "reserved_247", "reserved_248", "reserved_249", "reserved_250", "reserved_251", "reserved_252", "reserved_253", "reserved_254", "reserved_255"];
export declare type OpcodeEnumNative = (typeof _OpcodeEnumNativeIntToKey)[number];
export declare function OpcodeEnumNativeToInt(value: OpcodeEnumNative): number;
export declare class OpcodeNative {
    static to_string(value: OpcodeEnumNative, active_forks: number): string;
    static from_string(value: string): [boolean, OpcodeEnumNative];
    static to_hexadecimal(code: OpcodeEnumNative): string;
    static from_hexadecimal(value: string): [boolean, OpcodeEnumNative];
}
export declare class OperationNative {
    private readonly [ptrSym];
    static _create(ptr: number): OperationNative;
    protected _destructor(): void;
    constructor();
    constructor(opcode: OpcodeEnumNative);
    constructor(encoded: Uint8Array, minimal: boolean);
    toStr(activeForks: number): string;
    toData(): Uint8Array;
    fromData(encoded: Uint8Array): boolean;
    fromStr(str: string): boolean;
    isValid(): boolean;
    serializedSize(): number;
    code(): OpcodeEnumNative;
    data(): Uint8Array;
    isPush(): boolean;
    isCounted(): boolean;
    isVersion(): boolean;
    isPositive(): boolean;
    isDisabled(): boolean;
    isConditional(): boolean;
    isRelaxedPush(): boolean;
    isOversized(): boolean;
    isMinimalPush(): boolean;
    isNominalPush(): boolean;
    static opcodeFromSize(size: number): OpcodeEnumNative;
    static minimalOpcodeFromData(data: Uint8Array): OpcodeEnumNative;
    static nominalOpcodeFromData(data: Uint8Array): OpcodeEnumNative;
    static opcodeFromPositive(value: number): OpcodeEnumNative;
    static opcodeToPositive(code: OpcodeEnumNative): number;
    static opcodeIsPush(code: OpcodeEnumNative): boolean;
    static opcodeIsPayload(code: OpcodeEnumNative): boolean;
    static opcodeIsCounted(code: OpcodeEnumNative): boolean;
    static opcodeIsVersion(code: OpcodeEnumNative): boolean;
    static opcodeIsNumeric(code: OpcodeEnumNative): boolean;
    static opcodeIsPositive(code: OpcodeEnumNative): boolean;
    static opcodeIsReserved(code: OpcodeEnumNative): boolean;
    static opcodeIsDisabled(code: OpcodeEnumNative): boolean;
    static opcodeIsConditional(code: OpcodeEnumNative): boolean;
    static opcodeIsRelaxedPush(code: OpcodeEnumNative): boolean;
}
export declare class OperationListNative {
    private readonly [ptrSym];
    static _create(ptr: number): OperationListNative;
    protected _destructor(): void;
    constructor();
    pushBack(operation: OperationNative): void;
    count(): number;
    nth(index: number): OperationNative;
}
export declare class ScriptNative {
    private readonly [ptrSym];
    static _create(ptr: number): ScriptNative;
    protected _destructor(): void;
    constructor();
    constructor(str: string);
    constructor(operations: OperationListNative);
    constructor(encoded: Uint8Array, prefix: boolean);
    isValid(): boolean;
    isValidOperations(): boolean;
    satoshiContentSize(): number;
    serializedSize(prefix: boolean): number;
    toStr(activeForks: number): string;
    type(): string;
    toData(prefix: boolean): Uint8Array;
    sigops(embedded: boolean): number;
    operations(): OperationListNative;
    toBytes(): Uint8Array;
    static isPushOnly(ops: OperationListNative): boolean;
    static isRelaxedPush(ops: OperationListNative): boolean;
    static isCoinbasePattern(ops: OperationListNative, height: number): boolean;
    static isNullDataPattern(ops: OperationListNative): boolean;
    static isPayMultisigPattern(ops: OperationListNative): boolean;
    static isPayPublicKeyPattern(ops: OperationListNative): boolean;
    static isPayKeyHashPattern(ops: OperationListNative): boolean;
    static isPayScriptHashPattern(ops: OperationListNative): boolean;
    static isSignMultisigPattern(ops: OperationListNative): boolean;
    static isSignPublicKeyPattern(ops: OperationListNative): boolean;
    static isSignKeyHashPattern(ops: OperationListNative): boolean;
    static isSignScriptHashPattern(ops: OperationListNative): boolean;
    static toNullDataPattern(data: Uint8Array): OperationListNative;
    static toPayPublicKeyPattern(point: Uint8Array): OperationListNative;
    static toPayKeyHashPattern(hash: ShortHashNative): OperationListNative;
    static toPayScriptHashPattern(hash: ShortHashNative): OperationListNative;
}
export {};

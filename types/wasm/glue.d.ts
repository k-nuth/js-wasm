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
    count(): number;
    nth(index: number): string;
}
export declare class ShortHashNative {
    private readonly [ptrSym];
    static _create(ptr: number): ShortHashNative;
    get hash(): number;
    protected _destructor(): void;
    set(data: number): void;
}
export declare class HashNative {
    private readonly [ptrSym];
    static _create(ptr: number): HashNative;
    get hash(): number;
    protected _destructor(): void;
    constructor();
    set(data: number): void;
}
export declare class LongHashNative {
    private readonly [ptrSym];
    static _create(ptr: number): LongHashNative;
    get hash(): number;
    protected _destructor(): void;
    set(data: number): void;
}
export declare class EncryptedSeedNative {
    private readonly [ptrSym];
    static _create(ptr: number): EncryptedSeedNative;
    get hash(): number;
    protected _destructor(): void;
    set(data: number): void;
}
export declare class HashFunctionsNative {
    static sha256(encoded: Uint8Array): HashNative;
    static sha256Reversed(encoded: Uint8Array): HashNative;
    static sha256ReversedStr(encoded: Uint8Array): string;
}
export declare class DoubleListNative {
    private readonly [ptrSym];
    static _create(ptr: number): DoubleListNative;
    protected _destructor(): void;
    constructor();
    pushBack(x: number): void;
    count(): number;
    nth(index: number): number;
}
export declare class U32ListNative {
    private readonly [ptrSym];
    static _create(ptr: number): U32ListNative;
    protected _destructor(): void;
    constructor();
    pushBack(x: number): void;
    count(): number;
    nth(index: number): number;
}
export declare class U64ListNative {
    private readonly [ptrSym];
    static _create(ptr: number): U64ListNative;
    protected _destructor(): void;
    constructor();
    pushBack(x: bigint): void;
    count(): number;
    nth(index: number): bigint;
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
    constructor();
    set(data: number): void;
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
    constructor(encoded: string);
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
export declare class PaymentAddressListNative {
    private readonly [ptrSym];
    static _create(ptr: number): PaymentAddressListNative;
    protected _destructor(): void;
    constructor();
    pushBack(utxo: PaymentAddressNative): void;
    count(): number;
    nth(index: number): PaymentAddressNative;
}
export declare class PaymentAddressNative {
    private readonly [ptrSym];
    static _create(ptr: number): PaymentAddressNative;
    protected _destructor(): void;
    constructor(address: string);
    static fromShortHash(hash: ShortHashNative, version: number): PaymentAddressNative;
    static fromHash(hash: HashNative, version: number): PaymentAddressNative;
    static fromScript(script: ScriptNative, version: number): PaymentAddressNative;
    static fromPayPublicKeyHashScript(script: ScriptNative, version: number): PaymentAddressNative;
    encodedLegacy(): string;
    encodedCashAddr(tokenAware: boolean): string;
    hash20(): ShortHashNative;
    hash32(): HashNative;
    version(): number;
    isValid(): boolean;
    static extract(script: ScriptNative, p2khVersion: number, p2shVersion: number): PaymentAddressListNative;
    static extractInput(script: ScriptNative, p2khVersion: number, p2shVersion: number): PaymentAddressListNative;
    static extractOutput(script: ScriptNative, p2khVersion: number, p2shVersion: number): PaymentAddressListNative;
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
    toData(): Uint8Array;
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
export declare class WalletDataNative {
    private readonly [ptrSym];
    static _create(ptr: number): WalletDataNative;
    protected _destructor(): void;
    mnemonics(): StringListNative;
    encryptedSeed(): EncryptedSeedNative;
    xpub(): HdPublicNative;
}
export declare class WalletManagerNative {
    static createWallet(password: string, normalizedPassphrase: string): [number, WalletDataNative];
    static decryptSeed(password: string, encryptedSeed: EncryptedSeedNative): [number, LongHashNative];
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
    isDisabled(activeForks: number): boolean;
    isConditional(): boolean;
    isRelaxedPush(): boolean;
    isOversized(maxSize: number): boolean;
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
    static opcodeIsDisabled(code: OpcodeEnumNative, activeForks: number): boolean;
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
declare const _ScriptPatternIntToKey: readonly ["null_data", "pay_multisig", "pay_public_key", "pay_public_key_hash", "pay_script_hash", "sign_multisig", "sign_public_key", "sign_public_key_hash", "sign_script_hash", "witness_reservation", "non_standard"];
export declare type ScriptPattern = (typeof _ScriptPatternIntToKey)[number];
export declare function ScriptPatternToInt(value: ScriptPattern): number;
declare const _EndorsementTypeIntToKey: readonly ["ecdsa", "schnorr"];
export declare type EndorsementType = (typeof _EndorsementTypeIntToKey)[number];
export declare function EndorsementTypeToInt(value: EndorsementType): number;
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
    operations(): OperationListNative;
    toBytes(): Uint8Array;
    static isPushOnly(ops: OperationListNative): boolean;
    static isRelaxedPush(ops: OperationListNative): boolean;
    static isCoinbasePattern(ops: OperationListNative, height: number): boolean;
    static isNullDataPattern(ops: OperationListNative): boolean;
    static isPayMultisigPattern(ops: OperationListNative): boolean;
    static isPayPublicKeyPattern(ops: OperationListNative): boolean;
    static isPayPublicKeyHashPattern(ops: OperationListNative): boolean;
    static isPayScriptHashPattern(ops: OperationListNative): boolean;
    static isSignMultisigPattern(ops: OperationListNative): boolean;
    static isSignPublicKeyPattern(ops: OperationListNative): boolean;
    static isSignPublicKeyHashPattern(ops: OperationListNative): boolean;
    static isSignScriptHashPattern(ops: OperationListNative): boolean;
    static toNullDataPattern(data: Uint8Array): OperationListNative;
    static toPayPublicKeyPattern(point: Uint8Array): OperationListNative;
    static toPayPublicKeyHashPattern(hash: ShortHashNative): OperationListNative;
    static toPayScriptHashPattern(hash: ShortHashNative): OperationListNative;
    pattern(): ScriptPattern;
    outputPattern(): ScriptPattern;
    inputPattern(): ScriptPattern;
    sigops(accurate: boolean): number;
    isUnspendable(): boolean;
    reset(): void;
    static createEndorsement(secret: EcSecretNative, prevoutScript: ScriptNative, tx: TransactionNative, inputIndex: number, sighashType: number, activeForks: number, value: bigint, endorsementType: EndorsementType): Uint8Array;
    static verify(tx: TransactionNative, input: number, forks: number, inputScript: ScriptNative, prevoutScript: ScriptNative, value: bigint): number;
    static verifyTransaction(tx: TransactionNative, input: number, forks: number): number;
}
export declare class OutputPointNative {
    private readonly [ptrSym];
    static _create(ptr: number): OutputPointNative;
    protected _destructor(): void;
    constructor();
    constructor(hash: HashNative, index: number);
    hash(): HashNative;
    index(): number;
    cachedOutput(): OutputNative;
    setHash(hash: HashNative): void;
    setIndex(index: number): void;
    setCachedOutput(output: OutputNative): void;
}
declare const _TokenKindIntToKey: readonly ["none", "fungible", "non_fungible", "both"];
export declare type TokenKind = (typeof _TokenKindIntToKey)[number];
export declare function TokenKindToInt(value: TokenKind): number;
declare const _TokenCapabilityIntToKey: readonly ["none", "mutable", "minting"];
export declare type TokenCapability = (typeof _TokenCapabilityIntToKey)[number];
export declare function TokenCapabilityToInt(value: TokenCapability): number;
export declare class TokenDataNative {
    private readonly [ptrSym];
    static _create(ptr: number): TokenDataNative;
    protected _destructor(): void;
    static constructFungible(category: HashNative, amount: bigint): TokenDataNative;
    static constructNonFungible(category: HashNative, capability: TokenCapability, commitmentData: Uint8Array): TokenDataNative;
    static constructBothKinds(category: HashNative, amount: bigint, capability: TokenCapability, commitmentData: Uint8Array): TokenDataNative;
    isValid(): boolean;
    serializedSize(): number;
    toData(): Uint8Array;
    kind(): TokenKind;
    category(): HashNative;
    fungibleAmount(): bigint;
    nonFungibleCapability(): TokenCapability;
    nonFungibleCommitment(): Uint8Array;
}
export declare class UtxoNative {
    private readonly [ptrSym];
    static _create(ptr: number): UtxoNative;
    protected _destructor(): void;
    constructor();
    static fromPointAmount(hash: HashNative, index: number, amount: bigint): UtxoNative;
    static fromPointAmountFungible(hash: HashNative, index: number, amount: bigint, category: HashNative, tokenAmount: bigint): UtxoNative;
    static fromPointAmountNonFungible(hash: HashNative, index: number, amount: bigint, category: HashNative, capability: TokenCapability, commitmentData: Uint8Array): UtxoNative;
    static fromPointAmountBothKinds(hash: HashNative, index: number, amount: bigint, category: HashNative, tokenAmount: bigint, capability: TokenCapability, commitmentData: Uint8Array): UtxoNative;
    hash(): HashNative;
    index(): number;
    amount(): bigint;
    cachedOutput(): OutputNative;
    hasTokenData(): boolean;
    tokenData(): TokenDataNative;
    tokenCategory(): HashNative;
    tokenAmount(): bigint;
    setHash(hash: HashNative): void;
    setIndex(index: number): void;
    setAmount(amount: bigint): void;
    setCachedOutput(output: OutputNative): void;
    setTokenData(token_data: TokenDataNative): void;
    setTokenCategory(category: HashNative): void;
    setTokenAmount(amount: bigint): void;
}
export declare class OutputNative {
    private readonly [ptrSym];
    static _create(ptr: number): OutputNative;
    protected _destructor(): void;
    constructor();
    constructor(value: bigint, script: ScriptNative);
    constructor(value: bigint, script: ScriptNative, tokenData: TokenDataNative);
    static fromData(data: Uint8Array): OutputNative;
    toData(wire: boolean): Uint8Array;
    serializedSize(wire: boolean): number;
    isValid(): boolean;
    value(): bigint;
    script(): ScriptNative;
    hasTokenData(): boolean;
    tokenData(): TokenDataNative;
}
export declare class InputNative {
    private readonly [ptrSym];
    static _create(ptr: number): InputNative;
    protected _destructor(): void;
    constructor();
    constructor(previousOutput: OutputPointNative, script: ScriptNative, seq: number);
    static fromData(data: Uint8Array): InputNative;
    toData(wire: boolean): Uint8Array;
    serializedSize(wire: boolean): number;
    isValid(): boolean;
    seq(): number;
    script(): ScriptNative;
    previousOutput(): OutputPointNative;
}
export declare class OutputListNative {
    private readonly [ptrSym];
    static _create(ptr: number): OutputListNative;
    protected _destructor(): void;
    constructor();
    pushBack(output: OutputNative): void;
    count(): number;
    nth(index: number): OutputNative;
}
export declare class InputListNative {
    private readonly [ptrSym];
    static _create(ptr: number): InputListNative;
    protected _destructor(): void;
    constructor();
    pushBack(input: InputNative): void;
    count(): number;
    nth(index: number): InputNative;
}
export declare class UtxoListNative {
    private readonly [ptrSym];
    static _create(ptr: number): UtxoListNative;
    protected _destructor(): void;
    constructor();
    pushBack(utxo: UtxoNative): void;
    count(): number;
    nth(index: number): UtxoNative;
}
declare const _CoinSelectionAlgorithmIntToKey: readonly ["smallest_first", "largest_first", "manual", "send_all"];
export declare type CoinSelectionAlgorithm = (typeof _CoinSelectionAlgorithmIntToKey)[number];
export declare function CoinSelectionAlgorithmToInt(value: CoinSelectionAlgorithm): number;
export declare class TransactionNative {
    private readonly [ptrSym];
    static _create(ptr: number): TransactionNative;
    protected _destructor(): void;
    constructor();
    constructor(version: number, locktime: number, inputs: InputListNative, outputs: OutputListNative);
    static fromData(data: Uint8Array): TransactionNative;
    toData(wire: boolean): Uint8Array;
    serializedSize(wire: boolean): number;
    isValid(): boolean;
    hash(): HashNative;
    version(): number;
    locktime(): number;
    outputs(): OutputListNative;
    inputs(): InputListNative;
    isCoinbase(): boolean;
    totalInputValue(): bigint;
    totalOutputValue(): bigint;
    fees(): bigint;
    isMature(target_height: number): boolean;
    static createTemplateWithChangeRatios(available_utxos: UtxoListNative, amount_to_send: bigint, destination_address: PaymentAddressNative, change_addresses: PaymentAddressListNative, change_ratios: DoubleListNative, selection_algo: CoinSelectionAlgorithm): [number, TransactionNative, U32ListNative, PaymentAddressListNative, U64ListNative];
    static createTemplate(available_utxos: UtxoListNative, amount_to_send: bigint, destination_address: PaymentAddressNative, change_addresses: PaymentAddressListNative, selection_algo: CoinSelectionAlgorithm): [number, TransactionNative, U32ListNative, PaymentAddressListNative, U64ListNative];
}
export declare class InterpreterNative {
    static run(program: ProgramNative): number;
    static runOperation(operation: OperationNative, program: ProgramNative): number;
    static debugStart(program: ProgramNative): [number, number];
    static debugStepsAvailable(program: ProgramNative, step: number): boolean;
    static debugStep(program: ProgramNative, step: number): [number, number, ProgramNative];
    static debugEnd(program: ProgramNative): number;
}
export declare class ProgramNative {
    private readonly [ptrSym];
    static _create(ptr: number): ProgramNative;
    protected _destructor(): void;
    constructor();
    constructor(script: ScriptNative);
    constructor(script: ScriptNative, program: ProgramNative);
    constructor(script: ScriptNative, transaction: TransactionNative, inputIndex: number, forks: number);
    isValid(): boolean;
    evaluate(): number;
    stackResult(clean: boolean): boolean;
    size(): number;
    item(index: number): Uint8Array;
}
declare const _RuleForkEnumNativeIntToKey: readonly ["no_rules", "easy_blocks", "bip16_rule", "bip30_rule", "bip34_rule", "bip66_rule", "bip65_rule", "bip90_rule", "allow_collisions", "bip68_rule", "bip112_rule", "bip113_rule", "bch_uahf", "bch_daa_cw144", "bch_pythagoras", "bch_euclid", "bch_pisano", "bch_mersenne", "bch_fermat", "bch_euler", "bch_gauss", "bch_descartes", "bch_lobachevski", "bch_galois", "bch_leibniz", "retarget", "unverified", "bip34_activations", "bip9_bit0_group", "bip9_bit1_group", "all_rules"];
export declare type RuleForkEnumNative = (typeof _RuleForkEnumNativeIntToKey)[number];
export declare function RuleForkEnumNativeToInt(value: RuleForkEnumNative): number;
declare const _OpcodeEnumNativeIntToKey: readonly ["push_size_0", "push_size_1", "push_size_2", "push_size_3", "push_size_4", "push_size_5", "push_size_6", "push_size_7", "push_size_8", "push_size_9", "push_size_10", "push_size_11", "push_size_12", "push_size_13", "push_size_14", "push_size_15", "push_size_16", "push_size_17", "push_size_18", "push_size_19", "push_size_20", "push_size_21", "push_size_22", "push_size_23", "push_size_24", "push_size_25", "push_size_26", "push_size_27", "push_size_28", "push_size_29", "push_size_30", "push_size_31", "push_size_32", "push_size_33", "push_size_34", "push_size_35", "push_size_36", "push_size_37", "push_size_38", "push_size_39", "push_size_40", "push_size_41", "push_size_42", "push_size_43", "push_size_44", "push_size_45", "push_size_46", "push_size_47", "push_size_48", "push_size_49", "push_size_50", "push_size_51", "push_size_52", "push_size_53", "push_size_54", "push_size_55", "push_size_56", "push_size_57", "push_size_58", "push_size_59", "push_size_60", "push_size_61", "push_size_62", "push_size_63", "push_size_64", "push_size_65", "push_size_66", "push_size_67", "push_size_68", "push_size_69", "push_size_70", "push_size_71", "push_size_72", "push_size_73", "push_size_74", "push_size_75", "push_one_size", "push_two_size", "push_four_size", "push_negative_1", "reserved_80", "push_positive_1", "push_positive_2", "push_positive_3", "push_positive_4", "push_positive_5", "push_positive_6", "push_positive_7", "push_positive_8", "push_positive_9", "push_positive_10", "push_positive_11", "push_positive_12", "push_positive_13", "push_positive_14", "push_positive_15", "push_positive_16", "nop", "reserved_98", "if", "notif", "disabled_verif", "disabled_vernotif", "else", "endif", "verify", "return", "toaltstack", "fromaltstack", "drop2", "dup2", "dup3", "over2", "rot2", "swap2", "ifdup", "depth", "drop", "dup", "nip", "over", "pick", "roll", "rot", "swap", "tuck", "cat", "split", "num2bin", "bin2num", "size", "disabled_invert", "and", "or", "xor", "equal", "equalverify", "reserved_137", "reserved_138", "add1", "sub1", "disabled_mul2", "disabled_div2", "negate", "abs", "not", "nonzero", "add", "sub", "mul", "div", "mod", "disabled_lshift", "disabled_rshift", "booland", "boolor", "numequal", "numequalverify", "numnotequal", "lessthan", "greaterthan", "lessthanorequal", "greaterthanorequal", "min", "max", "within", "ripemd160", "sha1", "sha256", "hash160", "hash256", "codeseparator", "checksig", "checksigverify", "checkmultisig", "checkmultisigverify", "nop1", "nop2", "checklocktimeverify", "nop3", "checksequenceverify", "nop4", "nop5", "nop6", "nop7", "nop8", "nop9", "nop10", "checkdatasig", "checkdatasigverify", "reverse_bytes", "available1", "available2", "available3", "input_index", "active_bytecode", "tx_version", "tx_input_count", "tx_output_count", "tx_locktime", "utxo_value", "utxo_bytecode", "outpoint_tx_hash", "outpoint_index", "input_bytecode", "input_sequence_number", "output_value", "output_bytecode", "utxo_token_category", "utxo_token_commitment", "utxo_token_amount", "output_token_category", "output_token_commitment", "output_token_amount", "reserved_212", "reserved_213", "reserved_214", "first_undefined_op_value", "reserved_215", "reserved_216", "reserved_217", "reserved_218", "reserved_219", "reserved_220", "reserved_221", "reserved_222", "reserved_223", "reserved_224", "reserved_225", "reserved_226", "reserved_227", "reserved_228", "reserved_229", "reserved_230", "reserved_231", "reserved_232", "reserved_233", "reserved_234", "reserved_235", "reserved_236", "reserved_237", "reserved_238", "reserved_239", "special_token_prefix", "reserved_240", "reserved_241", "reserved_242", "reserved_243", "reserved_244", "reserved_245", "reserved_246", "reserved_247", "reserved_248", "reserved_249", "reserved_250", "reserved_251", "reserved_252", "reserved_253", "reserved_254", "reserved_255", "invalidopcode"];
export declare type OpcodeEnumNative = (typeof _OpcodeEnumNativeIntToKey)[number];
export declare function OpcodeEnumNativeToInt(value: OpcodeEnumNative): number;
export {};

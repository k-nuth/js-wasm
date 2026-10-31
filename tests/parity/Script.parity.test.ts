// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/domain/test/chain/script.cpp and src/c-api/test/chain/script.cpp through the public entry. Native-level calls
// use the exported ScriptNative; everything else goes through the idiomatic Script/Operation/Transaction wrappers.
import {
    EcPublic, HashFunctions, HdPublic, Input, OperationList, Output, OutputPoint, Script, ScriptNative, Transaction,
    bytesToHexStr, decodeHash, free, hexStrToBytes
} from '../..';
import { flag, upgrade } from './support/flags';
import { loadFixture, sourceHex } from './support/fixtures';
import { ecPublicClass } from './support/natives';
import { compressedPublicKey, derToNativeSignature } from './support/secp256k1';
import { describeSource, sourceCase } from './support/sourceCase';

const DOMAIN = 'src/domain/test/chain/script.cpp';
const CAPI = 'src/c-api/test/chain/script.cpp';

const noRules = 0n;
const allRules = flag('all_rules');

const SCRIPT_RETURN = 'return';
const SCRIPT_RETURN_EMPTY = 'return []';
const RETURN_80 = 'return [' + '00010203040506070809'.repeat(8) + ']';
const RETURN_81 = 'return [' + '00010203040506070809'.repeat(8) + 'FF]';
const KEYS = ['03dcfd9e580de35d8c2060d76dbf9e5561fe20febd2e64380e860a4d59f15ac864', '02440e0304bf8d32b2012994393c6a477acf238dd6adb4c3cef5bfa72f30c9861c', '03624505c6cc3967352cce480d8550490dd68519cd019066a4c302fdfb7d1c9934'];
const multisig = (m: string) => m + ' ' + KEYS.map(k => '[' + k + ']').join(' ') + ' 3 checkmultisig';
const SIXTEEN_OF_SIXTEEN = '16 ' + Array.from({ length: 16 }, (_, i) => '[' + KEYS[i % 3] + ']').join(' ') + ' 16 checkmultisig';
const SEVENTEEN_OF_SEVENTEEN = '[17] ' + Array.from({ length: 17 }, (_, i) => '[' + KEYS[i % 3] + ']').join(' ') + ' 16 checkmultisig';

function script(text: string): Script {
    const parsed = Script.fromString(text);
    expect(parsed).toBeDefined();
    return parsed!;
}

function withNative<T>(source: Script, body: (native: ScriptNative) => T): T {
    const native = source.toNative();
    try {
        return body(native);
    } finally {
        free(native);
    }
}

function fromDataOrFail(hex: string, prefix: boolean): Script {
    const parsed = Script.fromData(hexStrToBytes(hex), prefix);
    expect(parsed).toBeDefined();
    return parsed!;
}

function transactionOf(hex: string): Transaction {
    const tx = Transaction.fromData(hexStrToBytes(hex));
    expect(tx).toBeDefined();
    return tx!;
}

// Port of the upstream new_tx helper: version/locktime/sequence come from the table entry and the prevout script is the
// scriptPubKey of the entry. The transaction has one input and no outputs.
interface TableEntry {
    input: string;
    output: string;
    description: string;
    sequence: number;
    locktime: number;
    version: number;
}

const tables = loadFixture<Record<string, Array<TableEntry>>>('script_tables.json');

function describeEntry(entry: TableEntry): string {
    return 'input: "' + entry.input + '" prevout: "' + entry.output + '" (' + entry.sequence + ', ' + entry.locktime + ', ' + entry.version + ')';
}

function tableTransaction(entry: TableEntry): { tx: Transaction; input: Script; prevout: Script } | undefined {
    const input = Script.fromString(entry.input);
    const prevout = Script.fromString(entry.output);
    if (input === undefined || prevout === undefined) {
        return undefined;
    }
    const tx = new Transaction(entry.version, entry.locktime, [new Input(new OutputPoint(HashFunctions.nullHash, 0), input, entry.sequence)], []);
    return { tx, input, prevout };
}

function verifyEntry(entry: TableEntry, flags: bigint): number {
    const built = tableTransaction(entry);
    expect(built).toBeDefined();
    return Script.verify(built!.tx, 0, flags, built!.input, built!.prevout, 0n);
}

// Failure messages name the failing table entry, as the upstream CHECK_MESSAGE calls do.
function expectSuccess(entry: TableEntry, code: number): void {
    expect({ entry: describeEntry(entry), code }).toEqual({ entry: describeEntry(entry), code: 0 });
}

function expectFailure(entry: TableEntry, code: number): void {
    expect({ entry: describeEntry(entry), failed: code !== 0 }).toEqual({ entry: describeEntry(entry), failed: true });
}

describeSource(DOMAIN, () => {
    sourceCase('script one hash literal same', () => {
        const hashOne = decodeHash(sourceHex(DOMAIN, 'script one hash literal same', 0));
        const oneHash = new Uint8Array(32);
        oneHash[0] = 1;
        expect(Array.from(hashOne)).toEqual(Array.from(oneHash));
    });

    sourceCase('script from data testnet 119058 invalid op codes success', () => {
        expect(Script.fromData(hexStrToBytes(sourceHex(DOMAIN, 'script from data testnet 119058 invalid op codes success', 0)), false)).toBeDefined();
    });

    sourceCase('script from data parse success', () => {
        expect(Script.fromData(hexStrToBytes(sourceHex(DOMAIN, 'script from data parse success', 0)), true)).toBeDefined();
    });

    sourceCase('script from data to data roundtrips', () => {
        const raw = sourceHex(DOMAIN, 'script from data to data roundtrips', 0);
        const parsed = fromDataOrFail(raw, false);
        expect(parsed.valid).toBe(true);
        expect(parsed.operations).toHaveLength(5);
        expect(parsed.serializedSize).toBe(25);
        expect(withNative(parsed, n => n.serializedSize(true))).toBe(26);
        expect(parsed.sigops).toBe(1);
        expect(parsed.sigopsAccurate).toBe(1);
        expect(parsed.pattern()).toBe('pay_to_public_key_hash');
        expect(bytesToHexStr(parsed.toData(false))).toBe(raw);
    });

    sourceCase('script from data to data weird roundtrips', () => {
        const raw = sourceHex(DOMAIN, 'script from data to data weird roundtrips', 0);
        expect(bytesToHexStr(fromDataOrFail(raw, false).toData(false))).toBe(raw);
    });

    sourceCase('script factory from data chunk test', () => {
        expect(fromDataOrFail(sourceHex(DOMAIN, 'script factory from data chunk test', 0), false).valid).toBe(true);
    });

    sourceCase('script from data - first byte invalid wire code - success', () => {
        expect(Script.fromData(hexStrToBytes(sourceHex(DOMAIN, 'script from data - first byte invalid wire code - success', 0)), false)).toBeDefined();
    });

    sourceCase('script from data - internal invalid wire code - success', () => {
        expect(Script.fromData(hexStrToBytes(sourceHex(DOMAIN, 'script from data - internal invalid wire code - success', 0)), false)).toBeDefined();
    });

    sourceCase('script from string - empty - success', () => {
        const instance = script('');
        expect(instance.operations).toHaveLength(0);
    });

    sourceCase('script from string - two of three multisig - success', () => {
        const ops = script(multisig('2')).operations;
        expect(ops).toHaveLength(6);
        expect(ops[0].code).toBe('push_positive_2');
        expect(ops[1].toString(noRules)).toBe('[' + KEYS[0] + ']');
        expect(ops[2].toString(noRules)).toBe('[' + KEYS[1] + ']');
        expect(ops[3].toString(noRules)).toBe('[' + KEYS[2] + ']');
        expect(ops[4].code).toBe('push_positive_3');
        expect(ops[5].code).toBe('checkmultisig');
    });

    sourceCase('script empty - default - true', () => {
        expect(new Script(new Uint8Array(0), false).toBytes()).toHaveLength(0);
    });

    sourceCase('script empty - empty operations - true', () => {
        const native = new ScriptNative(OperationList.toNative([]));
        try {
            expect(native.bytes()).toHaveLength(0);
        } finally {
            free(native);
        }
    });

    sourceCase('script empty - non empty - false', () => {
        const instance = Script.fromOperations(Script.toNullDataPattern(Uint8Array.of(42))!)!;
        expect(instance.toBytes().length).toBeGreaterThan(0);
    });

    sourceCase('script clear - non empty - empty', () => {
        const instance = Script.fromOperations(Script.toNullDataPattern(Uint8Array.of(42))!)!;
        const native = instance.toNative();
        try {
            expect(native.bytes().length).toBeGreaterThan(0);
            native.reset();
            expect(native.bytes()).toHaveLength(0);
        } finally {
            free(native);
        }
    });

    const patterns: Array<[string, string, string, string, string]> = [
        ['script pattern - null data return only - non standard', SCRIPT_RETURN, 'non_standard', 'non_standard', 'non_standard'],
        ['script pattern - null data empty - null data', SCRIPT_RETURN_EMPTY, 'null_data', 'non_standard', 'null_data'],
        ['script pattern - null data 80 bytes - null data', RETURN_80, 'null_data', 'non_standard', 'null_data'],
        ['script pattern - null data 81 bytes - non standard', RETURN_81, 'non_standard', 'non_standard', 'non_standard'],
        ['script pattern - 0 of 3 multisig - non standard', multisig('0'), 'non_standard', 'non_standard', 'non_standard'],
        ['script pattern - 1 of 3 multisig - pay multisig', multisig('1'), 'pay_to_multisig', 'non_standard', 'pay_to_multisig'],
        ['script pattern - 2 of 3 multisig - pay multisig', multisig('2'), 'pay_to_multisig', 'non_standard', 'pay_to_multisig'],
        ['script pattern - 3 of 3 multisig - pay multisig', multisig('3'), 'pay_to_multisig', 'non_standard', 'pay_to_multisig'],
        ['script pattern - 4 of 3 multisig - non standard', multisig('4'), 'non_standard', 'non_standard', 'non_standard'],
        ['script pattern - 16 of 16 multisig - pay multisig', SIXTEEN_OF_SIXTEEN, 'pay_to_multisig', 'non_standard', 'pay_to_multisig'],
        ['script pattern - 17 of 17 multisig - non standard', SEVENTEEN_OF_SEVENTEEN, 'non_standard', 'non_standard', 'non_standard'],
    ];
    for (const [name, text, output, input, overall] of patterns) {
        sourceCase(name, () => {
            const instance = script(text);
            expect(instance.valid).toBe(true);
            expect(instance.outputPattern()).toBe(output);
            expect(instance.inputPattern()).toBe(input);
            expect(instance.pattern()).toBe(overall);
        });
    }

    const outputPatternWith = (source: Script, flags: bigint) => withNative(source, n => n.outputPattern(flags));
    const MAX_P2S_SCRIPT_SIZE = 201;

    sourceCase('script pattern - P2S - bch_p2s inactive keeps short bare scripts non_standard', () => {
        const instance = script('1');
        expect(instance.valid).toBe(true);
        expect(instance.outputPattern()).toBe('non_standard');
        expect(outputPatternWith(instance, noRules)).toBe('non_standard');
    });

    sourceCase('script pattern - P2S - bch_p2s active + size <= 201 reports pay_to_script', () => {
        const instance = script('1');
        expect(instance.valid).toBe(true);
        expect(instance.serializedSize).toBeLessThanOrEqual(MAX_P2S_SCRIPT_SIZE);
        expect(outputPatternWith(instance, flag('bch_p2s'))).toBe('pay_to_script');
    });

    sourceCase('script pattern - P2S - bch_p2s active at the 201-byte boundary is standard', () => {
        const instance = script(Array(201).fill('nop').join(' '));
        expect(instance.valid).toBe(true);
        expect(instance.serializedSize).toBe(MAX_P2S_SCRIPT_SIZE);
        expect(outputPatternWith(instance, flag('bch_p2s'))).toBe('pay_to_script');
    });

    sourceCase('script pattern - P2S - bch_p2s active but size > 201 stays non_standard', () => {
        const instance = script(Array(202).fill('nop').join(' '));
        expect(instance.valid).toBe(true);
        expect(instance.serializedSize).toBeGreaterThan(MAX_P2S_SCRIPT_SIZE);
        expect(outputPatternWith(instance, flag('bch_p2s'))).toBe('non_standard');
    });

    sourceCase('script pattern - P2S - witness-like scriptPubKey promotes to pay_to_script', () => {
        const instance = script('0 [0000000000000000000000000000000000000000]');
        expect(instance.valid).toBe(true);
        expect(instance.outputPattern()).toBe('non_standard');
        expect(outputPatternWith(instance, flag('bch_p2s'))).toBe('pay_to_script');
    });

    sourceCase('script pattern - P2S - mutated P2PKH (wrong hash size) falls into pay_to_script', () => {
        const instance = script('dup hash160 [0200000000000000000000000000000000000000000000000000000000000000aa] equalverify checksig');
        expect(instance.valid).toBe(true);
        expect(instance.outputPattern()).toBe('non_standard');
        expect(outputPatternWith(instance, flag('bch_p2s'))).toBe('pay_to_script');
    });

    sourceCase('script pattern - P2S - known templates take precedence over P2S classification', () => {
        const instance = script('return [deadbeef]');
        expect(instance.valid).toBe(true);
        expect(outputPatternWith(instance, flag('bch_p2s'))).toBe('null_data');
    });

    sourceCase('script pattern - P2S - catch-all applies to output scripts only', () => {
        const instance = script('1');
        expect(instance.valid).toBe(true);
        expect(outputPatternWith(instance, flag('bch_p2s'))).toBe('pay_to_script');
        expect(instance.inputPattern()).toBe('non_standard');

        // A transaction with a bare `1` scriptSig and a valid P2S scriptPubKey is still rejected: the non_standard input
        // side short-circuits is_standard(flags) even though the output side is a legitimate pay_to_script.
        const tx = new Transaction(1, 0,
            [new Input(new OutputPoint(HashFunctions.nullHash, 0xffffffff), script('1'), 0xffffffff)],
            [new Output(0n, script('1'))]);
        const native = tx.toNative();
        try {
            expect(native.isStandard(flag('bch_p2s'))).toBe(false);
        } finally {
            free(native);
        }
    });

    // Data-driven tables of script.hpp. Each upstream TEST_CASE loops over its table with the same flag sets.
    const tableCase = (caseName: string, table: string, check: (entry: TableEntry) => void) => {
        sourceCase(caseName, () => {
            expect(tables[table]).toBeDefined();
            for (const entry of tables[table]) {
                check(entry);
            }
        });
    };
    const ok = (entry: TableEntry, flags: bigint) => expectSuccess(entry, verifyEntry(entry, flags));
    const bad = (entry: TableEntry, flags: bigint) => expectFailure(entry, verifyEntry(entry, flags));
    const withoutMersenne = allRules & ~upgrade('bch_mersenne');

    tableCase('script bip16 valid', 'valid_bip16_scripts', e => {
        ok(e, noRules);
        ok(e, flag('bip16_rule'));
        ok(e, withoutMersenne);
    });
    tableCase('script bip16 invalid', 'invalid_bip16_scripts', e => {
        bad(e, noRules);
        bad(e, flag('bip16_rule'));
        bad(e, allRules);
    });
    tableCase('script bip16 invalidated', 'invalidated_bip16_scripts', e => {
        ok(e, noRules);
        bad(e, flag('bip16_rule'));
        bad(e, allRules);
    });
    tableCase('script bip65 valid', 'valid_bip65_scripts', e => {
        ok(e, noRules);
        ok(e, flag('bip65_rule'));
        ok(e, allRules);
    });
    tableCase('script bip65 invalid', 'invalid_bip65_scripts', e => {
        bad(e, noRules);
        bad(e, flag('bip65_rule'));
        bad(e, allRules);
    });
    tableCase('script bip65 invalidated', 'invalidated_bip65_scripts', e => {
        ok(e, noRules);
        bad(e, flag('bip65_rule'));
        bad(e, allRules);
    });
    tableCase('script bip112 valid', 'valid_bip112_scripts', e => {
        ok(e, noRules);
        ok(e, flag('bip112_rule'));
    });
    tableCase('script bip112 invalid', 'invalid_bip112_scripts', e => {
        bad(e, noRules);
        bad(e, flag('bip112_rule'));
        bad(e, allRules);
    });
    tableCase('script bip112 invalidated', 'invalidated_bip112_scripts', e => {
        ok(e, noRules);
        bad(e, flag('bip112_rule'));
        bad(e, allRules);
    });
    tableCase('script multisig valid', 'valid_multisig_scripts', e => {
        ok(e, noRules);
        ok(e, flag('bip66_rule'));
        ok(e, allRules);
    });
    tableCase('script multisig invalid', 'invalid_multisig_scripts', e => {
        const flags = allRules & ~flag('bch_vm_limits') & ~flag('bch_bigint');
        bad(e, noRules);
        bad(e, flag('bip66_rule'));
        bad(e, flags);
    });
    tableCase('script context free valid', 'valid_context_free_scripts', e => {
        ok(e, noRules);
        ok(e, withoutMersenne);
    });
    tableCase('script context free invalid', 'invalid_context_free_scripts', e => {
        const flags = allRules & ~flag('bch_loops') & ~flag('bch_vm_limits') & ~flag('bch_bigint');
        bad(e, noRules);
        bad(e, flags);
    });
    tableCase('script bch_pythagoras invalidated', 'invalidated_bch_pythagoras_scripts', e => {
        ok(e, noRules);
        ok(e, upgrade('bch_daa_cw144'));
        bad(e, upgrade('bch_pythagoras'));
        bad(e, allRules);
    });
    tableCase('script bch_pythagoras validated', 'validated_bch_pythagoras_scripts', e => {
        ok(e, upgrade('bch_pythagoras'));
        ok(e, withoutMersenne);
    });
    tableCase('script bch_gauss invalidated', 'invalidated_bch_gauss_scripts', e => {
        ok(e, noRules);
        bad(e, allRules);
    });
    tableCase('script bch_gauss validated', 'validated_bch_gauss_scripts', e => {
        bad(e, noRules);
        bad(e, upgrade('bch_euler'));
        ok(e, upgrade('bch_gauss'));
        ok(e, allRules);
    });
    tableCase('script bch_galois invalidated', 'invalidated_bch_galois_scripts', e => {
        ok(e, noRules);
        ok(e, upgrade('bch_lobachevski'));
        bad(e, upgrade('bch_galois'));
        bad(e, allRules);
    });
    tableCase('script bch_galois validated', 'validated_bch_galois_scripts', e => {
        bad(e, noRules);
        bad(e, upgrade('bch_lobachevski'));
        ok(e, upgrade('bch_galois'));
        ok(e, allRules);
    });

    sourceCase('script construction failures', () => {
        for (const entry of tables.invalid_construction_scripts) {
            expect({ entry: describeEntry(entry), built: tableTransaction(entry) !== undefined }).toEqual({ entry: describeEntry(entry), built: false });
        }
    });

    const checksig = (name: string, sighashType: number, index: number) => {
        sourceCase(name, () => {
            const parent = transactionOf(sourceHex(DOMAIN, name, 0));
            const signature = derToNativeSignature(hexStrToBytes(sourceHex(DOMAIN, name, 1)));
            const pubkey = hexStrToBytes(sourceHex(DOMAIN, name, 2));
            const scriptCode = fromDataOrFail(sourceHex(DOMAIN, name, 3), false);
            const nativeTx = parent.toNative();
            const nativeScript = scriptCode.toNative();
            const nativeSignature = HashFunctions.toNative(signature as any);
            try {
                const [valid] = ScriptNative.checkSignature(nativeSignature as any, sighashType, pubkey, nativeScript, nativeTx, index, noRules, 0n);
                expect(valid).toBe(true);
            } finally {
                free(nativeSignature);
                free(nativeScript);
                free(nativeTx);
            }
        });
    };
    checksig('script checksig single uses one hash', 3, 1);
    checksig('script checksig normal success', 3, 0);

    sourceCase('script generate signature hash - all', () => {
        const name = 'script generate signature hash - all';
        const tx = transactionOf(sourceHex(DOMAIN, name, 0));
        const prevout = script('dup hash160 [88350574280395ad2c3e2ee20e322073d94e5e40] equalverify checksig');
        const nativeTx = tx.toNative();
        const nativeScript = prevout.toNative();
        try {
            const [hash] = ScriptNative.generateSignatureHash(nativeTx, 0, nativeScript, 1, noRules, 0n);
            expect(bytesToHexStr(HashFunctions.fromNative(hash, true))).toBe('f89572635651b2e4f89778350616989183c98d1a721c911324bf9f17a0cf5bf0');
        } finally {
            free(nativeScript);
            free(nativeTx);
        }
    });

    const nativeBlock = (name: string, index: number, flags: bigint) => {
        sourceCase(name, () => {
            const tx = transactionOf(sourceHex(DOMAIN, name, 0));
            const prevout = fromDataOrFail(sourceHex(DOMAIN, name, 1), false);
            expect(prevout.valid).toBe(true);
            expect(tx.inputs!.length).toBeGreaterThan(index);
            expect(Script.verify(tx, index, flags, tx.inputs![index].script!, prevout, 0n)).toBe(0);
        });
    };
    nativeBlock('script native block 290329 tx valid', 1,
        flag('bip16_rule') | flag('bip30_rule') | flag('bip34_rule') | flag('bip90_rule') | flag('allow_collisions') | flag('retarget'));
    nativeBlock('script native block 438513 tx valid', 0,
        flag('bip16_rule') | flag('bip30_rule') | flag('bip34_rule') | flag('bip66_rule') | flag('bip65_rule'));

    // The upstream tests derive the key with secret_to_public. EllipticCurve is not reachable through the public API, so the
    // compressed key is derived by the independent secp256k1 in support/secp256k1.ts and handed to EcPublicNative.fromPoint.
    const UNLOCK_SECRET = 'ce8f4b713ffdd2658900845251890f30371856be201cd1f5b3d970f793634333';
    const vectorPublicKey = () => new EcPublic(ecPublicClass().fromVerifiedPoint(compressedPublicKey(decodeHash(UNLOCK_SECRET)), true));

    sourceCase('p2pkh unlocking script is the signature then the public key', () => {
        const signature = new Uint8Array(72).fill(0x30);
        const publicKey = vectorPublicKey();
        const publicNative = publicKey.toNative();
        try {
            const nativeOps = ScriptNative.toPayPublicKeyHashPatternUnlocking(signature, publicNative)!;
            const ops = OperationList.fromNative(nativeOps, true);
            expect(ops).toHaveLength(2);
            expect(Array.from(ops[0].data)).toEqual(Array.from(signature));
            expect(Array.from(ops[1].data)).toEqual(Array.from(publicKey.toData()));
            expect(ops[0].code).not.toBe('push_size_0');
        } finally {
            free(publicNative);
        }
    });

    sourceCase('the p2pkh unlocking placeholder serializes to the size of a real spend', () => {
        const signature = new Uint8Array(72).fill(0x30);
        const publicKey = vectorPublicKey();
        const publicNative = publicKey.toNative();
        try {
            const real = Script.fromOperations(OperationList.fromNative(ScriptNative.toPayPublicKeyHashPatternUnlocking(signature, publicNative)!, true))!;
            const placeholder = Script.fromOperations(OperationList.fromNative(
                ScriptNative.toPayPublicKeyHashPatternUnlockingPlaceholder(signature.length, publicKey.toData().length), true))!;
            expect(withNative(placeholder, n => n.serializedSize(true))).toBe(withNative(real, n => n.serializedSize(true)));
        } finally {
            free(publicNative);
        }
    });
});

describeSource(CAPI, () => {
    const OP_RETURN_PREFIXED = Uint8Array.of(0x01, 0x6a);
    const SHORT_HASH = Uint8Array.from({ length: 20 }, (_, i) => i);
    const HASH32 = hexStrToBytes('6fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000');
    const VALID_POINT = hexStrToBytes('0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2');

    sourceCase('C-API Script - default construct is empty', () => {
        const native = new ScriptNative();
        try {
            expect(native.serializedSize(false)).toBe(0);
        } finally {
            free(native);
        }
    });

    sourceCase('C-API Script - from_data prefixed roundtrip', () => {
        const parsed = Script.fromData(OP_RETURN_PREFIXED, true)!;
        expect(parsed).toBeDefined();
        expect(parsed.valid).toBe(true);
        expect(parsed.serializedSize).toBe(1);
        expect(Array.from(parsed.toData(true))).toEqual([0x01, 0x6a]);
    });

    sourceCase('C-API Script - serialized_size matches to_data length', () => {
        const parsed = Script.fromData(OP_RETURN_PREFIXED, true)!;
        expect(withNative(parsed, n => n.serializedSize(true))).toBe(2);
        expect(withNative(parsed, n => n.serializedSize(false))).toBe(1);
    });

    sourceCase('C-API Script - non-empty script has one operation', () => {
        expect(Script.fromData(OP_RETURN_PREFIXED, true)!.operations).toHaveLength(1);
    });

    sourceCase('C-API Script - from_string empty mnemonic', () => {
        const native = new ScriptNative();
        try {
            expect(native.fromStr('')).toBe(true);
            expect(native.serializedSize(false)).toBe(0);
        } finally {
            free(native);
        }
    });

    sourceCase('C-API Script - copy preserves equality', () => {
        const original = Script.fromData(OP_RETURN_PREFIXED, true)!.toNative();
        const copy = original.copy();
        try {
            expect(copy.isValid()).toBe(true);
            expect(original.equals(copy)).toBe(true);
            expect(copy.serializedSize(false)).toBe(original.serializedSize(false));
        } finally {
            free(copy);
            free(original);
        }
    });

    sourceCase('C-API Script - equals different scripts', () => {
        const a = Script.fromData(OP_RETURN_PREFIXED, true)!.toNative();
        const b = new ScriptNative();
        try {
            expect(a.equals(b)).toBe(false);
        } finally {
            free(a);
            free(b);
        }
    });

    sourceCase('C-API Script - to_pay_script_hash_pattern returns operation list', () => {
        const built = Script.fromOperations(Script.toPayScriptHashPattern(SHORT_HASH as any))!;
        expect(built.valid).toBe(true);
        expect(built.serializedSize).toBeGreaterThan(0);
    });

    sourceCase('C-API Script - to_pay_script_hash_32_pattern returns operation list', () => {
        const hashNative = HashFunctions.toNative(HASH32 as any);
        try {
            const ops = OperationList.fromNative(ScriptNative.toPayScriptHash32Pattern(hashNative), true);
            const built = Script.fromOperations(ops)!;
            expect(built.valid).toBe(true);
            expect(built.serializedSize).toBeGreaterThan(0);
        } finally {
            free(hashNative);
        }
    });

    sourceCase('C-API Script - to_null_data_pattern valid data returns list', () => {
        expect(Script.toNullDataPattern(Uint8Array.of(1, 2, 3, 4))).toBeDefined();
    });

    sourceCase('C-API Script - to_null_data_pattern oversized data returns NULL', () => {
        expect(Script.toNullDataPattern(new Uint8Array(81).fill(0x42))).toBeUndefined();
    });

    sourceCase('C-API Script - to_pay_public_key_pattern valid point returns list', () => {
        expect(Script.toPayPublicKeyPattern(VALID_POINT)).toBeDefined();
    });

    sourceCase('C-API Script - to_pay_public_key_pattern malformed point returns NULL', () => {
        expect(Script.toPayPublicKeyPattern(new Uint8Array(33))).toBeUndefined();
    });

    sourceCase('C-API Script - to_pay_public_key_pattern wrong-size point returns NULL', () => {
        expect(Script.toPayPublicKeyPattern(new Uint8Array(10).fill(0x03))).toBeUndefined();
    });

    sourceCase('C-API Script - to_pay_public_key_hash_pattern_unlocking valid pubkey returns list', () => {
        // kValidCompressedPoint is the BIP32 test vector 1 master public key, which HdPublic exposes as a point.
        const point = HdPublic.fromString('xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8')!.point;
        expect(Array.from(point.bytes)).toEqual(Array.from(VALID_POINT));
        const publicNative = new EcPublic(point, true).toNative();
        try {
            const ops = ScriptNative.toPayPublicKeyHashPatternUnlocking(new Uint8Array(71).fill(0x30), publicNative);
            expect(ops).not.toBeNull();
            expect(OperationList.fromNative(ops!, true)).toHaveLength(2);
        } finally {
            free(publicNative);
        }
    });

    sourceCase('C-API Script - to_pay_public_key_hash_pattern always returns a list', () => {
        expect(Script.toPayPublicKeyHashPattern(SHORT_HASH as any)).toHaveLength(5);
    });

    sourceCase('C-API Script - is_enabled bit test', () => {
        expect(ScriptNative.isEnabled(0x05n, 0x01n)).toBe(true);
        expect(ScriptNative.isEnabled(0x05n, 0x04n)).toBe(true);
        expect(ScriptNative.isEnabled(0x05n, 0x02n)).toBe(false);
    });

    sourceCase('C-API Script - pattern of empty script is non standard', () => {
        expect(new Script(new Uint8Array(0), false).pattern()).toBe('non_standard');
    });

    sourceCase('C-API Script - bare OP_RETURN is non_standard', () => {
        expect(Script.fromData(OP_RETURN_PREFIXED, true)!.outputPattern()).toBe('non_standard');
    });

    sourceCase('C-API Script - construct_from_data NULL data with zero size succeeds', () => {
        const parsed = Script.fromData(new Uint8Array(0), false);
        expect(parsed).toBeDefined();
        expect(parsed!.serializedSize).toBe(0);
    });

    sourceCase('C-API Script - check_signature with null public_key and zero size', () => {
        const tx = new Transaction(0, 0, [], []);
        const nativeTx = tx.toNative();
        const nativeScript = new ScriptNative();
        const nativeSignature = HashFunctions.toNative(new Uint8Array(64) as any);
        try {
            const [valid] = ScriptNative.checkSignature(nativeSignature as any, 0, new Uint8Array(0), nativeScript, nativeTx, 0, noRules, 0n);
            expect(typeof valid).toBe('boolean');
        } finally {
            free(nativeSignature);
            free(nativeScript);
            free(nativeTx);
        }
    });
});

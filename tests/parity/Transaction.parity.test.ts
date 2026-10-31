// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/domain/test/chain/transaction.cpp and src/c-api/test/chain/transaction.cpp through the Transaction wrapper.
// The wrapper has no equals(): where the upstream case compares two transactions the comparison is made on the wire
// serialization plus the scalar fields. Cases that need the previous-output validation cache, the store format or
// predicates the wrapper does not expose (is_final, is_locked, double spends, dust, sigops, ...) are in the inventory
// as blocked, with the missing member named.
import { HashFunctions, Input, Output, OutputPoint, Transaction, decodeHash, encodeHash, hexStrToBytes } from '../..';
import { emptyScript, inputFromHex, nullPrevout, outputFromHex, sameBytes, scriptFromHex, throughNative, transactionFromHex, wireHex } from './support/chain';
import { namedHex } from './support/fixtures';
import { describeSource, sourceCase } from './support/sourceCase';

const DOMAIN = 'src/domain/test/chain/transaction.cpp';
const CAPI = 'src/c-api/test/chain/transaction.cpp';
const tx0Inputs = () => namedHex(DOMAIN, 'tx0_inputs');
const tx0Output = () => namedHex(DOMAIN, 'tx0_inputs_last_output');

function expectEqual(a: Transaction, b: Transaction): void {
    expect(wireHex(a)).toBe(wireHex(b));
    expect(a.version).toBe(b.version);
    expect(a.locktime).toBe(b.locktime);
}

describeSource(DOMAIN, () => {
    sourceCase('chain transaction null is the all-default value', () => {
        const nullTx = new Transaction(0, 0, [], []);
        expect(nullTx.valid).toBe(false);
        expect(Transaction.isValid(nullTx.toData(true))).toBe(false);
        expect(nullTx.version).toBe(0);
        expect(nullTx.locktime).toBe(0);
        expect(nullTx.inputs).toEqual([]);
        expect(nullTx.outputs).toEqual([]);
        expectEqual(nullTx, throughNative(new Transaction(0, 0, [], [])));
    });

    sourceCase('chain transaction is null false for a populated transaction', () => {
        expect(new Transaction(1, 0, [], []).valid).toBe(true);
    });

    sourceCase('chain transaction constructor 1 always returns default initialized', () => {
        const instance = new Transaction();
        expect(instance.version).toBeUndefined();
        expect(instance.valid).toBe(false);
    });

    const constructorCase = (name: string) => {
        sourceCase(name, () => {
            const version = 2345;
            const locktime = 4568656;
            const inputs = [inputFromHex(tx0Inputs())];
            const outputs = [outputFromHex(tx0Output())];
            const instance = throughNative(new Transaction(version, locktime, inputs, outputs));
            expect(instance.version).toBe(version);
            expect(instance.locktime).toBe(locktime);
            expect(instance.inputs!.map(i => i.toData(true))).toEqual(inputs.map(i => i.toData(true)));
            expect(instance.outputs!.map(o => o.toData(true))).toEqual(outputs.map(o => o.toData(true)));
        });
    };
    constructorCase('chain transaction constructor 2 valid input returns input initialized');
    constructorCase('chain transaction constructor 3 valid input returns input initialized');

    sourceCase('chain transaction constructor 4 valid input returns input initialized', () => {
        const expected = transactionFromHex(namedHex(DOMAIN, 'tx1'));
        expectEqual(expected, throughNative(expected));
    });

    sourceCase('chain transaction constructor 5 valid input returns input initialized', () => {
        const expected = transactionFromHex(namedHex(DOMAIN, 'tx1'));
        expect(throughNative(expected).valid).toBe(true);
    });

    sourceCase('chain transaction is coinbase empty inputs returns false', () => {
        expect(new Transaction(0, 0, [], []).isCoinbase).toBe(false);
    });

    sourceCase('chain transaction is coinbase one null input returns true', () => {
        const instance = new Transaction(0, 0, [new Input(nullPrevout(), emptyScript(), 0)], []);
        expect(instance.isCoinbase).toBe(true);
    });

    sourceCase('chain transaction is coinbase one non null input returns false', () => {
        const instance = new Transaction(0, 0, [new Input(new OutputPoint(HashFunctions.nullHash, 42), emptyScript(), 0)], []);
        expect(instance.isCoinbase).toBe(false);
    });

    sourceCase('chain transaction is coinbase two inputs first null returns false', () => {
        const instance = new Transaction(0, 0, [
            new Input(nullPrevout(), emptyScript(), 0),
            new Input(new OutputPoint(HashFunctions.nullHash, 42), emptyScript(), 0)], []);
        expect(instance.isCoinbase).toBe(false);
    });

    sourceCase('chain transaction from data insufficient version bytes failure', () => {
        expect(Transaction.fromData(new Uint8Array(2))).toBeUndefined();
    });

    sourceCase('chain transaction from data insufficient input bytes failure', () => {
        expect(Transaction.fromData(hexStrToBytes('0000000103'))).toBeUndefined();
    });

    sourceCase('chain transaction from data insufficient output bytes failure', () => {
        expect(Transaction.fromData(hexStrToBytes('000000010003'))).toBeUndefined();
    });

    sourceCase('chain transaction factory data 1 case 1 success', () => {
        const raw = namedHex(DOMAIN, 'tx1');
        expect(raw.length / 2).toBe(225);
        const tx = transactionFromHex(raw);
        expect(tx.serializedSize(true)).toBe(225);
        expect(Array.from(tx.hash)).toEqual(Array.from(decodeHash(namedHex(DOMAIN, 'tx1_hash'))));
        expect(tx.serializedSize(true)).toBe(raw.length / 2);
        expect(sameBytes(tx.toData(true), hexStrToBytes(raw))).toBe(true);
    });

    sourceCase('chain transaction factory data 1 case 2 success', () => {
        const raw = namedHex(DOMAIN, 'tx4');
        expect(raw.length / 2).toBe(523);
        const tx = transactionFromHex(raw);
        expect(encodeHash(tx.hash)).toBe(namedHex(DOMAIN, 'tx4_hash'));
        expect(tx.serializedSize(true)).toBe(raw.length / 2);
        expect(sameBytes(tx.toData(true), hexStrToBytes(raw))).toBe(true);
    });

    sourceCase('chain transaction version roundtrip success', () => {
        expect(throughNative(new Transaction(1254, 0, [], [])).version).toBe(1254);
    });

    sourceCase('chain transaction locktime roundtrip success', () => {
        expect(throughNative(new Transaction(0, 1254, [], [])).locktime).toBe(1254);
    });

    for (const name of ['chain transaction inputs setter 1 roundtrip success', 'chain transaction inputs setter 2 roundtrip success']) {
        sourceCase(name, () => {
            const inputs = [inputFromHex(tx0Inputs())];
            const instance = throughNative(new Transaction(0, 0, inputs, []));
            expect(instance.inputs!.map(i => i.toData(true))).toEqual(inputs.map(i => i.toData(true)));
        });
    }

    for (const name of ['chain transaction outputs setter 1 roundtrip success', 'chain transaction outputs setter 2 roundtrip success']) {
        sourceCase(name, () => {
            const outputs = [outputFromHex(tx0Output())];
            const instance = throughNative(new Transaction(0, 0, [], outputs));
            expect(instance.outputs!.map(o => o.toData(true))).toEqual(outputs.map(o => o.toData(true)));
        });
    }

    sourceCase('chain transaction total input value no cache returns zero', () => {
        const inputs = [
            new Input(new OutputPoint(HashFunctions.nullHash, 0), emptyScript(), 0),
            new Input(new OutputPoint(HashFunctions.nullHash, 0), emptyScript(), 0)];
        expect(new Transaction(0, 0, inputs, []).totalInputValue).toBe(0n);
    });

    sourceCase('chain transaction total output value empty outputs returns zero', () => {
        expect(new Transaction(0, 0, [], []).totalOutputValue).toBe(0n);
    });

    sourceCase('chain transaction total output value non empty outputs returns sum', () => {
        const outputs = [new Output(1200n, emptyScript()), new Output(34n, emptyScript())];
        expect(new Transaction(0, 0, [], outputs).totalOutputValue).toBe(1234n);
    });

    sourceCase('chain transaction is mature no inputs returns true', () => {
        expect(new Transaction(0, 0, [], []).isMature(50)).toBe(true);
    });

    sourceCase('chain transaction operator assign equals 1 always matches equivalent', () => {
        const raw = namedHex(DOMAIN, 'tx4');
        expectEqual(transactionFromHex(raw), transactionFromHex(raw));
    });

    sourceCase('chain transaction operator assign equals 2 always matches equivalent', () => {
        const expected = transactionFromHex(namedHex(DOMAIN, 'tx4'));
        expectEqual(throughNative(expected), expected);
    });

    sourceCase('chain transaction operator boolean equals duplicates returns true', () => {
        const raw = namedHex(DOMAIN, 'tx4');
        expect(wireHex(transactionFromHex(raw))).toBe(wireHex(transactionFromHex(raw)));
    });

    sourceCase('chain transaction operator boolean equals differs returns false', () => {
        const alpha = transactionFromHex(namedHex(DOMAIN, 'tx4'));
        expect(wireHex(alpha)).not.toBe(wireHex(new Transaction(0, 0, [], [])));
    });

    sourceCase('chain transaction operator boolean not equals duplicates returns false', () => {
        const raw = namedHex(DOMAIN, 'tx4');
        expect(wireHex(transactionFromHex(raw)) !== wireHex(transactionFromHex(raw))).toBe(false);
    });

    sourceCase('chain transaction operator boolean not equals differs returns true', () => {
        const alpha = transactionFromHex(namedHex(DOMAIN, 'tx4'));
        expect(wireHex(alpha) !== wireHex(new Transaction(0, 0, [], []))).toBe(true);
    });

    sourceCase('chain transaction hash block320670 success', () => {
        const raw = namedHex(DOMAIN, 'tx7');
        const instance = transactionFromHex(raw);
        expect(Array.from(instance.hash)).toEqual(Array.from(decodeHash(namedHex(DOMAIN, 'tx7_hash'))));
        expect(sameBytes(instance.toData(true), hexStrToBytes(raw))).toBe(true);
    });
});

describeSource(CAPI, () => {
    const VERSION = 2;
    const LOCKTIME = 0;
    const PREV_HASH = Uint8Array.from({ length: 32 }, (_, i) => 0xa0 + i);
    const SCRIPT_BODY = 'ece424a6bb6ddf4db592c0faed60685047a361b1';

    const makeInputs = () => [new Input(new OutputPoint(PREV_HASH as any, 0), scriptFromHex(SCRIPT_BODY), 0xffffffff)];
    const makeOutputs = () => [new Output(50000n, scriptFromHex(SCRIPT_BODY))];
    const makeTx = () => new Transaction(VERSION, LOCKTIME, makeInputs(), makeOutputs());

    sourceCase('C-API Transaction - field constructor preserves version & locktime', () => {
        const tx = throughNative(makeTx());
        expect(tx.version).toBe(VERSION);
        expect(tx.locktime).toBe(LOCKTIME);
    });

    sourceCase('C-API Transaction - from_data insufficient bytes fails', () => {
        expect(Transaction.fromData(new Uint8Array(5))).toBeUndefined();
    });

    sourceCase('C-API Transaction - to_data / from_data roundtrip', () => {
        const expected = makeTx();
        const raw = expected.toData(true);
        expect(raw.length).toBeGreaterThan(0);
        const parsed = Transaction.fromData(raw)!;
        expect(parsed).toBeDefined();
        expect(parsed.version).toBe(VERSION);
        expect(parsed.locktime).toBe(LOCKTIME);
        expectEqual(expected, parsed);
    });

    sourceCase('C-API Transaction - constructor sets version', () => {
        expect(throughNative(new Transaction(VERSION, 0, [], [])).version).toBe(VERSION);
    });

    sourceCase('C-API Transaction - constructor sets locktime', () => {
        expect(throughNative(new Transaction(0, 12345, [], [])).locktime).toBe(12345);
    });

    sourceCase('C-API Transaction - constructor deep-copies inputs', () => {
        const inputs = makeInputs();
        const native = new Transaction(0, 0, inputs, []).toNative();
        inputs.push(new Input(nullPrevout(), emptyScript(), 1));
        const copy = Transaction.fromNative(native, true);
        expect(copy.inputs).toHaveLength(1);
    });

    sourceCase('C-API Transaction - constructor deep-copies outputs', () => {
        const outputs = makeOutputs();
        const native = new Transaction(0, 0, [], outputs).toNative();
        outputs.push(new Output(1n, emptyScript()));
        const copy = Transaction.fromNative(native, true);
        expect(copy.outputs).toHaveLength(1);
    });

    sourceCase('C-API Transaction - default is_coinbase is false', () => {
        expect(new Transaction(0, 0, [], []).isCoinbase).toBe(false);
    });

    sourceCase('C-API Transaction - hash is stable across calls', () => {
        const tx = makeTx();
        expect(Array.from(tx.hash)).toEqual(Array.from(tx.hash));
    });

    sourceCase('C-API Transaction - serialized_size matches to_data length', () => {
        const tx = makeTx();
        expect(tx.serializedSize(true)).toBe(tx.toData(true).length);
    });

    sourceCase('C-API Transaction - copy preserves fields', () => {
        const original = makeTx();
        const copy = original.clone()!;
        expectEqual(original, copy);
        expect(copy.version).toBe(VERSION);
        expect(copy.locktime).toBe(LOCKTIME);
    });

    sourceCase('C-API Transaction - equals identical txs is true, different is false', () => {
        const a = makeTx();
        const b = makeTx();
        const mutated = new Transaction(VERSION, LOCKTIME + 1, makeInputs(), makeOutputs());
        const c = new Transaction(0, 0, [], []);
        expect(wireHex(a)).toBe(wireHex(b));
        expect(wireHex(a)).not.toBe(wireHex(mutated));
        expect(wireHex(a)).not.toBe(wireHex(c));
    });
});

// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the transaction predicates of src/domain/test/chain/transaction.cpp. The Transaction wrapper does not repeat them,
// but its public toNative() hands out the native object that carries them, so they are exercised through that object.
// Cases that first set the previous-output validation cache (spent, confirmed, height, coinbase, cached output) cannot
// be constructed through the public API and stay in the inventory as blocked.
import { HashFunctions, Input, Output, OutputPoint, Script, Transaction, decodeHash, free } from '../..';
import { emptyScript, transactionFromHex } from './support/chain';
import { namedHex } from './support/fixtures';
import { describeSource, sourceCase } from './support/sourceCase';

const DOMAIN = 'src/domain/test/chain/transaction.cpp';
const LOCKTIME_THRESHOLD = 500000000;
const MAX_INPUT_SEQUENCE = 0xffffffff;
const MIN_COINBASE_SIZE = 2;
const MAX_COINBASE_SIZE = 100;

type Native = ReturnType<Transaction['toNative']>;

function query<T>(tx: Transaction, body: (native: Native) => T): T {
    const native = tx.toNative();
    try {
        return body(native);
    } finally {
        free(native);
    }
}

const zeroPoint = () => new OutputPoint(HashFunctions.nullHash, 0);
const nullPoint = () => new OutputPoint(HashFunctions.nullHash, 0xffffffff);
const inputOf = (point: OutputPoint, sequence: number, script: Script = emptyScript()) => new Input(point, script, sequence);
const empty = () => new Transaction(0, 0, [], []);

describeSource(DOMAIN, () => {
    sourceCase('chain transaction is null non coinbase empty inputs returns false', () => {
        expect(query(empty(), n => n.isNullNonCoinbase())).toBe(false);
    });
    sourceCase('chain transaction is null non coinbase one null input returns false', () => {
        expect(query(new Transaction(0, 0, [inputOf(nullPoint(), 0)], []), n => n.isNullNonCoinbase())).toBe(false);
    });
    sourceCase('chain transaction is null non coinbase one non null input returns false', () => {
        expect(query(new Transaction(0, 0, [inputOf(new OutputPoint(HashFunctions.nullHash, 42), 0)], []), n => n.isNullNonCoinbase())).toBe(false);
    });
    sourceCase('chain transaction is null non coinbase two inputs first null returns true', () => {
        const instance = new Transaction(0, 0, [inputOf(nullPoint(), 0), inputOf(new OutputPoint(HashFunctions.nullHash, 42), 0)], []);
        expect(query(instance, n => n.isNullNonCoinbase())).toBe(true);
    });
    sourceCase('chain transaction is null non coinbase coinbase tx returns false', () => {
        expect(query(transactionFromHex(namedHex(DOMAIN, 'tx6')), n => n.isNullNonCoinbase())).toBe(false);
    });
    sourceCase('chain transaction is null non coinbase no null input prevout returns false', () => {
        const instance = empty();
        expect(instance.isCoinbase).toBe(false);
        expect(query(instance, n => n.isNullNonCoinbase())).toBe(false);
    });
    sourceCase('chain transaction is null non coinbase null input prevout returns true', () => {
        const instance = new Transaction(0, 0, [inputOf(zeroPoint(), 0), inputOf(nullPoint(), 0)], []);
        expect(instance.isCoinbase).toBe(false);
        expect(query(instance, n => n.isNullNonCoinbase())).toBe(true);
    });

    sourceCase('chain transaction is final locktime zero returns true', () => {
        expect(query(new Transaction(0, 0, [], []), n => n.isFinal(100, 100))).toBe(true);
    });
    sourceCase('chain transaction is final locktime less block time greater threshold returns true', () => {
        expect(query(new Transaction(0, LOCKTIME_THRESHOLD + 50, [], []), n => n.isFinal(LOCKTIME_THRESHOLD + 100, 100))).toBe(true);
    });
    sourceCase('chain transaction is final locktime less block height less threshold returns true', () => {
        expect(query(new Transaction(0, 50, [], []), n => n.isFinal(100, 100))).toBe(true);
    });
    sourceCase('chain transaction is final locktime input not final returns false', () => {
        expect(query(new Transaction(0, 101, [inputOf(zeroPoint(), 1)], []), n => n.isFinal(100, 100))).toBe(false);
    });
    sourceCase('chain transaction is final locktime inputs final returns true', () => {
        expect(query(new Transaction(0, 101, [inputOf(zeroPoint(), MAX_INPUT_SEQUENCE)], []), n => n.isFinal(100, 100))).toBe(true);
    });

    sourceCase('chain transaction is locked version 1 empty returns false', () => {
        expect(query(new Transaction(1, 0, [], []), n => n.isLocked(0, 0))).toBe(false);
    });
    sourceCase('chain transaction is locked version 2 empty returns false', () => {
        expect(query(new Transaction(2, 0, [], []), n => n.isLocked(0, 0))).toBe(false);
    });
    sourceCase('chain transaction is locked version 1 one of two locked locked returns false', () => {
        const inputs = [inputOf(zeroPoint(), 1), inputOf(zeroPoint(), 0)];
        expect(query(new Transaction(1, 0, inputs, []), n => n.isLocked(0, 0))).toBe(false);
    });
    sourceCase('chain transaction is locked version 4 one of two locked returns true', () => {
        const inputs = [inputOf(zeroPoint(), 1), inputOf(zeroPoint(), 0)];
        expect(query(new Transaction(4, 0, inputs, []), n => n.isLocked(0, 0))).toBe(true);
    });

    sourceCase('chain transaction is locktime conflict locktime zero returns false', () => {
        expect(query(empty(), n => n.isLocktimeConflict())).toBe(false);
    });
    sourceCase('chain transaction is locktime conflict input sequence not maximum returns false', () => {
        expect(query(new Transaction(0, 2143, [inputOf(zeroPoint(), 1)], []), n => n.isLocktimeConflict())).toBe(false);
    });
    sourceCase('chain transaction is locktime conflict no inputs returns true', () => {
        expect(query(new Transaction(0, 2143, [], []), n => n.isLocktimeConflict())).toBe(true);
    });
    sourceCase('chain transaction is locktime conflict input max sequence returns true', () => {
        expect(query(new Transaction(0, 2143, [inputOf(zeroPoint(), MAX_INPUT_SEQUENCE)], []), n => n.isLocktimeConflict())).toBe(true);
    });

    const coinbaseWith = (script: Script) => new Transaction(0, 0, [inputOf(nullPoint(), 0, script)], []);
    sourceCase('chain transaction is oversized coinbase non coinbase tx returns false', () => {
        const instance = transactionFromHex(namedHex(DOMAIN, 'tx5'));
        expect(instance.isCoinbase).toBe(false);
        expect(query(instance, n => n.isOversizedCoinbase())).toBe(false);
    });
    sourceCase('chain transaction is oversized coinbase script size below min returns true', () => {
        const instance = coinbaseWith(emptyScript());
        expect(instance.isCoinbase).toBe(true);
        expect(instance.inputs![0].script!.toData(false).length).toBeLessThan(MIN_COINBASE_SIZE);
        expect(query(instance, n => n.isOversizedCoinbase())).toBe(true);
    });
    sourceCase('chain transaction is oversized coinbase script size above max returns true', () => {
        const oversized = Script.fromData(new Uint8Array(MAX_COINBASE_SIZE + 10), false)!;
        expect(oversized).toBeDefined();
        expect(oversized.toData(false).length).toBeGreaterThan(MAX_COINBASE_SIZE);
        const instance = coinbaseWith(oversized);
        expect(instance.isCoinbase).toBe(true);
        expect(query(instance, n => n.isOversizedCoinbase())).toBe(true);
    });
    sourceCase('chain transaction is oversized coinbase script size within bounds returns false', () => {
        const valid = Script.fromData(new Uint8Array(50), false)!;
        const size = valid.toData(false).length;
        expect(size).toBeGreaterThanOrEqual(MIN_COINBASE_SIZE);
        expect(size).toBeLessThanOrEqual(MAX_COINBASE_SIZE);
        const instance = coinbaseWith(valid);
        expect(instance.isCoinbase).toBe(true);
        expect(query(instance, n => n.isOversizedCoinbase())).toBe(false);
    });

    sourceCase('chain transaction is overspent output does not exceed input returns false', () => {
        expect(query(empty(), n => n.isOverspent())).toBe(false);
    });
    sourceCase('chain transaction is overspent output exceeds input returns true', () => {
        const instance = new Transaction(0, 0, [], [new Output(1200n, emptyScript()), new Output(34n, emptyScript())]);
        expect(query(instance, n => n.isOverspent())).toBe(true);
    });

    sourceCase('chain transaction signature operations uninitialized input output returns zero', () => {
        const instance = new Transaction(0, 0, [inputOf(zeroPoint(), 0)], [new Output(0n, emptyScript())]);
        expect(query(instance, n => n.signatureOperations(false, false))).toBe(0);
    });
    sourceCase('chain transaction signature operations p2pkh transaction returns output sigops', () => {
        // tx1 has two P2PKH outputs (one checksig each) and no checksig in its input script.
        expect(query(transactionFromHex(namedHex(DOMAIN, 'tx1')), n => n.signatureOperations(false, false))).toBe(2);
    });
    sourceCase('chain transaction signature operations multiple inputs p2pkh returns output sigops', () => {
        // tx4 has three inputs and two P2PKH outputs.
        expect(query(transactionFromHex(namedHex(DOMAIN, 'tx4')), n => n.signatureOperations(false, false))).toBe(2);
    });

    sourceCase('chain transaction is missing previous outputs empty inputs returns false', () => {
        expect(query(empty(), n => n.isMissingPreviousOutputs())).toBe(false);
    });
    sourceCase('chain transaction is missing previous outputs inputs without cache value returns true', () => {
        expect(query(new Transaction(0, 0, [inputOf(zeroPoint(), 0)], []), n => n.isMissingPreviousOutputs())).toBe(true);
    });
    sourceCase('chain transaction missing previous outputs empty inputs returns empty', () => {
        expect(query(empty(), n => n.missingPreviousOutputs().count())).toBe(0);
    });
    sourceCase('chain transaction missing previous outputs default input returns point', () => {
        // The input has index 0, not the null index, and no cached output, so it is missing.
        expect(query(new Transaction(0, 0, [inputOf(zeroPoint(), 0)], []), n => n.missingPreviousOutputs().count())).toBe(1);
    });
    sourceCase('chain transaction missing previous outputs null input returns empty', () => {
        expect(query(new Transaction(0, 0, [inputOf(nullPoint(), 0)], []), n => n.missingPreviousOutputs().count())).toBe(0);
    });
    sourceCase('chain transaction missing previous outputs non null input without cache returns point', () => {
        const expectedHash = decodeHash('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f');
        const instance = new Transaction(0, 0, [inputOf(new OutputPoint(expectedHash, 42), 0)], []);
        query(instance, n => {
            const missing = n.missingPreviousOutputs();
            expect(missing.count()).toBe(1);
            const point = missing.nth(0);
            expect(Array.from(HashFunctions.fromNative(point.hash(), true))).toEqual(Array.from(expectedHash));
            expect(point.index()).toBe(42);
        });
    });

    sourceCase('chain transaction is double spend empty inputs returns false', () => {
        expect(query(empty(), n => n.isDoubleSpend(false))).toBe(false);
        expect(query(empty(), n => n.isDoubleSpend(true))).toBe(false);
    });
    sourceCase('chain transaction is double spend unspent inputs returns false', () => {
        const instance = new Transaction(0, 0, [inputOf(zeroPoint(), 0)], []);
        expect(query(instance, n => n.isDoubleSpend(false))).toBe(false);
        expect(query(instance, n => n.isDoubleSpend(true))).toBe(false);
    });

    sourceCase('chain transaction is dusty no outputs zero returns false', () => {
        expect(query(empty(), n => n.isDusty(0n))).toBe(false);
    });
    const dusty = (name: string, limit: bigint, expected: boolean) => {
        sourceCase(name, () => {
            expect(query(transactionFromHex(namedHex(DOMAIN, 'tx1')), n => n.isDusty(limit))).toBe(expected);
        });
    };
    dusty('chain transaction is dusty two outputs limit above both returns true', 1740950001n, true);
    dusty('chain transaction is dusty two outputs limit below both returns false', 257999999n, false);
    dusty('chain transaction is dusty two outputs limit at upper returns true', 1740950000n, true);
    dusty('chain transaction is dusty two outputs limit at lower returns false', 258000000n, false);
    dusty('chain transaction is dusty two outputs limit between both returns true', 258000001n, true);
});

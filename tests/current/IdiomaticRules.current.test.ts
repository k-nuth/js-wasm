// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Generated wrappers of every kind (value, state, union, flattened, serialized, static module, session) exercised against
// the real library: construction, field mutation, arrays, nested conversion, absent values, status errors, disposal,
// retention, caller-owned handles and failures while converting a second argument.
import {
    Debugger, HashFunctions, HdPublic, Input, Interpreter, Opcode, Operation, Output, OutputPoint, PaymentAddress, Program,
    Script, ScriptFlags, SighashAlgorithm, TokenData, TokenDataBothKinds, TokenDataFungible, TokenDataNonFungible, Transaction,
    Utxo, WalletManager
} from '../..';
import { hexStrToBytes } from '../..';
import type { Hash } from '../..';

const p2pkhHex = '76a91406ccef231c2db72526df9338894ccf9355e8f12188ac';
const p2pkh = (): Script => Script.fromData(hexStrToBytes(p2pkhHex), false) as Script;
const hash = (fill: number) => new Uint8Array(32).fill(fill) as Hash;
const input = (n: number) => new Input(new OutputPoint(hash(n + 1), n), p2pkh(), 0xffffffff);

describe('Transaction (generated)', () => {
    const make = () => new Transaction(1, 0, [input(0), input(1)], [new Output(5000n, p2pkh())]);

    it('keeps mutable array fields and round-trips through the wire format', () => {
        const tx = make();
        tx.locktime = 77;
        tx.outputs = [new Output(1n, p2pkh()), new Output(2n, p2pkh())];
        const again = Transaction.fromData(tx.toData(true)) as Transaction;
        expect(again.locktime).toBe(77);
        expect(again.inputs?.length).toBe(2);
        expect(again.outputs?.map(o => o.value)).toEqual([1n, 2n]);
        expect(again.inputs?.[1].previousOutput?.index).toBe(1);
        expect(again.serializedSize(true)).toBe(tx.serializedSize(true));
    });

    it('is valid only when complete and not the null value; bad data is undefined', () => {
        expect(make().valid).toBe(true);
        expect(new Transaction().valid).toBe(false);
        expect(new Transaction(1, 0, undefined, []).valid).toBe(false);
        expect(Transaction.isValid(make().toData(true))).toBe(true);
        expect(Transaction.isValid(new Uint8Array([1, 2, 3]))).toBe(false);
        expect(Transaction.fromData(new Uint8Array([1, 2, 3]))).toBeUndefined();
    });

    it('exposes the hash, fee totals and clone with the JavaScript-only cached outputs', () => {
        const tx = make();
        expect(tx.hash.length).toBe(32);
        expect(tx.isCoinbase).toBe(false);
        const cached = new Output(9n, p2pkh());
        tx.inputs![0].previousOutput!.cachedOutput = cached;
        expect(tx.clone()?.inputs?.[0].previousOutput?.cachedOutput).toBe(cached);
        expect(tx.totalOutputValue).toBe(5000n);
    });

    it('checks that a signed response only changed unlocking scripts', () => {
        const template = make();
        const signed = make();
        expect(Transaction.hasSameSigningStructure(template, signed)).toBe(true);
        signed.outputs![0].value = 4999n;
        expect(Transaction.hasSameSigningStructure(template, signed)).toBe(false);
    });

    it('releases the first nested list when the second cannot be converted', () => {
        const tx = make();
        const bad = new Output(1n, p2pkh());
        bad.toNative = () => { throw new Error('output conversion failed'); };
        tx.outputs = [bad];
        expect(() => tx.toNative()).toThrow('output conversion failed');
    });
});

describe('Utxo (generated, flattened point)', () => {
    it('flattens the point into hash and index and composes it back', () => {
        const utxo = new Utxo(hash(5), 3, 1000n);
        const again = Utxo.fromNative(utxo.toNative(), true);
        expect(again.hash).toEqual(hash(5));
        expect(again.index).toBe(3);
        expect(again.amount).toBe(1000n);
        expect(again.tokenData).toBeUndefined();
        expect(utxo.valid).toBe(true);
    });

    it('coerces the amount and answers the default native when nothing is set', () => {
        expect(new Utxo(hash(1), 0, 7 as unknown as bigint).amount).toBe(7n);
        const native = new Utxo().toNative();
        // the constructor keeps its historical coercion: a zero amount is `undefined` (falsy), as in the baseline wrapper
        expect(Utxo.fromNative(native, true).amount).toBeUndefined();
        expect(new Utxo().valid).toBe(false);
    });
});

describe('TokenData (generated union)', () => {
    const category = hash(9);

    it('round-trips each variant and maps the capability spelling at the boundary', () => {
        const fungible = TokenData.fromNative(new TokenData(category, new TokenDataFungible(5n)).toNative(), true);
        expect(fungible.kind).toBe('fungible');
        expect((fungible.data as TokenDataFungible).amount).toBe(5n);
        const nft = TokenData.fromNative(
            new TokenData(category, new TokenDataNonFungible('mutable', new Uint8Array([1, 2]))).toNative(), true);
        expect(nft.kind).toBe('non_fungible');
        expect((nft.data as TokenDataNonFungible).capability).toBe('mutable');
        expect((nft.data as TokenDataNonFungible).commitment).toEqual(new Uint8Array([1, 2]));
        const both = TokenData.fromNative(
            new TokenData(category, new TokenDataBothKinds(3n, 'minting', new Uint8Array([7]))).toNative(), true);
        expect(both.kind).toBe('both');
        expect((both.data as TokenDataBothKinds).fungible.amount).toBe(3n);
    });

    it('refuses to convert incomplete or invalid token data', () => {
        expect(() => new TokenData().toNative()).toThrow(/Invalid token data/);
        expect(new TokenData(category).valid).toBe(false);
        expect(new TokenData(category, new TokenDataFungible(5n)).valid).toBe(true);
        expect(() => new TokenDataNonFungible('bogus' as 'none', new Uint8Array()).capability).not.toThrow();
        expect(() => new TokenData(category, new TokenDataNonFungible('bogus' as 'none', new Uint8Array())).toNative())
            .toThrow(RangeError);
    });
});

describe('Script, Operation and addresses (generated)', () => {
    it('serializes through private fields and exposes operations as an array', () => {
        const script = p2pkh();
        expect(script.valid).toBe(true);
        expect(script.operations.length).toBe(5);
        expect(script.operations[0]).toBeInstanceOf(Operation);
        expect(script.toData(false)).toEqual(hexStrToBytes(p2pkhHex));
        expect(Script.fromOperations(script.operations)?.toData(false)).toEqual(hexStrToBytes(p2pkhHex));
        expect(Script.isValid(hexStrToBytes(p2pkhHex), false)).toBe(true);
        expect(Script.isPayPublicKeyHashPattern(script.operations)).toBe(true);
        expect(Script.toNullDataPattern(new Uint8Array(200))).toBeUndefined();
    });

    it('resolves opcode aliases and keeps a raw operation round-trippable', () => {
        const op = new Operation('dup');
        expect(op.code).toBe('dup');
        expect(Operation.fromData(op.toData())?.toData()).toEqual(op.toData());
        expect(new Operation(new Uint8Array([1, 2, 3])).isPush).toBe(true);
        expect(Opcode.toInt('dup')).toBe(0x76);
        expect(Opcode.toInt('disabled_verif')).toBe(Opcode.toInt(Opcode.resolve('disabled_verif')));
        expect(Operation.opcodeIsPush('dup')).toBe(false);
        expect(() => Reflect.construct(Operation, [5])).toThrow('Invalid argument type');
    });

    it('parses addresses through the ordered attempts and rebuilds them from hashes', () => {
        const address = PaymentAddress.fromScript(p2pkh(), PaymentAddress.mainnetP2kh);
        const legacy = address.encodedLegacy();
        expect(legacy.startsWith('1')).toBe(true);
        expect(PaymentAddress.fromString(legacy)?.hash).toEqual(address.hash);
        expect(PaymentAddress.fromString(address.encodedCashAddr())?.encodedLegacy()).toBe(legacy);
        expect(PaymentAddress.isValid('not an address')).toBe(false);
        expect(PaymentAddress.fromString('not an address')).toBeUndefined();
        expect(PaymentAddress.fromHash(address.hash32, PaymentAddress.mainnetP2sh)?.version).toBe(PaymentAddress.mainnetP2sh);
        expect(PaymentAddress.extractOutput(p2pkh(), 0x00, 0x05).length).toBe(1);
    });
});

describe('Endorsement guard (generated forwarding)', () => {
    const secret = new Uint8Array(32).fill(1) as Uint8Array & { length: 32 };
    const utxos = SighashAlgorithm.utxos | SighashAlgorithm.all;

    it('refuses SIGHASH_UTXOS with 1001 / 1002 / 1003 before touching native code', () => {
        const tx = new Transaction(1, 0, [input(0)], [new Output(1n, p2pkh())]);
        expect(Script.createEndorsementResult(secret, p2pkh(), tx, 0, utxos, 0n, 1n, 'schnorr')).toEqual({ success: false, errorCode: 1001 });
        tx.inputs![0].previousOutput!.cachedOutput = new Output(1n, p2pkh());
        expect(Script.createEndorsementResult(secret, p2pkh(), tx, 0, utxos, 0n, 1n, 'schnorr')).toEqual({ success: false, errorCode: 1002 });
        expect(Script.createEndorsementResult(secret, p2pkh(), tx, 0, utxos, ScriptFlags.bchTokens, 1n, 'schnorr')).toEqual({ success: false, errorCode: 1003 });
        expect(() => Script.createEndorsement(secret, p2pkh(), tx, 0, utxos, 0n, 1n, 'schnorr')).toThrow(/error 1002/);
    });
});

describe('Program, Interpreter and Debugger (generated state wrappers)', () => {
    const program = () => new Program(Script.fromData(hexStrToBytes('5152'), false) as Script);

    it('runs a program without taking ownership of it', () => {
        const p = program();
        expect(typeof Interpreter.run(p)).toBe('number');
        expect(p.size).toBe(2);
        expect(p.valid).toBe(true);
        p.dispose();
    });

    it('leaves the caller program usable when a second conversion fails', () => {
        const p = program();
        const op = new Operation('dup');
        op.toNative = () => { throw new Error('operation conversion failed'); };
        expect(() => Interpreter.runOperation(op, p)).toThrow('operation conversion failed');
        expect(p.valid).toBe(true);
        p.dispose();
    });

    it('disposes once, refuses use afterwards and keeps copies independent', () => {
        const p = program();
        Interpreter.run(p);
        const copy = p.copy();
        expect(copy.size).toBe(p.size);
        p.dispose();
        p.dispose();
        expect(() => p.size).toThrow(/disposed/);
        copy.dispose();
    });

    it('rejects arguments that select no constructor', () => {
        expect(() => new Program(Script.fromData(hexStrToBytes('51'), false) as Script, {} as Program)).toThrow('Invalid argument type');
    });

    it('steps through a debugger session that never disposes the caller program', () => {
        const p = program();
        const session = Interpreter.debug(p) as Debugger;
        expect(session).toBeInstanceOf(Debugger);
        let guard = 0;
        while (session.stepsAvailable && guard++ < 10) {
            session.stepForward();
        }
        expect(session.lastProgram).toBeDefined();
        session.dispose();
        session.dispose();
        expect(p.valid).toBe(true);
        p.dispose();
    });
});

describe('HdPublic and WalletManager (generated)', () => {
    it('parses what it encodes, derives children and exposes the point', () => {
        const data = WalletManager.createSimple('password');
        expect(data?.mnemonics?.length).toBeGreaterThan(0);
        const xpub = data!.xpub as HdPublic;
        const parsed = HdPublic.fromString(xpub.encoded) as HdPublic;
        expect(parsed.encoded).toBe(xpub.encoded);
        expect(HdPublic.isValid(xpub.encoded)).toBe(true);
        expect(HdPublic.isValid('garbage')).toBe(false);
        expect(HdPublic.fromString('garbage')).toBeUndefined();
        expect(parsed.derivePublic(1).encoded).not.toBe(parsed.encoded);
        expect(parsed.point.bytes.length).toBe(33);
        parsed.dispose();
        expect(() => parsed.encoded).toThrow(/disposed/);
    });

    it('decrypts a seed to 64 bytes and reports unavailable members loudly', () => {
        const data = WalletManager.createSimple('password');
        expect(WalletManager.decryptSeed('password', data!.encryptedSeed!)?.length).toBe(64);
        expect('createWallet' in WalletManager).toBe(false);
    });
});

describe('hash conventions', () => {
    it('uses the shared null hash', () => {
        expect(HashFunctions.nullHash.length).toBe(32);
    });
});

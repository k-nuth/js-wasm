// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// The generated HD wallet owns a master key and an account key: every intermediate key is released, a construction that
// fails releases what it acquired, and dispose() releases the keys it owns. The native keys are counted through their
// prototype: every key the wallet creates (copy / derivePrivate results, the master) must be destroyed exactly once.
import { Wallet } from '../..';
import { bytesToHexStr } from '../..';

const MNEMONIC = ['car', 'slab', 'tail', 'dirt', 'wife', 'custom', 'front', 'shield', 'diet', 'pear', 'skull', 'vapor',
    'gorilla', 'token', 'yard'];
const PATH = "m/44'/145'/0'/0";

type Inside = { master?: object; account?: object; seed: Uint8Array };
const inside = (wallet: Wallet) => wallet as unknown as Inside;

interface KeyProto {
    _destructor(): void;
    derivePrivate(index: number): object;
    copy(): object;
}

// The prototype of the native key class, taken from a throwaway wallet.
const keyPrototype = (): KeyProto => {
    const probe = new Wallet(MNEMONIC, 'm', 'MAINNET');
    const proto = Object.getPrototypeOf(inside(probe).master as object) as KeyProto;
    probe.dispose();
    return proto;
};

describe('Wallet (generated lifecycle)', () => {
    let proto: KeyProto;
    let destroyed: jest.SpyInstance;
    let derived: jest.SpyInstance;
    let copied: jest.SpyInstance;

    beforeAll(() => {
        proto = keyPrototype();
    });

    beforeEach(() => {
        destroyed = jest.spyOn(proto, '_destructor');
        derived = jest.spyOn(proto, 'derivePrivate');
        copied = jest.spyOn(proto, 'copy');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // every key created: the master (1), the account copies, and each derivation that returned a key
    const returned = (spy: jest.SpyInstance) => spy.mock.results.filter(result => result.type === 'return').length;
    const created = () => 1 + returned(copied) + returned(derived);

    it('releases every key it creates: construction, repeated derivation and disposal', () => {
        const wallet = new Wallet(MNEMONIC, PATH, 'MAINNET');
        for (let i = 0; i < 25; ++i) {
            wallet.getSecret(i);
            wallet.getAddress(i % 5).encoded();
        }
        wallet.dispose();
        expect(destroyed).toHaveBeenCalledTimes(created());
        // constructor: copy + one derivation per path step, then 25 secrets and 25 addresses
        expect(derived).toHaveBeenCalledTimes(4 + 25 + 25);
    });

    it('disposes once: a second dispose releases nothing and the wallet refuses further use', () => {
        const wallet = new Wallet(MNEMONIC, PATH, 'MAINNET');
        wallet.dispose();
        const after = destroyed.mock.calls.length;
        wallet.dispose();
        expect(destroyed).toHaveBeenCalledTimes(after);
        expect(() => wallet.getSecret(0)).toThrow(/disposed/);
        expect(() => wallet.getAddress(0)).toThrow(/disposed/);
    });

    it('an invalid path fails before any native key exists', () => {
        expect(() => new Wallet(MNEMONIC, "m/44'/x", 'MAINNET')).toThrow('Invalid derivation path.');
        expect(derived).not.toHaveBeenCalled();
        expect(copied).not.toHaveBeenCalled();
        expect(destroyed).not.toHaveBeenCalled();
    });

    it('a derivation that fails midway releases the master, the account copy and the derived keys', () => {
        // the second step is outside the unsigned 32-bit range: refused when the argument reaches the native call
        expect(() => new Wallet(MNEMONIC, 'm/1/4294967296', 'MAINNET')).toThrow(RangeError);
        expect(derived.mock.calls.length).toBeGreaterThan(0);
        expect(destroyed).toHaveBeenCalledTimes(created());
    });

    it('does not touch the caller seed and keeps its own copy', () => {
        const original = inside(new Wallet(MNEMONIC, PATH, 'MAINNET')).seed;
        const seed = new Uint8Array(original) as Uint8Array & { length: 64 };
        const kept = new Uint8Array(seed);
        const wallet = new Wallet(seed, PATH, 'MAINNET');
        expect(new Uint8Array(seed)).toEqual(kept);
        seed.fill(0);
        expect(wallet.getAddress(0).encoded()).toBe('bitcoincash:qr9sawzzmstkluq9nqefsu7eqya4zk2w7udune2pmf');
        wallet.dispose();
    });

    it('hands the public key of a triple to the caller and disposes the ones it did not return', () => {
        const wallet = new Wallet(MNEMONIC, PATH, 'MAINNET');
        const wanted = wallet.getAddress(3);
        const triple = wallet.getTripleOf(wanted, 10);
        expect(triple).toBeDefined();
        expect(triple!.address.encoded()).toBe(wanted.encoded());
        expect(triple!.publicKey.encoded.length).toBeGreaterThan(0);
        // the address passed in and the wallet are still usable
        expect(wanted.encoded()).toBe(wallet.getAddress(3).encoded());
        triple!.publicKey.dispose();
        expect(() => triple!.publicKey.encoded).toThrow(/disposed/);
        expect(wallet.getSecret(3)).toEqual(triple!.secret);
        expect(wallet.getTripleOf(wanted, 3)).toBeUndefined();
        wallet.dispose();
    });

    it('enumerates public keys and addresses with defaults and a start index', () => {
        const wallet = new Wallet(MNEMONIC, PATH, 'MAINNET');
        const keys = wallet.getPublicKeys(3, 2);
        expect(keys.length).toBe(3);
        expect(new Set(keys.map(k => k.encoded)).size).toBe(3);
        keys.forEach(k => k.dispose());
        expect(wallet.getAddresses().length).toBe(20);
        expect(bytesToHexStr(wallet.getSecret(0))).toBe(bytesToHexStr(wallet.getTriple(0).secret));
        wallet.dispose();
    });

    it('derives an account wallet from the same mnemonic and network', () => {
        const wallet = new Wallet(MNEMONIC, PATH, 'MAINNET');
        const other = wallet.deriveAccount("m/44'/145'/1'/0");
        expect(other.getAddress(0).encoded()).not.toBe(wallet.getAddress(0).encoded());
        other.dispose();
        wallet.dispose();
    });
});

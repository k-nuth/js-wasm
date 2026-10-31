// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the OutputPoint, Utxo and TokenData cases that the public wrappers can express (src/domain/test/chain/output_point.cpp,
// src/c-api/test/chain/output_point.cpp, utxo.cpp and token_data.cpp). The wrappers expose no OutputPoint serialization,
// no Utxo height, no TokenData parser and no equals(); those cases are blocked in the inventory.
import { HashFunctions, OutputPoint, TokenData, TokenDataBothKinds, TokenDataFungible, TokenDataNonFungible, Utxo, decodeHash, free } from '../..';
import { namedHex } from './support/fixtures';
import { describeSource, sourceCase } from './support/sourceCase';

const DOMAIN_POINT = 'src/domain/test/chain/output_point.cpp';
const CAPI_POINT = 'src/c-api/test/chain/output_point.cpp';
const CAPI_UTXO = 'src/c-api/test/chain/utxo.cpp';
const CAPI_TOKEN = 'src/c-api/test/chain/token_data.cpp';

const throughNative = (point: OutputPoint) => OutputPoint.fromNative(point.toNative(), true);
const filled = (byte: number) => new Uint8Array(32).fill(byte) as any;

describeSource(DOMAIN_POINT, () => {
    const hash1 = () => decodeHash(namedHex(DOMAIN_POINT, 'hash1'));

    for (const name of ['output point constructor 4 valid input returns input initialized', 'output point constructor 5 valid input returns input initialized']) {
        sourceCase(name, () => {
            const instance = throughNative(new OutputPoint(hash1(), 1234));
            expect(Array.from(instance.hash!)).toEqual(Array.from(hash1()));
            expect(instance.index).toBe(1234);
        });
    }

    sourceCase('output point constructor 6 valid input returns input initialized', () => {
        const expected = new OutputPoint(hash1(), 524342);
        const instance = throughNative(throughNative(expected));
        expect(Array.from(instance.hash!)).toEqual(Array.from(expected.hash!));
        expect(instance.index).toBe(524342);
    });

    sourceCase('output point constructor 7 valid input returns input initialized', () => {
        expect(throughNative(new OutputPoint(hash1(), 524342)).index).toBe(524342);
    });
});

describeSource(CAPI_POINT, () => {
    const hash =new Uint8Array([
        0x6f, 0xe2, 0x8c, 0x0a, 0xb6, 0xf1, 0xb3, 0x72, 0xc1, 0xa6, 0xa2, 0x46, 0xae, 0x63, 0xf7, 0x4f,
        0x93, 0x1e, 0x83, 0x65, 0xe1, 0x5a, 0x08, 0x9c, 0x68, 0xd6, 0x19, 0x00, 0x00, 0x00, 0x00, 0x00]) as any;

    sourceCase('C-API OutputPoint - default construct yields zeroed point', () => {
        expect(throughNative(new OutputPoint())).toBeDefined();
    });

    sourceCase('C-API OutputPoint - construct from hash and index', () => {
        const point = throughNative(new OutputPoint(hash, 1234));
        expect(point.index).toBe(1234);
        expect(Array.from(point.hash!)).toEqual(Array.from(hash));
    });

    sourceCase('C-API OutputPoint - construct exposes hash', () => {
        expect(Array.from(throughNative(new OutputPoint(hash, 0)).hash!)).toEqual(Array.from(hash));
    });

    sourceCase('C-API OutputPoint - construct exposes index', () => {
        expect(throughNative(new OutputPoint(hash, 9999)).index).toBe(9999);
    });

    sourceCase('C-API OutputPoint - copy preserves fields', () => {
        const copy = throughNative(throughNative(new OutputPoint(hash, 524342)));
        expect(copy.index).toBe(524342);
        expect(Array.from(copy.hash!)).toEqual(Array.from(hash));
    });
});

describeSource(CAPI_UTXO, () => {
    const TXID = filled(0xaa);
    const CATEGORY = filled(0xbb);
    const throughUtxo = (utxo: Utxo) => Utxo.fromNative(utxo.toNative(), true);

    sourceCase('C-API Utxo - construct from point+amount yields engaged values', () => {
        const utxo = throughUtxo(new Utxo(TXID, 7, 5000n));
        expect(utxo.amount).toBe(5000n);
        expect(utxo.tokenData).toBeUndefined();
        expect(utxo.index).toBe(7);
    });

    sourceCase('C-API Utxo - construct with token_data stores it', () => {
        const token = new TokenData(CATEGORY, new TokenDataFungible(1234n));
        const utxo = throughUtxo(new Utxo(TXID, 0, 1000n, token));
        expect(utxo.tokenData).toBeDefined();
        expect((utxo.tokenData!.data as TokenDataFungible).amount).toBe(1234n);
    });

    sourceCase('C-API Utxo - copy preserves fields and equals original', () => {
        const original = new Utxo(TXID, 3, 999n);
        const copy = throughUtxo(throughUtxo(original));
        expect(copy.amount).toBe(999n);
        expect(copy.index).toBe(3);
        expect(Array.from(copy.hash!)).toEqual(Array.from(TXID));
    });
});

describeSource(CAPI_TOKEN, () => {
    const A = filled(0xaa);
    const B = filled(0xbb);
    const COMMITMENT = Uint8Array.of(0x10, 0x20, 0x30, 0x40, 0x50);
    const throughToken = (token: TokenData) => TokenData.fromNative(token.toNative(), true);

    sourceCase('C-API TokenData - make_fungible builds a valid handle', () => {
        const token = new TokenData(A, new TokenDataFungible(1234n));
        expect(token.valid).toBe(true);
        expect(token.kind).toBe('fungible');
        const stored = throughToken(token);
        expect(stored.kind).toBe('fungible');
        expect((stored.data as TokenDataFungible).amount).toBe(1234n);
        expect(Array.from(stored.category!)).toEqual(Array.from(A));
    });

    sourceCase('C-API TokenData - make_non_fungible mutable carries commitment and capability', () => {
        const token = new TokenData(A, new TokenDataNonFungible('mutable', COMMITMENT));
        expect(token.valid).toBe(true);
        const stored = throughToken(token);
        expect(stored.kind).toBe('non_fungible');
        const nft = stored.data as TokenDataNonFungible;
        expect(nft.capability).toBe('mutable');
        expect(Array.from(nft.commitment)).toEqual(Array.from(COMMITMENT));
    });

    sourceCase('C-API TokenData - make_non_fungible immutable', () => {
        const token = new TokenData(A, new TokenDataNonFungible('none', COMMITMENT));
        expect(token.valid).toBe(true);
        expect((throughToken(token).data as TokenDataNonFungible).capability).toBe('none');
    });

    sourceCase('C-API TokenData - make_non_fungible minting', () => {
        const token = new TokenData(A, new TokenDataNonFungible('minting', COMMITMENT));
        expect(token.valid).toBe(true);
        expect((throughToken(token).data as TokenDataNonFungible).capability).toBe('minting');
    });

    sourceCase('C-API TokenData - make_non_fungible with empty commitment', () => {
        const token = new TokenData(A, new TokenDataNonFungible('none', new Uint8Array(0)));
        expect(throughToken(token).data).toBeInstanceOf(TokenDataNonFungible);
        expect((throughToken(token).data as TokenDataNonFungible).commitment).toHaveLength(0);
    });

    sourceCase('C-API TokenData - make_both carries amount, capability, commitment', () => {
        const token = new TokenData(A, new TokenDataBothKinds(9999n, 'mutable', COMMITMENT));
        expect(token.valid).toBe(true);
        const stored = throughToken(token);
        expect(stored.kind).toBe('both');
        const both = stored.data as TokenDataBothKinds;
        expect(both.fungible.amount).toBe(9999n);
        expect(both.nonFungible.capability).toBe('mutable');
        expect(Array.from(both.nonFungible.commitment)).toEqual(Array.from(COMMITMENT));
    });

    sourceCase('C-API TokenData - make_fungible rejects amount 0', () => {
        expect(new TokenData(A, new TokenDataFungible(0n)).valid).toBe(false);
    });

    sourceCase('C-API TokenData - make_fungible rejects amounts above INT64_MAX', () => {
        expect(new TokenData(A, new TokenDataFungible(0xffffffffffffffffn)).valid).toBe(false);
    });

    sourceCase('C-API TokenData - make_both rejects amount 0', () => {
        expect(new TokenData(A, new TokenDataBothKinds(0n, 'mutable', COMMITMENT)).valid).toBe(false);
    });

    sourceCase('C-API TokenData - get_amount returns 0 for pure NFT', () => {
        const native = new TokenData(A, new TokenDataNonFungible('none', COMMITMENT)).toNative();
        try {
            expect(native.getAmount()).toBe(0n);
        } finally {
            free(native);
        }
    });

    sourceCase('C-API TokenData - get_nft_capability is `none` for pure fungible', () => {
        const native = new TokenData(A, new TokenDataFungible(1n)).toNative();
        try {
            expect(native.getNftCapability()).toBe('none');
        } finally {
            free(native);
        }
    });

    sourceCase('C-API TokenData - set_id replaces category', () => {
        const native = new TokenData(A, new TokenDataFungible(1n)).toNative();
        const replacement = HashFunctions.toNative(B);
        try {
            native.setId(replacement);
            expect(Array.from(HashFunctions.fromNative(native.id(), true))).toEqual(Array.from(B));
        } finally {
            free(replacement);
            free(native);
        }
    });

    sourceCase('C-API TokenData - different categories compare unequal', () => {
        const a = new TokenData(A, new TokenDataFungible(1n)).toNative();
        const b = new TokenData(B, new TokenDataFungible(1n)).toNative();
        try {
            expect(a.equals(b)).toBe(false);
        } finally {
            free(a);
            free(b);
        }
    });

    sourceCase('C-API TokenData - different amounts compare unequal', () => {
        const a = new TokenData(A, new TokenDataFungible(1n)).toNative();
        const b = new TokenData(A, new TokenDataFungible(2n)).toNative();
        try {
            expect(a.equals(b)).toBe(false);
        } finally {
            free(a);
            free(b);
        }
    });

    sourceCase('C-API TokenData - copy preserves equality', () => {
        const original = new TokenData(A, new TokenDataBothKinds(42n, 'mutable', COMMITMENT)).toNative();
        const copy = original.copy();
        try {
            expect(copy).not.toBeNull();
            expect(original.equals(copy)).toBe(true);
        } finally {
            free(copy);
            free(original);
        }
    });

    sourceCase('C-API TokenData - make_fungible_unsafe builds the same handle', () => {
        const safe = new TokenData(A, new TokenDataFungible(7n)).toNative();
        const again = new TokenData(A, new TokenDataFungible(7n)).toNative();
        try {
            expect(safe.equals(again)).toBe(true);
        } finally {
            free(safe);
            free(again);
        }
    });
});

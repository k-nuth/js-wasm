// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the src/c-api/test cases for DataStack, PointList, TokenData serialization and the HdPublic key round trip. The
// native classes are the ones public calls return (support/natives.ts): Program.pop(n), Transaction native previousOutputs(),
// TokenData.toNative() and HdPublic.toNative(). OutputPointList and TransactionList have no public accessor that returns
// them, so their cases stay blocked in the inventory.
import { HashFunctions, TokenData, TokenDataBothKinds, TokenDataFungible, free } from '../..';
import { HdPublicNative, PointNative, dataStackClass, hdPublicClass, pointClass, pointListClass, tokenDataClass } from './support/natives';
import { describeSource, sourceCase } from './support/sourceCase';

describeSource('src/c-api/test/data_stack.cpp', () => {
    const make = () => new (dataStackClass())();

    sourceCase('C-API DataStack - default construct yields empty list', () => {
        expect(make().count()).toBe(0);
    });

    sourceCase('C-API DataStack - copy is independent of source', () => {
        const source = make();
        source.pushBack(Uint8Array.of(0x01, 0x02, 0x03));
        source.pushBack(Uint8Array.of(0xff));
        const copy = source.copy();
        expect(copy.count()).toBe(2);
        copy.erase(0);
        expect(copy.count()).toBe(1);
        expect(source.count()).toBe(2);
    });

    sourceCase('C-API DataStack - push_back appends variable-length buffers', () => {
        const list = make();
        list.pushBack(Uint8Array.of(0xde, 0xad, 0xbe, 0xef));
        list.pushBack(Uint8Array.of(0x42));
        expect(list.count()).toBe(2);
        expect(Array.from(list.nth(0))).toEqual([0xde, 0xad, 0xbe, 0xef]);
        expect(Array.from(list.nth(1))).toEqual([0x42]);
    });

    sourceCase('C-API DataStack - push_back handles empty elements (NULL + n=0)', () => {
        const list = make();
        list.pushBack(new Uint8Array(0));
        expect(list.count()).toBe(1);
        expect(list.nth(0)).toHaveLength(0);
    });

    sourceCase('C-API DataStack - nth_copy hands back an owned buffer', () => {
        const list = make();
        list.pushBack(Uint8Array.of(0x10, 0x20, 0x30));
        const owned = list.nthCopy(0);
        free(list);
        expect(Array.from(owned)).toEqual([0x10, 0x20, 0x30]);
    });

    sourceCase('C-API DataStack - erase removes the selected element', () => {
        const list = make();
        list.pushBack(Uint8Array.of(0xaa));
        list.pushBack(Uint8Array.of(0xbb));
        list.pushBack(Uint8Array.of(0xcc));
        list.erase(1);
        expect(list.count()).toBe(2);
        expect(list.nth(0)[0]).toBe(0xaa);
        expect(list.nth(1)[0]).toBe(0xcc);
    });
});

describeSource('src/c-api/test/chain/point_list.cpp', () => {
    const HASH = Uint8Array.from({ length: 32 }, (_, i) => i + 1);
    const makePoint = (): PointNative => {
        const hash = HashFunctions.toNative(HASH as any);
        try {
            return new (pointClass())(hash, 42);
        } finally {
            free(hash);
        }
    };

    sourceCase('C-API PointList - default construct is empty', () => {
        expect(new (pointListClass())().count()).toBe(0);
    });

    sourceCase('C-API PointList - push_back / count / nth', () => {
        const list = new (pointListClass())();
        list.pushBack(makePoint());
        expect(list.count()).toBe(1);
        const element = list.nth(0);
        expect(element).not.toBeNull();
        expect(element.index()).toBe(42);
    });

    sourceCase('C-API PointList - erase removes element', () => {
        const list = new (pointListClass())();
        const point = makePoint();
        list.pushBack(point);
        list.pushBack(point);
        expect(list.count()).toBe(2);
        list.erase(0);
        expect(list.count()).toBe(1);
    });
});

describeSource('src/c-api/test/chain/token_data.cpp', () => {
    const CATEGORY = new Uint8Array(32).fill(0xaa) as any;
    const COMMITMENT = Uint8Array.of(0x10, 0x20, 0x30, 0x40, 0x50);

    sourceCase('C-API TokenData - to_data / from_data roundtrip (fungible)', () => {
        const original = new TokenData(CATEGORY, new TokenDataFungible(7777n)).toNative();
        const raw = original.toData();
        expect(raw).toHaveLength(original.serializedSize());
        const parsed = tokenDataClass().fromData(raw);
        expect(original.equals(parsed)).toBe(true);
    });

    sourceCase('C-API TokenData - to_data / from_data roundtrip (both)', () => {
        const original = new TokenData(CATEGORY, new TokenDataBothKinds(12345n, 'mutable', COMMITMENT)).toNative();
        const raw = original.toData();
        const parsed = tokenDataClass().fromData(raw);
        expect(original.equals(parsed)).toBe(true);
    });

    sourceCase('C-API TokenData - from_data with truncated input fails', () => {
        expect(() => tokenDataClass().fromData(new Uint8Array(5))).toThrow();
    });
});

describeSource('src/c-api/test/wallet/hd_public.cpp', () => {
    const XPUB = 'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8';

    sourceCase('C-API HdPublic - to_hd_key round-trips through from_hd_key', () => {
        const original: HdPublicNative = hdPublicClass().parseFrom(XPUB);
        const reconstructed = hdPublicClass().fromHdKey(original.toHdKey());
        expect(original.equals(reconstructed)).toBe(true);
    });
});

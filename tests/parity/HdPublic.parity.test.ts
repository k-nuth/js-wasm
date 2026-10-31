// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the src/c-api/test/wallet/hd_public.cpp cases that the HdPublic wrapper and its native object express. The
// key-to-bytes round trip (to_hd_key / from_hd_key) needs the static native factory, which is not exported.
import { HdPublic, free } from '../..';
import { describeSource, sourceCase } from './support/sourceCase';

const XPUB = 'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8';
const FIRST_HARDENED = 0x80000000;

describeSource('src/c-api/test/wallet/hd_public.cpp', () => {
    sourceCase('C-API HdPublic - parse_from produces a handle', () => {
        expect(HdPublic.fromString(XPUB)).toBeDefined();
    });

    sourceCase('C-API HdPublic - parse_from invalid encoded returns error', () => {
        expect(HdPublic.fromString('not-a-valid-xpub')).toBeUndefined();
        expect(HdPublic.isValid('not-a-valid-xpub')).toBe(false);
    });

    sourceCase('C-API HdPublic - to_string round-trips', () => {
        expect(HdPublic.fromString(XPUB)!.encoded).toBe(XPUB);
    });

    sourceCase('C-API HdPublic - lineage returns valid data', () => {
        const native = HdPublic.fromString(XPUB)!.toNative();
        try {
            const lineage = native.lineage();
            expect(lineage.depth).toBe(0);
            expect(lineage.parent_fingerprint).toBe(0);
            expect(lineage.child_number).toBe(0);
        } finally {
            free(native);
        }
    });

    sourceCase('C-API HdPublic - copy preserves equality', () => {
        const original = HdPublic.fromString(XPUB)!.toNative();
        const copy = original.copy();
        try {
            expect(copy).not.toBeNull();
            expect(original.equals(copy)).toBe(true);
        } finally {
            free(copy);
            free(original);
        }
    });

    sourceCase('C-API HdPublic - derive_public produces a child', () => {
        const parent = HdPublic.fromString(XPUB)!;
        const child = parent.derivePublic(0);
        expect(child).toBeDefined();
        const parentNative = parent.toNative();
        const childNative = child.toNative();
        try {
            expect(parentNative.equals(childNative)).toBe(false);
            expect(childNative.lineage().depth).toBe(1);
        } finally {
            free(childNative);
            free(parentNative);
        }
    });

    sourceCase('C-API HdPublic - derive_public hardened index reports failure', () => {
        expect(() => HdPublic.fromString(XPUB)!.derivePublic(FIRST_HARDENED)).toThrow();
    });
});

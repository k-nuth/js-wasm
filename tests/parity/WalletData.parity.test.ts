// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/c-api/test/wallet/wallet_data.cpp through WalletManager.createSimple and the WalletData wrapper. WalletData is a
// plain data holder: the native handle is consumed by createSimple and never exposed, so the upstream setters
// (set_mnemonics, set_encrypted_seed_unsafe) are observed as assignment of the fields. The native copy() has no reachable
// handle and stays blocked in the inventory.
import { HdPublic, WalletData, WalletManager } from '../..';
import { describeSource, sourceCase } from './support/sourceCase';

describeSource('src/c-api/test/wallet/wallet_data.cpp', () => {
    sourceCase('C-API WalletData - create with English default returns a handle', () => {
        const data = WalletManager.createSimple('testpassword', 'testpassphrase');
        expect(data).toBeDefined();
        expect(data!.mnemonics).toHaveLength(24);
        expect(data!.xpub).toBeInstanceOf(HdPublic);
        expect(HdPublic.isValid(data!.xpub!.encoded)).toBe(true);
        expect(data!.encryptedSeed).toHaveLength(96);
    });

    sourceCase('C-API WalletData - set_mnemonics replaces the word list', () => {
        const data = WalletManager.createSimple('p', 'p')!;
        expect(data.mnemonics).toHaveLength(24);
        data.mnemonics = ['word-one', 'word-two'];
        expect(data.mnemonics).toEqual(['word-one', 'word-two']);
    });

    sourceCase('C-API WalletData - set_encrypted_seed_unsafe round-trip', () => {
        const data = WalletManager.createSimple('p', 'p')!;
        const replacement = Uint8Array.from({ length: 96 }, (_, i) => i & 0xff) as any;
        data.encryptedSeed = replacement;
        expect(Array.from(data.encryptedSeed!)).toEqual(Array.from(replacement));
        expect(data).toBeInstanceOf(WalletData);
    });
});

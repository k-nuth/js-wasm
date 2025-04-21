// Copyright (c) 2016-2025 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { WalletManager, WalletData, EncryptedSeed, Wallet, PaymentAddress } from '..';


describe('WalletManager', () => {
    beforeAll(async () => {
    });

    it('should create wallet and decrypt seed', async () => {
        const manager = WalletManager.createWallet('12345678');
        expect(manager).toBeDefined();
        if ( ! manager) return;

        expect(manager.mnemonics).toBeDefined();
        if ( ! manager.mnemonics) return;
        expect(manager.mnemonics.length).toEqual(24);

        expect(manager.xpub?.encoded.startsWith('xpub')).toBeTruthy();

        if ( ! manager.encryptedSeed) return;

        const seed = WalletManager.decryptSeed('12345678', manager.encryptedSeed);
        expect(seed).toBeDefined();
        if ( ! seed) return;
        expect(seed.length).toEqual(64);


        const TEST_DERIVATION_PATH = "m/44'/145'/0'/0";
        const TEST_NETWORK = 'MAINNET';     //'TESTNET';
        const wallet = new Wallet(seed, TEST_DERIVATION_PATH, TEST_NETWORK);
        const address = wallet.getAddress(0);
        expect(address).toBeInstanceOf(PaymentAddress);
        // Non-deterministic address, we can't check the value unless we use a fixed seed
        // expect(address.encoded()).toBe('bitcoincash:qpm48yhw5gv7d8uj0zsdvd9g0lqc2tchmc865rk3k3');
        expect(address.encoded()).toMatch(/^bitcoincash:/);
    });

    it('decryptSeed from hardcoded encrypted seed', () => {
        const encryptedSeed = Uint8Array.from([
            0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F,
            0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F,
            0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F,
            0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F,
            0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F,
            0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5A, 0x5B, 0x5C, 0x5D, 0x5E, 0x5F,
        ]) as EncryptedSeed;

        const seed = WalletManager.decryptSeed('12345678', encryptedSeed);
        expect(seed).toBeDefined();

        expect(seed).toEqual(Uint8Array.from([
            123, 214, 250,  79,  92,  82,  94,   4,  40, 254, 222,
            210, 201, 229, 207,  11, 144, 187,  82, 241, 135, 146,
            220,  33, 179,   5, 127, 254, 125,  92, 215, 110, 218,
            241,  94, 212,  98, 140, 145, 122,  43,  45,  45, 186,
            102, 216,  11, 138,  76, 137, 202, 114, 235,  53, 127,
            108,  94,  39, 186, 144, 159, 200, 178,  93
        ]));
    });


});


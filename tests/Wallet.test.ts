// Copyright (c) 2016-2024 Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

import { PaymentAddress } from '..';
import { Wallet } from '..';

describe('Wallet', () => {
    const TEST_MNEMONIC = [
        'car', 'slab', 'tail', 'dirt', 'wife', 'custom', 'front',
        'shield', 'diet', 'pear', 'skull', 'vapor', 'gorilla', 'token', 'yard'
    ];

    const TEST_DERIVATION_PATH = "m/44'/145'/0'/0";
    const TEST_NETWORK = 'MAINNET';     //'TESTNET';

    let wallet: Wallet;

    beforeAll(async () => {
        wallet = new Wallet(TEST_MNEMONIC, TEST_DERIVATION_PATH, TEST_NETWORK);
    });

    it('should correctly instantiate with given mnemonic, derivation path, and network', () => {
        expect(wallet).toBeInstanceOf(Wallet);
    });

    it('rootKey should return expected BIP32 root key', () => {
        const rootKey = wallet.rootKey;
        expect(typeof rootKey).toBe('string');
        expect(rootKey).toBe('xprv9s21ZrQH143K2DQjFCenT6uLwd7dNoMKXEsiQ2v5EkNFGd54wN9td5GnDKLR1amKpXFPwHBHdUNL3uowUZd4jZtFEbSG73wEyPrYn9sfbNN');
    });

    it('extendedPrivateKey should return expected extended private key', () => {
        const extPrivateKey = wallet.extendedPrivateKey;
        expect(typeof extPrivateKey).toBe('string');
        expect(extPrivateKey).toBe('xprvA2NTL1ZqHfcTbSbCXeRcuUWo9jib7TroFrQSMFyNS4YpSCs8Aqi23nPQHiQC6SVNXp68AFQLU5Nt2CEKjBmtaFhYdBTGhd7tydWxKhWzSc7');
    });

    it('extendedPublicKey should return expected extended public key', () => {
        const extPublicKey = wallet.extendedPublicKey;
        expect(typeof extPublicKey).toBe('string');
        expect(extPublicKey).toBe('xpub6FMojX6j83AkovffdfxdGcTXhmZ5Wvaed5L39eNyzQ5oK1CGiP2Gbaht8yTEBM2rfGMpNnkkXiQkhUKJnnrc31yLgvmimYWEhXdGXwy16eW');
    });

    it('getAddress should return PaymentAddress instance for given index', async () => {
        const address = await wallet.getAddress(0);
        expect(address).toBeInstanceOf(PaymentAddress);
        expect(address.encoded()).toBe('bitcoincash:qr9sawzzmstkluq9nqefsu7eqya4zk2w7udune2pmf');
    });

    it('getAddresses should return array of PaymentAddress instances', async () => {
        const addresses = await wallet.getAddresses(5);
        expect(Array.isArray(addresses)).toBeTruthy();
        expect(addresses).toHaveLength(5);

        expect(addresses.map(a => a.encoded())).toStrictEqual([
            'bitcoincash:qr9sawzzmstkluq9nqefsu7eqya4zk2w7udune2pmf',
            'bitcoincash:qpvmwrhxcdyyq64ar6kz46rejp0r2tjcwg8d462hum',
            'bitcoincash:qqftgwpz0wm45z3sumncfrzm0s3n7x5rcqq9350gd6',
            'bitcoincash:qrwelh5dw56rjnr3nnttfc45j0p0yv2a3vtuwu9nlt',
            'bitcoincash:qpawyf7fp6lhvhld5gtz74smm969fx2j2546uj60l0'])

        const addresses2nd = await wallet.getAddresses(5, 5);
        expect(Array.isArray(addresses2nd)).toBeTruthy();
        expect(addresses2nd).toHaveLength(5);

        expect(addresses2nd.map(a => a.encoded())).toStrictEqual([
            'bitcoincash:qqzhz2m6cg6au7r3hntjraqj4aj8akg3gvakarc69v',
            'bitcoincash:qpzf4kuq03js0tnug5z6e5q7zcfse6guagmhktuzcd',
            'bitcoincash:qr6jhutnh6jk7aphlyu9sq5f6zu2epj8uqpynlacwk',
            'bitcoincash:qrlfnn7f03n020yyvgyfqtq9fcu35wussq4ev4glfv',
            'bitcoincash:qrmn9ss3dsu79rws6j4jwa9qhdxrr4rqcqxxxvlnwx'])
    });
});


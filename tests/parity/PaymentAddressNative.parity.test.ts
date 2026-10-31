// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports the key- and payment-based cases of src/domain/test/wallet/payment_address.cpp through the native classes the
// public wrappers return (EcPublicNative and PaymentAddressNative; see support/natives.ts). The four cases built from an
// EcPrivate stay blocked: no public call returns an EcPrivate native, so no instance (and no static factory) is reachable.
import { HashFunctions, bytesToHexStr, free, hexStrToBytes } from '../..';
import { namedHex } from './support/fixtures';
import { EcPublicNative, PaymentAddressNative, ecPublicClass, paymentAddressClass } from './support/natives';
import { describeSource, sourceCase } from './support/sourceCase';

const FILE = 'src/domain/test/wallet/payment_address.cpp';
const constant = (name: string) => namedHex(FILE, name);
const MAINNET_P2KH = 0x00;
const MAINNET_P2SH = 0x05;
const TESTNET_P2KH = 0x6f;
const LONG_PUBKEY = '04278f7bfee4ef625f85279c3a01d57c22e2877a902128b2df85071f9d6c95b290f094f5bd1bff5880d09cc231c774d71ac22d3ab9bdd9dda2e75017b52d893367';

const parsePublic = (hex: string): EcPublicNative => ecPublicClass().parseFrom(hex);
const addressOf = (hex: string, version: number): PaymentAddressNative => paymentAddressClass().fromEcPublic(parsePublic(hex), version);

describeSource(FILE, () => {
    sourceCase('payment_address construct public valid expected', () => {
        expect(addressOf(constant('compressed_pubkey'), MAINNET_P2KH).encodedLegacy()).toBe(constant('address_compressed'));
    });

    sourceCase('payment_address construct public testnet valid expected', () => {
        expect(addressOf(constant('compressed_pubkey'), TESTNET_P2KH).encodedLegacy()).toBe(constant('address_compressed_testnet'));
    });

    sourceCase('payment_address construct public uncompressed valid expected', () => {
        expect(addressOf(constant('uncompressed_pubkey'), MAINNET_P2KH).encodedLegacy()).toBe(constant('address_uncompressed'));
    });

    sourceCase('payment_address construct public testnet uncompressed valid expected', () => {
        expect(addressOf(constant('uncompressed_pubkey'), TESTNET_P2KH).encodedLegacy()).toBe(constant('address_uncompressed_testnet'));
    });

    sourceCase('payment_address construct public compressed from uncompressed testnet valid expected', () => {
        const point = hexStrToBytes(constant('uncompressed_pubkey'));
        const publicKey = ecPublicClass().fromPoint(point, true);
        expect(paymentAddressClass().fromEcPublic(publicKey, TESTNET_P2KH).encodedLegacy()).toBe(constant('address_compressed_testnet'));
    });

    sourceCase('payment_address construct public uncompressed from compressed testnet valid expected', () => {
        const point = hexStrToBytes(constant('compressed_pubkey'));
        const publicKey = ecPublicClass().fromVerifiedPoint(point, false);
        expect(paymentAddressClass().fromEcPublic(publicKey, TESTNET_P2KH).encodedLegacy()).toBe(constant('address_uncompressed_testnet'));
    });

    sourceCase('payment_address construct payment valid expected', () => {
        const address = paymentAddressClass().fromPayment(hexStrToBytes(constant('payment_hex')));
        expect(address.encodedLegacy()).toBe(constant('address_script'));
    });

    sourceCase('payment_address construct payment testnet valid expected', () => {
        const address = paymentAddressClass().fromPayment(hexStrToBytes(constant('payment_testnet')));
        expect(address.encodedLegacy()).toBe(constant('address_script_testnet'));
    });

    sourceCase('payment_address construct copy valid expected', () => {
        const address = paymentAddressClass().fromPayment(hexStrToBytes(constant('payment_hex')));
        expect(address.copy().encodedLegacy()).toBe(constant('address_script'));
    });

    sourceCase('payment_address version default mainnet', () => {
        expect(addressOf(constant('compressed_pubkey'), MAINNET_P2KH).version()).toBe(MAINNET_P2KH);
    });

    sourceCase('payment_address version testnet testnet', () => {
        expect(addressOf(constant('compressed_pubkey'), 0x6f).version()).toBe(0x6f);
    });

    sourceCase('payment_address hash compressed point expected', () => {
        const address = addressOf(constant('compressed_pubkey'), MAINNET_P2KH);
        expect(bytesToHexStr(HashFunctions.fromNative(address.hash20(), true))).toBe(constant('compressed_hash'));
    });

    sourceCase('payment_address cashAddr mainnet encode', () => {
        expect(addressOf(LONG_PUBKEY, MAINNET_P2KH).encodedCashaddr(false)).toBe('bitcoincash:qpzz8n7jp6847yyx8t33matrgcsdx6c0cvmtevrfgz');
    });

    sourceCase('payment_address cashAddr testnet encode', () => {
        expect(addressOf(LONG_PUBKEY, TESTNET_P2KH).encodedCashaddr(false)).toBe('bchtest:qpzz8n7jp6847yyx8t33matrgcsdx6c0cvleatp707');
    });

    sourceCase('payment_address cashAddr testnet from string', () => {
        const address = paymentAddressClass().parseFrom('bchtest:qpzz8n7jp6847yyx8t33matrgcsdx6c0cvleatp707', 'testnet');
        expect(address.encodedCashaddr(false)).toBe('bchtest:qpzz8n7jp6847yyx8t33matrgcsdx6c0cvleatp707');
        expect(address.encodedLegacy()).toBe('mmjF9M1saNs7vjCGaSDaDHvFAtTgUNtfrJ');
    });

    sourceCase('payment_address 32-byte to_payment returns zero sentinel', () => {
        const hash32 = HashFunctions.toNative(Uint8Array.from({ length: 32 }, (_, i) => i + 1) as any);
        try {
            const address = new (paymentAddressClass())(hash32, MAINNET_P2SH);
            expect(Array.from(address.toPayment())).toEqual(new Array(25).fill(0));
        } finally {
            free(hash32);
        }
    });
});

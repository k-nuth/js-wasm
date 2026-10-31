// Copyright (c) 2016-present Knuth Project developers.
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Ports src/domain/test/wallet/payment_address.cpp through the PaymentAddress wrapper. The key-based constructors
// (from_ec_private, from_ec_public, from_payment) have no wrapper counterpart and no way to build the key objects from raw
// secrets or points, so those cases are blocked in the inventory. The address strings, hashes and script come from the
// upstream constants (fixtures/hex_literals.json).
import { PaymentAddress, Script, bytesToHexStr, hexStrToBytes } from '../..';
import { namedHex } from './support/fixtures';
import { describeSource, sourceCase } from './support/sourceCase';

const FILE = 'src/domain/test/wallet/payment_address.cpp';
const constant = (name: string) => namedHex(FILE, name);
const shortHash = (hex: string) => hexStrToBytes(hex) as any;
const scriptOps = () => Script.fromString(constant('script_text'))!;
const MAINNET_P2KH = 0x00;
const MAINNET_P2SH = 0x05;

describeSource(FILE, () => {
    sourceCase('payment_address construct string invalid invalid', () => {
        expect(PaymentAddress.fromString('bogus')).toBeUndefined();
    });

    sourceCase('payment_address construct hash valid expected', () => {
        const address = PaymentAddress.fromShortHash(shortHash(constant('compressed_hash')), MAINNET_P2KH)!;
        expect(address.encodedLegacy()).toBe(constant('address_compressed'));
    });

    sourceCase('payment_address construct uncompressed hash testnet valid expected', () => {
        const address = PaymentAddress.fromShortHash(shortHash(constant('uncompressed_hash')), 0x6f)!;
        expect(address.encodedLegacy()).toBe(constant('address_uncompressed_testnet'));
    });

    sourceCase('payment_address construct script valid expected', () => {
        expect(PaymentAddress.fromScript(scriptOps(), MAINNET_P2SH).encodedLegacy()).toBe(constant('address_script'));
    });

    sourceCase('payment_address construct script testnet valid expected', () => {
        expect(PaymentAddress.fromScript(scriptOps(), 0xc4).encodedLegacy()).toBe(constant('address_script_testnet'));
    });

    sourceCase('payment_address version script valid mainnet p2sh', () => {
        expect(PaymentAddress.fromScript(scriptOps(), MAINNET_P2SH).version).toBe(MAINNET_P2SH);
    });

    sourceCase('payment_address cashAddr mainnet from string', () => {
        const address = PaymentAddress.fromString('bitcoincash:qpzz8n7jp6847yyx8t33matrgcsdx6c0cvmtevrfgz')!;
        expect(address.encodedCashAddr()).toBe('bitcoincash:qpzz8n7jp6847yyx8t33matrgcsdx6c0cvmtevrfgz');
        expect(address.encodedLegacy()).toBe('17DHrHvtmMRs9ciersFCPNhvJtryd5NWbT');
    });

    sourceCase('payment_address token address from string', () => {
        const address = PaymentAddress.fromString('bitcoincash:pvstqkm54dtvnpyqxt5m5n7sjsn4enrlxc526xyxlnjkaycdzfeu69reyzmqx')!;
        expect(address.encodedCashAddr()).toBe('bitcoincash:pvstqkm54dtvnpyqxt5m5n7sjsn4enrlxc526xyxlnjkaycdzfeu69reyzmqx');
        expect(address.encodedCashTokens()).toBe('bitcoincash:rvstqkm54dtvnpyqxt5m5n7sjsn4enrlxc526xyxlnjkaycdzfeu6hs99m6ed');
        // A 32-byte (pay_script_hash_32) address has no legacy form: the encoder returns an empty string rather than a truncated hash.
        expect(address.encodedLegacy()).toBe('');
    });

    const hash32 = () => Uint8Array.from({ length: 32 }, (_, i) => i + 1) as any;

    sourceCase('payment_address 32-byte hash20 returns null sentinel', () => {
        const address = PaymentAddress.fromHash(hash32(), MAINNET_P2SH)!;
        expect(Array.from(address.hash20)).toEqual(new Array(20).fill(0));
        expect(Array.from(address.hash32)).toEqual(Array.from(hash32()));
    });

    sourceCase('payment_address 20-byte accessors stay untouched on 20-byte hashes', () => {
        const hash = shortHash(constant('compressed_hash'));
        const address = PaymentAddress.fromShortHash(hash, MAINNET_P2KH)!;
        expect(bytesToHexStr(address.hash20)).toBe(constant('compressed_hash'));
        expect(address.encodedLegacy()).not.toBe('');
        expect(address.encodedLegacy()).toBe(constant('address_compressed'));
    });
});
